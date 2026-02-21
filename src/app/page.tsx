"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Truck,
  AlertTriangle,
  Activity,
  Package,
  MapPin,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Sun,
  Moon,
  ListFilter,
  LayoutDashboard,
  Settings,
  User,
  Bell,
  Search,
  LogOut,
  Calendar,
  CheckCircle2,
  Menu,
  X,
  Plus,
  Filter,
  ChevronDown,
  Wrench,
  BarChart3,
  Receipt
} from "lucide-react";

// Expanded Mock Data
const mockFleetData = [
  { id: "1", vehicle: "Van-05 (XY-1234)", type: "Van", driver: "John Doe", region: "North", status: "On Trip" },
  { id: "2", vehicle: "Truck-12 (AB-9876)", type: "Truck", driver: "Sarah Chen", region: "South", status: "In Shop" },
  { id: "3", vehicle: "Bike-02 (KL-4567)", type: "Bike", driver: "Marcus Johnson", region: "East", status: "Ready" },
  { id: "4", vehicle: "Van-08 (MN-3456)", type: "Van", driver: "Elena Rodriguez", region: "West", status: "On Trip" },
  { id: "5", vehicle: "Truck-04 (OP-1122)", type: "Truck", driver: "David Kim", region: "North", status: "On Trip" },
  { id: "6", vehicle: "Van-01 (XY-9988)", type: "Van", driver: "Lisa Wong", region: "South", status: "Ready" },
  { id: "7", vehicle: "Truck-08 (ZZ-1122)", type: "Truck", driver: "James Smith", region: "East", status: "In Shop" },
  { id: "8", vehicle: "Bike-05 (YY-3344)", type: "Bike", driver: "Amy Lee", region: "West", status: "Ready" },
  { id: "9", vehicle: "Van-09 (AA-0000)", type: "Van", driver: "Tom Hardy", region: "North", status: "On Trip" },
  { id: "10", vehicle: "Truck-01 (BB-1111)", type: "Truck", driver: "Emma Stone", region: "South", status: "Ready" },
];

const getStatusStyling = (status: string) => {
  switch (status) {
    case "On Trip": return { color: "text-emerald-500", bg: "bg-emerald-500/10" };
    case "In Shop": return { color: "text-rose-500", bg: "bg-rose-500/10" };
    case "Ready": return { color: "text-blue-500", bg: "bg-blue-500/10" };
    default: return { color: "text-[var(--muted-foreground)]", bg: "bg-[var(--muted-foreground)]/10" };
  }
};

const SidebarItem = ({ icon: Icon, text, active = false }: { icon: any, text: string, active?: boolean }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${active ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--card-glow)]' : 'hover:bg-[rgba(255,255,255,0.05)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}>
    <Icon size={20} className={active ? 'text-white' : ''} />
    <span className="font-medium text-sm">{text}</span>
  </div>
);

