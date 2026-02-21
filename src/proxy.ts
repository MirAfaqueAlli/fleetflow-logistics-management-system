import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextRequest } from "next/server";

// Initialize Auth.js with ONLY the edge-safe config (no Prisma).
// Even in Next.js 16, the proxy bundle cannot run Prisma.
// The full auth.ts (with Prisma adapter) is used everywhere else.
const { auth } = NextAuth(authConfig);

export function proxy(request: NextRequest) {
    return auth(request as any);
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
