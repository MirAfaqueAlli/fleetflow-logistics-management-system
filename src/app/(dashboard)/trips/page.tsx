import { getAvailableVehicles, getAvailableDrivers, getTrips } from "@/lib/actions/logistics";
import TripsClient from "./TripsClient";

export default async function TripsPage() {
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
