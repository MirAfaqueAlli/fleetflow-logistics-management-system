import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthRoute = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/signup");
      const isApiRoute = nextUrl.pathname.startsWith("/api");

      if (isApiRoute) {
        return true; // Let the API requests through
      }

      if (isAuthRoute) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true; 
      }

      // Restrict all other routes (dashboard, etc.)
      if (!isLoggedIn) {
        return false; // redirects back to signIn page
      }

      // If logged in but no role, force onboarding (unless already there)
      const userRole = (auth?.user as any)?.role;
      if (userRole === "NONE" && nextUrl.pathname !== "/onboarding") {
        return Response.redirect(new URL("/onboarding", nextUrl));
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  providers: [], // providers will be added in auth.ts
} satisfies NextAuthConfig;
