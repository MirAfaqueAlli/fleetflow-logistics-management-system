"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    options: (string | Option)[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
    variant?: "pill" | "block";
    placeholder?: string;
}

export default function CustomSelect({
    options,
    value,
    onChange,
    className = "",
    variant = "pill",
    placeholder,
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const normalizedOptions: Option[] = options.map(opt =>
        typeof opt === "string" ? { value: opt, label: opt } : opt
    );

    const selectedOption = normalizedOptions.find(opt => opt.value === value);
    const displayLabel = selectedOption ? selectedOption.label : (placeholder || "Select...");

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close on Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const isPill = variant === "pill";

    return (
        <div ref={ref} className={`relative ${className}`}>
            {/* Trigger */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
          flex items-center justify-between gap-2 text-sm font-medium transition-all duration-200 cursor-pointer
          text-[var(--foreground)] border border-[var(--card-border)]
          hover:border-[rgba(167,139,250,0.35)] focus:outline-none
          ${isPill
                        ? "px-4 py-2.5 rounded-full glass-panel min-w-[130px]"
                        : "w-full px-4 py-2.5 rounded-xl glass-panel bg-[var(--background)]"
                    }
          ${isOpen ? "border-[var(--primary)] shadow-[0_0_0_1px_var(--primary),0_4px_16px_rgba(96,81,155,0.15)]" : ""}
        `}
            >
                <span className={value ? "" : "text-[var(--muted-foreground)]"}>
                    {displayLabel}
                </span>
                <ChevronDown
                    size={14}
                    className={`text-[var(--muted-foreground)] transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className={`
              absolute z-[60] mt-2 w-full min-w-[180px]
              rounded-xl border border-[var(--card-border)]
              bg-[var(--background)]/95 backdrop-blur-xl
              shadow-[0_8px_30px_rgba(0,0,0,0.35),0_0_0_1px_rgba(167,139,250,0.1)]
              overflow-hidden
            `}
                    >
                        <div className="py-1">
                            {normalizedOptions.map((option) => {
                                const isSelected = option.value === value;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            onChange(option.value);
                                            setIsOpen(false);
                                        }}
                                        className={`
                      w-full text-left px-4 py-2.5 text-sm flex items-center justify-between gap-3
                      transition-all duration-150 cursor-pointer
                      ${isSelected
                                                ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
                                                : "text-[var(--foreground)] hover:bg-[rgba(167,139,250,0.08)]"
                                            }
                    `}
                                    >
                                        <span>{option.label}</span>
                                        {isSelected && (
                                            <Check size={14} className="text-[var(--primary)] shrink-0" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
