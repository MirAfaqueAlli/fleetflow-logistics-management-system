import { getDrivers } from "@/lib/actions/drivers";
import PerformanceClient from "./PerformanceClient";
import { requireRole } from "@/lib/rbac";

export default async function PerformancePage() {
    await requireRole(["MANAGER", "SAFETY_OFFICER"]);
    // Fetch all drivers and their completion stats via Prisma
    const drivers = await getDrivers();

    // Pass initial data to the interactive client component
    return <PerformanceClient initialDrivers={drivers} />;
}
