"use client";

import { motion } from "framer-motion";

interface KPICardProps {
    title: string;
    value: string | number;
    delay: number;
}

export const KPICard = ({ title, value, delay }: KPICardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="glass-panel p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[160px]"
    >
        <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-2xl opacity-10 transition-opacity group-hover:opacity-20 bg-[var(--primary)]`} />
        <div className={`absolute -left-8 -bottom-8 w-32 h-32 rounded-full blur-2xl opacity-10 transition-opacity group-hover:opacity-20 bg-[var(--primary)]`} />

        <h3 className="text-[var(--muted-foreground)] font-semibold text-lg mb-4 tracking-wide">{title}</h3>
        <div className="text-5xl font-bold tracking-tight text-[var(--foreground)] drop-shadow-sm">{value}</div>
    </motion.div>
);
