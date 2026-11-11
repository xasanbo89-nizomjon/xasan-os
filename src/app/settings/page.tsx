"use client";

import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ModuleHeader } from "@/components/layout/module-header";
import {
  Settings,
  Database,
  Palette,
  Shield,
  Check,
  Languages,
} from "lucide-react";
import { MultiPlatformControl } from "@/components/settings/multi-platform-control";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useTranslation } from "@/stores/language-store";

export default function SettingsPage() {
  const { dict, isUz } = useTranslation();

  const themeTokens = [
    {
      name: isUz ? "Asosiy Fon" : "Primary Background",
      hex: "#080D0B",
      role: isUz ? "Bosh ilova maydoni" : "Main canvas",
    },
    {
      name: isUz ? "Yon Panel Foni" : "Secondary Background",
      hex: "#101915",
      role: isUz ? "Yon menyu va panellar" : "Sidebar & Panels",
    },
    {
      name: isUz ? "Karta Foni" : "Card Background",
      hex: "#142019",
      role: isUz ? "Shishasimon kartalar" : "Glassmorphism cards",
    },
    {
      name: isUz ? "Asosiy Urg‘u (Zumrad)" : "Primary Accent",
      hex: "#10B981",
      role: isUz ? "Zumrad chaqnash effekti" : "Emerald glow",
    },
    {
      name: isUz ? "Faol Tugma Urg‘usi" : "Hover Accent",
      hex: "#059669",
      role: isUz ? "Interaktiv harakatlar" : "Interactive hover",
    },
    {
      name: isUz ? "Asosiy Matn" : "Main Text",
      hex: "#F3F7F4",
      role: isUz ? "Yuqori kontrastli sarlavhalar" : "High-contrast headings",
    },
    {
      name: isUz ? "Ikkilamchi Matn" : "Secondary Text",
      hex: "#98A69D",
      role: isUz ? "Kichik matnlar va metama'lumotlar" : "Subtitles & meta",
    },
    {
      name: isUz ? "Ajratuvchi Chegara" : "Border",
      hex: "#25352C",
      role: isUz ? "Tuzilma chegaralari" : "Structural outlines",
    },
    {
      name: isUz ? "Ogohlantirish / Xato" : "Error",
      hex: "#EF4444",
      role: isUz ? "Kritik ogohlantirishlar" : "Urgent alerts",
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <ModuleHeader
          icon={Settings}
          badge={dict.settings.badge}
          title={dict.settings.title}
          description={dict.settings.description}
        />

        {/* 1. Language & Localization Configuration Card */}
        <div className="glass-card rounded-2xl p-6 border border-[#25352C]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[#F3F7F4] flex items-center gap-2">
              <Languages className="w-4 h-4 text-[#10B981]" />
              {dict.settings.language_card.title}
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
              {dict.settings.language_card.active_badge}: {isUz ? "O‘ZBEK" : "ENGLISH"}
            </span>
          </div>

          <p className="text-xs text-[#98A69D] mb-4">
            {dict.settings.language_card.description}
          </p>

          <LanguageSwitcher variant="select" />
        </div>

        {/* 2. Design System & Theme Specification Display */}
        <div className="glass-card rounded-2xl p-6 border border-[#25352C]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[#F3F7F4] flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#10B981]" />
              {dict.settings.theme_card.title}
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
              {dict.settings.theme_card.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {themeTokens.map((token) => (
              <div
                key={token.name}
                className="p-3 rounded-xl bg-[#101915] border border-[#25352C] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-lg border border-[#25352C] shadow-inner shrink-0"
                    style={{ backgroundColor: token.hex }}
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-[#F3F7F4]">
                      {token.name}
                    </h4>
                    <span className="text-[10px] text-[#98A69D]">{token.role}</span>
                  </div>
                </div>
                <code className="text-[11px] font-mono text-[#10B981]">
                  {token.hex}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Authentication & Security Architecture */}
        <div className="glass-card rounded-2xl p-6 border border-[#25352C]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[#F3F7F4] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#10B981]" />
              {isUz ? "Xavfsizlik va Autentifikatsiya Arxitekturasi" : "Authentication & Security Architecture (PRD Phase 2)"}
            </h3>
            <span className="text-xs font-mono text-[#10B981] flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              {isUz ? "Faol va Himoyalangan" : "Active & Protected"}
            </span>
          </div>

          <div className="space-y-3 text-xs text-[#98A69D]">
            <div className="p-3.5 rounded-xl bg-[#101915] border border-[#25352C] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-semibold text-[#F3F7F4]">
                  {isUz ? "Firebase Autentifikatsiyasi:" : "Firebase Authentication:"}
                </span>
                <p className="text-[11px] mt-0.5">
                  {isUz
                    ? "Google OAuth va Email/Parol orqali kirish hamda xavfsiz sessiya tokenlarini tekshirish"
                    : "Google OAuth and Email/Password with client SDK & server token verification"}
                </p>
              </div>
              <span className="font-mono text-[#10B981] px-2 py-1 bg-[#142019] rounded border border-[#25352C]">
                {isUz ? "SOZLANGAN" : "CONFIGURED"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#101915] border border-[#25352C] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-semibold text-[#F3F7F4]">
                  {isUz ? "Next.js Marshrut Himoyasi (Middleware):" : "Next.js Route Protection:"}
                </span>
                <p className="text-[11px] mt-0.5">
                  {isUz
                    ? "Tizimga kirmagan so‘rovlarni avtomatik /login sahifasiga, qulflangan holatda esa /lock sahifasiga yo‘naltirish"
                    : "Edge middleware redirecting unauthenticated requests to /login and locked sessions to /lock"}
                </p>
              </div>
              <span className="font-mono text-[#10B981] px-2 py-1 bg-[#142019] rounded border border-[#25352C]">
                {isUz ? "FAOL (middleware.ts)" : "ENFORCED (middleware.ts)"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#101915] border border-[#25352C] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-semibold text-[#F3F7F4]">
                  {isUz ? "PIN-kod va Biometrik Himoya:" : "Passcode & Biometrics:"}
                </span>
                <p className="text-[11px] mt-0.5">
                  {isUz
                    ? "4/6 xonali raqamli klaviatura, TouchID/FaceID hamda 3 ta noto‘g‘ri urinishdan so‘ng 30 soniyalik blokirovka"
                    : "4/6-Digit keypad with TouchID/FaceID simulation & 3-attempt 30s lockout"}
                </p>
              </div>
              <span className="font-mono text-[#10B981] px-2 py-1 bg-[#142019] rounded border border-[#25352C]">
                {isUz ? "TAYYOR (/lock)" : "READY (/lock)"}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Sovereign Storage & Database Architecture */}
        <div className="glass-card rounded-2xl p-6 border border-[#25352C]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[#F3F7F4] flex items-center gap-2">
              <Database className="w-4 h-4 text-[#10B981]" />
              {dict.settings.storage_card.title}
            </h3>
            <span className="text-xs font-mono text-[#10B981] flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              {isUz ? "0-Database Xavfsiz Rejimi" : "0-Database Sovereign Mode"}
            </span>
          </div>

          <div className="space-y-3 text-xs text-[#98A69D]">
            <div className="p-3.5 rounded-xl bg-[#101915] border border-[#25352C] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-semibold text-[#F3F7F4]">
                  {isUz ? "Mahalliy Xotira Saqlash Rejimi:" : "User Data Isolation Mode:"}
                </span>
                <p className="text-[11px] mt-0.5">
                  {dict.settings.storage_card.description}
                </p>
              </div>
              <span className="font-mono text-[#10B981] px-2 py-1 bg-[#142019] rounded border border-[#25352C]">
                {isUz ? "FAOL (localStorage)" : "ENFORCED (localStorage)"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#101915] border border-[#25352C] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-semibold text-[#F3F7F4]">
                  {isUz ? "Qo‘llab-quvvatlanuvchi Ma'lumot Modellari:" : "Registered Database Models:"}
                </span>
                <p className="text-[11px] mt-0.5">
                  User, Task, Habit, HabitLog, Project, Transaction, KnowledgeNote, Goal
                </p>
              </div>
              <span className="font-mono text-[#10B981] px-2 py-1 bg-[#142019] rounded border border-[#25352C]">
                {isUz ? "8 Modul Birlashtirilgan" : "8 Models Configured"}
              </span>
            </div>
          </div>
        </div>

        {/* 5. Phase 12: Multi-Platform, Offline Sync & Disaster Recovery */}
        <MultiPlatformControl />
      </div>
    </AppShell>
  );
}