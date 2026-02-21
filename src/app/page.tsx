"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Truck, ArrowRight, Shield, Clock, Zap } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading" || status === "authenticated") return null;

  return (
    <div className="min-h-screen bg-[#1e202c] text-white selection:bg-[#60519b]/30">
      {/* Liquid Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#60519b]/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#31323e]/40 rounded-full blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#60519b] to-[#31323e] flex items-center justify-center shadow-lg shadow-[#60519b]/20">
            <Truck size={22} className="text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight">FleetFlow</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-6 py-2 rounded-full font-medium hover:bg-white/5 transition-all">
            Login
          </Link>
          <Link href="/signup" className="px-6 py-2 bg-[#60519b] rounded-full font-bold hover:bg-[#7b6ac6] transition-all shadow-lg shadow-[#60519b]/20">
            Join Now
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#31323e] border border-white/10 text-sm font-medium mb-8"
        >
          <Zap size={14} className="text-[#60519b]" />
          <span className="text-[#bfc0d1]">Revolutionizing Logistics Management</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.1]"
        >
          Streamline Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60519b] via-[#8b8c9d] to-[#bfc0d1]">
            Fleet Operations
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-[#8b8c9d] max-w-2xl mb-12 leading-relaxed"
        >
          A premium, high-fidelity platform for managing vehicles, dispatching trips, and auditing expenses in real-time. Experience the future of fleet management.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-6 items-center"
        >
          <Link
            href="/signup"
            className="group px-10 py-5 bg-[#60519b] rounded-2xl font-bold text-lg hover:bg-[#7b6ac6] transition-all shadow-2xl shadow-[#60519b]/40 flex items-center gap-3"
          >
            Start Your Journey <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="px-10 py-5 bg-[#31323e] border border-white/10 rounded-2xl font-bold text-lg hover:bg-[#3d3e4e] transition-all"
          >
            Watch Demo
          </Link>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full text-left">
          {[
            { icon: Shield, title: "Real-time Auditing", desc: "Monitor every fuel expense and trip with bank-grade security and precision." },
            { icon: Clock, title: "Live Dispatching", desc: "Assign drivers and track trip status in real-time with our smart dispatch engine." },
            { icon: Zap, title: "Instant Analytics", desc: "Get powerful insights into vehicle health and utilization rates with one click." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-panel p-8 rounded-3xl bg-[#31323e]/50 border-white/5 hover:border-[#60519b]/50 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#60519b]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="text-[#60519b]" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-[#8b8c9d] leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 px-8 py-12 border-t border-white/5 text-center text-[#8b8c9d] bg-[#1e202c]">
        <p>© 2026 FleetFlow Platform. Designed for Next-Gen Logistics.</p>
      </footer>
    </div>
  );
}
