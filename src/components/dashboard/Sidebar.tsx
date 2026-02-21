"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Truck,
    MapPin,
    Wrench,
    Receipt,
    Activity,
    BarChart3,
    LayoutDashboard,
    X,
    Home
} from "lucide-react";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarItem = ({
    icon: Icon,
    text,
    href,
    active = false,
    onClick
}: {
    icon: any;
    text: string;
    href: string;
    active?: boolean;
    onClick?: () => void;
}) => (
    <Link href={href} onClick={onClick}>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${active ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--card-glow)]' : 'hover:bg-[rgba(255,255,255,0.05)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}>
            <Icon size={20} className={active ? 'text-white' : ''} />
            <span className="font-medium text-sm">{text}</span>
        </div>
    </Link>
);

export const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
    const pathname = usePathname();

    const handleLinkClick = () => {
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            <motion.aside
                initial={{ x: -300 }}
                animate={{ x: sidebarOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth >= 1024 ? 0 : -300) }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="w-72 glass-panel m-4 rounded-2xl flex flex-col z-50 fixed lg:relative h-[calc(100vh-2rem)] border-r border-[var(--card-border)]"
            >
                <div className="p-6 flex items-center justify-between border-b border-[var(--card-border)]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#60519b] to-[#31323e] flex items-center justify-center shadow-lg shadow-[#60519b]/20">
                            <Truck size={20} className="text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-wide">FleetFlow</span>
                    </div>
                    <button className="lg:hidden p-2" onClick={() => setSidebarOpen(false)}>
                        <X size={20} className="text-[var(--muted-foreground)]" />
                    </button>
                </div>

                <div className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar mt-4">
                    <SidebarItem href="/" icon={Home} text="Home" active={pathname === '/'} onClick={handleLinkClick} />
                    <SidebarItem href="/dashboard" icon={LayoutDashboard} text="Dashboard" active={pathname === '/dashboard'} onClick={handleLinkClick} />
                    <SidebarItem href="/vehicles" icon={Truck} text="Vehicle Registry" active={pathname === '/vehicles'} onClick={handleLinkClick} />
                    <SidebarItem href="/trips" icon={MapPin} text="Trip Dispatcher" active={pathname === '/trips'} onClick={handleLinkClick} />
                    <SidebarItem href="/maintenance" icon={Wrench} text="Maintenance" active={pathname === '/maintenance'} onClick={handleLinkClick} />
                    <SidebarItem href="/expenses" icon={Receipt} text="Trip & Expense" active={pathname === '/expenses'} onClick={handleLinkClick} />
                    <SidebarItem href="/performance" icon={Activity} text="Performance" active={pathname === '/performance'} onClick={handleLinkClick} />
                    <SidebarItem href="/analytics" icon={BarChart3} text="Analytics" active={pathname === '/analytics'} onClick={handleLinkClick} />
                </div>
            </motion.aside>
        </>
    );
};
