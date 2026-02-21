"use client";

import { motion } from "framer-motion";

export default function LoadingTrips() {
    return (
        <div className="px-6 py-8 pb-24 max-w-7xl mx-auto space-y-8">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
                <div className="w-64 h-8 rounded-lg bg-[rgba(255,255,255,0.05)] animate-pulse" />
            </div>

            {/* Table Panel Skeleton */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-3xl p-6 shadow-xl border border-[var(--card-border)] bg-[var(--card)]/50 space-y-6"
            >
                {/* Toolbar Skeleton */}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="w-full max-w-md h-10 rounded-xl bg-[rgba(255,255,255,0.05)] animate-pulse" />
                    <div className="flex gap-3">
                        <div className="w-24 h-10 rounded-xl bg-[rgba(255,255,255,0.05)] animate-pulse" />
                        <div className="w-24 h-10 rounded-xl bg-[rgba(255,255,255,0.05)] animate-pulse" />
                        <div className="w-24 h-10 rounded-xl bg-[rgba(255,255,255,0.05)] animate-pulse" />
                    </div>
                </div>

                {/* Table Rows Skeleton */}
                <div className="space-y-4 pt-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex gap-4 items-center w-full">
                            <div className="w-16 h-4 rounded bg-[rgba(255,255,255,0.05)] animate-pulse" />
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
                className="glass-panel rounded-3xl p-8 shadow-xl border border-[var(--card-border)] bg-[var(--card)]/50 space-y-8"
            >
                <div className="w-48 h-8 rounded-lg bg-[rgba(255,255,255,0.05)] animate-pulse" />

                <div className="space-y-6 max-w-4xl">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="w-32 h-4 rounded bg-[rgba(255,255,255,0.05)] animate-pulse" />
                            <div className="flex-1 max-w-md h-12 rounded-xl bg-[rgba(255,255,255,0.05)] animate-pulse" />
                        </div>
                    ))}
                </div>

                <div className="w-48 h-12 rounded-xl bg-[var(--primary)]/20 animate-pulse mt-8" />
            </motion.div>
        </div>
    );
}
