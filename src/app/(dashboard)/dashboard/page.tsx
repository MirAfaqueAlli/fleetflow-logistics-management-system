import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
    // Fetch all vehicles and eagerly load any currently active trips and assigned drivers.
    const rawVehicles = await prisma.vehicle.findMany({
        include: {
            trips: {
                where: {
                    status: {
                        notIn: ["COMPLETED", "CANCELLED"]
                    }
                },
                include: {
                    driver: true
                },
                take: 1
            }
        },
        orderBy: { createdAt: "desc" }
    });

    // Map Prisma models to the UI's expected unified fleet row shape
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
            region: activeTrip?.destination || "Depot", // Mocking region based on active trip destination if dispatched
            status: statusDisplay
        };
    });

    return <DashboardClient initialFleetData={initialFleetData} />;
}
