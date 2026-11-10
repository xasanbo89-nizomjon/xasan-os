import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ModuleHeader } from "@/components/layout/module-header";
import { User, ShieldCheck, Mail, MapPin, Briefcase, Award, Terminal } from "lucide-react";

export default function ProfilePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <ModuleHeader
          icon={User}
          badge="IDENTITY TELEMETRY"
          title="Architect Profile"
          description="Personal credentials, executive identity, and operating system administrator configuration."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Identity Card (1 col) */}
          <div className="glass-card rounded-2xl p-6 border border-[#25352C] flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#10B981] to-[#3B82F6] flex items-center justify-center text-3xl font-black text-[#080D0B] shadow-lg shadow-[#10B981]/25 mb-4">
              XM
            </div>
            <h2 className="text-xl font-bold text-[#F3F7F4]">
              Xasan Mukhammadiev
            </h2>
            <p className="text-xs text-[#10B981] font-mono mt-0.5 font-semibold">
              Senior Software Architect & Creator
            </p>

            <div className="w-full mt-6 space-y-2.5 text-xs text-left border-t border-[#25352C] pt-6">
              <div className="flex items-center gap-2.5 text-[#98A69D]">
                <Mail className="w-4 h-4 text-[#10B981]" />
                <span>xasan@os.local</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#98A69D]">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span>System Role: OWNER / ROOT</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#98A69D]">
                <Briefcase className="w-4 h-4 text-[#10B981]" />
                <span>Focus: Aurelius IELTS, Full-Stack OS, AI</span>
              </div>
            </div>
          </div>

          {/* Capabilities & Bio (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl p-6 border border-[#25352C]">
              <h3 className="text-base font-semibold text-[#F3F7F4] mb-4 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#10B981]" />
                Architectural Principles & Work Protocol
              </h3>
              <p className="text-xs sm:text-sm text-[#98A69D] leading-relaxed mb-4">
                Specialized in zero-friction distributed architectures, reactive agentic tooling, and personal discipline engineering. Architecting high-availability platforms with Next.js, PostgreSQL, TypeScript, and customized AI reasoning systems.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-[#25352C]">
                <div className="p-3 rounded-xl bg-[#101915] border border-[#25352C]">
                  <div className="text-[10px] text-[#98A69D] font-mono">CODE EFFICIENCY</div>
                  <div className="text-sm font-bold text-[#10B981] mt-1">99.8%</div>
                </div>
                <div className="p-3 rounded-xl bg-[#101915] border border-[#25352C]">
                  <div className="text-[10px] text-[#98A69D] font-mono">IELTS BENCHMARK</div>
                  <div className="text-sm font-bold text-[#3B82F6] mt-1">Band 8.5</div>
                </div>
                <div className="p-3 rounded-xl bg-[#101915] border border-[#25352C]">
                  <div className="text-[10px] text-[#98A69D] font-mono">DISCIPLINE STREAK</div>
                  <div className="text-sm font-bold text-[#F59E0B] mt-1">21 Days</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
