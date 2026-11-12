"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useTranslation } from "@/stores/language-store";
import { triggerHaptic } from "@/lib/mobile";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "pill" | "button" | "select";
}

export function LanguageSwitcher({
  className = "",
  variant = "pill",
}: LanguageSwitcherProps) {
  const { language, setLanguage, isUz, isHydrated } = useTranslation();

  const handleToggle = () => {
    const next = isUz ? "en" : "uz";
    setLanguage(next);
    triggerHaptic("LIGHT");
  };

  if (!isHydrated) {
    return (
      <div
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D1527] border border-[#1E2D4D] text-xs font-mono text-[#94A3B8] ${className}`}
      >
        <Globe className="w-3.5 h-3.5 text-[#38BDF8]" />
        <span className="font-bold text-[#F1F5F9]">UZ</span>
      </div>
    );
  }

  if (variant === "select") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          type="button"
          onClick={() => {
            setLanguage("uz");
            triggerHaptic("LIGHT");
          }}
          className={`flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold font-mono transition-all cursor-pointer ${
            isUz
              ? "bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/50 shadow-md shadow-[#38BDF8]/10 font-bold"
              : "bg-[#0D1527] text-[#94A3B8] border-[#1E2D4D] hover:text-[#F1F5F9] hover:border-[#38BDF8]/30"
          }`}
        >
          <span>🇺🇿</span>
          <span>O‘zbek tili (Lotin)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setLanguage("en");
            triggerHaptic("LIGHT");
          }}
          className={`flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold font-mono transition-all cursor-pointer ${
            !isUz
              ? "bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/50 shadow-md shadow-[#38BDF8]/10 font-bold"
              : "bg-[#0D1527] text-[#94A3B8] border-[#1E2D4D] hover:text-[#F1F5F9] hover:border-[#38BDF8]/30"
          }`}
        >
          <span>🇺🇸</span>
          <span>English (US)</span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={isUz ? "Switch to English" : "O‘zbek tiliga o‘tish"}
      aria-label="Switch Language"
      className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D1527] hover:bg-[#070B14] border border-[#1E2D4D] hover:border-[#38BDF8]/50 text-xs font-mono transition-all cursor-pointer shadow-inner ${className}`}
    >
      <Globe className="w-3.5 h-3.5 text-[#38BDF8]" />
      <span className="font-bold text-[#F1F5F9] group-hover:text-[#38BDF8] transition-colors">
        {isUz ? "UZ" : "EN"}
      </span>
      <span className="text-[10px] text-[#94A3B8]">▼</span>
    </button>
  );
}
