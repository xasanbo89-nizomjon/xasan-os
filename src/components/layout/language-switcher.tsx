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
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#142019] border border-[#25352C] text-xs font-mono text-[#98A69D] ${className}`}
      >
        <Globe className="w-3.5 h-3.5 text-[#10B981]" />
        <span>O‘Z</span>
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
              ? "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/50 shadow-md shadow-[#10B981]/10 font-bold"
              : "bg-[#142019] text-[#98A69D] border-[#25352C] hover:text-[#F3F7F4] hover:border-[#10B981]/30"
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
              ? "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/50 shadow-md shadow-[#10B981]/10 font-bold"
              : "bg-[#142019] text-[#98A69D] border-[#25352C] hover:text-[#F3F7F4] hover:border-[#10B981]/30"
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
      className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#142019] hover:bg-[#101915] border border-[#25352C] hover:border-[#10B981]/40 text-xs font-mono transition-all cursor-pointer shadow-inner ${className}`}
    >
      <Globe className="w-3.5 h-3.5 text-[#10B981] group-hover:rotate-45 transition-transform duration-300" />
      <div className="flex items-center gap-1 font-bold text-[11px]">
        <span className={isUz ? "text-[#10B981]" : "text-[#98A69D]"}>O‘Z</span>
        <span className="text-[#25352C] font-normal">/</span>
        <span className={!isUz ? "text-[#10B981]" : "text-[#98A69D]"}>EN</span>
      </div>
    </button>
  );
}
