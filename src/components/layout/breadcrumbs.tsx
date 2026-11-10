"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { NAVIGATION_ITEMS } from "@/config/navigation";

export function Breadcrumbs() {
  const pathname = usePathname();
  const currentItem = NAVIGATION_ITEMS.find((item) => item.href === pathname);

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
            {currentItem ? currentItem.name : pathname.replace("/", "")}
          </span>
        </>
      )}
    </nav>
  );
}