const KPICard = ({ title, value, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="glass-panel p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[160px]"
  >
    <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-2xl opacity-10 transition-opacity group-hover:opacity-20 bg-[var(--primary)]`} />
    <div className={`absolute -left-8 -bottom-8 w-32 h-32 rounded-full blur-2xl opacity-10 transition-opacity group-hover:opacity-20 bg-[var(--primary)]`} />

    <h3 className="text-[var(--muted-foreground)] font-semibold text-lg mb-4 tracking-wide">{title}</h3>
    <div className="text-5xl font-bold tracking-tight text-[var(--foreground)] drop-shadow-sm">{value}</div>
  </motion.div>
);

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Filtering and Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All Types");
  const [filterStatus, setFilterStatus] = useState("All Statuses");
  const [filterRegion, setFilterRegion] = useState("All Regions");

  // Pagination & Modal State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isNewTripOpen, setIsNewTripOpen] = useState(false);
  const [isNewVehicleOpen, setIsNewVehicleOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize dark mode based on state
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // KPI Calculations
  const totalVehicles = mockFleetData.length;
  const activeFleetCount = mockFleetData.filter(v => v.status === "On Trip").length;
  const maintenanceCount = mockFleetData.filter(v => v.status === "In Shop").length;
  const utilRate = totalVehicles > 0 ? Math.round((activeFleetCount / (totalVehicles - maintenanceCount)) * 100) : 0;

  // Pending Cargo mock (e.g. static for now as per PS)
  const pendingCargoCount = 20;

  // Search & Filter Logic
  const filteredData = useMemo(() => {
    return mockFleetData.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = item.vehicle.toLowerCase().includes(q) ||
        item.driver.toLowerCase().includes(q) ||
        item.id.includes(q);
      const matchesType = filterType === "All Types" || item.type === filterType;
      const matchesStatus = filterStatus === "All Statuses" || item.status === filterStatus;
      const matchesRegion = filterRegion === "All Regions" || item.region === filterRegion;

      return matchesSearch && matchesType && matchesStatus && matchesRegion;
    });
  }, [searchQuery, filterType, filterStatus, filterRegion]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, filterStatus, filterRegion]);

  if (!mounted || status === "loading") return null;
  if (status === "unauthenticated") return null;

  const userInitials = session?.user?.name
    ? session.user.name.slice(0, 2).toUpperCase()
    : session?.user?.email?.slice(0, 2).toUpperCase() || "FA";

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
    </motion.div>

        </div >
      </main >

    {/* Modals */ }
    <AnimatePresence>
  {
    isNewTripOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsNewTripOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm shadow-2xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-panel w-full max-w-lg rounded-2xl p-6 relative z-10 overflow-hidden shadow-2xl border border-[var(--card-border)] bg-[var(--background)]/90"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary)] to-[#bfc0d1]" />
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MapPin className="text-[var(--primary)]" />
              Create New Trip
            </h2>
            <button onClick={() => setIsNewTripOpen(false)} className="p-2 rounded-full hover:bg-[rgba(255,255,255,0.1)] transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">Destination</label>
              <input type="text" placeholder="Enter destination address..." className="w-full px-4 py-2.5 rounded-xl glass-panel border border-[var(--card-border)] focus:ring-2 focus:ring-[var(--primary)] text-sm focus:outline-none bg-[rgba(255,255,255,0.02)]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">Cargo Weight (kg)</label>
                <input type="number" placeholder="0" className="w-full px-4 py-2.5 rounded-xl glass-panel border border-[var(--card-border)] focus:ring-2 focus:ring-[var(--primary)] text-sm focus:outline-none bg-[rgba(255,255,255,0.02)]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">Vehicle Type</label>
                <select className="w-full px-4 py-2.5 rounded-xl glass-panel border border-[var(--card-border)] focus:ring-2 focus:ring-[var(--primary)] text-sm focus:outline-none bg-[var(--background)]">
                  <option>Truck</option>
                  <option>Van</option>
                  <option>Bike</option>
                </select>
              </div>
            </div>
            <button onClick={() => setIsNewTripOpen(false)} className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-semibold mt-6 hover:shadow-[0_0_20px_rgba(96,81,155,0.4)] transition-all flex justify-center items-center gap-2">
              <MapPin size={18} /> Dispatch Trip
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  {
    isNewVehicleOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsNewVehicleOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-panel w-full max-w-lg rounded-2xl p-6 relative z-10 overflow-hidden shadow-2xl border border-[var(--card-border)] bg-[var(--background)]/90"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Truck className="text-emerald-500" />
              Register Vehicle
            </h2>
            <button onClick={() => setIsNewVehicleOpen(false)} className="p-2 rounded-full hover:bg-[rgba(255,255,255,0.1)] transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">Vehicle Type</label>
                <select className="w-full px-4 py-2.5 rounded-xl glass-panel border border-[var(--card-border)] focus:ring-2 focus:ring-emerald-500 text-sm focus:outline-none bg-[var(--background)]">
                  <option>Truck</option>
                  <option>Van</option>
                  <option>Bike</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">Max Capacity (kg)</label>
                <input type="number" placeholder="1000" className="w-full px-4 py-2.5 rounded-xl glass-panel border border-[var(--card-border)] focus:ring-2 focus:ring-emerald-500 text-sm focus:outline-none bg-[rgba(255,255,255,0.02)]" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">License Plate / Unique ID</label>
              <input type="text" placeholder="AB-1234" className="w-full px-4 py-2.5 rounded-xl glass-panel border border-[var(--card-border)] focus:ring-2 focus:ring-emerald-500 text-sm focus:outline-none bg-[rgba(255,255,255,0.02)]" />
            </div>
            <button onClick={() => setIsNewVehicleOpen(false)} className="w-full py-3 rounded-xl bg-emerald-500 text-white font-semibold mt-6 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex justify-center items-center gap-2">
              <Plus size={18} /> Register Asset
            </button>
          </div>
        </motion.div>
      </div>
    )
  }
      </AnimatePresence >

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
    </div >
  );
}
