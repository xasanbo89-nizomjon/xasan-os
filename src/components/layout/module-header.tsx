import React from "react";
import { LucideIcon } from "lucide-react";
import { ModuleHeaderText } from "./module-header-text";

interface ModuleHeaderProps {
  icon?: LucideIcon | React.ReactNode;
  badge?: string;
  title: string;
  description: string;
  moduleId?: string;
  children?: React.ReactNode;
}

export function ModuleHeader({
  icon: Icon,
  badge,
  title,
  description,
  moduleId,
  children,
}: ModuleHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#25352C]">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-[#142019] border border-[#25352C] flex items-center justify-center text-[#10B981] shrink-0 mt-0.5">
            {React.isValidElement(Icon) ? (
              Icon
            ) : typeof Icon === "function" ? (
              // @ts-ignore
              <Icon className="w-5 h-5 text-[#10B981]" />
            ) : null}
          </div>
        )}

        <ModuleHeaderText
          badge={badge}
          title={title}
          description={description}
          moduleId={moduleId}
        />
      </div>

      {children && <div className="flex items-center gap-2.5">{children}</div>}
    </div>
  );
}
