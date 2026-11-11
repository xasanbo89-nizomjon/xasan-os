"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { NAVIGATION_ITEMS } from "@/config/navigation";
import { useTranslation } from "@/stores/language-store";

export function Breadcrumbs() {
  const pathname = usePathname();
  const { dict } = useTranslation();
  const currentItem = NAVIGATION_ITEMS.find((item) => item.href === pathname);

  const getLocalizedName = (itemId: string, fallback: string) => {
    switch (itemId) {
      case "overview":
        return dict.nav.overview;
      case "my-day":
        return dict.nav.my_day;
      case "tasks":
        return dict.nav.tasks;
      case "calendar":
        return dict.nav.calendar;
      case "life-tracker":
        return dict.nav.life_tracker;
      case "study-center":
        return dict.nav.study_center;
      case "developer-hub":
        return dict.nav.developer_hub;
      case "finance":
        return dict.nav.finance;
      case "xasan-ai":
        return dict.nav.xasan_ai;
      case "knowledge-base":
        return dict.nav.knowledge_base;
      case "goals":
        return dict.nav.goals;
      case "analytics":
        return dict.nav.analytics;
      case "notifications":
        return dict.nav.notifications;
      case "profile":
        return dict.nav.profile;
      case "settings":
        return dict.nav.settings;
      default:
        return fallback;
    }
  };

  return (
    <nav className="flex items-center space-x-2 text-xs text-[#98A69D]" aria-label="Breadcrumb">
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-[#10B981] transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">XASAN OS</span>
      </Link>
      {pathname !== "/" && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-[#25352C]" />
          <span className="text-[#10B981] font-medium">
            {currentItem ? getLocalizedName(currentItem.id, currentItem.name) : pathname.replace("/", "")}
          </span>
        </>
      )}
    </nav>
  );
}
