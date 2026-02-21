import { getVehicles } from "@/lib/actions/vehicles";
import VehiclesClient from "./VehiclesClient";

export default async function VehiclesPage() {
    // Fetch vehicles data on the server
    const vehicles = await getVehicles();

    // Pass the initial data to the interactive client component
    return <VehiclesClient initialVehicles={vehicles} />;
}
