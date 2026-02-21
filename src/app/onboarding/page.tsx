"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { updateUserRole } from "@/lib/actions/auth";
import { Role } from "@/lib/types/enums";

export default function OnboardingPage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [role, setRole] = useState("MANAGER");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.id) return;

        setIsLoading(true);
        setError("");

        try {
            const result = await updateUserRole(session.user.id, role as Role);
            if (result.success) {
                // Update the session client-side to reflect the new role
                await update({ role });
                router.push("/");
                router.refresh();
            } else {
                setError(result.error || "Failed to update role");
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1e202c] text-[#bfc0d1]">
            <div className="w-full max-w-md p-8 rounded-2xl glass-panel bg-[#31323e] shadow-2xl relative overflow-hidden ring-1 ring-[#bfc0d1]/10">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#60519b] rounded-full blur-[80px] opacity-70"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#60519b] rounded-full blur-[80px] opacity-70"></div>

                <div className="relative z-10 text-center">
                    <h1 className="text-3xl font-bold tracking-wider text-white mb-2">Final Step</h1>
                    <p className="text-sm text-[#8b8c9d] mb-8">Choose your role in FleetFlow</p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="text-left space-y-2">
                            <label className="text-sm font-medium text-[#bfc0d1] ml-1">Select Your Expertise</label>
                            <div className="grid grid-cols-1 gap-3">
                                {[
                                    { value: "MANAGER", label: "Fleet Manager", desc: "Oversee vehicle health and assets" },
                                    { value: "DISPATCHER", label: "Dispatcher", desc: "Create trips and assign drivers" },
                                    { value: "SAFETY_OFFICER", label: "Safety Officer", desc: "Monitor compliance and scores" },
                                    { value: "FINANCIAL_ANALYST", label: "Financial Analyst", desc: "Audit fuel and maintenance costs" },
                                ].map((item) => (
                                    <button
                                        key={item.value}
                                        type="button"
                                        onClick={() => setRole(item.value)}
                                        className={`p-4 rounded-xl border transition-all text-left group ${role === item.value
                                                ? "bg-[#60519b]/20 border-[#60519b] ring-1 ring-[#60519b]"
                                                : "bg-[#1e202c] border-[#bfc0d1]/10 hover:border-[#60519b]/50"
                                            }`}
                                    >
                                        <div className="font-bold text-white group-hover:text-[#7b6ac6] transition-colors">{item.label}</div>
                                        <div className="text-xs text-[#8b8c9d] mt-1">{item.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#60519b] hover:bg-[#7b6ac6] active:scale-[0.98] transition-all duration-300 text-white font-medium rounded-xl px-4 py-4 shadow-lg disabled:opacity-50"
                        >
                            {isLoading ? "Finalizing..." : "Complete Setup"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
