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
    } else if (status === "authenticated") {
      const userRole = (session?.user as any)?.role;
      if (!userRole || userRole === "NONE") {
        router.push("/onboarding");
      }
    }
  }, [status, session, router]);

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
  if (status === "unauthenticated" || ((session?.user as any)?.role === "NONE")) return null;

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

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth >= 1024 ? 0 : -300) }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="w-72 glass-panel m-4 rounded-2xl flex flex-col z-50 fixed lg:relative h-[calc(100vh-2rem)] border-r border-[var(--card-border)]"
      >
        <div className="p-6 flex items-center justify-between border-b border-[var(--card-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#60519b] to-[#31323e] flex items-center justify-center shadow-lg shadow-[#60519b]/20">
              <Truck size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-wide">FleetFlow</span>
          </div>
          <button className="lg:hidden p-2" onClick={() => setSidebarOpen(false)}>
            <X size={20} className="text-[var(--muted-foreground)]" />
          </button>
        </div>

        <div className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar mt-4">
          <SidebarItem icon={LayoutDashboard} text="Dashboard" active />
          <SidebarItem icon={Truck} text="Vehicle Registry" />
          <SidebarItem icon={MapPin} text="Trip Dispatcher" />
          <SidebarItem icon={Wrench} text="Maintenance" />
          <SidebarItem icon={Receipt} text="Trip & Expense" />
          <SidebarItem icon={Activity} text="Performance" />
          <SidebarItem icon={BarChart3} text="Analytics" />
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto z-10 w-full relative">

        {/* Top Header strictly aligned to sketch */}
        <header className="px-6 py-5 flex items-center justify-between sticky top-0 z-20 backdrop-blur-xl bg-[var(--background)]/40 border-b border-[var(--card-border)] shadow-sm">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 rounded-lg glass-panel text-[var(--foreground)]" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">Main Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2.5 rounded-full glass-panel hover:bg-[rgba(255,255,255,0.1)] transition-colors shadow-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDark ? "dark" : "light"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <Sun size={18} className="text-[#bfc0d1]" /> : <Moon size={18} className="text-[#31323e]" />}
                </motion.div>
              </AnimatePresence>
            </button>

            <div
              onClick={() => signOut()}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[#bfc0d1] border-2 border-[var(--card-border)] shadow-md cursor-pointer flex items-center justify-center hover:scale-105 transition-transform"
              title="Sign Out"
            >
              <span className="text-white font-bold text-sm">{userInitials}</span>
            </div>
          </div>
        </header>

        {/* Action Bar (Search & Filters & Buttons) */}
        <div className="px-6 py-6 space-y-4">

          {/* Top row of action bar matching wireframe */}
          <div className="flex flex-col xl:flex-row gap-4 justify-between">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search vehicle or driver..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full glass-panel border border-[var(--card-border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm transition-all text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:bg-[var(--card)]/80"
                />
              </div>

              {/* Filter By Type */}
              <div className="relative">
                <select
                  className="glass-panel px-4 py-2.5 rounded-full text-sm font-medium appearance-none pr-10 cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-colors text-[var(--foreground)] outline-none"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="All Types" className="bg-[var(--background)]">All Types</option>
                  <option value="Truck" className="bg-[var(--background)]">Truck</option>
                  <option value="Van" className="bg-[var(--background)]">Van</option>
                  <option value="Bike" className="bg-[var(--background)]">Bike</option>
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
              </div>

              {/* Filter By Status */}
              <div className="relative">
                <select
                  className="glass-panel px-4 py-2.5 rounded-full text-sm font-medium appearance-none pr-10 cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-colors text-[var(--foreground)] outline-none"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All Statuses" className="bg-[var(--background)]">All Statuses</option>
                  <option value="On Trip" className="bg-[var(--background)]">On Trip</option>
                  <option value="In Shop" className="bg-[var(--background)]">In Shop</option>
                  <option value="Ready" className="bg-[var(--background)]">Ready</option>
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
              </div>

              {/* Filter By Region */}
              <div className="relative">
                <select
                  className="glass-panel px-4 py-2.5 rounded-full text-sm font-medium appearance-none pr-10 cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-colors text-[var(--foreground)] outline-none"
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                >
                  <option value="All Regions" className="bg-[var(--background)]">All Regions</option>
                  <option value="North" className="bg-[var(--background)]">North</option>
                  <option value="South" className="bg-[var(--background)]">South</option>
                  <option value="East" className="bg-[var(--background)]">East</option>
                  <option value="West" className="bg-[var(--background)]">West</option>
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 self-end xl:self-auto">
              <button onClick={() => setIsNewTripOpen(true)} className="px-6 py-2.5 rounded-full bg-transparent border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white font-medium text-sm transition-all shadow-[0_0_15px_rgba(96,81,155,0.2)] hover:shadow-[0_0_20px_rgba(96,81,155,0.4)] flex items-center gap-2">
                <Plus size={16} /> New Trip
              </button>
              <button onClick={() => setIsNewVehicleOpen(true)} className="px-6 py-2.5 rounded-full bg-[var(--primary)] text-white font-medium text-sm transition-all hover:bg-[#4d417c] hover:shadow-[0_0_20px_rgba(96,81,155,0.6)] flex items-center gap-2 border border-[#4d417c]/50">
                <Plus size={16} /> New Vehicle
              </button>
            </div>
          </div>

          {/* Four Big KPI Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pt-4">
            <KPICard title="Active Fleet" value={activeFleetCount} delay={0.1} />
            <KPICard title="Maintenance Alert" value={maintenanceCount} delay={0.2} />
            <KPICard title="Utilization Rate" value={`${utilRate}%`} delay={0.3} />
            <KPICard title="Pending Cargo" value={pendingCargoCount} delay={0.4} />
          </div>

          {/* Core Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-panel rounded-2xl overflow-hidden mt-8 shadow-xl"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-[rgba(255,255,255,0.04)] text-[var(--primary)] text-sm border-b border-[var(--card-border)]">
                    <th className="py-5 px-6 font-semibold w-24">Trip</th>
                    <th className="py-5 px-6 font-semibold">Vehicle</th>
                    <th className="py-5 px-6 font-semibold">Driver</th>
                    <th className="py-5 px-6 font-semibold w-40">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--card-border)]/50">
                  {paginatedData.length > 0 ? (
                    paginatedData.map((row, i) => {
                      const styling = getStatusStyling(row.status);
                      return (
                        <tr key={i} className="hover:bg-[rgba(255,255,255,0.03)] transition-colors group">
                          <td className="py-4 px-6 text-sm font-medium text-[var(--foreground)]">{row.id}</td>
                          <td className="py-4 px-6 text-sm text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors">
                            {row.vehicle}
                          </td>
                          <td className="py-4 px-6 text-sm font-medium">{row.driver}</td>
                          <td className="py-4 px-6 text-sm">
                            <div className="flex items-center gap-2">
                              {row.status !== "Ready" ? (
                                <span className={`flex h-2 w-2 rounded-full ${styling.bg}`}>
                                  <span className={`animate-ping absolute inline-flex h-2 w-2 rounded-full opacity-75 ${styling.bg}`}></span>
                                  <span className={`relative inline-flex rounded-full h-2 w-2 ${styling.bg.replace('/10', '')}`}></span>
                                </span>
                              ) : (
                                <span className={`flex h-2 w-2 rounded-full ${styling.bg}`}></span>
                              )}
                              <span className={`font-semibold ${styling.color}`}>{row.status}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 px-6 text-center text-[var(--muted-foreground)]">
                        No fleet vehicles match your criteria.
                      </td>
                    </tr>
                  )}

                  {/* Empty rows to represent the visual structure from wireframe */}
                  {Array.from({ length: 4 }).map((_, i) => (
                    <tr key={`empty-${i}`} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                      <td className="py-4 px-6 text-center text-[var(--muted-foreground)]/40">•</td>
                      <td className="py-4 px-6 text-center text-[var(--muted-foreground)]/40">•</td>
                      <td className="py-4 px-6 text-center text-[var(--muted-foreground)]/40">•</td>
                      <td className="py-4 px-6 text-center text-[var(--muted-foreground)]/40 text-sm">•</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-[var(--card-border)] flex items-center justify-between text-xs text-[var(--muted-foreground)] bg-[rgba(255,255,255,0.01)]">
              <span>Showing {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-md glass-panel hover:text-[var(--foreground)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`px-3 py-1.5 rounded-md transition-colors ${currentPage === idx + 1 ? 'bg-[var(--primary)] text-white' : 'glass-panel hover:text-[var(--foreground)]'}`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-md glass-panel hover:text-[var(--foreground)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {isNewTripOpen && (
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
        )}

        {isNewVehicleOpen && (
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
        )}
      </AnimatePresence>

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
