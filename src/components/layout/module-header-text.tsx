"use client";

import React from "react";
import { useTranslation } from "@/stores/language-store";

interface ModuleHeaderTextProps {
  badge?: string;
  title: string;
  description: string;
  moduleId?: string;
}

export function ModuleHeaderText({
  badge,
  title,
  description,
  moduleId,
}: ModuleHeaderTextProps) {
  const { dict, isUz } = useTranslation();

  let displayBadge = badge;
  let displayTitle = title;
  let displayDescription = description;

  if (isUz) {
    const t = title.toLowerCase();
    const m = (moduleId || "").toLowerCase();

    if (m === "tasks" || t.includes("task") || t.includes("vazifa")) {
      displayBadge = dict.tasks.badge;
      displayTitle = dict.tasks.title;
      displayDescription = dict.tasks.description;
    } else if (m === "calendar" || t.includes("calendar") || t.includes("kalendar")) {
      displayBadge = dict.calendar.badge;
      displayTitle = dict.calendar.title;
      displayDescription = dict.calendar.description;
    } else if (m === "life-tracker" || m === "habits" || t.includes("habit") || t.includes("life") || t.includes("odat")) {
      displayBadge = dict.habits.badge;
      displayTitle = dict.habits.title;
      displayDescription = dict.habits.description;
    } else if (m === "my-day" || t.includes("my day") || t.includes("mening kunim")) {
      displayBadge = dict.my_day.badge;
      displayTitle = dict.my_day.title;
      displayDescription = dict.my_day.description;
    } else if (m === "study-center" || t.includes("study") || t.includes("ielts") || t.includes("o‘quv")) {
      displayBadge = dict.study.badge;
      displayTitle = dict.study.title;
      displayDescription = dict.study.description;
    } else if (m === "developer-hub" || t.includes("developer") || t.includes("dev hub") || t.includes("dasturchi")) {
      displayBadge = dict.developer.badge;
      displayTitle = dict.developer.title;
      displayDescription = dict.developer.description;
    } else if (m === "finance" || t.includes("finance") || t.includes("moliya")) {
      displayBadge = dict.finance.badge;
      displayTitle = dict.finance.title;
      displayDescription = dict.finance.description;
    } else if (m === "xasan-ai" || t.includes("ai") || t.includes("intellekt")) {
      displayBadge = dict.ai.badge;
      displayTitle = dict.ai.title;
      displayDescription = dict.ai.description;
    } else if (m === "knowledge-base" || t.includes("knowledge") || t.includes("bilim") || t.includes("brain")) {
      displayBadge = dict.knowledge.badge;
      displayTitle = dict.knowledge.title;
      displayDescription = dict.knowledge.description;
    } else if (m === "goals" || t.includes("goal") || t.includes("maqsad") || t.includes("vision")) {
      displayBadge = dict.goals.badge;
      displayTitle = dict.goals.title;
      displayDescription = dict.goals.description;
    } else if (m === "analytics" || t.includes("analytic") || t.includes("tahlil")) {
      displayBadge = dict.analytics.badge;
      displayTitle = dict.analytics.title;
      displayDescription = dict.analytics.description;
    } else if (m === "notifications" || t.includes("notif") || t.includes("bildirish")) {
      displayBadge = dict.nav.notifications.toUpperCase();
      displayTitle = dict.nav.notifications;
      displayDescription = dict.nav.notifications_desc;
    } else if (m === "profile" || t.includes("profile") || t.includes("profil")) {
      displayBadge = "SHAXSIYAT VA XAVFSIZLIK";
      displayTitle = "Arxitektor Profili va Xavfsizlik Dvigateli";
      displayDescription = "Hisob ma'lumotlarini boshqarish, PIN-kod va biometriyani sozlash va faol seanslarni nazorat qilish.";
    } else if (m === "settings" || t.includes("setting") || t.includes("sozlama")) {
      displayBadge = dict.settings.badge;
      displayTitle = dict.settings.title;
      displayDescription = dict.settings.description;
    } else if (m === "focus" || t.includes("focus") || t.includes("pomodoro") || t.includes("diqqat")) {
      displayBadge = "KOGNITIV OQIM";
      displayTitle = "Diqqat va Pomodoro Laboratoriyasi";
      displayDescription = "Chalg‘ituvchilarsiz ijro bloklari, bitta vazifaga chuqur sho‘ng‘ish va seans telemetriyasi.";
    } else if (m === "activity" || t.includes("activity") || t.includes("faoliyat")) {
      displayBadge = "AUDIT JURNALI";
      displayTitle = "Faoliyat Jurnali va Yangiliklar";
      displayDescription = "Bajarilgan vazifalar, odatlar intizomi va keshflo operatsiyalarining xronologik telemetriyasi.";
    } else if (m === "weekly" || t.includes("weekly") || t.includes("haftalik")) {
      displayBadge = "SPRINT VELOSITISI";
      displayTitle = "Haftalik Velositi va Tahlil";
      displayDescription = "Haftalik ish unumdorligi, sprint natijalari va odatlar barqarorligi tahlili.";
    } else if (m === "monthly" || t.includes("monthly") || t.includes("oylik")) {
      displayBadge = "OYLIK SARHISOB";
      displayTitle = "Oylik OKR va Marralar";
      displayDescription = "Oylik strategik marralar, umumiy keshflo va uzoq muddatli maqsadlar.";
    } else if (m === "custom-dashboard" || t.includes("custom") || t.includes("moslashtirilgan")) {
      displayBadge = "MAXSUS MAKET";
      displayTitle = "Maxsus Boshqaruv Paneli";
      displayDescription = "O‘zingiz uchun qulay vidjetlar va erkin boshqaruv paneli joylashuvi.";
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        {displayBadge && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
            {displayBadge}
          </span>
        )}
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-[#F3F7F4]">
        {displayTitle}
      </h1>
      <p className="text-xs sm:text-sm text-[#98A69D] mt-1 max-w-2xl leading-relaxed">
        {displayDescription}
      </p>
    </div>
  );
}
