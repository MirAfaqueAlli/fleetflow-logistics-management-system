import { getAvailableVehicles, getAvailableDrivers, getTrips } from "@/lib/actions/logistics";
import TripsClient from "./TripsClient";
import { requireRole } from "@/lib/rbac";

export default async function TripsPage() {
    await requireRole(["MANAGER", "DISPATCHER"]);
    const [vehicles, drivers, trips] = await Promise.all([
        getAvailableVehicles(),
        getAvailableDrivers(),
        getTrips(),
    ]);

    return (
        <TripsClient
            initialTrips={trips}
            availableVehicles={vehicles}
            availableDrivers={drivers}
        />
    );
}
