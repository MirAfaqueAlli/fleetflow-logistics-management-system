"use client";

import Link from "next/link";
import {
  Truck, ArrowRight, Shield, Clock, Zap, ChevronDown,
  BarChart3, Users, Globe, MapPin, Fuel, Wrench,
  Activity, Route, Bell
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const { data: session, status } = useSession();

  const heroRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const ctaSectionRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const dashboardPreviewRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = status === "authenticated";

  // Main GSAP Animations
  useEffect(() => {
    if (status === "loading") return;

    const handleScroll = () => {
      if (!scrollIndicatorRef.current) return;
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const distFromBottom = docHeight - scrollY - winHeight;
      if (distFromBottom < 300) {
        gsap.to(scrollIndicatorRef.current, { opacity: 0, duration: 0.3 });
      } else {
        gsap.to(scrollIndicatorRef.current, { opacity: 1, duration: 0.3 });
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    const ctx = gsap.context(() => {
      // --- NAV entrance ---
      gsap.from(navRef.current, {
        y: -80,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        delay: 0.2,
      });

      // --- Hero timeline ---
      const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });

      heroTl
        .from(badgeRef.current, { y: 40, opacity: 0, duration: 0.8, delay: 0.3 })
        .from(headingRef.current, { y: 60, opacity: 0, duration: 1 }, "-=0.4")
        .from(subRef.current, { y: 30, opacity: 0, duration: 0.8 }, "-=0.5")
        .from(ctaRef.current, { y: 30, opacity: 0, scale: 0.95, duration: 0.8 }, "-=0.4")
        .from(scrollIndicatorRef.current, { opacity: 0, y: -10, duration: 0.6 }, "-=0.2");

      // --- Dashboard Preview entrance ---
      if (dashboardPreviewRef.current) {
        gsap.from(dashboardPreviewRef.current, {
          y: 100,
          opacity: 0,
          scale: 0.92,
          duration: 1.2,
          ease: "power3.out",
          delay: 1.2,
        });
      }

      // --- Scroll indicator bounce + hide near bottom ---
      gsap.to(scrollIndicatorRef.current, {
        y: 10,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        duration: 1.2,
      });


      // --- Feature cards staggered reveal ---
      const featureCards = featuresRef.current?.querySelectorAll(".feature-card");
      if (featureCards) {
        gsap.set(featureCards, { opacity: 0, y: 40, scale: 0.95 });
        featureCards.forEach((card, i) => {
          ScrollTrigger.create({
            trigger: card,
            start: "top 90%",
            onEnter: () => {
              gsap.to(card, { opacity: 1, y: 0, scale: 1, duration: 0.7, delay: i * 0.08, ease: "power3.out" });
            },
          });
        });
      }

      // --- How-it-works steps ---
      const steps = howItWorksRef.current?.querySelectorAll(".step-card");
      if (steps) {
        gsap.set(steps, { opacity: 0, x: -40 });
        steps.forEach((step, i) => {
          ScrollTrigger.create({
            trigger: step,
            start: "top 90%",
            onEnter: () => {
              gsap.to(step, { opacity: 1, x: 0, duration: 0.7, delay: i * 0.12, ease: "power3.out" });
            },
          });
        });
      }

      // --- Stats section ---
      if (statsRef.current) {
        gsap.set(statsRef.current, { opacity: 0, y: 40 });
        ScrollTrigger.create({
          trigger: statsRef.current,
          start: "top 88%",
          onEnter: () => {
            gsap.to(statsRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
          },
        });
      }

      // --- CTA section reveal ---
      if (ctaSectionRef.current) {
        gsap.set(ctaSectionRef.current, { opacity: 0, y: 40, scale: 0.97 });
        ScrollTrigger.create({
          trigger: ctaSectionRef.current,
          start: "top 85%",
          onEnter: () => {
            gsap.to(ctaSectionRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" });
          },
        });
      }

      // --- Parallax blobs ---
      gsap.to(".hero-blob-1", {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
        y: -150,
        x: 50,
        scale: 1.2,
      });

      gsap.to(".hero-blob-2", {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
        y: -100,
        x: -80,
        scale: 0.8,
      });
    });

    return () => {
      ctx.revert();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [status]);

  // Floating particles
  useEffect(() => {
    if (!particlesRef.current) return;

    const particles: HTMLDivElement[] = [];
    const container = particlesRef.current;

    for (let i = 0; i < 25; i++) {
      const particle = document.createElement("div");
      particle.className = "landing-particle";
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.opacity = `${Math.random() * 0.4 + 0.1}`;
      container.appendChild(particle);
      particles.push(particle);

      gsap.to(particle, {
        y: `random(-80, 80)`,
        x: `random(-50, 50)`,
        duration: `random(4, 8)`,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 3,
      });
    }

    return () => {
      particles.forEach((p) => p.remove());
    };
  }, []);

  // Magnetic cursor follower
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX - 16,
        y: e.clientY - 16,
        duration: 0.6,
        ease: "power3.out",
      });
    };

    const onMouseEnterInteractive = () => {
      gsap.to(cursor, { scale: 2.5, opacity: 0.15, duration: 0.3 });
    };
    const onMouseLeaveInteractive = () => {
      gsap.to(cursor, { scale: 1, opacity: 0.3, duration: 0.3 });
    };

    window.addEventListener("mousemove", onMouseMove);

    const interactives = document.querySelectorAll("a, button");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", onMouseEnterInteractive);
      el.addEventListener("mouseleave", onMouseLeaveInteractive);
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnterInteractive);
        el.removeEventListener("mouseleave", onMouseLeaveInteractive);
      });
    };
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#1e202c] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#60519b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1e202c] text-white selection:bg-[#60519b]/30 overflow-x-hidden">
      {/* Magnetic Cursor */}
      <div
        ref={cursorRef}
        className="fixed w-8 h-8 rounded-full bg-[#60519b] pointer-events-none z-[9999] mix-blend-screen opacity-30 hidden md:block"
        style={{ top: 0, left: 0 }}
      />

      {/* Particles */}
      <div ref={particlesRef} className="fixed inset-0 overflow-hidden pointer-events-none z-[1]" />

      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="hero-blob-1 absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#60519b]/20 rounded-full blur-[120px]" />
        <div className="hero-blob-2 absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#31323e]/40 rounded-full blur-[120px]" />
        <div className="absolute top-[50%] left-[50%] w-[400px] h-[400px] bg-[#60519b]/10 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Nav */}
      <nav ref={navRef} className="relative z-10 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#60519b] to-[#31323e] flex items-center justify-center shadow-lg shadow-[#60519b]/20">
            <Truck size={22} className="text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight">FleetFlow</span>
        </div>
        <div className="flex gap-4 items-center">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="px-6 py-2.5 bg-[#60519b] rounded-full font-bold hover:bg-[#7b6ac6] transition-all shadow-lg shadow-[#60519b]/20 flex items-center gap-2 text-sm"
            >
              Go to Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link href="/login" className="px-6 py-2 rounded-full font-medium hover:bg-white/5 transition-all text-sm">
                Login
              </Link>
              <Link href="/signup" className="px-6 py-2 bg-[#60519b] rounded-full font-bold hover:bg-[#7b6ac6] transition-all shadow-lg shadow-[#60519b]/20 text-sm">
                Join Now
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <main ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-8 pt-16 pb-8 flex flex-col items-center text-center">
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#31323e]/80 border border-white/10 text-sm font-medium mb-6 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#60519b] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#60519b]" />
          </span>
          <span className="text-[#bfc0d1]">Revolutionizing Logistics Management</span>
        </div>

        <h1
          ref={headingRef}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-6 leading-[1.1]"
        >
          Streamline Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] via-[#c4b5fd] to-[#e0d4ff]">
            Fleet Operations
          </span>
        </h1>

        <p ref={subRef} className="text-lg md:text-xl text-[#8b8c9d] max-w-2xl mb-10 leading-relaxed">
          A premium, high-fidelity platform for managing vehicles, dispatching
          trips, and auditing expenses in real-time.
        </p>

        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-5 items-center">
          {!isAuthenticated && (
            <>
              <Link
                href="/signup"
                className="group px-10 py-4 bg-[#60519b] rounded-2xl font-bold text-lg hover:bg-[#7b6ac6] transition-all shadow-2xl shadow-[#60519b]/40 flex items-center gap-3 hover:scale-[1.03] active:scale-[0.98]"
              >
                Start Your Journey <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="px-10 py-4 bg-[#31323e] border border-white/10 rounded-2xl font-bold text-lg hover:bg-[#3d3e4e] transition-all hover:scale-[1.03] active:scale-[0.98]"
              >
                Watch Demo
              </Link>
            </>
          )}
        </div>

        {/* Scroll Indicator - Fixed at bottom */}
        <div
          ref={scrollIndicatorRef}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1.5 text-[#8b8c9d] pointer-events-none"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Explore</span>
          <ChevronDown size={16} />
        </div>
      </main>

      {/* ─── Dashboard Preview Mockup ─── */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 pb-20">
        <div
          ref={dashboardPreviewRef}
          className="relative rounded-2xl border border-white/10 bg-[#252736]/60 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/30"
        >
          {/* Fake topbar */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5 bg-[#1e202c]/60">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-4 text-xs text-[#8b8c9d] font-mono">fleetflow.app/dashboard</span>
          </div>

          {/* Mockup content */}
          <div className="grid grid-cols-12 gap-0 min-h-[340px]">
            {/* Mini sidebar */}
            <div className="col-span-2 border-r border-white/5 py-5 px-3 hidden md:flex flex-col gap-3">
              {[
                { icon: BarChart3, label: "Dashboard", active: true },
                { icon: Truck, label: "Vehicles" },
                { icon: MapPin, label: "Trips" },
                { icon: Wrench, label: "Service" },
                { icon: Fuel, label: "Expenses" },
                { icon: Activity, label: "Analytics" },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${item.active
                    ? "bg-[#60519b]/30 text-white"
                    : "text-[#8b8c9d] hover:text-white"
                    } transition-colors`}
                >
                  <item.icon size={14} />
                  <span className="hidden lg:inline">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Main content mockup */}
            <div className="col-span-12 md:col-span-10 p-5 space-y-4">
              {/* Top header row */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-5 w-36 rounded bg-white/10 mb-2" />
                  <div className="h-3 w-48 rounded bg-white/5" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Bell size={14} className="text-[#8b8c9d]" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#60519b] to-[#31323e]" />
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: "Active Vehicles", value: "48", change: "+3", color: "#60519b" },
                  { label: "On Trip", value: "21", change: "+5", color: "#4a9b7c" },
                  { label: "In Service", value: "6", change: "-1", color: "#c77b4a" },
                  { label: "Fuel Cost", value: "$4.2k", change: "-12%", color: "#9b5160" },
                ].map((kpi, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-white/[0.03] border border-white/5 p-3"
                  >
                    <p className="text-[10px] text-[#8b8c9d] mb-1">{kpi.label}</p>
                    <p className="text-lg font-bold">{kpi.value}</p>
                    <p className="text-[10px]" style={{ color: kpi.color }}>{kpi.change}</p>
                  </div>
                ))}
              </div>

              {/* Mini chart row */}
              <div className="grid grid-cols-5 lg:grid-cols-7 gap-3">
                <div className="col-span-5 lg:col-span-4 rounded-xl bg-white/[0.03] border border-white/5 p-4 h-32">
                  <p className="text-xs text-[#8b8c9d] mb-3">Fleet Utilization</p>
                  <div className="flex items-end gap-[6px] h-16">
                    {[40, 65, 50, 80, 70, 90, 55, 75, 85, 60, 45, 95].map((h, i) => (
                      <div key={i} className="flex-1 rounded-sm bg-[#60519b]/60" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
                <div className="col-span-5 lg:col-span-3 rounded-xl bg-white/[0.03] border border-white/5 p-4 h-32">
                  <p className="text-xs text-[#8b8c9d] mb-3">Status</p>
                  <div className="space-y-2">
                    {[
                      { label: "Ready", w: "68%", color: "#4a9b7c" },
                      { label: "On Trip", w: "45%", color: "#60519b" },
                      { label: "In Shop", w: "12%", color: "#c77b4a" },
                    ].map((bar, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-[10px] text-[#8b8c9d] mb-1">
                          <span>{bar.label}</span>
                          <span>{bar.w}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: bar.w, backgroundColor: bar.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gradient overlay on bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#1e202c] to-transparent pointer-events-none" />
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-[#a78bfa] uppercase tracking-widest mb-3">Core Features</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Everything You Need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] via-[#c4b5fd] to-[#e0d4ff]">
              Manage Your Fleet
            </span>
          </h2>
        </div>
        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: "Real-time Auditing", desc: "Monitor every fuel expense and trip with bank-grade security and precision.", gradient: "from-[#60519b] to-[#8b7cc8]" },
            { icon: Clock, title: "Live Dispatching", desc: "Assign drivers and track trip status in real-time with our smart dispatch engine.", gradient: "from-[#4a7c9b] to-[#6ba5c7]" },
            { icon: Zap, title: "Instant Analytics", desc: "Get powerful insights into vehicle health and utilization rates with one click.", gradient: "from-[#9b5160] to-[#c77b8b]" },
            { icon: Route, title: "Smart Routing", desc: "Optimize routes for fuel efficiency and reduced delivery times across your fleet.", gradient: "from-[#4a9b6a] to-[#6bc78a]" },
            { icon: Wrench, title: "Maintenance Tracking", desc: "Automate service schedules and keep every vehicle in peak operating condition.", gradient: "from-[#c7944a] to-[#e8b86a]" },
            { icon: Bell, title: "Instant Alerts", desc: "Get notified about critical events — breakdowns, delays, and compliance flags.", gradient: "from-[#9b4a8c] to-[#c76bb0]" },
          ].map((feature, i) => (
            <div
              key={i}
              className="feature-card group relative p-7 rounded-2xl bg-[#31323e]/40 border border-white/5 hover:border-[#60519b]/30 transition-all duration-500 cursor-default overflow-hidden"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-lg transition-all duration-500 shadow-md`}>
                <feature.icon className="text-white" size={22} />
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-[#bfc0d1] transition-colors">{feature.title}</h3>
              <p className="text-sm text-[#8b8c9d] leading-relaxed">{feature.desc}</p>
              <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-transparent via-[#60519b] to-transparent transition-all duration-700" />
            </div>
          ))}
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="relative z-10 max-w-5xl mx-auto px-8 py-20">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-[#a78bfa] uppercase tracking-widest mb-3">Workflow</p>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
            Get Started in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] via-[#c4b5fd] to-[#e0d4ff]">
              3 Simple Steps
            </span>
          </h2>
        </div>
        <div ref={howItWorksRef} className="space-y-6">
          {[
            { step: "01", title: "Register Your Fleet", desc: "Add your vehicles, assign drivers, and set up operational rules in minutes.", icon: Truck },
            { step: "02", title: "Dispatch & Track", desc: "Create trips, assign drivers, and monitor every route in real-time from one dashboard.", icon: MapPin },
            { step: "03", title: "Analyze & Optimize", desc: "Review costs, performance metrics, and utilization reports to maximize efficiency.", icon: BarChart3 },
          ].map((item, i) => (
            <div key={i} className="step-card flex items-start gap-6 p-8 rounded-[2rem] bg-[#1e202c]/60 border border-white/5 hover:border-[#a78bfa]/30 transition-all group backdrop-blur-xl">
              <div className="shrink-0 w-16 h-16 rounded-2xl bg-[#a78bfa]/15 border border-[#a78bfa]/20 flex items-center justify-center group-hover:bg-[#a78bfa]/25 group-hover:scale-110 transition-all duration-500 shadow-[0_0_20px_rgba(167,139,250,0.15)]">
                <item.icon size={26} className="text-[#c4b5fd]" />
              </div>
              <div>
                <span className="text-sm font-bold font-mono text-[#a78bfa] tracking-[0.2em] opacity-80">STEP {item.step}</span>
                <h3 className="text-xl font-bold mt-1 mb-2 text-white group-hover:text-[#c4b5fd] transition-colors">{item.title}</h3>
                <p className="text-[#8b8c9d] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section ref={statsRef} className="relative z-10 max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: 500, suffix: "+", label: "Vehicles Managed", icon: Truck },
            { number: 98, suffix: "%", label: "Uptime Guarantee", icon: Shield },
            { number: 1200, suffix: "+", label: "Active Users", icon: Users },
            { number: 45, suffix: "+", label: "Countries Served", icon: Globe },
          ].map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="w-12 h-12 rounded-xl bg-[#60519b]/10 border border-[#60519b]/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#60519b]/20 group-hover:scale-110 transition-all duration-500">
                <stat.icon size={20} className="text-[#60519b]" />
              </div>
              <div className="text-3xl md:text-4xl font-bold tracking-tight mb-1">
                <span className="stat-number" data-target={stat.number}>{stat.number}</span>
                <span className="text-[#60519b]">{stat.suffix}</span>
              </div>
              <p className="text-[#8b8c9d] text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section ref={ctaSectionRef} className="relative z-10 max-w-4xl mx-auto px-8 py-20 text-center">
        <div className="relative p-10 md:p-14 rounded-[2rem] bg-gradient-to-br from-[#31323e]/80 to-[#1e202c] border border-white/10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#60519b]/20 rounded-full blur-[100px] -translate-y-1/2" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5">
              Ready to Transform Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] via-[#c4b5fd] to-[#e0d4ff]">Fleet?</span>
            </h2>
            <p className="text-[#8b8c9d] text-base max-w-xl mx-auto mb-8 leading-relaxed">
              Join hundreds of companies already using FleetFlow to optimize their logistics operations.
            </p>
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-3 px-10 py-4 bg-[#60519b] rounded-2xl font-bold text-lg hover:bg-[#7b6ac6] transition-all shadow-2xl shadow-[#60519b]/40 hover:scale-[1.03] active:scale-[0.98]"
              >
                <BarChart3 size={20} /> View Dashboard
              </Link>
            ) : (
              <Link
                href="/signup"
                className="inline-flex items-center gap-3 px-10 py-4 bg-[#60519b] rounded-2xl font-bold text-lg hover:bg-[#7b6ac6] transition-all shadow-2xl shadow-[#60519b]/40 hover:scale-[1.03] active:scale-[0.98]"
              >
                Get Started Free <ArrowRight size={20} />
              </Link>
            )}
          </div>
        </div>
      </section>

      <footer className="relative z-10 px-8 py-10 border-t border-white/5 text-center text-[#8b8c9d] bg-[#1e202c]">
        <p className="text-sm">© 2026 FleetFlow Platform. Designed for Next-Gen Logistics.</p>
      </footer>
    </div>
  );
}
