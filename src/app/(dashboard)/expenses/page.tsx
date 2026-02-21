"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, ChevronDown, X, Receipt } from "lucide-react";
import { mockExpenses, getStatusStyling, mockFleetData } from "@/lib/mock-data";
import { toast } from "sonner";

export default function ExpensesPage() {
    // State for Logs
    const [expenses, setExpenses] = useState(mockExpenses);

    // Filtering and Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All Statuses");

    // Pagination & Modal State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [isNewExpenseOpen, setIsNewExpenseOpen] = useState(false);

    // Search & Filter Logic
    const filteredData = useMemo(() => {
        return expenses.filter((item) => {
            const q = searchQuery.toLowerCase();
            const matchesSearch = item.tripId.toLowerCase().includes(q) ||
                item.driver.toLowerCase().includes(q) ||
                item.vehicleId?.toLowerCase().includes(q);
            const matchesStatus = filterStatus === "All Statuses" || item.status === filterStatus;

            return matchesSearch && matchesStatus;
        });
    }, [expenses, searchQuery, filterStatus]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(start, start + itemsPerPage);
    }, [filteredData, currentPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

    const handleCreateExpense = (newExpense: any) => {
        setExpenses(prev => [newExpense, ...prev]);
        setIsNewExpenseOpen(false);

        // Calculate total new cost for the toast
        const total = (parseFloat(newExpense.fuelExpense) || 0) + (parseFloat(newExpense.miscExpense) || 0);

        // Toast simulates the Cost per Vehicle calculation and Automated "Total Operational Cost"
        toast.success(`Expense Logged Successfully!`, {
            description: `Automated Calculation: Total Operational Cost updated. +$${total} added to ${newExpense.vehicleId || newExpense.driver}'s record.`
        });
    };

    return (
        <div className="px-6 py-6 space-y-4">
            {/* Header & Description */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold mb-2 flex items-center gap-3">
                        <Receipt className="w-6 h-6 text-[var(--primary)]" />
                        Completed Trip, Expense & Fuel Logging
                    </h1>
                    <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
                        This is the digital "wallet" for your fleet. It tracks exactly how much money is being spent to keep your vehicles moving. The system automatically connects these receipts to the specific vehicle used and calculates the
                        <span className="text-[var(--primary)] font-semibold mx-1">"Total Operational Cost"</span>.
                    </p>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col xl:flex-row gap-4 justify-between pt-2">
                <div className="flex flex-wrap items-center gap-3 flex-1">
                    {/* Search Bar */}
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by Trip ID or Driver..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-full glass-panel border border-[var(--card-border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm transition-all text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:bg-[var(--card)]/80"
                        />
                    </div>

                    {/* Filters */}
                    <div className="relative flex gap-2">
                        <div className="relative">
                            <select
                                className="glass-panel px-4 py-2.5 rounded-full text-sm font-medium appearance-none pr-10 cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-colors text-[var(--foreground)] outline-none"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                {["All Statuses", "Completed", "Pending", "Done"].map(opt => (
                                    <option key={opt} value={opt} className="bg-[var(--background)]">{opt}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 self-end xl:self-auto">
                    <button onClick={() => setIsNewExpenseOpen(true)} className="px-6 py-2.5 rounded-full bg-[var(--primary)] text-white font-medium text-sm transition-all hover:bg-[#4d417c] hover:shadow-[0_0_20px_rgba(96,81,155,0.6)] flex items-center gap-2 border border-[#4d417c]/50">
                        <Plus size={16} /> Add an Expense
                    </button>
                </div>
            </div>

            {/* Core Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="glass-panel rounded-2xl overflow-hidden mt-6 shadow-xl"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-[rgba(255,255,255,0.04)] text-[var(--primary)] text-sm border-b border-[var(--card-border)]">
                                <th className="py-5 px-6 font-semibold w-28">Trip ID</th>
                                <th className="py-5 px-6 font-semibold">Driver</th>
                                <th className="py-5 px-6 font-semibold">Distance</th>
                                <th className="py-5 px-6 font-semibold w-32">Fuel Expense</th>
                                <th className="py-5 px-6 font-semibold w-32">Misc. Expen</th>
                                <th className="py-5 px-6 font-semibold w-36">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--card-border)]/50">
                            {paginatedData.length > 0 ? (
                                paginatedData.map((row, i) => {
                                    const styling = getStatusStyling(row.status);

                                    // Make "1000" into "1k" to mimic wireframe exactly, if needed, else display the raw string with a $ sign
                                    const fuelDisplay = Number(row.fuelExpense) >= 1000 ? `${(Number(row.fuelExpense) / 1000).toFixed(Number(row.fuelExpense) % 1000 === 0 ? 0 : 1)}k` : row.fuelExpense;
                                    const miscDisplay = Number(row.miscExpense) >= 1000 ? `${(Number(row.miscExpense) / 1000).toFixed(Number(row.miscExpense) % 1000 === 0 ? 0 : 1)}k` : (row.miscExpense === "0" ? "-" : row.miscExpense);

                                    return (
                                        <tr key={i} className="hover:bg-[rgba(255,255,255,0.03)] transition-colors group">
                                            <td className="py-4 px-6 text-sm font-medium text-[var(--foreground)]">{row.tripId.replace('TRP-', '')}</td>
                                            <td className="py-4 px-6 text-sm text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors">
                                                {row.driver.split(' ')[0]} {/* Keeping just first name to match "John" in wireframe */}
                                            </td>
                                            <td className="py-4 px-6 text-sm font-medium">{row.distance}</td>
                                            <td className="py-4 px-6 text-sm font-mono text-[var(--muted-foreground)]">
                                                {fuelDisplay !== "undefined" && isNaN(Number(fuelDisplay)) && fuelDisplay.includes('k') ? fuelDisplay : `$${row.fuelExpense}`}
                                            </td>
                                            <td className="py-4 px-6 text-sm font-mono text-[var(--muted-foreground)]">
                                                {miscDisplay !== "undefined" && isNaN(Number(miscDisplay)) && miscDisplay.includes('k') ? miscDisplay : (row.miscExpense === "0" ? "-" : `$${row.miscExpense}`)}
                                            </td>
                                            <td className="py-4 px-6 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <StatusIndicator status={row.status} styling={styling} />
                                                    <span className={`font-semibold ${styling.color}`}>{row.status}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-8 px-6 text-center text-[var(--muted-foreground)]">
                                        No expenses match your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-[var(--card-border)] flex items-center justify-between text-xs text-[var(--muted-foreground)] bg-[rgba(255,255,255,0.01)]">
                    <span>Showing {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries</span>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 rounded-md glass-panel disabled:opacity-50 hover:bg-[rgba(255,255,255,0.05)] transition-colors">Prev</button>
                        {Array.from({ length: totalPages }).map((_, idx) => (
                            <button key={idx} onClick={() => setCurrentPage(idx + 1)} className={`px-3 py-1.5 rounded-md transition-colors ${currentPage === idx + 1 ? 'bg-[var(--primary)] text-white' : 'glass-panel hover:bg-[rgba(255,255,255,0.05)]'}`}>{idx + 1}</button>
                        ))}
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 rounded-md glass-panel disabled:opacity-50 hover:bg-[rgba(255,255,255,0.05)] transition-colors">Next</button>
                    </div>
                </div>
            </motion.div>

            {/* Modals */}
            <AnimatePresence>
                {isNewExpenseOpen && <NewExpenseModal onClose={() => setIsNewExpenseOpen(false)} onCreate={handleCreateExpense} />}
            </AnimatePresence>
        </div>
    );
}

const StatusIndicator = ({ status, styling }: any) => (
    <span className={`flex h-2 w-2 rounded-full ${styling.bg}`}>
        {(status === "Pending" || status === "New") && (
            <span className={`animate-ping absolute inline-flex h-2 w-2 rounded-full opacity-75 ${styling.bg}`}></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${styling.bg.replace('/10', '')}`}></span>
    </span>
);

const NewExpenseModal = ({ onClose, onCreate }: { onClose: () => void, onCreate: (log: any) => void }) => {
    const [tripId, setTripId] = useState("");
    const [driver, setDriver] = useState("");
    const [fuelCost, setFuelCost] = useState("");
    const [miscExpense, setMiscExpense] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Find if driver matches any fleet data to associate vehicle
        const matchingVehicle = mockFleetData.find(v => v.driver.toLowerCase().includes(driver.toLowerCase()));

        const newLog = {
            id: Math.floor(Math.random() * 1000).toString(),
            tripId,
            driver,
            distance: "0 km", // Generated for the table if not part of form
            fuelExpense: fuelCost || "0",
            miscExpense: miscExpense || "0",
            status: "Done",
            date: new Date().toISOString().split('T')[0],
            vehicleId: matchingVehicle ? matchingVehicle.vehicle : "Unknown"
        };
        onCreate(newLog);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm shadow-2xl" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="glass-panel w-full max-w-sm rounded-2xl p-6 relative z-10 overflow-hidden shadow-2xl border border-[var(--card-border)] bg-[var(--background)]/90">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary)] to-emerald-400" />
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">New Expense</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-[rgba(255,255,255,0.1)]"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="flex items-center justify-between w-full">
                        <label className="text-sm font-semibold text-[var(--muted-foreground)] w-[30%]">Trip ID:</label>
                        <input
                            type="text"
                            required
                            className="w-[70%] px-3 py-2 rounded-lg glass-panel text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] bg-[rgba(255,255,255,0.02)]"
                            value={tripId}
                            onChange={e => setTripId(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center justify-between w-full">
                        <label className="text-sm font-semibold text-[var(--muted-foreground)] w-[30%]">Driver:</label>
                        <input
                            type="text"
                            required
                            className="w-[70%] px-3 py-2 rounded-lg glass-panel text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] bg-[rgba(255,255,255,0.02)]"
                            value={driver}
                            onChange={e => setDriver(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center justify-between w-full">
                        <label className="text-sm font-semibold text-[var(--muted-foreground)] w-[30%]">Fuel Cost:</label>
                        <input
                            type="number"
                            required
                            className="w-[70%] px-3 py-2 rounded-lg glass-panel text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] bg-[rgba(255,255,255,0.02)]"
                            value={fuelCost}
                            onChange={e => setFuelCost(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center justify-between w-full">
                        <label className="text-sm font-semibold text-[var(--muted-foreground)] w-[30%]">Misc Expense:</label>
                        <input
                            type="number"
                            className="w-[70%] px-3 py-2 rounded-lg glass-panel text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] bg-[rgba(255,255,255,0.02)]"
                            value={miscExpense}
                            onChange={e => setMiscExpense(e.target.value)}
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="submit" className="flex-1 py-1.5 rounded-lg border border-[var(--primary)] bg-transparent hover:bg-[var(--primary)]/10 text-[var(--primary)] font-semibold transition-all shadow-[0_0_10px_rgba(96,81,155,0.1)]">
                            Create
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 py-1.5 rounded-lg border border-[var(--card-border)] bg-transparent hover:bg-[rgba(255,255,255,0.05)] text-[var(--foreground)] font-semibold transition-colors">
                            Cancel
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};
