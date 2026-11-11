"use client";

import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ModuleHeader } from "@/components/layout/module-header";
import { Bell, Flame, CheckCircle, Clock, AlertTriangle, ShieldCheck } from "lucide-react";
import { useTranslation } from "@/stores/language-store";

export default function NotificationsPage() {
  const { dict, isUz } = useTranslation();

  const notifications = [
    {
      id: "notif-1",
      title: isUz ? "21 kunlik odatlar uzluksizligi zabt etildi" : "21-Day Habit Streak Achieved",
      category: isUz ? "Intizom" : "Discipline",
      desc: isUz
        ? "Siz 21 kun davomida uzluksiz kunlik dasturlash va o‘rganish seanslarini bajardingiz."
        : "You have maintained uninterrupted daily coding sessions for 21 consecutive days.",
      time: isUz ? "25 daqiqa oldin" : "25 minutes ago",
      icon: Flame,
      color: "text-[#F59E0B]",
    },
    {
      id: "notif-2",
      title: isUz ? "Whisper Pipeline optimallashtirish muddati ertaga" : "Whisper Pipeline Optimization Due Tomorrow",
      category: "Aurelius IELTS",
      desc: isUz
        ? "Kiruvchi audio oqimlari uchun kechikish ko‘rsatkichi 500ms dan past bo‘lishi rejalashtirilgan."
        : "Target latency benchmark is set to sub-500ms for incoming audio streams.",
      time: isUz ? "1 soat oldin" : "1 hour ago",
      icon: Clock,
      color: "text-[#10B981]",
    },
    {
      id: "notif-3",
      title: isUz ? "Mahalliy ma'lumotlar yaxlitligi: 100% A'lo" : "Data Isolation Health Check: 100% OK",
      category: isUz ? "Tizim yadrosi" : "System Core",
      desc: isUz
        ? "Mahalliy xotira yaxlitligi, avtonom kesh va kalitlar muvaffaqiyatli tekshirildi."
        : "Local client-side persistent storage and session integrity verified.",
      time: isUz ? "3 soat oldin" : "3 hours ago",
      icon: ShieldCheck,
      color: "text-[#3B82F6]",
    },
    {
      id: "notif-4",
      title: isUz ? "Infratuzilma xarajati chegarasi ogohlantirishi" : "Cloud Compute Threshold Alert",
      category: isUz ? "Moliya" : "Finance",
      desc: isUz
        ? "Oylik GPU va AI infratuzilmasi xarajati belgilangan tadqiqot byudjetining 72% iga yetdi."
        : "Monthly GPU node spend has reached 72% of allocated research budget.",
      time: isUz ? "Kecha" : "Yesterday",
      icon: AlertTriangle,
      color: "text-[#EF4444]",
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <ModuleHeader
          icon={Bell}
          badge={isUz ? "BILDIRISHNOMALAR MARKAZI" : "ALERT DISPATCHER"}
          title={isUz ? "Bildirishnomalar va Tizim Eslatmalari" : "Notifications & System Alerts"}
          description={
            isUz
              ? "Xronologik bildirishnomalar, avtomatlashtirilgan eslatmalar, odatlar marralari va xavfsizlik signallari."
              : "Chronological notifications, automated nudges, habit milestones & security alerts."
          }
        />

        <div className="space-y-3">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                className="glass-card rounded-2xl p-5 border border-[#25352C] flex items-start gap-4 hover:border-[#10B981]/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#101915] border border-[#25352C] flex items-center justify-center shrink-0">
                  <Icon className={`w-5 h-5 ${n.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-[#F3F7F4]">
                      {n.title}
                    </h3>
                    <span className="text-[11px] font-mono text-[#98A69D]">
                      {n.time}
                    </span>
                  </div>
                  <p className="text-xs text-[#98A69D] leading-relaxed mb-2">
                    {n.desc}
                  </p>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101915] text-[#98A69D] border border-[#25352C]">
                    {n.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
