"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { updateUserRole } from "@/lib/actions/auth";
import { Role } from "@prisma/client";
import { ShieldAlert, Truck, MapPin, Activity, BarChart3, Wrench, Receipt, LayoutDashboard } from "lucide-react";

const ROLES = [
    {
        value: "MANAGER",
        label: "Fleet Manager",
        desc: "Full access — oversee all vehicles, trips, drivers, expenses & analytics.",
        color: "border-violet-500 ring-violet-500 bg-violet-500/10",
        badgeColor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
        icon: ShieldAlert,
        pages: ["Dashboard", "Vehicle Registry", "Trip Dispatcher", "Maintenance", "Trip & Expense", "Drivers & Performance", "Analytics"],
    },
    {
        value: "DISPATCHER",
        label: "Dispatcher",
        desc: "Create and manage trips, assign drivers, view vehicle availability.",
        color: "border-blue-500 ring-blue-500 bg-blue-500/10",
        badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        icon: MapPin,
        pages: ["Dashboard", "Vehicle Registry", "Trip Dispatcher"],
    },
    {
        value: "SAFETY_OFFICER",
        label: "Safety Officer",
        desc: "Monitor driver compliance, license validity, and safety scores.",
        color: "border-emerald-500 ring-emerald-500 bg-emerald-500/10",
        badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        icon: Activity,
        pages: ["Dashboard", "Vehicle Registry", "Drivers & Performance"],
    },
    {
        value: "FINANCIAL_ANALYST",
        label: "Financial Analyst",
        desc: "Audit fuel spend, maintenance costs, ROI, and operational analytics.",
        color: "border-amber-500 ring-amber-500 bg-amber-500/10",
        badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        icon: BarChart3,
        pages: ["Dashboard", "Maintenance", "Trip & Expense", "Analytics"],
    },
];

export default function OnboardingPage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [role, setRole] = useState("MANAGER");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const selectedRole = ROLES.find(r => r.value === role)!;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.id) return;

        setIsLoading(true);
        setError("");

        try {
            const result = await updateUserRole(session.user.id, role as Role);
            if (result.success) {
                await update({ role });
                router.push("/dashboard");
                router.refresh();
            } else {
                setError(result.error || "Failed to update role");
            }
        } catch {
            setError("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1e202c] text-[#bfc0d1] p-4">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#60519b]/20 border border-[#60519b]/30 text-[#a78bfa] text-sm font-medium mb-4">
                        <ShieldAlert size={14} />
                        Role-Based Access Control
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Choose Your Role</h1>
                    <p className="text-[#8b8c9d] text-sm">Your role determines which pages and features you can access in FleetFlow.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Role Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ROLES.map((item) => {
                            const isActive = role === item.value;
                            return (
                                <button
                                    key={item.value}
                                    type="button"
                                    onClick={() => setRole(item.value)}
                                    className={`p-4 rounded-2xl border-2 transition-all text-left group relative overflow-hidden ${isActive
                                            ? `${item.color} ring-1`
                                            : "bg-[#252736] border-[#bfc0d1]/10 hover:border-[#60519b]/40"
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={`p-2 rounded-xl border ${isActive ? item.badgeColor : "bg-white/5 border-white/10 text-[#8b8c9d]"}`}>
                                            <item.icon size={18} />
                                        </div>
                                        {isActive && (
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${item.badgeColor}`}>
                                                SELECTED
                                            </span>
                                        )}
                                    </div>
                                    <div className="font-bold text-white mb-1 group-hover:text-[#c4b5fd] transition-colors">
                                        {item.label}
                                    </div>
                                    <div className="text-xs text-[#8b8c9d] leading-relaxed mb-3">{item.desc}</div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {item.pages.map(p => (
                                            <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#bfc0d1]">
                                                {p}
                                            </span>
                                        ))}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Access Preview */}
                    <div className="p-4 rounded-xl bg-[#252736] border border-[#bfc0d1]/10">
                        <p className="text-xs font-semibold text-[#8b8c9d] uppercase tracking-wider mb-2">
                            As <span className="text-white">{selectedRole.label}</span>, you will access:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {selectedRole.pages.map(p => (
                                <span key={p} className={`text-xs px-3 py-1 rounded-full border font-medium ${selectedRole.badgeColor}`}>
                                    {p}
                                </span>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#60519b] hover:bg-[#7b6ac6] active:scale-[0.98] transition-all duration-300 text-white font-semibold rounded-xl px-4 py-4 shadow-lg shadow-[#60519b]/20 disabled:opacity-50"
                    >
                        {isLoading ? "Setting up your workspace..." : `Enter as ${selectedRole.label} →`}
                    </button>
                </form>
            </div>
        </div>
    );
}
