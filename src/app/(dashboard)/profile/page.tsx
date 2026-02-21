"use client";

import { useSession } from "next-auth/react";
import { User, Mail, Shield, Calendar, Camera, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProfilePage() {
    const { data: session } = useSession();
    const user = session?.user;

    const userInitials = user?.name
        ? user.name.slice(0, 2).toUpperCase()
        : user?.email?.slice(0, 2).toUpperCase() || "FA";

    return (
        <div className="px-6 py-8 max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard" className="p-2 rounded-xl glass-panel hover:bg-white/5 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-3xl font-bold">Profile Settings</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Avatar & Quick Info */}
                <div className="md:col-span-1 space-y-6">
                    <div className="glass-panel p-6 rounded-2xl flex flex-col items-center border border-[var(--card-border)] relative overflow-hidden group">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[#bfc0d1] border-4 border-[var(--card-border)] shadow-xl flex items-center justify-center overflow-hidden relative mb-4">
                            {user?.image ? (
                                <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl font-bold text-white">{userInitials}</span>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                <Camera size={24} className="text-white" />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-center">{user?.name || "User Name"}</h2>
                        <p className="text-[var(--muted-foreground)] text-sm text-center">{(user as any)?.role || "No Role Assigned"}</p>

                        <div className="w-full mt-6 pt-6 border-t border-[var(--card-border)] space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <Shield size={16} className="text-[var(--primary)]" />
                                <span className="text-[var(--muted-foreground)]">System Access: Full</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar size={16} className="text-[var(--primary)]" />
                                <span className="text-[var(--muted-foreground)]">Member since 2024</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Detailed Settings */}
                <div className="md:col-span-2 space-y-6">
                    <div className="glass-panel p-6 rounded-2xl border border-[var(--card-border)]">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <User size={18} className="text-[var(--primary)]" />
                            Personal Information
                        </h3>
                        <form className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[var(--muted-foreground)]">Full Name</label>
                                    <input
                                        type="text"
                                        defaultValue={user?.name || ""}
                                        className="w-full bg-black/20 border border-[var(--card-border)] rounded-xl px-4 py-2.5 outline-none focus:border-[var(--primary)] transition-colors"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[var(--muted-foreground)]">Email Address</label>
                                    <input
                                        type="email"
                                        readOnly
                                        defaultValue={user?.email || ""}
                                        className="w-full bg-black/10 border border-[var(--card-border)] rounded-xl px-4 py-2.5 outline-none text-[var(--muted-foreground)] cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[var(--muted-foreground)]">Biography</label>
                                <textarea
                                    className="w-full bg-black/20 border border-[var(--card-border)] rounded-xl px-4 py-2.5 outline-none focus:border-[var(--primary)] transition-colors min-h-[100px]"
                                    placeholder="Tell us about your role at FleetFlow..."
                                ></textarea>
                            </div>
                        </form>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl border border-[var(--card-border)]">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Mail size={18} className="text-[var(--primary)]" />
                            Notification Preferences
                        </h3>
                        <div className="space-y-4">
                            {[
                                { title: "Trip Updates", desc: "Get notified when trips are dispatched or completed." },
                                { title: "Maintenance Alerts", desc: "Receive alerts for scheduled maintenance and shop status." },
                                { title: "System Announcements", desc: "Stay updated with the latest platform features and changes." }
                            ].map((pref, i) => (
                                <div key={i} className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="font-medium">{pref.title}</p>
                                        <p className="text-xs text-[var(--muted-foreground)]">{pref.desc}</p>
                                    </div>
                                    <div className="w-12 h-6 bg-[var(--primary)]/20 rounded-full relative cursor-pointer border border-[var(--card-border)]">
                                        <div className="absolute right-1 top-1 w-4 h-4 bg-[var(--primary)] rounded-full shadow-sm" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button className="px-6 py-2.5 rounded-xl border border-[var(--card-border)] text-[var(--muted-foreground)] hover:bg-white/5 transition-all">
                            Discard Changes
                        </button>
                        <button className="px-8 py-2.5 rounded-xl bg-[var(--primary)] text-white font-medium hover:bg-[#7262b5] transition-all shadow-lg shadow-[var(--primary)]/20 flex items-center gap-2">
                            <Save size={18} />
                            Save Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
