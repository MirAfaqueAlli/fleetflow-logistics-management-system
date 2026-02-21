// Utility: maps a status string to Tailwind CSS color tokens
export const getStatusStyling = (status: string) => {
  switch (status) {
    case "On Trip":      return { color: "text-emerald-500", bg: "bg-emerald-500/10" };
    case "In Shop":      return { color: "text-rose-500",    bg: "bg-rose-500/10"    };
    case "Ready":        return { color: "text-blue-500",    bg: "bg-blue-500/10"    };
    case "New":          return { color: "text-blue-500",    bg: "bg-blue-500/10"    };
    case "In Progress":  return { color: "text-amber-500",   bg: "bg-amber-500/10"   };
    case "Completed":    return { color: "text-emerald-500", bg: "bg-emerald-500/10" };
    case "Pending":      return { color: "text-amber-500",   bg: "bg-amber-500/10"   };
    case "Done":         return { color: "text-emerald-500", bg: "bg-emerald-500/10" };
    default:             return { color: "text-[var(--muted-foreground)]", bg: "bg-[var(--muted-foreground)]/10" };
  }
};
