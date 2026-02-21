"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Download, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend
} from "recharts";

interface MonthlyData {
    month: string;
    revenue: number;
    fuelCost: number;
    maintenance: number;
    netProfit: number;
    avgKmL: number;
}

interface VehicleCost {
    name: string;
    totalCost: number;
}

interface AnalyticsProps {
    monthlyFinancials: MonthlyData[];
    costliestVehicles: VehicleCost[];
    totalFuelCost: number;
    fleetRoi: number;
    utilizationRate: number;
}

export default function AnalyticsClient({
    monthlyFinancials,
    costliestVehicles,
    totalFuelCost,
    fleetRoi,
    utilizationRate,
}: AnalyticsProps) {

    // Format Indian Rupees (Rs. / ₹) in lakhs if large, else regular
    const formatRupees = (val: number) => {
        if (Math.abs(val) >= 100000) {
            return `Rs. ${(val / 100000).toFixed(1)}L`;
        }
        return `Rs. ${val.toLocaleString("en-IN")}`;
    };

    const downloadCSV = () => {
        // Headers
        let csvContent = "Month,Revenue (Rs),Fuel Cost (Rs),Maintenance (Rs),Net Profit (Rs),Avg km/L\n";

        // Rows
        monthlyFinancials.forEach(row => {
            csvContent += `${row.month},${row.revenue},${row.fuelCost},${row.maintenance},${row.netProfit},${row.avgKmL}\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `fleetflow_financials_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="px-6 py-8 space-y-6 w-full text-[var(--foreground)] pb-24">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
                        Operational Analytics & Financial Reports
                    </h1>
                    <p className="text-sm text-[var(--muted-foreground)]">
                        Deep insights, automated ROI calculations, and one-click data exports.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--card-border)] glass-panel hover:bg-[rgba(255,255,255,0.05)] transition-colors text-sm font-medium"
                    >
                        <Download size={16} /> Export PDF
                    </button>
                    <button
                        onClick={downloadCSV}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--primary)] text-white hover:bg-[#4d417c] transition-all shadow-[0_0_15px_rgba(96,81,155,0.4)] text-sm font-medium"
                    >
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            {/* Top KPI Cards (Mimicking wireframe directly) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-6 rounded-2xl border border-emerald-500/20 backdrop-blur-md relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                    <p className="text-sm font-semibold text-emerald-500/80 mb-2 uppercase tracking-wide">Total Fuel Cost</p>
                    <div className="text-3xl font-bold text-emerald-400">
                        {formatRupees(totalFuelCost)}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel p-6 rounded-2xl border border-emerald-500/20 backdrop-blur-md relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                    <p className="text-sm font-semibold text-emerald-500/80 mb-2 uppercase tracking-wide">Fleet ROI</p>
                    <div className="text-3xl font-bold text-emerald-400 flex items-center gap-2">
                        {fleetRoi >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} className="text-rose-400" />}
                        {fleetRoi >= 0 ? "+" : ""}{fleetRoi.toFixed(1)}%
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-panel p-6 rounded-2xl border border-emerald-500/20 backdrop-blur-md relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                    <p className="text-sm font-semibold text-emerald-500/80 mb-2 uppercase tracking-wide">Utilization Rate</p>
                    <div className="text-3xl font-bold text-emerald-400">
                        {utilizationRate}%
                    </div>
                </motion.div>
            </div>

            {/* Charts Section */}
            <div className="flex flex-col gap-6 w-full">
                {/* Fuel Efficiency Trend */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="glass-panel p-6 rounded-3xl border border-[var(--card-border)] bg-[rgba(255,255,255,0.01)]"
                >
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        Fuel Efficiency Trend (km/L)
                    </h2>
                    <div className="h-[400px] min-h-[400px] w-full text-sm">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyFinancials}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" tick={{ fill: "rgba(255,255,255,0.5)" }} axisLine={false} tickLine={false} />
                                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: "rgba(255,255,255,0.5)" }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
                                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--card-border)', borderRadius: '12px', color: '#fff' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="avgKmL"
                                    stroke="var(--primary)"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: "var(--background)", stroke: "var(--primary)", strokeWidth: 2 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Top 5 Costliest Vehicles */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="glass-panel p-6 rounded-3xl border border-[var(--card-border)] bg-[rgba(255,255,255,0.01)]"
                >
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        Top 5 Costliest Vehicles
                    </h2>
                    <div className="h-[400px] min-h-[400px] w-full text-sm">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={costliestVehicles}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fill: "rgba(255,255,255,0.5)" }} axisLine={false} tickLine={false} />
                                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: "rgba(255,255,255,0.5)" }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--card-border)', borderRadius: '12px', color: '#fff' }}
                                    formatter={(value: any) => [formatRupees(value as number), "Total Cost"]}
                                />
                                <Bar
                                    dataKey="totalCost"
                                    fill="url(#costGradient)"
                                    radius={[4, 4, 0, 0]}
                                    barSize={40}
                                />
                                <defs>
                                    <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.8} />
                                        <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.2} />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Financial Summary Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-panel rounded-3xl overflow-hidden shadow-xl border border-[var(--card-border)]"
            >
                <div className="bg-[rgba(255,255,255,0.02)] px-6 py-4 border-b border-[var(--card-border)] flex items-center gap-3">
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-sm uppercase tracking-wider font-semibold">
                        Financial Summary of Month
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-[rgba(255,255,255,0.03)] text-[var(--muted-foreground)] text-sm border-b border-[var(--card-border)] tracking-wide uppercase">
                                <th className="py-5 px-6 font-semibold">Month</th>
                                <th className="py-5 px-6 font-semibold text-rose-300">Revenue</th>
                                <th className="py-5 px-6 font-semibold text-rose-300">Fuel Cost</th>
                                <th className="py-5 px-6 font-semibold text-rose-300">Maintenance</th>
                                <th className="py-5 px-6 font-semibold text-rose-300">Net Profit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--card-border)]/50">
                            {monthlyFinancials.map((row, i) => (
                                <tr key={i} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors group">
                                    <td className="py-4 px-6 text-sm font-medium flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
                                        {row.month}
                                    </td>
                                    <td className="py-4 px-6 text-sm font-mono text-[var(--foreground)] font-medium">
                                        {formatRupees(row.revenue)}
                                    </td>
                                    <td className="py-4 px-6 text-sm font-mono text-[var(--foreground)] font-medium">
                                        {formatRupees(row.fuelCost)}
                                    </td>
                                    <td className="py-4 px-6 text-sm font-mono text-[var(--foreground)] font-medium">
                                        {formatRupees(row.maintenance)}
                                    </td>
                                    <td className="py-4 px-6 text-sm font-mono font-bold text-emerald-400">
                                        {formatRupees(row.netProfit)}
                                    </td>
                                </tr>
                            ))}
                            {monthlyFinancials.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-8 px-6 text-center text-[var(--muted-foreground)]">
                                        No financial data available to generate reports.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
