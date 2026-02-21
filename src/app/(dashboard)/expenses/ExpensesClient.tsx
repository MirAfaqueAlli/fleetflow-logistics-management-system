"use client";

import { useState, useMemo, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, ChevronDown, X, Receipt } from "lucide-react";
import { getStatusStyling } from "@/lib/mock-data";
import { logExpense } from "@/lib/actions/logistics";
import { toast } from "sonner";

interface ExpenseRow {
    id: string;
    vehicleName: string;
    licensePlate: string;
    cost: number;
    liters: number | null;
    type: string;
    date: Date;
}

interface VehicleOption {
    id: string;
    name: string;
    licensePlate: string;
}

export default function ExpensesClient({
    initialExpenses,
    vehicles,
}: {
    initialExpenses: ExpenseRow[];
    vehicles: VehicleOption[];
}) {
    const [expenses, setExpenses] = useState(initialExpenses);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("All Types");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [isNewExpenseOpen, setIsNewExpenseOpen] = useState(false);

    const filteredData = useMemo(() => {
        return expenses.filter((item) => {
            const q = searchQuery.toLowerCase();
            const matchesSearch =
                item.vehicleName.toLowerCase().includes(q) ||
                item.licensePlate.toLowerCase().includes(q) ||
                item.type.toLowerCase().includes(q);
            const matchesType = filterType === "All Types" || item.type === filterType;
            return matchesSearch && matchesType;
        });
    }, [expenses, searchQuery, filterType]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(start, start + itemsPerPage);
    }, [filteredData, currentPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

    const handleCreateExpense = (newExpense: ExpenseRow) => {
        setExpenses(prev => [newExpense, ...prev]);
        setIsNewExpenseOpen(false);
        toast.success(`Expense Logged!`, {
            description: `₹${newExpense.cost.toLocaleString()} added to ${newExpense.vehicleName}'s record.`
        });
    };

    return (
        <div className="px-6 py-6 space-y-4">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2 flex items-center gap-3">
                    <Receipt className="w-6 h-6 text-[var(--primary)]" />
                    Fuel &amp; Expense Logs
                </h1>
                <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
                    Track exactly how much money is being spent to keep your fleet moving. The system automatically connects
                    receipts to vehicles and calculates the
                    <span className="text-[var(--primary)] font-semibold mx-1">"Total Operational Cost"</span>.
                </p>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col xl:flex-row gap-4 justify-between pt-2">
                <div className="flex flex-wrap items-center gap-3 flex-1">
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by vehicle or type..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-full glass-panel border border-[var(--card-border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm transition-all text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:bg-[var(--card)]/80"
                        />
                    </div>
                    <div className="relative">
                        <select
                            className="glass-panel px-4 py-2.5 rounded-full text-sm font-medium appearance-none pr-10 cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-colors text-[var(--foreground)] outline-none"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            {["All Types", "FUEL", "MAINTENANCE"].map(opt => (
                                <option key={opt} value={opt} className="bg-[var(--background)]">{opt}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
                    </div>
                </div>

                <div className="flex items-center gap-3 self-end xl:self-auto">
                    <button
                        onClick={() => setIsNewExpenseOpen(true)}
                        className="px-6 py-2.5 rounded-full bg-[var(--primary)] text-white font-medium text-sm transition-all hover:bg-[#4d417c] hover:shadow-[0_0_20px_rgba(96,81,155,0.6)] flex items-center gap-2 border border-[#4d417c]/50"
                    >
                        <Plus size={16} /> Add Expense
                    </button>
                </div>
            </div>

            {/* Summary KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Spent", value: `₹${expenses.reduce((s, e) => s + e.cost, 0).toLocaleString()}` },
                    { label: "Fuel Costs", value: `₹${expenses.filter(e => e.type === "FUEL").reduce((s, e) => s + e.cost, 0).toLocaleString()}` },
                    { label: "Maintenance", value: `₹${expenses.filter(e => e.type === "MAINTENANCE").reduce((s, e) => s + e.cost, 0).toLocaleString()}` },
                    { label: "Total Liters", value: `${expenses.filter(e => e.liters).reduce((s, e) => s + (e.liters || 0), 0).toFixed(0)} L` },
                ].map((kpi) => (
                    <div key={kpi.label} className="glass-panel rounded-xl p-4 border border-[var(--card-border)]">
                        <p className="text-xs text-[var(--muted-foreground)] mb-1">{kpi.label}</p>
                        <p className="text-xl font-bold text-[var(--foreground)]">{kpi.value}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="glass-panel rounded-2xl overflow-hidden mt-2 shadow-xl"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-[rgba(255,255,255,0.04)] text-[var(--primary)] text-sm border-b border-[var(--card-border)]">
                                <th className="py-5 px-6 font-semibold">Vehicle</th>
                                <th className="py-5 px-6 font-semibold w-28">Type</th>
                                <th className="py-5 px-6 font-semibold w-28">Liters</th>
                                <th className="py-5 px-6 font-semibold w-32">Cost</th>
                                <th className="py-5 px-6 font-semibold w-32">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--card-border)]/50">
                            {paginatedData.length > 0 ? (
                                paginatedData.map((row, i) => (
                                    <tr key={i} className="hover:bg-[rgba(255,255,255,0.03)] transition-colors group">
                                        <td className="py-4 px-6 text-sm">
                                            <div className="font-medium text-[var(--foreground)]">{row.vehicleName}</div>
                                            <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{row.licensePlate}</div>
                                        </td>
                                        <td className="py-4 px-6 text-sm">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${row.type === "FUEL"
                                                    ? "bg-amber-500/10 text-amber-400"
                                                    : "bg-rose-500/10 text-rose-400"
                                                }`}>
                                                {row.type}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-[var(--muted-foreground)]">
                                            {row.liters ? `${row.liters} L` : "—"}
                                        </td>
                                        <td className="py-4 px-6 text-sm font-mono font-semibold text-[var(--foreground)]">
                                            ₹{row.cost.toLocaleString()}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-[var(--muted-foreground)]">
                                            {new Date(row.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-8 px-6 text-center text-[var(--muted-foreground)]">
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
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 rounded-md glass-panel disabled:opacity-50">Prev</button>
                        {Array.from({ length: totalPages }).map((_, idx) => (
                            <button key={idx} onClick={() => setCurrentPage(idx + 1)} className={`px-3 py-1.5 rounded-md ${currentPage === idx + 1 ? 'bg-[var(--primary)] text-white' : 'glass-panel'}`}>{idx + 1}</button>
                        ))}
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 rounded-md glass-panel disabled:opacity-50">Next</button>
                    </div>
                </div>
            </motion.div>

            {/* Modal */}
            <AnimatePresence>
                {isNewExpenseOpen && (
                    <NewExpenseModal
                        onClose={() => setIsNewExpenseOpen(false)}
                        onCreate={handleCreateExpense}
                        vehicles={vehicles}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

const NewExpenseModal = ({
    onClose,
    onCreate,
    vehicles,
}: {
    onClose: () => void;
    onCreate: (expense: any) => void;
    vehicles: VehicleOption[];
}) => {
    const [vehicleId, setVehicleId] = useState(vehicles[0]?.id || "");
    const [type, setType] = useState("FUEL");
    const [cost, setCost] = useState("");
    const [liters, setLiters] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!vehicleId || !cost) return;

        startTransition(async () => {
            try {
                const expense = await logExpense({
                    vehicleId,
                    type,
                    cost: parseFloat(cost),
                    liters: liters ? parseFloat(liters) : null,
                });
                const vehicle = vehicles.find(v => v.id === vehicleId);
                onCreate({
                    id: expense.id,
                    vehicleName: vehicle?.name || "",
                    licensePlate: vehicle?.licensePlate || "",
                    cost: parseFloat(cost),
                    liters: liters ? parseFloat(liters) : null,
                    type,
                    date: new Date(),
                });
            } catch (error: any) {
                toast.error(error.message || "Failed to log expense.");
            }
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="glass-panel w-full max-w-sm rounded-2xl p-6 relative z-10 shadow-2xl border border-[var(--card-border)] bg-[var(--background)]/90">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary)] to-emerald-400" />
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2"><Receipt className="text-[var(--primary)]" size={20} /> New Expense</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-[rgba(255,255,255,0.1)]"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Vehicle</label>
                        <select
                            required
                            className="w-full px-4 py-2.5 rounded-xl glass-panel text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] bg-[var(--background)]"
                            value={vehicleId}
                            onChange={e => setVehicleId(e.target.value)}
                        >
                            {vehicles.map(v => (
                                <option key={v.id} value={v.id}>{v.name} ({v.licensePlate})</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Expense Type</label>
                        <select
                            className="w-full px-4 py-2.5 rounded-xl glass-panel text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] bg-[var(--background)]"
                            value={type}
                            onChange={e => setType(e.target.value)}
                        >
                            <option value="FUEL">Fuel</option>
                            <option value="MAINTENANCE">Maintenance</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Cost (₹)</label>
                            <input
                                type="number"
                                required
                                placeholder="0"
                                className="w-full px-4 py-2.5 rounded-xl glass-panel text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] bg-[rgba(255,255,255,0.02)]"
                                value={cost}
                                onChange={e => setCost(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Liters (optional)</label>
                            <input
                                type="number"
                                placeholder="0"
                                className="w-full px-4 py-2.5 rounded-xl glass-panel text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] bg-[rgba(255,255,255,0.02)]"
                                value={liters}
                                onChange={e => setLiters(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-[var(--card-border)] hover:bg-[rgba(255,255,255,0.05)] font-semibold transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={isPending} className="flex-1 py-3 rounded-xl bg-[var(--primary)] hover:bg-[#4d417c] text-white font-semibold transition-all shadow-[0_0_15px_rgba(96,81,155,0.4)] disabled:opacity-50">
                            {isPending ? "Saving..." : "Log Expense"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};
