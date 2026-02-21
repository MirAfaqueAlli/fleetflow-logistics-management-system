"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu } from "lucide-react";
import { signOut } from "next-auth/react";

interface HeaderProps {
    isDark: boolean;
    toggleTheme: () => void;
    setSidebarOpen: (open: boolean) => void;
    userInitials: string;
}

export const Header = ({ isDark, toggleTheme, setSidebarOpen, userInitials }: HeaderProps) => {
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

                <div
                    onClick={() => signOut()}
                    className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[#bfc0d1] border-2 border-[var(--card-border)] shadow-md cursor-pointer flex items-center justify-center hover:scale-105 transition-transform"
                    title="Sign Out"
                >
                    <span className="text-white font-bold text-sm">{userInitials}</span>
                </div>
            </div>
        </header>
    );
};
