import { auth } from "@/auth";
import { redirect } from "next/navigation";

// ─── Role Access Map ───
// Defines which roles can access which routes
export const ROUTE_ROLES: Record<string, string[]> = {
    "/dashboard":  ["MANAGER", "DISPATCHER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"],
    "/vehicles":   ["MANAGER", "DISPATCHER", "SAFETY_OFFICER"],
    "/trips":      ["MANAGER", "DISPATCHER"],
    "/maintenance":["MANAGER", "FINANCIAL_ANALYST"],
    "/expenses":   ["MANAGER", "FINANCIAL_ANALYST"],
    "/performance":["MANAGER", "SAFETY_OFFICER"],
    "/analytics":  ["MANAGER", "FINANCIAL_ANALYST"],
};

/**
 * Call this at the top of any Server Component page.
 * It will redirect unauthorized users to /dashboard with an "access denied" param.
 */
export async function requireRole(allowedRoles: string[]): Promise<string> {
    const session = await auth();
    const role = (session?.user as any)?.role as string | undefined;

    if (!role || !allowedRoles.includes(role)) {
        redirect("/dashboard?denied=1");
    }

    return role;
}
