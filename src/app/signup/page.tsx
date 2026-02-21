"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/actions/auth";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Role } from "@prisma/client";

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<Role>("MANAGER" as Role);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const result = await signUp({ name, email, password, role });
            if (result.error) {
                setError(result.error);
                toast.error(result.error);
                setIsLoading(false);
            } else {
                toast.success("Account created successfully! Logging you in...");
                const res = await signIn("credentials", {
                    redirect: false,
                    email,
                    password,
                });
                if (!res?.error) {
                    router.push("/dashboard");
                } else {
                    toast.error("Login failed after signup.");
                    setIsLoading(false);
                }
            }
        } catch (err) {
            setError("An unexpected error occurred.");
            toast.error("An unexpected error occurred.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1e202c] text-[#bfc0d1]">
            <div className="w-full max-w-md p-8 rounded-2xl glass-panel bg-[#31323e] shadow-2xl relative overflow-hidden ring-1 ring-[#bfc0d1]/10">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#60519b] rounded-full blur-[80px] opacity-70"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#60519b] rounded-full blur-[80px] opacity-70"></div>

                <div className="relative z-10">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold tracking-wider text-white mb-2">Join FleetFlow</h1>
                        <p className="text-sm text-[#8b8c9d]">Create your logistics account</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-[#bfc0d1]">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full bg-[#1e202c] border border-[#bfc0d1]/20 rounded-xl px-4 py-3 text-[#bfc0d1] placeholder-[#8b8c9d] focus:outline-none focus:ring-2 focus:ring-[#60519b] focus:border-transparent transition-all duration-300"
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-[#bfc0d1]">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-[#1e202c] border border-[#bfc0d1]/20 rounded-xl px-4 py-3 text-[#bfc0d1] placeholder-[#8b8c9d] focus:outline-none focus:ring-2 focus:ring-[#60519b] focus:border-transparent transition-all duration-300"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-[#bfc0d1]">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-[#1e202c] border border-[#bfc0d1]/20 rounded-xl px-4 py-3 text-[#bfc0d1] placeholder-[#8b8c9d] focus:outline-none focus:ring-2 focus:ring-[#60519b] focus:border-transparent transition-all duration-300"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-[#bfc0d1]">Organization Role</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value as Role)}
                                className="w-full bg-[#1e202c] border border-[#bfc0d1]/20 rounded-xl px-4 py-3 text-[#bfc0d1] focus:outline-none focus:ring-2 focus:ring-[#60519b] focus:border-transparent transition-all duration-300"
                            >
                                <option value="MANAGER">Fleet Manager</option>
                                <option value="DISPATCHER">Dispatcher</option>
                                <option value="SAFETY_OFFICER">Safety Officer</option>
                                <option value="FINANCIAL_ANALYST">Financial Analyst</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#60519b] hover:bg-[#7b6ac6] active:scale-[0.98] transition-all duration-300 text-white font-medium rounded-xl px-4 py-3 shadow-[0_4px_14px_0_rgba(96,81,155,0.39)] hover:shadow-[0_6px_20px_rgba(96,81,155,0.23)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {isLoading ? "Creating account..." : "Sign Up"}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[var(--border)]"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#31323e] px-2 text-[#8b8c9d]">Or sign up with</span>
                            </div>
                        </div>

                        <button
                            onClick={() => signIn("google")}
                            className="mt-4 w-full flex items-center justify-center gap-3 bg-[var(--background)] hover:bg-[#3d3e4e] text-white border border-[var(--border)] rounded-xl px-4 py-3 transition-all duration-300"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            <span>Google</span>
                        </button>
                    </div>

                    <p className="text-center mt-6 text-sm text-[#8b8c9d]">
                        Already have an account?{" "}
                        <Link href="/login" className="text-[#60519b] hover:text-[#7b6ac6] font-semibold">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
