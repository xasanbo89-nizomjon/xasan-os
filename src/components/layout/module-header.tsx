import React from "react";
import { LucideIcon } from "lucide-react";

interface ModuleHeaderProps {
  icon: LucideIcon;
  badge?: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function ModuleHeader({
  icon: Icon,
  badge,
  title,
  description,
  children,
}: ModuleHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#25352C]">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-6 rounded-lg bg-[#142019] border border-[#25352C] flex items-center justify-center text-[#10B981]">
            <Icon className="w-3.5 h-3.5" />
          </div>
          {badge && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
              {badge}
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#F3F7F4]">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-[#98A69D] mt-1 max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>

      {children && <div className="flex items-center gap-2.5">{children}</div>}
    </div>
  );
}
