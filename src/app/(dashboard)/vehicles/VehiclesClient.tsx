"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, Search, Plus, X, Power, Trash2, SlidersHorizontal, Package, AlertCircle } from "lucide-react";
import { createVehicle, deleteVehicle, toggleVehicleRetired, seedVehicles, VehicleFormData } from "@/lib/actions/vehicles";
import { toast } from "sonner";

// Helper to get status colors
const getStatusStyles = (status: string) => {
    switch (status) {
        case "AVAILABLE": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
        case "ON_TRIP": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
        case "IN_SHOP": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
        case "RETIRED": return "bg-rose-500/10 text-rose-500 border-rose-500/20";
        default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
};

export default function VehiclesClient({ initialVehicles }: { initialVehicles: any[] }) {
    const [vehicles, setVehicles] = useState(initialVehicles);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const [formData, setFormData] = useState({
        name: "",
        model: "",
        licensePlate: "",
        maxLoadCapacity: "",
        odometer: "",
    });

    const filteredVehicles = vehicles.filter(v =>
        v.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.model.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            try {
                const newVehicle = await createVehicle({
                    name: formData.name,
                    model: formData.model,
                    licensePlate: formData.licensePlate,
                    maxLoadCapacity: Number(formData.maxLoadCapacity),
                    odometer: Number(formData.odometer),
                });
                setVehicles([newVehicle, ...vehicles]);
                setFormData({ name: "", model: "", licensePlate: "", maxLoadCapacity: "", odometer: "" });
                setIsModalOpen(false);
                toast.success("Vehicle registered successfully");
            } catch (error: any) {
                toast.error(error.message || "Failed to register vehicle");
            }
        });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this vehicle?")) return;
        startTransition(async () => {
            try {
                await deleteVehicle(id);
                setVehicles(vehicles.filter(v => v.id !== id));
                toast.success("Vehicle deleted successfully");
            } catch (error: any) {
                toast.error(error.message || "Failed to delete vehicle");
            }
        });
    };

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        startTransition(async () => {
            try {
                const updated = await toggleVehicleRetired(id, currentStatus as any);
                setVehicles(vehicles.map(v => v.id === id ? { ...v, status: updated.status } : v));
                toast.success(`Vehicle status updated to ${updated.status}`);
            } catch (error: any) {
                toast.error(error.message || "Failed to update status");
            }
        });
    };

    const handleSeed = async () => {
        startTransition(async () => {
            try {
                const res = await seedVehicles();
                if (res.seeded) {
                    toast.success(`Seeded ${res.count} vehicles! Refreshing...`);
                    window.location.reload();
                } else {
                    toast.info(res.message);
                }
            } catch (error: any) {
                toast.error("Failed to seed vehicles");
            }
        });
    };

    return (
        <div className="px-6 py-8 h-full flex flex-col max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <div className="p-2 bg-[#60519b]/20 rounded-xl">
                            <Truck className="text-[#60519b] w-6 h-6" />
                        </div>
                        Vehicle Registry
                    </h1>
                    <p className="text-[var(--muted-foreground)]">Manage your physical assets, capacities, and vehicle lifecycles.</p>
                </div>
                <div className="flex items-center gap-3">
                    {vehicles.length === 0 && (
                        <button
                            onClick={handleSeed}
                            disabled={isPending}
                            className="btn-ghost flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card)] hover:bg-[var(--card-glow)] transition-all"
                        >
                            <Package size={18} />
                            <span>Add Mock Data</span>
                        </button>
                    )}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
                    >
                        <Plus size={18} />
                        <span>New Vehicle</span>
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
                            placeholder="Search by license plate, name or model..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/20 border border-[var(--card-border)] rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-[#60519b] transition-colors text-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/20 border border-[var(--card-border)] text-sm hover:bg-black/40 transition-colors">
                            <SlidersHorizontal size={16} />
                            <span>Filter</span>
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-[var(--card)]/95 backdrop-blur-md z-10 shadow-sm">
                            <tr>
                                <th className="py-4 px-6 font-medium text-[var(--muted-foreground)] text-sm border-b border-[var(--card-border)] w-16">No</th>
                                <th className="py-4 px-6 font-medium text-[var(--muted-foreground)] text-sm border-b border-[var(--card-border)]">Plate / ID</th>
                                <th className="py-4 px-6 font-medium text-[var(--muted-foreground)] text-sm border-b border-[var(--card-border)]">Name / Make</th>
                                <th className="py-4 px-6 font-medium text-[var(--muted-foreground)] text-sm border-b border-[var(--card-border)]">Type</th>
                                <th className="py-4 px-6 font-medium text-[var(--muted-foreground)] text-sm border-b border-[var(--card-border)]">Capacity</th>
                                <th className="py-4 px-6 font-medium text-[var(--muted-foreground)] text-sm border-b border-[var(--card-border)]">Odometer</th>
                                <th className="py-4 px-6 font-medium text-[var(--muted-foreground)] text-sm border-b border-[var(--card-border)]">Status</th>
                                <th className="py-4 px-6 font-medium text-[var(--muted-foreground)] text-sm border-b border-[var(--card-border)] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVehicles.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-[var(--muted-foreground)]">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <AlertCircle className="w-8 h-8 opacity-50" />
                                            <p>No vehicles found. Register a new asset to get started.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredVehicles.map((vehicle, index) => (
                                    <tr key={vehicle.id} className="border-b border-[var(--card-border)]/50 hover:bg-white/5 transition-colors group">
                                        <td className="py-4 px-6 text-sm text-[var(--muted-foreground)]">{(index + 1).toString().padStart(2, '0')}</td>
                                        <td className="py-4 px-6 font-mono font-medium">{vehicle.licensePlate}</td>
                                        <td className="py-4 px-6">
                                            <div className="font-medium">{vehicle.name}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="px-3 py-1 bg-white/5 rounded-lg text-sm border border-white/10">{vehicle.model}</span>
                                        </td>
                                        <td className="py-4 px-6 text-sm">{vehicle.maxLoadCapacity.toLocaleString()} kg</td>
                                        <td className="py-4 px-6 text-sm">{vehicle.odometer.toLocaleString()} km</td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles(vehicle.status)}`}>
                                                {vehicle.status.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleToggleStatus(vehicle.id, vehicle.status)}
                                                    className="p-2 rounded-lg hover:bg-white/10 text-[var(--muted-foreground)] hover:text-white transition-colors"
                                                    title={vehicle.status === "RETIRED" ? "Mark Available" : "Mark Out of Service (Retired)"}
                                                >
                                                    <Power size={18} className={vehicle.status === "RETIRED" ? "text-blue-400" : ""} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(vehicle.id)}
                                                    className="p-2 rounded-lg hover:bg-rose-500/20 text-[var(--muted-foreground)] hover:text-rose-500 transition-colors"
                                                    title="Delete Vehicle"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
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
                                    <Truck className="text-[#60519b]" />
                                    New Vehicle Registration
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-[var(--muted-foreground)] hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleCreate} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-[var(--muted-foreground)] w-full block">License Plate</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. TH-001"
                                            value={formData.licensePlate}
                                            onChange={e => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
                                            className="w-full bg-black/30 border border-[var(--card-border)] rounded-xl px-4 py-2.5 outline-none focus:border-[#60519b] transition-colors font-mono uppercase"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-[var(--muted-foreground)] w-full block">Name / Make</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. Titan Hauler"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-black/30 border border-[var(--card-border)] rounded-xl px-4 py-2.5 outline-none focus:border-[#60519b] transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-[var(--muted-foreground)] w-full block">Vehicle Type</label>
                                        <select
                                            required
                                            value={formData.model}
                                            onChange={e => setFormData({ ...formData, model: e.target.value })}
                                            className="w-full bg-black/30 border border-[var(--card-border)] rounded-xl px-4 py-2.5 outline-none focus:border-[#60519b] transition-colors appearance-none"
                                        >
                                            <option value="" disabled>Select type...</option>
                                            <option value="Truck">Truck</option>
                                            <option value="Van">Van</option>
                                            <option value="Mini">Mini Courier</option>
                                            <option value="Bike">Delivery Bike</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-[var(--muted-foreground)] w-full block">Max Payload (kg)</label>
                                        <input
                                            required
                                            type="number"
                                            min="0"
                                            placeholder="e.g. 15000"
                                            value={formData.maxLoadCapacity}
                                            onChange={e => setFormData({ ...formData, maxLoadCapacity: e.target.value })}
                                            className="w-full bg-black/30 border border-[var(--card-border)] rounded-xl px-4 py-2.5 outline-none focus:border-[#60519b] transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5 border-t border-[var(--card-border)]/50 pt-4 mt-2">
                                    <label className="text-sm font-medium text-[var(--muted-foreground)] w-full block">Initial Odometer (km)</label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        placeholder="Current mileage"
                                        value={formData.odometer}
                                        onChange={e => setFormData({ ...formData, odometer: e.target.value })}
                                        className="w-full bg-black/30 border border-[var(--card-border)] rounded-xl px-4 py-2.5 outline-none focus:border-[#60519b] transition-colors"
                                    />
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
                                        {isPending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Save Vehicle"}
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
