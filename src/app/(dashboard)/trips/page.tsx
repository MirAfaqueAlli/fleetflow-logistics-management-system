"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ListFilter, SortAsc, LayoutGrid, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// Mock Data
const MOCK_VEHICLES = [
    { id: "v1", name: "Trailer Truck-01 (MH-12-AB-1234)", type: "Trailer Truck", capacity: 20000, status: "Available" },
    { id: "v2", name: "Van-05 (MH-14-XY-9876)", type: "Van", capacity: 1000, status: "Available" },
    { id: "v3", name: "Bike-02 (MH-09-PQ-4567)", type: "Bike", capacity: 50, status: "Available" },
    { id: "v4", name: "Trailer Truck-02 (MH-12-CD-5678)", type: "Trailer Truck", capacity: 20000, status: "On Trip" },
];

const MOCK_DRIVERS = [
    { id: "d1", name: "Rajesh Kumar", status: "Available" },
    { id: "d2", name: "Amit Singh", status: "Available" },
    { id: "d3", name: "Suresh Patel", status: "On Trip" },
];

const INITIAL_TRIPS = [
    { id: "1", fleetType: "Trailer Truck", origin: "Mumbai", destination: "Pune", status: "On way" },
    { id: "2", fleetType: "Van", origin: "Delhi", destination: "Noida", status: "Completed" },
];

