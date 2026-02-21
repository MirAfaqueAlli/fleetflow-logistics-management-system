import { getVehicles } from "@/lib/actions/vehicles";
import VehiclesClient from "./VehiclesClient";
import { requireRole } from "@/lib/rbac";

export default async function VehiclesPage() {
    await requireRole(["MANAGER", "DISPATCHER", "SAFETY_OFFICER"]);
    // Fetch vehicles data on the server
    const vehicles = await getVehicles();

    // Pass the initial data to the interactive client component
    return <VehiclesClient initialVehicles={vehicles} />;
}
