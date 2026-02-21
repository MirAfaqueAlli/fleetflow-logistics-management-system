import { getDrivers } from "@/lib/actions/drivers";
import PerformanceClient from "./PerformanceClient";

export default async function PerformancePage() {
    // Fetch all drivers and their completion stats via Prisma
    const drivers = await getDrivers();

    // Pass initial data to the interactive client component
    return <PerformanceClient initialDrivers={drivers} />;
}
