"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <SessionProvider>{children}</SessionProvider>;
    }

    return (
        <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <SmoothScrollProvider>
                    {children}
                </SmoothScrollProvider>
            </ThemeProvider>
        </SessionProvider>
    );
}
