import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ModuleHeader } from "@/components/layout/module-header";
import { Sparkles, Bot, Send, Zap, Cpu, Terminal, ArrowRight } from "lucide-react";

export default function XasanAiPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <ModuleHeader
          icon={Sparkles}
          badge="NEURAL ENGINE"
          title="XASAN AI: Autonomous Copilot"
          description="Integrated multimodal reasoning engine, codebase architecture assistant, and personal cognitive amplifier."
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main AI Chat Interface (3 cols) */}
          <div className="lg:col-span-3 glass-card rounded-2xl border border-[#25352C] flex flex-col h-[600px] overflow-hidden">
            {/* AI Status bar */}
            <div className="p-4 border-b border-[#25352C] bg-[#101915] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#F3F7F4] flex items-center gap-1.5">
                    XASAN Sovereign Agent
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  </h3>
                  <span className="text-[10px] text-[#98A69D] font-mono">
                    Model: Claude 3.7 Sonnet / Gemini 3.8 Flash • Context: 1M tokens
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#142019] text-[#10B981] border border-[#10B981]/30">
                LOW-LATENCY
              </span>
            </div>

            {/* Conversation Flow */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              <div className="p-4 rounded-2xl bg-[#101915] border border-[#25352C] max-w-2xl text-xs space-y-2">
                <div className="flex items-center gap-2 text-[#10B981] font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>XASAN AI System</span>
                </div>
                <p className="text-[#F3F7F4] leading-relaxed">
                  Greetings, Xasan. All subsystems in **XASAN OS Ultimate** are online.
                  The Prisma PostgreSQL schema is structured for strict user data isolation.
                  Developer Hub projects (Aurelius IELTS, LinguaHub, Ravon Avto) and IELTS preparation routines are synchronized. How can I assist your engineering execution today?
                </p>
              </div>
            </div>

            {/* Prompt Input Box */}
            <div className="p-4 border-t border-[#25352C] bg-[#101915]">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#142019] border border-[#25352C] focus-within:border-[#10B981] transition-colors">
                <input
                  type="text"
                  placeholder="Ask XASAN AI to review system design, evaluate IELTS essay, or draft database queries..."
                  className="flex-1 bg-transparent text-xs text-[#F3F7F4] placeholder-[#98A69D] px-2 focus:outline-none"
                />
                <button className="p-2 rounded-lg bg-[#10B981] text-[#080D0B] hover:bg-[#059669] transition-colors">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* AI Capabilities Sidebar (1 col) */}
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-5 border border-[#25352C]">
              <h4 className="text-xs font-bold text-[#F3F7F4] mb-3 uppercase tracking-wider font-mono text-[#10B981]">
                Quick Directives
              </h4>
              <div className="space-y-2">
                <button className="w-full text-left p-2.5 rounded-xl bg-[#101915] border border-[#25352C] hover:border-[#10B981]/50 text-xs text-[#98A69D] hover:text-[#F3F7F4] transition-colors">
                  ⚡ Audit PostgreSQL Indexing
                </button>
                <button className="w-full text-left p-2.5 rounded-xl bg-[#101915] border border-[#25352C] hover:border-[#10B981]/50 text-xs text-[#98A69D] hover:text-[#F3F7F4] transition-colors">
                  🎙️ Simulate IELTS Speaking Part 2
                </button>
                <button className="w-full text-left p-2.5 rounded-xl bg-[#101915] border border-[#25352C] hover:border-[#10B981]/50 text-xs text-[#98A69D] hover:text-[#F3F7F4] transition-colors">
                  📊 Summarize Weekly Velocity
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
