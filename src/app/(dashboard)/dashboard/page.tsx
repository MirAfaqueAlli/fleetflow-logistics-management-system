"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Truck,
    MapPin,
    Search,
    Plus,
    ChevronDown,
    X
} from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { mockFleetData, getStatusStyling } from "@/lib/mock-data";

export default function DashboardPage() {
    // Filtering and Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("All Types");
    const [filterStatus, setFilterStatus] = useState("All Statuses");
    const [filterRegion, setFilterRegion] = useState("All Regions");

    // Pagination & Modal State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [isNewTripOpen, setIsNewTripOpen] = useState(false);
    const [isNewVehicleOpen, setIsNewVehicleOpen] = useState(false);

    // KPI Calculations
    const totalVehicles = mockFleetData.length;
    const activeFleetCount = mockFleetData.filter(v => v.status === "On Trip").length;
    const maintenanceCount = mockFleetData.filter(v => v.status === "In Shop").length;
    const utilRate = totalVehicles > 0 ? Math.round((activeFleetCount / (totalVehicles - maintenanceCount)) * 100) : 0;
    const pendingCargoCount = 20;

    // Search & Filter Logic
    const filteredData = useMemo(() => {
        return mockFleetData.filter((item) => {
            const q = searchQuery.toLowerCase();
            const matchesSearch = item.vehicle.toLowerCase().includes(q) ||
                item.driver.toLowerCase().includes(q) ||
                item.id.includes(q);
            const matchesType = filterType === "All Types" || item.type === filterType;
            const matchesStatus = filterStatus === "All Statuses" || item.status === filterStatus;
            const matchesRegion = filterRegion === "All Regions" || item.region === filterRegion;

            return matchesSearch && matchesType && matchesStatus && matchesRegion;
        });
    }, [searchQuery, filterType, filterStatus, filterRegion]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(start, start + itemsPerPage);
    }, [filteredData, currentPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

    return (
        <div className="px-6 py-6 space-y-4">
            {/* Action Bar */}
            <div className="flex flex-col xl:flex-row gap-4 justify-between">
                <div className="flex flex-wrap items-center gap-3 flex-1">
                    {/* Search Bar */}
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search vehicle or driver..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-full glass-panel border border-[var(--card-border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm transition-all text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:bg-[var(--card)]/80"
                        />
                    </div>

                    {/* Filters */}
                    {[
                        { value: filterType, setter: setFilterType, options: ["All Types", "Truck", "Van", "Bike"] },
                        { value: filterStatus, setter: setFilterStatus, options: ["All Statuses", "On Trip", "In Shop", "Ready"] },
                        { value: filterRegion, setter: setFilterRegion, options: ["All Regions", "North", "South", "East", "West"] }
                    ].map((filter, idx) => (
                        <div key={idx} className="relative">
                            <select
                                className="glass-panel px-4 py-2.5 rounded-full text-sm font-medium appearance-none pr-10 cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-colors text-[var(--foreground)] outline-none"
                                value={filter.value}
                                onChange={(e) => filter.setter(e.target.value)}
                            >
                                {filter.options.map(opt => (
                                    <option key={opt} value={opt} className="bg-[var(--background)]">{opt}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 self-end xl:self-auto">
                    <button onClick={() => setIsNewTripOpen(true)} className="px-6 py-2.5 rounded-full bg-transparent border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white font-medium text-sm transition-all shadow-[0_0_15px_rgba(96,81,155,0.2)] hover:shadow-[0_0_20px_rgba(96,81,155,0.4)] flex items-center gap-2">
                        <Plus size={16} /> New Trip
                    </button>
                    <button onClick={() => setIsNewVehicleOpen(true)} className="px-6 py-2.5 rounded-full bg-[var(--primary)] text-white font-medium text-sm transition-all hover:bg-[#4d417c] hover:shadow-[0_0_20px_rgba(96,81,155,0.6)] flex items-center gap-2 border border-[#4d417c]/50">
                        <Plus size={16} /> New Vehicle
                    </button>
                </div>
            </div>

            {/* KPI Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pt-4">
                <KPICard title="Active Fleet" value={activeFleetCount} delay={0.1} />
                <KPICard title="Maintenance Alert" value={maintenanceCount} delay={0.2} />
                <KPICard title="Utilization Rate" value={`${utilRate}%`} delay={0.3} />
                <KPICard title="Pending Cargo" value={pendingCargoCount} delay={0.4} />
            </div>

            {/* Core Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="glass-panel rounded-2xl overflow-hidden mt-8 shadow-xl"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-[rgba(255,255,255,0.04)] text-[var(--primary)] text-sm border-b border-[var(--card-border)]">
                                <th className="py-5 px-6 font-semibold w-24">Trip</th>
                                <th className="py-5 px-6 font-semibold">Vehicle</th>
                                <th className="py-5 px-6 font-semibold">Driver</th>
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
                                            <td className="py-4 px-6 text-sm font-medium">{row.driver}</td>
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
                                    <td colSpan={4} className="py-8 px-6 text-center text-[var(--muted-foreground)]">
                                        No fleet vehicles match your criteria.
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

            {/* Modals */}
            <AnimatePresence>
                {isNewTripOpen && <TripModal onClose={() => setIsNewTripOpen(false)} />}
                {isNewVehicleOpen && <VehicleModal onClose={() => setIsNewVehicleOpen(false)} />}
            </AnimatePresence>
        </div>
    );
}

const StatusIndicator = ({ status, styling }: any) => (
    <span className={`flex h-2 w-2 rounded-full ${styling.bg}`}>
        {status !== "Ready" && (
            <span className={`animate-ping absolute inline-flex h-2 w-2 rounded-full opacity-75 ${styling.bg}`}></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${styling.bg.replace('/10', '')}`}></span>
    </span>
);

const TripModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm shadow-2xl" />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="glass-panel w-full max-w-lg rounded-2xl p-6 relative z-10 overflow-hidden shadow-2xl border border-[var(--card-border)] bg-[var(--background)]/90">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary)] to-[#bfc0d1]" />
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2"><MapPin className="text-[var(--primary)]" /> Create New Trip</h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-[rgba(255,255,255,0.1)]"><X size={20} /></button>
            </div>
            <div className="space-y-4">
                <input type="text" placeholder="Destination address..." className="w-full px-4 py-2.5 rounded-xl glass-panel text-sm focus:outline-none bg-[rgba(255,255,255,0.02)]" />
                <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="Cargo weight (kg)" className="w-full px-4 py-2.5 rounded-xl glass-panel text-sm focus:outline-none bg-[rgba(255,255,255,0.02)]" />
                    <select className="w-full px-4 py-2.5 rounded-xl glass-panel text-sm focus:outline-none bg-[var(--background)]">
                        <option>Truck</option><option>Van</option><option>Bike</option>
                    </select>
                </div>
                <button onClick={onClose} className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-semibold mt-6">Dispatch Trip</button>
            </div>
        </motion.div>
    </div>
);

const VehicleModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm shadow-2xl" />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="glass-panel w-full max-w-lg rounded-2xl p-6 relative z-10 overflow-hidden shadow-2xl border border-[var(--card-border)] bg-[var(--background)]/90">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary)] to-[#bfc0d1]" />
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2"><Truck className="text-[var(--primary)]" /> Register Vehicle</h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-[rgba(255,255,255,0.1)]"><X size={20} /></button>
            </div>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <select className="w-full px-4 py-2.5 rounded-xl glass-panel text-sm focus:outline-none bg-[var(--background)] border-[var(--card-border)] focus:ring-2 focus:ring-[var(--primary)]">
                        <option>Truck</option><option>Van</option><option>Bike</option>
                    </select>
                    <input type="number" placeholder="Max capacity (kg)" className="w-full px-4 py-2.5 rounded-xl glass-panel text-sm focus:outline-none bg-[rgba(255,255,255,0.02)] border-[var(--card-border)] focus:ring-2 focus:ring-[var(--primary)]" />
                </div>
                <input type="text" placeholder="License Plate / Unique ID" className="w-full px-4 py-2.5 rounded-xl glass-panel text-sm focus:outline-none bg-[rgba(255,255,255,0.02)] border-[var(--card-border)] focus:ring-2 focus:ring-[var(--primary)]" />
                <button onClick={onClose} className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-semibold mt-6 shadow-[0_4px_14px_0_rgba(96,81,155,0.39)] hover:shadow-[0_6px_20px_rgba(96,81,155,0.23)] transition-all">Register Asset</button>
            </div>
        </motion.div>
    </div>
);
