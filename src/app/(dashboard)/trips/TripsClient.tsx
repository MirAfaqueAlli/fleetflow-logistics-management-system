"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Search, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { createTrip } from "@/lib/actions/logistics";

export default function TripsClient({ initialTrips, availableVehicles, availableDrivers }: any) {
    const [trips, setTrips] = useState(initialTrips);
    const [search, setSearch] = useState("");
    const [isPending, startTransition] = useTransition();

    // Form State
    const [selectedVehicleId, setSelectedVehicleId] = useState("");
    const [cargoWeight, setCargoWeight] = useState("");
    const [selectedDriverId, setSelectedDriverId] = useState("");
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [fuelCost, setFuelCost] = useState("");

    const handleDispatch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedVehicleId || !selectedDriverId || !cargoWeight || !origin || !destination) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const vehicle = availableVehicles.find((v: any) => v.id === selectedVehicleId);
        if (vehicle && Number(cargoWeight) > vehicle.maxLoadCapacity) {
            toast.error(`Too heavy! Cargo weight (${cargoWeight}kg) exceeds vehicle capacity (${vehicle.maxLoadCapacity}kg).`);
            return;
        }

        startTransition(async () => {
            try {
                const payload = {
                    vehicleId: selectedVehicleId,
                    driverId: selectedDriverId,
                    cargoWeight: Number(cargoWeight),
                    origin,
                    destination,
                };
                const newTripData = await createTrip(payload);

                // Optimistically update table or wait for router refresh 
                // (NextJS Server Actions revalidatePath automatically refreshes Server Component data)
                const driver = availableDrivers.find((d: any) => d.id === selectedDriverId);

                const optimisticTrip = {
                    id: newTripData.id,
                    vehicle: vehicle,
                    origin,
                    destination,
                    status: newTripData.status,
                    createdAt: new Date(),
                };

                setTrips([optimisticTrip, ...trips]);
                toast.success("Trip confirmed and dispatched!");

                // Reset form
                setSelectedVehicleId("");
                setCargoWeight("");
                setSelectedDriverId("");
                setOrigin("");
                setDestination("");
                setFuelCost("");
            } catch (error: any) {
                toast.error(error.message || "Failed to dispatch trip.");
            }
        });
    };

    return (
        <div className="p-6 pb-24 max-w-[1600px] mx-auto text-[var(--foreground)]">
            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
                {/* Trips Table Panel */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel rounded-3xl p-6 shadow-xl border border-[var(--card-border)] bg-[var(--card)]/50 space-y-6 flex flex-col h-fit overflow-hidden"
                >
                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search trips..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-xl glass-panel border border-[var(--card-border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] bg-[rgba(255,255,255,0.02)]"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-[var(--card-border)]">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="bg-[rgba(255,255,255,0.04)] text-[var(--primary)] text-sm border-b border-[var(--card-border)]">
                                    <th className="py-4 px-6 font-semibold w-24">Date</th>
                                    <th className="py-4 px-6 font-semibold">Fleet Type</th>
                                    <th className="py-4 px-6 font-semibold">Origin</th>
                                    <th className="py-4 px-6 font-semibold">Destination</th>
                                    <th className="py-4 px-6 font-semibold w-32">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--card-border)]/50">
                                {trips.filter((t: any) => t.origin.toLowerCase().includes(search.toLowerCase()) || t.destination.toLowerCase().includes(search.toLowerCase())).map((trip: any, i: number) => (
                                    <tr key={i} className="hover:bg-[rgba(255,255,255,0.03)] transition-colors group">
                                        <td className="py-4 px-6 text-sm font-medium text-[var(--primary)] text-nowrap">{new Date(trip.createdAt).toLocaleDateString()}</td>
                                        <td className="py-4 px-6 text-sm text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors">{trip.vehicle?.model || "Unknown"}</td>
                                        <td className="py-4 px-6 text-sm font-medium">{trip.origin}</td>
                                        <td className="py-4 px-6 text-sm font-medium">{trip.destination}</td>
                                        <td className="py-4 px-6 text-sm">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${trip.status === "ON_TRIP" || trip.status === "DISPATCHED" ? "bg-amber-500/10 text-amber-500" :
                                                trip.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400" :
                                                    "bg-blue-500/10 text-blue-400"
                                                }`}>
                                                {trip.status === "COMPLETED" ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                                {trip.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {trips.length === 0 && (
                                    <tr><td colSpan={5} className="py-6 text-center text-[var(--muted-foreground)]">No trips found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* New Trip Form Panel */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel panel-shine rounded-3xl p-6 lg:p-8 shadow-xl border border-[var(--card-border)] bg-[var(--card)]/50 relative overflow-hidden h-fit"
                >

                    <h2 className="text-xl font-bold mb-6 mt-1 flex items-center gap-2 text-white">
                        <span className="px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 rounded-lg text-sm uppercase tracking-wider">New Trip Form</span>
                    </h2>

                    <form onSubmit={handleDispatch} className="space-y-5">
                        <div className="grid grid-cols-1 gap-5">

                            {/* Select Vehicle */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-[var(--muted-foreground)]">Select Vehicle:</label>
                                <select
                                    required
                                    value={selectedVehicleId}
                                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl glass-panel border border-[var(--card-border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm text-[var(--foreground)] bg-[var(--background)] appearance-none"
                                >
                                    <option value="" className="bg-[var(--background)] text-[var(--foreground)]">-- Choose an available vehicle --</option>
                                    {availableVehicles.map((v: any) => (
                                        <option key={v.id} value={v.id} className="bg-[var(--background)] text-[var(--foreground)]">{v.name} (Max: {v.maxLoadCapacity}kg)</option>
                                    ))}
                                </select>
                            </div>

                            {/* Cargo Weight */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-[var(--muted-foreground)]">Cargo Weight (Kg):</label>
                                <input
                                    type="number"
                                    required
                                    value={cargoWeight}
                                    onChange={(e) => setCargoWeight(e.target.value)}
                                    placeholder="0"
                                    className="w-full px-4 py-2.5 rounded-xl glass-panel border border-[var(--card-border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm text-[var(--foreground)] bg-[rgba(255,255,255,0.02)]"
                                />
                            </div>

                            {/* Select Driver */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-[var(--muted-foreground)]">Select Driver:</label>
                                <select
                                    required
                                    value={selectedDriverId}
                                    onChange={(e) => setSelectedDriverId(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl glass-panel border border-[var(--card-border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm text-[var(--foreground)] bg-[var(--background)] appearance-none"
                                >
                                    <option value="" className="bg-[var(--background)] text-[var(--foreground)]">-- Choose an available driver --</option>
                                    {availableDrivers.map((d: any) => (
                                        <option key={d.id} value={d.id} className="bg-[var(--background)] text-[var(--foreground)]">{d.name} ({d.category})</option>
                                    ))}
                                </select>
                            </div>

                            {/* Origin Address */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-[var(--muted-foreground)]">Origin Address:</label>
                                <input
                                    type="text"
                                    required
                                    value={origin}
                                    onChange={(e) => setOrigin(e.target.value)}
                                    placeholder="Mumbai"
                                    className="w-full px-4 py-2.5 rounded-xl glass-panel border border-[var(--card-border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm text-[var(--foreground)] bg-[rgba(255,255,255,0.02)]"
                                />
                            </div>

                            {/* Destination Address */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-[var(--muted-foreground)]">Destination:</label>
                                <input
                                    type="text"
                                    required
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    placeholder="Pune"
                                    className="w-full px-4 py-2.5 rounded-xl glass-panel border border-[var(--card-border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm text-[var(--foreground)] bg-[rgba(255,255,255,0.02)]"
                                />
                            </div>

                            {/* Estimated Fuel Cost */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-[var(--muted-foreground)]">Estimated Fuel Cost:</label>
                                <input
                                    type="number"
                                    value={fuelCost}
                                    onChange={(e) => setFuelCost(e.target.value)}
                                    placeholder="0"
                                    className="w-full px-4 py-2.5 rounded-xl glass-panel border border-[var(--card-border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm text-[var(--foreground)] bg-[rgba(255,255,255,0.02)]"
                                />
                            </div>

                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 mt-2">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full py-3 rounded-xl border border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--foreground)] font-semibold hover:bg-[var(--primary)] hover:text-white transition-all shadow-[0_4px_14px_0_rgba(96,81,155,0.2)] hover:shadow-[0_6px_20px_rgba(96,81,155,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending ? "Dispatching..." : "Confirm & Dispatch Trip"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
