import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";
import { Suspense } from "react";

export default async function DashboardPage() {
    const rawVehicles = await prisma.vehicle.findMany({
        include: {
            trips: {
                where: { status: { notIn: ["COMPLETED", "CANCELLED"] } },
                include: { driver: true },
                take: 1
            }
        },
        orderBy: { createdAt: "desc" }
    });

    const initialFleetData = rawVehicles.map((v: any) => {
        const activeTrip = v.trips[0];
        let statusDisplay = "Ready";
        if (v.status === "ON_TRIP") statusDisplay = "On Trip";
        if (v.status === "IN_SHOP") statusDisplay = "In Shop";

        return {
            id: v.licensePlate,
            vehicle: `${v.name} (${v.licensePlate})`,
            type: v.model,
            driver: activeTrip?.driver?.name || "Unassigned",
            region: activeTrip?.destination || "Depot",
            status: statusDisplay
        };
    });

    return (
        <Suspense fallback={null}>
            <DashboardClient initialFleetData={initialFleetData} />
        </Suspense>
    );
}

