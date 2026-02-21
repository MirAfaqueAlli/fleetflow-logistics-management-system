"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Search, Plus, X, AlertOctagon, Trash2, SlidersHorizontal, Users, AlertCircle } from "lucide-react";
import { createDriver, deleteDriver, updateDriverStatus, seedDrivers, DriverFormData } from "@/lib/actions/drivers";
import { toast } from "sonner";
import { DriverStatus } from "@prisma/client";

// Helper to format date
const formatDate = (dateString: string | Date) => {
    const d = new Date(dateString);
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear().toString().slice(2);
    return `${month}/${year}`;
};

const getStatusColor = (status: DriverStatus) => {
    switch (status) {
        case "ON_DUTY": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
        case "OFF_DUTY": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
        case "SUSPENDED": return "text-rose-500 bg-rose-500/10 border-rose-500/20";
        default: return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    }
};

const getSafetyColor = (score: number) => {
    if (score >= 90) return "text-emerald-500";
    if (score >= 75) return "text-amber-500";
    return "text-rose-500";
};

export default function PerformanceClient({ initialDrivers }: { initialDrivers: any[] }) {
    const [drivers, setDrivers] = useState(initialDrivers);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const [formData, setFormData] = useState({
        name: "",
        licenseNumber: "",
        licenseExpiry: "",
        category: "",
    });

    const filteredDrivers = drivers.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            try {
                const newDriver = await createDriver({
                    name: formData.name,
                    licenseNumber: formData.licenseNumber,
                    licenseExpiry: formData.licenseExpiry,
                    category: formData.category,
                });
                setDrivers([{ ...newDriver, completionRate: 100 }, ...drivers]);
                setFormData({ name: "", licenseNumber: "", licenseExpiry: "", category: "" });
                setIsModalOpen(false);
                toast.success("Driver added successfully");
            } catch (error: any) {
                toast.error(error.message || "Failed to add driver");
            }
        });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to remove this driver?")) return;
        startTransition(async () => {
            try {
                await deleteDriver(id);
                setDrivers(drivers.filter(d => d.id !== id));
                toast.success("Driver removed successfully");
            } catch (error: any) {
                toast.error(error.message || "Failed to remove driver");
            }
        });
    };

    const handleStatusChange = async (id: string, currentStatus: DriverStatus) => {
        const nextStatus = currentStatus === "OFF_DUTY" ? "ON_DUTY"
            : currentStatus === "ON_DUTY" ? "SUSPENDED"
                : "OFF_DUTY";

        startTransition(async () => {
            try {
                const updated = await updateDriverStatus(id, nextStatus as DriverStatus);
                setDrivers(drivers.map(d => d.id === id ? { ...d, status: updated.status } : d));
                toast.success(`Driver status updated to ${updated.status}`);
            } catch (error: any) {
                toast.error(error.message || "Failed to update status");
            }
        });
    };

    const handleSeed = async () => {
        startTransition(async () => {
            try {
                const res = await seedDrivers();
                if (res.seeded) {
                    toast.success(`Seeded ${res.count} drivers! Refreshing...`);
                    window.location.reload();
                } else {
                    toast.info(res.message);
                }
            } catch (error: any) {
                toast.error("Failed to seed drivers");
            }
        });
    };

    return (
        <div className="px-6 py-8 h-full flex flex-col max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <div className="p-2 bg-[#60519b]/20 rounded-xl">
                            <Shield className="text-[#60519b] w-6 h-6" />
                        </div>
                        Driver Performance & Safety Profiles
                    </h1>
                    <p className="text-[var(--muted-foreground)]">Manage your human resources, track safety scores, and ensure compliance.</p>
                </div>
                <div className="flex items-center gap-3">
                    {drivers.length === 0 && (
                        <button
                            onClick={handleSeed}
                            disabled={isPending}
                            className="btn-ghost flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card)] hover:bg-[var(--card-glow)] transition-all"
                        >
                            <Users size={18} />
                            <span>Add Mock Data</span>
                        </button>
                    )}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
                    >
                        <Plus size={18} />
                        <span>Add Driver</span>
                    </button>
                </div>
            </div>

            <div className="glass-panel rounded-2xl flex-1 flex flex-col overflow-hidden border border-[var(--card-border)]">
                {/* Toolbar */}
                <div className="p-4 border-b border-[var(--card-border)] flex flex-wrap gap-4 justify-between items-center bg-[var(--card)]/50">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name or license..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/20 border border-[var(--card-border)] rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-[#60519b] transition-colors text-sm"
                        />
                    </div>
                    <div className="flex gap-2 text-sm">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/20 border border-[var(--card-border)] hover:bg-black/40 transition-colors">
                            Group by
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/20 border border-[var(--card-border)] hover:bg-black/40 transition-colors">
                            <SlidersHorizontal size={16} /> Filter
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/20 border border-[var(--card-border)] hover:bg-black/40 transition-colors">
                            Sort by...
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead className="sticky top-0 bg-[var(--card)]/95 backdrop-blur-md z-10 shadow-sm">
                            <tr>
                                <th className="py-4 px-6 font-medium text-[var(--muted-foreground)] text-sm border-b border-[var(--card-border)]">Name</th>
                                <th className="py-4 px-6 font-medium text-[var(--muted-foreground)] text-sm border-b border-[var(--card-border)]">License#</th>
                                <th className="py-4 px-6 font-medium text-[var(--muted-foreground)] text-sm border-b border-[var(--card-border)]">Expiry</th>
                                <th className="py-4 px-6 font-medium text-[var(--muted-foreground)] text-sm border-b border-[var(--card-border)]">Completion Rate</th>
                                <th className="py-4 px-6 font-medium text-[var(--muted-foreground)] text-sm border-b border-[var(--card-border)]">Safety Score</th>
                                <th className="py-4 px-6 font-medium text-[var(--muted-foreground)] text-sm border-b border-[var(--card-border)]">Complaints</th>
                                <th className="py-4 px-6 font-medium text-[var(--muted-foreground)] text-sm border-b border-[var(--card-border)]">Duty Status</th>
                                <th className="py-4 px-6 font-medium text-[var(--muted-foreground)] text-sm border-b border-[var(--card-border)] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDrivers.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-[var(--muted-foreground)]">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <AlertCircle className="w-8 h-8 opacity-50" />
                                            <p>No drivers found. Add a driver to populate the profiles.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredDrivers.map((driver) => {
                                    const isExpired = new Date(driver.licenseExpiry) < new Date();

                                    return (
                                        <tr key={driver.id} className={`border-b border-[var(--card-border)]/50 hover:bg-white/5 transition-colors group ${isExpired ? 'bg-rose-500/5' : ''}`}>
                                            <td className="py-4 px-6 font-medium">{driver.name}</td>
                                            <td className="py-4 px-6 font-mono text-sm">{driver.licenseNumber}</td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-mono text-sm ${isExpired ? 'text-rose-500 font-bold' : ''}`}>
                                                        {formatDate(driver.licenseExpiry)}
                                                    </span>
                                                    {isExpired && <AlertOctagon size={16} className="text-rose-500" title="License Expired (System Locked)" />}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 font-medium">{driver.completionRate}%</td>
                                            <td className="py-4 px-6">
                                                <span className={`font-bold ${getSafetyColor(driver.safetyScore)}`}>
                                                    {driver.safetyScore}%
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 font-medium text-center">{driver.complaints}</td>
                                            <td className="py-4 px-6">
                                                <button
                                                    onClick={() => handleStatusChange(driver.id, driver.status)}
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-colors hover:opacity-80 ${getStatusColor(driver.status)}`}
                                                    title="Click to cycle status"
                                                >
                                                    {driver.status.replace("_", " ")}
                                                </button>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <button
                                                    onClick={() => handleDelete(driver.id)}
                                                    className="p-2 inline-flex items-center justify-center rounded-lg hover:bg-rose-500/20 text-[var(--muted-foreground)] hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Remove Driver"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Registration Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-[#1e1f2a] border border-[var(--card-border)] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-[var(--card-border)] flex justify-between items-center bg-[#252632]">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Shield className="text-[#60519b]" />
                                    Driver Form & Compliance
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-[var(--muted-foreground)] hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleCreate} className="p-6 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[var(--muted-foreground)] w-full block">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. John Doe"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-black/30 border border-[var(--card-border)] rounded-xl px-4 py-2.5 outline-none focus:border-[#60519b] transition-colors"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-[var(--muted-foreground)] w-full block">License #</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. DL-12345"
                                            value={formData.licenseNumber}
                                            onChange={e => setFormData({ ...formData, licenseNumber: e.target.value.toUpperCase() })}
                                            className="w-full bg-black/30 border border-[var(--card-border)] rounded-xl px-4 py-2.5 outline-none focus:border-[#60519b] transition-colors font-mono uppercase"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-[var(--muted-foreground)] w-full block">Expiry Date</label>
                                        <input
                                            required
                                            type="date"
                                            value={formData.licenseExpiry}
                                            onChange={e => setFormData({ ...formData, licenseExpiry: e.target.value })}
                                            className="w-full bg-black/30 border border-[var(--card-border)] rounded-xl px-4 py-2.5 outline-none focus:border-[#60519b] transition-colors block"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[var(--muted-foreground)] w-full block">Vehicle Category</label>
                                    <select
                                        required
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-black/30 border border-[var(--card-border)] rounded-xl px-4 py-2.5 outline-none focus:border-[#60519b] transition-colors appearance-none"
                                    >
                                        <option value="" disabled>Select category...</option>
                                        <option value="Truck">Truck</option>
                                        <option value="Van">Van</option>
                                        <option value="Mini">Mini Delivery</option>
                                        <option value="Bike">Motorcycle/Bike</option>
                                    </select>
                                </div>

                                <div className="pt-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-5 py-2.5 rounded-xl border border-[var(--card-border)] hover:bg-white/5 transition-colors font-medium text-[var(--muted-foreground)]"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors font-medium border border-emerald-500 shadow-lg shadow-emerald-900/20 disabled:opacity-50 flex items-center justify-center min-w-[120px]"
                                    >
                                        {isPending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Save Driver"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
