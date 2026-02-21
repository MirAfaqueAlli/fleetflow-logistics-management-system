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
        <div className="min-h-screen relative flex text-[var(--foreground)] font-sans">
            {/* Liquid Background */}
            <div className="liquid-bg">
                <div className="blob bg-[var(--blob-1)] w-[600px] h-[600px] top-[-10%] left-[-10%]" />
                <div className="blob bg-[var(--blob-2)] w-[800px] h-[800px] bottom-[-20%] right-[-10%]" />
                <div className="blob bg-[var(--blob-3)] w-[500px] h-[500px] top-[30%] left-[40%]" />
            </div>

            <aside className="print:hidden sticky top-0 h-screen z-50">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            </aside>

            <main className="flex-1 flex flex-col min-h-screen z-10 w-full relative">
                <header className="print:hidden w-full">
                    <Header
                        isDark={isDark}
                        toggleTheme={toggleTheme}
                        setSidebarOpen={setSidebarOpen}
                        userInitials={userInitials}
                        userImage={session?.user?.image}
                    />
                </header>
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
        @media print {
          @page {
            size: auto;
            margin: 10mm;
          }
          body {
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .liquid-bg, aside, header {
             display: none !important;
          }
          main {
             position: absolute;
             left: 0;
             top: 0;
             width: 100% !important;
             height: auto !important;
             overflow: visible !important;
             margin: 0 !important;
             padding: 0 !important;
             background: white !important;
             color: black !important;
          }
          .glass-panel {
             border: 1px solid #eee !important;
             background:rgba(255,255,255,0.05) !important;
             color: #111 !important;
             box-shadow: none !important;
             break-inside: avoid;
             margin-bottom: 1rem;
          }
          h1, h2, h3, p, span, td, th {
             color: #111 !important;
          }
          /* Ensure charts are visible */
          /* Recharts Print Fixes */
          .recharts-cartesian-axis-line, .recharts-cartesian-axis-tick-line {
            stroke: #333 !important;
          }
          .recharts-cartesian-grid-horizontal line, .recharts-cartesian-grid-vertical line {
            stroke: #ddd !important;
          }
          .recharts-text {
            fill: #333 !important;
          }
          .recharts-legend-item-text {
            color: #333 !important;
          }
        }
      `}</style>
        </div>
    );
}
