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
    Home,
    ShieldAlert
} from "lucide-react";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

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

// ─── RBAC Nav Config ───
const ALL_NAV = [
    { href: "/dashboard", icon: LayoutDashboard, text: "Dashboard", roles: ["MANAGER", "DISPATCHER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"] },
    { href: "/vehicles", icon: Truck, text: "Vehicle Registry", roles: ["MANAGER", "DISPATCHER", "SAFETY_OFFICER"] },
    { href: "/trips", icon: MapPin, text: "Trip Dispatcher", roles: ["MANAGER", "DISPATCHER"] },
    { href: "/maintenance", icon: Wrench, text: "Maintenance", roles: ["MANAGER", "FINANCIAL_ANALYST"] },
    { href: "/expenses", icon: Receipt, text: "Trip & Expense", roles: ["MANAGER", "FINANCIAL_ANALYST"] },
    { href: "/performance", icon: Activity, text: "Drivers & Performance", roles: ["MANAGER", "SAFETY_OFFICER"] },
    { href: "/analytics", icon: BarChart3, text: "Analytics", roles: ["MANAGER", "FINANCIAL_ANALYST"] },
];

// Role display config
const ROLE_META: Record<string, { label: string; color: string }> = {
    MANAGER: { label: "Fleet Manager", color: "text-violet-400  bg-violet-500/10 border-violet-500/20" },
    DISPATCHER: { label: "Dispatcher", color: "text-blue-400    bg-blue-500/10   border-blue-500/20" },
    SAFETY_OFFICER: { label: "Safety Officer", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    FINANCIAL_ANALYST: { label: "Financial Analyst", color: "text-amber-400   bg-amber-500/10  border-amber-500/20" },
};

export const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
    const pathname = usePathname();
    const { data: session } = useSession();
    const userRole = (session?.user as any)?.role as string || "NONE";

    const visibleNav = ALL_NAV.filter(item => item.roles.includes(userRole));
    const roleMeta = ROLE_META[userRole];

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
                {/* Logo */}
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

                {/* Role Badge */}
                {roleMeta && (
                    <div className="px-4 pt-4">
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold ${roleMeta.color}`}>
                            <ShieldAlert size={14} />
                            <span>{roleMeta.label}</span>
                        </div>
                    </div>
                )}

                {/* Nav Items */}
                <div className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar mt-2">
                    <SidebarItem href="/" icon={Home} text="Home" active={pathname === '/'} onClick={handleLinkClick} />
                    {visibleNav.map(item => (
                        <SidebarItem
                            key={item.href}
                            href={item.href}
                            icon={item.icon}
                            text={item.text}
                            active={pathname === item.href}
                            onClick={handleLinkClick}
                        />
                    ))}
                </div>
            </motion.aside>
        </>
    );
};
