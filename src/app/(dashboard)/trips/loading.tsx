"use client";

import { motion } from "framer-motion";

export default function LoadingTrips() {
    return (
        <div className="px-4 md:px-6 py-6 pb-24 max-w-[1400px] mx-auto space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
                {/* Trips Table Panel Skeleton */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel rounded-3xl p-6 shadow-xl border border-[var(--card-border)] bg-[var(--card)]/50 space-y-6 flex flex-col h-fit overflow-hidden"
                >
                    {/* Toolbar Skeleton */}
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="w-full max-w-md h-10 rounded-xl bg-[rgba(255,255,255,0.05)] animate-pulse" />
                        <div className="flex flex-wrap gap-3">
                            <div className="w-24 h-10 rounded-xl bg-[rgba(255,255,255,0.05)] animate-pulse" />
                            <div className="w-24 h-10 rounded-xl bg-[rgba(255,255,255,0.05)] animate-pulse" />
                            <div className="w-24 h-10 rounded-xl bg-[rgba(255,255,255,0.05)] animate-pulse" />
                        </div>
                    </div>

                    {/* Table Rows Skeleton */}
                    <div className="space-y-4 pt-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex gap-4 items-center w-full py-2 border-b border-[var(--card-border)]/50">
                                <div className="w-20 h-4 rounded bg-[rgba(255,255,255,0.05)] animate-pulse" />
                                <div className="flex-1 h-4 rounded bg-[rgba(255,255,255,0.05)] animate-pulse" />
                                <div className="flex-1 h-4 rounded bg-[rgba(255,255,255,0.05)] animate-pulse" />
                                <div className="w-24 h-6 rounded-full bg-[rgba(255,255,255,0.05)] animate-pulse" />
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Form Panel Skeleton */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel rounded-3xl p-6 lg:p-8 shadow-xl border border-[var(--card-border)] bg-[var(--card)]/50 relative overflow-hidden h-fit"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[rgba(255,255,255,0.1)] to-[rgba(255,255,255,0.05)]" />

                    <div className="w-48 h-8 rounded-lg bg-[rgba(255,255,255,0.05)] animate-pulse mb-8" />

                    <div className="space-y-6">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="w-32 h-4 rounded bg-[rgba(255,255,255,0.05)] animate-pulse" />
                                <div className="w-full h-10 rounded-xl bg-[rgba(255,255,255,0.05)] animate-pulse" />
                            </div>
                        ))}
                    </div>

                    <div className="w-full h-12 rounded-xl bg-[rgba(255,255,255,0.05)] animate-pulse mt-8" />
                </motion.div>
            </div>
        </div>
    );
}
