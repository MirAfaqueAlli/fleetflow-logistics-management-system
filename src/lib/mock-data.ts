export const getStatusStyling = (status: string) => {
  switch (status) {
    case "On Trip": return { color: "text-emerald-500", bg: "bg-emerald-500/10" };
    case "In Shop": return { color: "text-rose-500", bg: "bg-rose-500/10" };
    case "Ready": return { color: "text-blue-500", bg: "bg-blue-500/10" };
    case "New": return { color: "text-blue-500", bg: "bg-blue-500/10" };
    case "In Progress": return { color: "text-amber-500", bg: "bg-amber-500/10" };
    case "Completed": return { color: "text-emerald-500", bg: "bg-emerald-500/10" };
    default: return { color: "text-[var(--muted-foreground)]", bg: "bg-[var(--muted-foreground)]/10" };
  }
};

export const mockMaintenanceLogs = [
  { id: "321", vehicle: "Truck-12 (AB-9876)", issue: "Engine Issue", date: "2024-02-20", cost: "10,000", status: "New" },
  { id: "320", vehicle: "Van-05 (XY-1234)", issue: "Oil Change", date: "2024-02-15", cost: "1,500", status: "Completed" },
  { id: "319", vehicle: "Truck-08 (ZZ-1122)", issue: "Brake Pad Replacement", date: "2024-02-10", cost: "5,000", status: "In Progress" },
];
