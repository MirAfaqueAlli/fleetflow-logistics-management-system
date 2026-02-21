import { getExpenses, getVehicles } from "@/lib/actions/logistics";
import ExpensesClient from "./ExpensesClient";

export default async function ExpensesPage() {
    const [rawExpenses, vehicles] = await Promise.all([
        getExpenses(),
        getVehicles(),
    ]);

    const initialExpenses = rawExpenses.map((e) => ({
        id: e.id,
        vehicleName: e.vehicle.name,
        licensePlate: e.vehicle.licensePlate,
        cost: e.cost,
        liters: e.liters,
        type: e.type,
        date: e.date,
    }));

    const vehicleOptions = vehicles.map((v) => ({
        id: v.id,
        name: v.name,
        licensePlate: v.licensePlate,
    }));

    return <ExpensesClient initialExpenses={initialExpenses} vehicles={vehicleOptions} />;
}
