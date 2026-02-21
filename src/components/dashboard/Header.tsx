"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";

interface HeaderProps {
    isDark: boolean;
    toggleTheme: () => void;
    setSidebarOpen: (open: boolean) => void;
    userInitials: string;
    userImage?: string | null;
}

export const Header = ({ isDark, toggleTheme, setSidebarOpen, userInitials, userImage }: HeaderProps) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="px-6 py-5 flex items-center justify-between sticky top-0 z-20 backdrop-blur-xl bg-[var(--background)]/40 border-b border-[var(--card-border)] shadow-sm">
            <div className="flex items-center gap-4">
                <button className="lg:hidden p-2 rounded-lg glass-panel text-[var(--foreground)]" onClick={() => setSidebarOpen(true)}>
                    <Menu size={24} />
                </button>
                <h1 className="text-xl font-bold tracking-tight hidden sm:block">Main Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
                <button onClick={toggleTheme} className="p-2.5 rounded-full glass-panel hover:bg-[rgba(255,255,255,0.1)] transition-colors shadow-sm">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isDark ? "dark" : "light"}
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {isDark ? <Sun size={18} className="text-[#bfc0d1]" /> : <Moon size={18} className="text-[#31323e]" />}
                        </motion.div>
                    </AnimatePresence>
                </button>

                <div className="relative" ref={dropdownRef}>
                    <div
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[#bfc0d1] border-2 border-[var(--card-border)] shadow-md cursor-pointer flex items-center justify-center hover:scale-105 transition-transform overflow-hidden relative shrink-0"
                        title="Profile Menu"
                    >
                        {userImage ? (
                            <Image
                                src={userImage}
                                alt="Profile Avatar"
                                fill
                                className="object-cover"
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            <span className="text-white font-bold text-sm tracking-wide">{userInitials}</span>
                        )}
                    </div>

                    <AnimatePresence>
                        {dropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-3 w-48 glass-panel border border-[var(--card-border)] shadow-2xl rounded-2xl overflow-hidden z-50 py-2 bg-[var(--background)]/90"
                            >
                                <div className="px-4 py-3 border-b border-[var(--card-border)] mb-2">
                                    <p className="text-sm font-semibold text-[var(--foreground)]">My Account</p>
                                </div>
                                <div className="flex flex-col">
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[rgba(255,255,255,0.05)] transition-colors flex items-center gap-2"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <User size={16} /> Profile Settings
                                    </button>
                                    <button
                                        onClick={() => signOut()}
                                        className="w-full text-left px-4 py-2 text-sm text-rose-500 hover:bg-rose-500/10 transition-colors flex items-center gap-2 mt-1"
                                    >
                                        <LogOut size={16} /> Sign Out
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};
