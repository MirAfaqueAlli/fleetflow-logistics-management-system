"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isDark, setIsDark] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            const userRole = (session?.user as any)?.role;
            if (!userRole || userRole === "NONE") {
                router.push("/onboarding");
            }
        }
    }, [status, session, router]);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    if (!mounted || status === "loading") return null;
    if (status === "unauthenticated" || (session?.user as any)?.role === "NONE") return null;

    const userInitials = session?.user?.name
        ? session.user.name.slice(0, 2).toUpperCase()
        : session?.user?.email?.slice(0, 2).toUpperCase() || "FA";

    return (
        <div className="min-h-screen relative flex text-[var(--foreground)] font-sans overflow-hidden">
            {/* Liquid Background */}
            <div className="liquid-bg">
                <div className="blob bg-[var(--blob-1)] w-[600px] h-[600px] top-[-10%] left-[-10%]" />
                <div className="blob bg-[var(--blob-2)] w-[800px] h-[800px] bottom-[-20%] right-[-10%]" />
                <div className="blob bg-[var(--blob-3)] w-[500px] h-[500px] top-[30%] left-[40%]" />
            </div>

            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <main className="flex-1 flex flex-col h-screen overflow-y-auto z-10 w-full relative">
                <Header
                    isDark={isDark}
                    toggleTheme={toggleTheme}
                    setSidebarOpen={setSidebarOpen}
                    userInitials={userInitials}
                />
                {children}
            </main>

            <style jsx global>{`
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: var(--card-border);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: var(--muted-foreground);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
      `}</style>
        </div>
    );
}
