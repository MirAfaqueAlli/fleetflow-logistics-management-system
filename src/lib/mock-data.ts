export const mockFleetData = [
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
    default: return { color: "text-[var(--muted-foreground)]", bg: "bg-[var(--muted-foreground)]/10" };
  }
};
