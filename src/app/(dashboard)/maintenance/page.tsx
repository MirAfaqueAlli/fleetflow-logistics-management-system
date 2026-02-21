"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, ChevronDown, X, Wrench } from "lucide-react";
import { mockMaintenanceLogs, getStatusStyling, mockFleetData } from "@/lib/mock-data";
import { toast } from "sonner"; // Assuming sonner is set up

export default function MaintenancePage() {
    // State for Logs
    const [logs, setLogs] = useState(mockMaintenanceLogs);

    // Filtering and Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All Statuses");

    // Pagination & Modal State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [isNewServiceOpen, setIsNewServiceOpen] = useState(false);

    // Search & Filter Logic
    const filteredData = useMemo(() => {
        return logs.filter((item) => {
            const q = searchQuery.toLowerCase();
            const matchesSearch = item.vehicle.toLowerCase().includes(q) ||
                item.issue.toLowerCase().includes(q) ||
                item.id.includes(q);
            const matchesStatus = filterStatus === "All Statuses" || item.status === filterStatus;

            return matchesSearch && matchesStatus;
        });
    }, [logs, searchQuery, filterStatus]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(start, start + itemsPerPage);
    }, [filteredData, currentPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

    const handleCreateService = (newLog: any) => {
        setLogs(prev => [newLog, ...prev]);
        setIsNewServiceOpen(false);
        // Toast simulates the Auto-Hide Rule logic
        toast.success(`Service Log Created!`, {
            description: `Auto-Hide Rule: ${newLog.vehicle} has been automatically marked as "In Shop" and removed from dispatch pool.`
        });
    };

    return (
        <div className="px-6 py-6 space-y-4">
            {/* Header & Description */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold mb-2 flex items-center gap-3">
                        <Wrench className="w-6 h-6 text-[var(--primary)]" />
                        Maintenance & Service Logs
                    </h1>
                    <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
                        This is where you keep your vehicles healthy. Logging a Repair automatically triggers the
                        <span className="text-[var(--primary)] font-semibold mx-1">"Auto-Hide" Rule</span>
                        marking the vehicle as "In Shop" preventing it from being accidentally dispatched.
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
                            placeholder="Search logs by ID, vehicle, or issue..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-full glass-panel border border-[var(--card-border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm transition-all text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:bg-[var(--card)]/80"
                        />
                    </div>

                    {/* Filters */}
                    <div className="relative">
                        <select
                            className="glass-panel px-4 py-2.5 rounded-full text-sm font-medium appearance-none pr-10 cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-colors text-[var(--foreground)] outline-none"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            {["All Statuses", "New", "In Progress", "Completed"].map(opt => (
                                <option key={opt} value={opt} className="bg-[var(--background)]">{opt}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 self-end xl:self-auto">
                    <button onClick={() => setIsNewServiceOpen(true)} className="px-6 py-2.5 rounded-full bg-[var(--primary)] text-white font-medium text-sm transition-all hover:bg-[#4d417c] hover:shadow-[0_0_20px_rgba(96,81,155,0.6)] flex items-center gap-2 border border-[#4d417c]/50">
                        <Plus size={16} /> Create New Service
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
                                <th className="py-5 px-6 font-semibold w-24">Log ID</th>
                                <th className="py-5 px-6 font-semibold">Vehicle</th>
                                <th className="py-5 px-6 font-semibold">Issue/Service</th>
                                <th className="py-5 px-6 font-semibold w-32">Date</th>
                                <th className="py-5 px-6 font-semibold w-28">Cost</th>
                                <th className="py-5 px-6 font-semibold w-40">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--card-border)]/50">
                            {paginatedData.length > 0 ? (
                                paginatedData.map((row, i) => {
                                    const styling = getStatusStyling(row.status);
                                    return (
                                        <tr key={i} className="hover:bg-[rgba(255,255,255,0.03)] transition-colors group">
                                            <td className="py-4 px-6 text-sm font-medium text-[var(--foreground)]">{row.id}</td>
                                            <td className="py-4 px-6 text-sm text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors">
                                                {row.vehicle}
                                            </td>
                                            <td className="py-4 px-6 text-sm font-medium">{row.issue}</td>
                                            <td className="py-4 px-6 text-sm text-[var(--muted-foreground)]">{row.date}</td>
                                            <td className="py-4 px-6 text-sm font-mono text-[var(--muted-foreground)]">${row.cost}</td>
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
                                        No service logs match your criteria.
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
                {isNewServiceOpen && <NewServiceModal onClose={() => setIsNewServiceOpen(false)} onCreate={handleCreateService} />}
            </AnimatePresence>
        </div>
    );
}

const StatusIndicator = ({ status, styling }: any) => (
    <span className={`flex h-2 w-2 rounded-full ${styling.bg}`}>
        {(status === "New" || status === "In Progress") && (
            <span className={`animate-ping absolute inline-flex h-2 w-2 rounded-full opacity-75 ${styling.bg}`}></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${styling.bg.replace('/10', '')}`}></span>
    </span>
);

const NewServiceModal = ({ onClose, onCreate }: { onClose: () => void, onCreate: (log: any) => void }) => {
    const [vehicle, setVehicle] = useState(mockFleetData[0]?.vehicle || "");
    const [issue, setIssue] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [cost, setCost] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newLog = {
            id: Math.floor(Math.random() * 1000).toString(),
            vehicle,
            issue,
            date,
            cost: cost || "0",
            status: "New"
        };
        onCreate(newLog);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm shadow-2xl" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="glass-panel w-full max-w-lg rounded-2xl p-6 relative z-10 overflow-hidden shadow-2xl border border-[var(--card-border)] bg-[var(--background)]/90">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary)] to-rose-400" />
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2"><Wrench className="text-[var(--primary)]" /> Log New Repair</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-[rgba(255,255,255,0.1)]"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Vehicle</label>
                        <select
                            required
                            className="w-full px-4 py-2.5 rounded-xl glass-panel text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] bg-[var(--background)]"
                            value={vehicle}
                            onChange={e => setVehicle(e.target.value)}
                        >
                            {mockFleetData.map(v => (
                                <option key={v.id} value={v.vehicle}>{v.vehicle}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Issue / Service</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Engine Check, Oil Change"
                            className="w-full px-4 py-2.5 rounded-xl glass-panel text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] bg-[rgba(255,255,255,0.02)]"
                            value={issue}
                            onChange={e => setIssue(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Date</label>
                            <input
                                type="date"
                                required
                                className="w-full px-4 py-2.5 rounded-xl glass-panel text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] bg-[rgba(255,255,255,0.02)]"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Est. Cost ($)</label>
                            <input
                                type="number"
                                placeholder="0"
                                className="w-full px-4 py-2.5 rounded-xl glass-panel text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] bg-[rgba(255,255,255,0.02)]"
                                value={cost}
                                onChange={e => setCost(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl bg-transparent border border-[var(--card-border)] hover:bg-[rgba(255,255,255,0.05)] text-[var(--foreground)] font-semibold transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="flex-1 py-3 rounded-xl bg-[var(--primary)] hover:bg-[#4d417c] text-white font-semibold transition-all shadow-[0_0_15px_rgba(96,81,155,0.4)]">
                            Create Log
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

