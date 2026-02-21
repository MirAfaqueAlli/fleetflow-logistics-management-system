import { prisma } from "@/lib/prisma";
import { getVehicles } from "@/lib/actions/logistics";
import MaintenanceClient from "./MaintenanceClient";
import { requireRole } from "@/lib/rbac";

export default async function MaintenancePage() {
    await requireRole(["MANAGER", "FINANCIAL_ANALYST"]);
    const [rawLogs, vehicles] = await Promise.all([
        prisma.maintenanceLog.findMany({
            include: { vehicle: true },
            orderBy: { date: "desc" },
        }),
        getVehicles(),
    ]);

    const initialLogs = rawLogs.map((log) => ({
        id: log.id,
        vehicleName: log.vehicle.name,
        licensePlate: log.vehicle.licensePlate,
        serviceType: log.serviceType,
        cost: log.cost,
        date: log.date,
    }));

    const vehicleOptions = vehicles.map((v) => ({
        id: v.id,
        name: v.name,
        licensePlate: v.licensePlate,
    }));

    return <MaintenanceClient initialLogs={initialLogs} vehicles={vehicleOptions} />;
}
