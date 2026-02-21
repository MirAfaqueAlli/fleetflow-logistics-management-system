export const mockFleetData: any[] = [
  { id: "1", vehicle: "Van-05 (XY-1234)", type: "Van", driver: "John Doe", region: "North", status: "On Trip" },
  { id: "2", vehicle: "Truck-12 (AB-9876)", type: "Truck", driver: "Sarah Chen", region: "South", status: "In Shop" },
  { id: "3", vehicle: "Bike-02 (KL-4567)", type: "Bike", driver: "Marcus Johnson", region: "East", status: "Ready" },
  { id: "4", vehicle: "Van-08 (MN-3456)", type: "Van", driver: "Elena Rodriguez", region: "West", status: "On Trip" },
  { id: "5", vehicle: "Truck-04 (OP-1122)", type: "Truck", driver: "David Kim", region: "North", status: "On Trip" },
  { id: "6", vehicle: "Van-01 (XY-9988)", type: "Van", driver: "Lisa Wong", region: "South", status: "Ready" },
  { id: "7", vehicle: "Truck-08 (ZZ-1122)", type: "Truck", driver: "James Smith", region: "East", status: "In Shop" },
  { id: "8", vehicle: "Bike-05 (YY-3344)", type: "Bike", driver: "Amy Lee", region: "West", status: "Ready" },
  { id: "9", vehicle: "Van-09 (AA-0000)", type: "Van", driver: "Tom Hardy", region: "North", status: "On Trip" },
  { id: "10", vehicle: "Truck-01 (BB-1111)", type: "Truck", driver: "Emma Stone", region: "South", status: "Ready" },
];

export const getStatusStyling = (status: string) => {
  switch (status) {
    case "On Trip": return { color: "text-emerald-500", bg: "bg-emerald-500/10" };
    case "In Shop": return { color: "text-rose-500", bg: "bg-rose-500/10" };
    case "Ready": return { color: "text-blue-500", bg: "bg-blue-500/10" };
    case "New": return { color: "text-blue-500", bg: "bg-blue-500/10" };
    case "In Progress": return { color: "text-amber-500", bg: "bg-amber-500/10" };
    case "Completed": return { color: "text-emerald-500", bg: "bg-emerald-500/10" };
    case "Pending": return { color: "text-amber-500", bg: "bg-amber-500/10" };
    case "Done": return { color: "text-emerald-500", bg: "bg-emerald-500/10" };
    default: return { color: "text-[var(--muted-foreground)]", bg: "bg-[var(--muted-foreground)]/10" };
  }
};

export const mockMaintenanceLogs: any[] = [
  { id: "321", vehicle: "Truck-12 (AB-9876)", issue: "Engine Issue", date: "2024-02-20", cost: "10,000", status: "New" },
  { id: "320", vehicle: "Van-05 (XY-1234)", issue: "Oil Change", date: "2024-02-15", cost: "1,500", status: "Completed" },
  { id: "319", vehicle: "Truck-08 (ZZ-1122)", issue: "Brake Pad Replacement", date: "2024-02-10", cost: "5,000", status: "In Progress" },
];

export const mockExpenses: any[] = [
  { id: "101", tripId: "TRP-321", driver: "John Doe", distance: "1000 km", fuelExpense: "1000", miscExpense: "3000", status: "Completed", date: "2024-02-21", vehicleId: "Van-05 (XY-1234)" },
  { id: "102", tripId: "TRP-322", driver: "Sarah Chen", distance: "800 km", fuelExpense: "750", miscExpense: "50", status: "Pending", date: "2024-02-20", vehicleId: "Truck-12 (AB-9876)" },
  { id: "103", tripId: "TRP-323", driver: "Marcus Johnson", distance: "2100 km", fuelExpense: "1800", miscExpense: "400", status: "Completed", date: "2024-02-19", vehicleId: "Bike-02 (KL-4567)" },
  { id: "104", tripId: "TRP-324", driver: "Elena Rodriguez", distance: "1200 km", fuelExpense: "1150", miscExpense: "120", status: "Completed", date: "2024-02-18", vehicleId: "Van-08 (MN-3456)" },
  { id: "105", tripId: "TRP-325", driver: "David Kim", distance: "450 km", fuelExpense: "400", miscExpense: "0", status: "Completed", date: "2024-02-17", vehicleId: "Truck-04 (OP-1122)" },
];