export default function TripsPage() {
    const [trips, setTrips] = useState(INITIAL_TRIPS);
    const [search, setSearch] = useState("");

    // Form State
    const [selectedVehicleId, setSelectedVehicleId] = useState("");
    const [cargoWeight, setCargoWeight] = useState("");
    const [selectedDriverId, setSelectedDriverId] = useState("");
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [fuelCost, setFuelCost] = useState("");

    const availableVehicles = MOCK_VEHICLES.filter(v => v.status === "Available");
    const availableDrivers = MOCK_DRIVERS.filter(d => d.status === "Available");

    const handleDispatch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedVehicleId || !selectedDriverId || !cargoWeight || !origin || !destination) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const vehicle = MOCK_VEHICLES.find(v => v.id === selectedVehicleId);
        if (vehicle && Number(cargoWeight) > vehicle.capacity) {
            toast.error(`Too heavy! Cargo weight (${cargoWeight}kg) exceeds vehicle capacity (${vehicle.capacity}kg).`);
            return;
        }

        const newTrip = {
            id: `${trips.length + 1}`,
            fleetType: vehicle?.type || "Unknown",
            origin,
            destination,
            status: "Dispatched",
        };

        setTrips([newTrip, ...trips]);
        toast.success("Trip confirmed and dispatched!");

        // Reset form
        setSelectedVehicleId("");
        setCargoWeight("");
        setSelectedDriverId("");
        setOrigin("");
        setDestination("");
        setFuelCost("");
    };

    return (
        <div className="px-6 py-8 pb-24 max-w-7xl mx-auto space-y-8 text-[var(--foreground)]">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
                <h1 className="text-2xl font-bold tracking-wide">4. Trip Dispatcher & Management</h1>
            </div>

            {/* Trips Table Panel */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-3xl p-6 shadow-xl border border-[var(--card-border)] bg-[var(--card)]/50 space-y-6"
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
                    <div className="flex flex-wrap items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-sm font-medium hover:bg-[rgba(255,255,255,0.05)] transition-colors border border-[var(--card-border)]">
                            <LayoutGrid size={16} /> Group by
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-sm font-medium hover:bg-[rgba(255,255,255,0.05)] transition-colors border border-[var(--card-border)]">
                            <ListFilter size={16} /> Filter
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-sm font-medium hover:bg-[rgba(255,255,255,0.05)] transition-colors border border-[var(--card-border)]">
                            <SortAsc size={16} /> Sort by...
                        </button>
                    </div>
                </div>

                {/* Table representation */}
                <div className="overflow-x-auto rounded-xl border border-[var(--card-border)]">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-[rgba(255,255,255,0.04)] text-[var(--primary)] text-sm border-b border-[var(--card-border)]">
                                <th className="py-4 px-6 font-semibold w-24">Trip</th>
                                <th className="py-4 px-6 font-semibold">Fleet Type</th>
                                <th className="py-4 px-6 font-semibold">Origin</th>
                                <th className="py-4 px-6 font-semibold">Destination</th>
                                <th className="py-4 px-6 font-semibold w-32">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--card-border)]/50">
                            {trips.filter(t => t.id.toLowerCase().includes(search.toLowerCase()) || t.origin.toLowerCase().includes(search.toLowerCase()) || t.destination.toLowerCase().includes(search.toLowerCase())).map((trip, i) => (
                                <tr key={i} className="hover:bg-[rgba(255,255,255,0.03)] transition-colors group">
                                    <td className="py-4 px-6 text-sm font-medium text-[var(--primary)]">{trip.id}</td>
                                    <td className="py-4 px-6 text-sm text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors">{trip.fleetType}</td>
                                    <td className="py-4 px-6 text-sm font-medium">{trip.origin}</td>
                                    <td className="py-4 px-6 text-sm font-medium">{trip.destination}</td>
                                    <td className="py-4 px-6 text-sm">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${trip.status === "On way" || trip.status === "Dispatched" ? "bg-amber-500/10 text-amber-500" :
                                                trip.status === "Completed" ? "bg-emerald-500/10 text-emerald-400" :
                                                    "bg-blue-500/10 text-blue-400"
                                            }`}>
                                            {trip.status === "Completed" ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
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
                className="glass-panel rounded-3xl p-8 shadow-xl border border-[var(--card-border)] bg-[var(--card)]/50 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary)] to-emerald-500" />

                <h2 className="text-xl font-bold mb-8 mt-2 flex items-center gap-2 text-white">
                    <span className="px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 rounded-lg text-sm uppercase tracking-wider">New Trip Form</span>
                </h2>

                <form onSubmit={handleDispatch} className="space-y-6 max-w-4xl">
                    <div className="grid grid-cols-1 gap-6">

                        {/* Select Vehicle */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <label className="sm:w-48 text-sm font-medium text-[var(--muted-foreground)]">Select Vehicle:</label>
                            <select
                                required
                                value={selectedVehicleId}
                                onChange={(e) => setSelectedVehicleId(e.target.value)}
                                className="flex-1 px-4 py-3 rounded-xl glass-panel border border-[var(--card-border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm text-[var(--foreground)] bg-[var(--background)] max-w-md"
                            >
                                <option value="">-- Choose an available vehicle --</option>
                                {availableVehicles.map(v => (
                                    <option key={v.id} value={v.id}>{v.name} (Max: {v.capacity}kg)</option>
                                ))}
                            </select>
                        </div>

                        {/* Cargo Weight */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <label className="sm:w-48 text-sm font-medium text-[var(--muted-foreground)]">Cargo Weight (Kg):</label>
                            <input
                                type="number"
                                required
                                value={cargoWeight}
                                onChange={(e) => setCargoWeight(e.target.value)}
                                placeholder="0"
                                className="flex-1 px-4 py-3 rounded-xl glass-panel border border-[var(--card-border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm text-[var(--foreground)] bg-[rgba(255,255,255,0.02)] max-w-md"
                            />
                        </div>

                        {/* Select Driver */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <label className="sm:w-48 text-sm font-medium text-[var(--muted-foreground)]">Select Driver:</label>
                            <select
                                required
                                value={selectedDriverId}
                                onChange={(e) => setSelectedDriverId(e.target.value)}
                                className="flex-1 px-4 py-3 rounded-xl glass-panel border border-[var(--card-border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm text-[var(--foreground)] bg-[var(--background)] max-w-md"
                            >
                                <option value="">-- Choose an available driver --</option>
                                {availableDrivers.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Origin Address */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <label className="sm:w-48 text-sm font-medium text-[var(--muted-foreground)]">Origin Address:</label>
                            <input
                                type="text"
                                required
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                                placeholder="Mumbai"
                                className="flex-1 px-4 py-3 rounded-xl glass-panel border border-[var(--card-border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm text-[var(--foreground)] bg-[rgba(255,255,255,0.02)] max-w-md"
                            />
                        </div>

                        {/* Destination Address */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <label className="sm:w-48 text-sm font-medium text-[var(--muted-foreground)]">Destination:</label>
                            <input
                                type="text"
                                required
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                placeholder="Pune"
                                className="flex-1 px-4 py-3 rounded-xl glass-panel border border-[var(--card-border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm text-[var(--foreground)] bg-[rgba(255,255,255,0.02)] max-w-md"
                            />
                        </div>

                        {/* Estimated Fuel Cost */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <label className="sm:w-48 text-sm font-medium text-[var(--muted-foreground)]">Estimated Fuel Cost:</label>
                            <input
                                type="number"
                                value={fuelCost}
                                onChange={(e) => setFuelCost(e.target.value)}
                                placeholder="0"
                                className="flex-1 px-4 py-3 rounded-xl glass-panel border border-[var(--card-border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm text-[var(--foreground)] bg-[rgba(255,255,255,0.02)] max-w-md"
                            />
                        </div>

                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-[var(--card-border)]">
                        <button
                            type="submit"
                            className="px-8 py-3 rounded-xl border border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--foreground)] font-semibold hover:bg-[var(--primary)] hover:text-white transition-all shadow-[0_4px_14px_0_rgba(96,81,155,0.2)] hover:shadow-[0_6px_20px_rgba(96,81,155,0.4)] flex items-center gap-2"
                        >
                            Confirm & Dispatch Trip
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
