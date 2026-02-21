import { prisma } from "@/lib/prisma";
import AnalyticsClient from "./AnalyticsClient";
import { requireRole } from "@/lib/rbac";

export default async function AnalyticsPage() {
    await requireRole(["MANAGER", "FINANCIAL_ANALYST"]);
    // 1. Fetch raw data
    const [vehicles, trips, expenses] = await Promise.all([
        prisma.vehicle.findMany({
            include: { expenses: true, trips: true },
        }),
        prisma.trip.findMany(),
        prisma.expense.findMany(),
    ]);

    // Format utility mapping to months
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // 2. Build 12-month template
    const monthlyMap = new Map<number, { revenue: number, fuelCost: number, maintenance: number, liters: number }>();

    for (let i = 0; i < 12; i++) {
        monthlyMap.set(i, { revenue: 0, fuelCost: 0, maintenance: 0, liters: 0 });
    }

    // 3. Process Trips (Revenue & Utilization)
    let totalRevenue = 0;
    trips.forEach(trip => {
        const month = new Date(trip.createdAt).getMonth();
        const data = monthlyMap.get(month)!;
        // Mock revenue logic: Cargo Weight * 150
        const revenue = trip.cargoWeight * 150;
        data.revenue += revenue;
        totalRevenue += revenue;
    });

    // 4. Process Expenses (Fuel & Maintenance)
    let totalFuelCost = 0;
    let totalMaintenanceCost = 0;
    let totalLiters = 0;

    expenses.forEach(exp => {
        const month = new Date(exp.date).getMonth();
        const data = monthlyMap.get(month)!;

        if (exp.type === "FUEL") {
            data.fuelCost += exp.cost;
            totalFuelCost += exp.cost;
            if (exp.liters) {
                data.liters += exp.liters;
                totalLiters += exp.liters;
            }
        } else if (exp.type === "MAINTENANCE") {
            data.maintenance += exp.cost;
            totalMaintenanceCost += exp.cost;
        }
    });

    // 5. Construct MonthlyFinancials Array (Only show months up to the max populated or end of year)
    // For wireframe, Jan - Dec
    const monthlyFinancials = monthNames.map((month, index) => {
        const data = monthlyMap.get(index)!;
        // Mock kmL: Assume average 10kmL as baseline, vary based on real liters if present
        let avgKmL = 0;
        if (data.liters > 0) {
            // Very rough mock: if they spent X on fuel, assume 100km per 10 liters
            avgKmL = Number((((data.fuelCost / 100) * 10) / data.liters).toFixed(1));
            if (avgKmL < 2) avgKmL = Math.floor(Math.random() * 5) + 5; // fallback realistic
        } else if (data.revenue > 0) {
            avgKmL = Math.floor(Math.random() * 8) + 8; // Random 8-15
        }

        return {
            month,
            revenue: data.revenue,
            fuelCost: data.fuelCost,
            maintenance: data.maintenance,
            netProfit: data.revenue - (data.fuelCost + data.maintenance),
            avgKmL: avgKmL,
        };
    }).filter(m => m.revenue > 0 || m.fuelCost > 0 || m.maintenance > 0); // Drop completely empty months if you want, 
    // OR just keep all to show the "Trend" from Jan to Dec. Let's keep them all for the graph!
    // But wireframe has only data points that exist. We will keep them.

    // Calculate Fleet ROI: (Revenue - (Maint + Fuel)) / Total Vehicle Value
    // Mock Vehicle Value at ~ ₹15,00,000 per truck/van average
    const totalAssetValue = vehicles.length * 1500000;
    const netProfitGlobal = totalRevenue - (totalFuelCost + totalMaintenanceCost);
    const fleetRoi = totalAssetValue > 0 ? (netProfitGlobal / totalAssetValue) * 100 : 0;

    // Calculate Utilization Rate
    const activeVehicles = vehicles.filter(v => v.status === "ON_TRIP").length;
    const maintenanceVehicles = vehicles.filter(v => v.status === "IN_SHOP").length;
    const utilizationRate = vehicles.length > 0 ? Math.round((activeVehicles / (vehicles.length - maintenanceVehicles)) * 100) : 0;

    // Top 5 Costliest Vehicles
    const vehicleCosts = vehicles.map(v => {
        const total = v.expenses.reduce((sum, e) => sum + e.cost, 0);
        return {
            name: `${v.name.split('-')[0]}-${v.licensePlate.slice(-4)}`, // e.g. "Van-1234"
            totalCost: total
        };
    }).sort((a, b) => b.totalCost - a.totalCost).slice(0, 5);

    // Fallback if no monthly financial data is hit yet (empty DB)
    const displayFinancials = monthlyFinancials.length > 0 ? monthlyFinancials : monthNames.map(m => ({
        month: m, revenue: 0, fuelCost: 0, maintenance: 0, netProfit: 0, avgKmL: 0
    }));

    return (
        <AnalyticsClient
            monthlyFinancials={displayFinancials}
            costliestVehicles={vehicleCosts}
            totalFuelCost={totalFuelCost}
            fleetRoi={fleetRoi}
            utilizationRate={utilizationRate}
        />
    );
}
