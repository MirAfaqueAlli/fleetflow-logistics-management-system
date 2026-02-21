"use client";

import { motion } from "framer-motion";
import { Receipt } from "lucide-react";

export default function ExpensesPage() {
    return (
        <div className="px-6 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-3xl p-8 min-h-[60vh] flex flex-col items-center justify-center text-center"
            >
                <div className="w-16 h-16 rounded-2xl bg-[#60519b]/10 flex items-center justify-center mb-6">
                    <Receipt className="text-[#60519b] w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Trip & Expense Logs</h1>
                <p className="text-[#8b8c9d] max-w-lg mb-8">
                    Record fuel consumption, log expenses, and correlate costs against completed trips.
                </p>

                {/* Placeholder for the friend's future UI */}
                <div className="w-full max-w-4xl h-64 border border-dashed border-white/10 rounded-2xl flex items-center justify-center text-[#8b8c9d]/50 bg-[#31323e]/20">
                    Component Workspace: Insert Fuel & Expense Forms Here
                </div>
            </motion.div>
        </div>
    );
}
