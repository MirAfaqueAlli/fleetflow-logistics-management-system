import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
    const session = await auth();

    return (
        <div className="min-h-screen bg-[#1e202c] text-[#bfc0d1] flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-2xl glass-panel p-12 rounded-3xl bg-[#31323e] border border-[#bfc0d1]/10 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#60519b]/20 rounded-full blur-[100px]"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#60519b]/20 rounded-full blur-[100px]"></div>

                <h1 className="text-5xl font-extrabold text-white mb-6 tracking-tight">
                    Welcome to <span className="text-[#60519b]">FleetFlow</span>
                </h1>

                <p className="text-xl text-[#8b8c9d] mb-10 leading-relaxed">
                    The hub is under construction by our front-end team. <br />
                    Authentication systems are fully operational.
                </p>

                {session ? (
                    <div className="space-y-4">
                        <p className="font-medium text-white">Signed in as {session.user?.email}</p>
                        <div className="flex gap-4 justify-center">
                            <Link
                                href="/api/auth/signout"
                                className="px-8 py-3 bg-[#31323e] border border-[#bfc0d1]/20 rounded-xl hover:bg-[#3d3e4e] transition-all font-semibold"
                            >
                                Sign Out
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-4 justify-center">
                        <Link
                            href="/login"
                            className="px-8 py-3 bg-[#60519b] text-white rounded-xl hover:bg-[#7b6ac6] transition-all shadow-lg shadow-[#60519b]/20 font-bold"
                        >
                            Get Started
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
