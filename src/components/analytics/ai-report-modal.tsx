"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  X,
  Copy,
  Check,
  FileText,
  Brain,
  GraduationCap,
  Flame,
  Code2,
  Wallet,
  ArrowRight,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import {
  AnalyticsTimePeriod,
  AiGeneratedReportResult,
} from "@/types";
import { generateAiAnalyticsReportAction } from "@/server/actions/analytics";
import { useTranslation } from "@/stores/language-store";

interface AiReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPeriod: AnalyticsTimePeriod;
}

export function AiReportModal({
  isOpen,
  onClose,
  currentPeriod,
}: AiReportModalProps) {
  const { dict, isUz } = useTranslation();
  const [selectedType, setSelectedType] = useState<string>("EXECUTIVE_SYNTHESIS");
  const [period, setPeriod] = useState<AnalyticsTimePeriod>(currentPeriod);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AiGeneratedReportResult | null>(null);
  const [copied, setCopied] = useState(false);

  const reportTypes = [
    { id: "EXECUTIVE_SYNTHESIS", label: isUz ? "Ijroiya Xulosasi" : "Executive Synthesis", icon: Sparkles },
    { id: "STUDY_PERFORMANCE", label: isUz ? "O‘qish va IELTS 8.5" : "Study & IELTS 8.5", icon: GraduationCap },
    { id: "HABIT_CONSISTENCY", label: isUz ? "Odatlar va Intizom" : "Habit & Discipline", icon: Flame },
    { id: "PROJECT_PROGRESS", label: isUz ? "Dasturchi Loyihalari" : "Developer Ventures", icon: Code2 },
    { id: "FINANCIAL_TREASURY", label: isUz ? "Moliya va Jamg‘arma" : "Treasury & Runway", icon: Wallet },
  ];

  const getPeriodLabel = (p: AnalyticsTimePeriod) => {
    if (!isUz) return p;
    switch (p) {
      case "DAILY":
        return "KUNLIK";
      case "WEEKLY":
        return "HAFTALIK";
      case "MONTHLY":
        return "OYLIK";
      case "YEARLY":
        return "YILLIK";
      default:
        return p;
    }
  };

  useEffect(() => {
    if (isOpen) {
      setPeriod(currentPeriod);
      handleGenerate(selectedType, currentPeriod);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentPeriod]);

  const handleGenerate = async (type: string, p: AnalyticsTimePeriod) => {
    setLoading(true);
    try {
      const res = await generateAiAnalyticsReportAction(p, type);
      setReport(res);
    } catch (err) {
      console.error("AI report generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!report) return;
    const fullText = `# ${report.title}
${isUz ? "Yaratilgan sana" : "Generated"}: ${report.generatedAt}

## ${isUz ? "Ijroiya Xulosasi" : "Executive Summary"}
${report.executiveSummary}

## ${isUz ? "Asosiy Topilmalar" : "Key Findings"}
${report.keyFindings.map((f) => `- ${f}`).join("\n")}

## ${isUz ? "Tizim Kuchli Tomonlari" : "Strengths"}
${report.strengths.map((s) => `+ ${s}`).join("\n")}

## ${isUz ? "To‘siqlar va Oqsoqliklar" : "Bottlenecks & Friction Points"}
${report.bottlenecks.map((b) => `! ${b}`).join("\n")}

## ${isUz ? "Amaliy Tavsiyalar" : "Actionable Recommendations"}
${report.actionableRecommendations.map((r, i) => `${i + 1}. ${r}`).join("\n")}
`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl bg-[#101915] border border-[#25352C] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#25352C] bg-[#080D0B] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F3F7F4] flex items-center gap-2">
                {isUz ? "AI Shaxsiy Tahliliy Hisobot" : "AI Sovereign Analytical Report"}
                <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                  {isUz ? "HAQIQIY MA'LUMOTLAR" : "VERIFIED DATA"}
                </span>
              </h3>
              <p className="text-[11px] text-[#98A69D]">
                {isUz
                  ? "Mahalliy xotira va diqqat markazidan olingan telemetriya tahlili."
                  : "Synthesizing telemetry records from local storage and Sovereign Focus Kernel."}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#142019] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filters & Mode Selection */}
        <div className="p-3 border-b border-[#25352C] bg-[#101915] flex flex-wrap items-center justify-between gap-2">
          {/* Report types */}
          <div className="flex flex-wrap gap-1.5">
            {reportTypes.map((rt) => {
              const Icon = rt.icon;
              const isSelected = selectedType === rt.id;
              return (
                <button
                  key={rt.id}
                  onClick={() => {
                    setSelectedType(rt.id);
                    handleGenerate(rt.id, period);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#142019] text-[#10B981] font-semibold border border-[#10B981]/40 shadow-sm"
                      : "text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#142019]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{rt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Period selector */}
          <div className="flex items-center gap-1 bg-[#080D0B] p-1 rounded-lg border border-[#25352C] text-[11px] font-mono">
            {(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"] as AnalyticsTimePeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPeriod(p);
                  handleGenerate(selectedType, p);
                }}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  period === p
                    ? "bg-[#10B981] text-[#080D0B] font-bold"
                    : "text-[#98A69D] hover:text-[#F3F7F4]"
                }`}
              >
                {getPeriodLabel(p)}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#10B981]/20 border-t-[#10B981] animate-spin" />
              <p className="text-xs font-mono text-[#10B981]">
                {isUz
                  ? "Tizim telemetriyasi va ko‘rsatkichlari tahlil qilinmoqda..."
                  : "Synthesizing cross-subsystem telemetry & invariants..."}
              </p>
            </div>
          ) : report ? (
            <div className="space-y-4">
              {/* Title & Metadata */}
              <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
                <div>
                  <h4 className="text-base font-bold text-[#F3F7F4]">
                    {report.title}
                  </h4>
                  <p className="text-xs text-[#98A69D] font-mono">
                    {isUz ? "Davr: " : "Timeframe: "}{getPeriodLabel(period)} &bull; {isUz ? "Yaratildi: " : "Generated: "}{new Date(report.generatedAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#142019] text-[#98A69D] hover:text-[#10B981] border border-[#25352C] hover:border-[#10B981]/30 transition-colors text-xs font-mono cursor-pointer"
                    title={isUz ? "Hisobotni nusxalash" : "Copy Report Markdown"}
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? (isUz ? "Nusxalandi" : "Copied") : (isUz ? "Nusxalash" : "Copy")}</span>
                  </button>

                  <button
                    onClick={() => handleGenerate(selectedType, period)}
                    className="p-1.5 rounded-lg bg-[#142019] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C] transition-colors cursor-pointer"
                    title={isUz ? "Hisobotni qayta yaratish" : "Regenerate Report"}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Executive Summary Card */}
              <div className="glass-card rounded-xl p-4 border border-[#25352C] space-y-2 bg-[#142019]/60">
                <span className="text-[10px] font-mono font-bold text-[#10B981] uppercase tracking-wider">
                  {isUz ? "Ijroiya Xulosasi" : "Executive Summary"}
                </span>
                <p className="text-xs text-[#F3F7F4] leading-relaxed font-sans">
                  {report.executiveSummary}
                </p>
              </div>

              {/* Key Findings */}
              <div className="glass-card rounded-xl p-4 border border-[#25352C] space-y-2.5">
                <span className="text-[10px] font-mono font-bold text-[#98A69D] uppercase tracking-wider">
                  {isUz ? "Asosiy Topilmalar va Ko‘rsatkichlar" : "Empirical Findings & Metrics"}
                </span>
                <ul className="space-y-1.5">
                  {report.keyFindings.map((finding, idx) => (
                    <li key={idx} className="text-xs text-[#F3F7F4] flex items-start gap-2 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-1.5 shrink-0" />
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Strengths & Bottlenecks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="glass-card rounded-xl p-4 border border-[#25352C] space-y-2 bg-[#101915]/50">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#10B981] uppercase">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isUz ? "Tizim Kuchli Tomonlari" : "System Strengths"}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {report.strengths.map((s, idx) => (
                      <li key={idx} className="text-[11px] text-[#F3F7F4] flex items-start gap-2">
                        <span className="text-[#10B981]">&bull;</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottlenecks */}
                <div className="glass-card rounded-xl p-4 border border-[#25352C] space-y-2 bg-[#101915]/50">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 uppercase">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{isUz ? "To‘siqlar va Oqsoqliklar" : "Bottlenecks & Friction"}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {report.bottlenecks.map((b, idx) => (
                      <li key={idx} className="text-[11px] text-[#F3F7F4] flex items-start gap-2">
                        <span className="text-amber-400">&bull;</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div className="glass-card rounded-xl p-4 border border-[#10B981]/30 bg-[#142019] space-y-2.5">
                <span className="text-[10px] font-mono font-bold text-[#10B981] uppercase tracking-wider">
                  {isUz ? "Keyingi Davr Uchun Tavsiya Etilgan Amallar" : "Prioritized Action Items for Next Sprint"}
                </span>
                <div className="space-y-2">
                  {report.actionableRecommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-[#080D0B] border border-[#25352C] flex items-start gap-2.5 text-xs text-[#F3F7F4]"
                    >
                      <span className="w-5 h-5 rounded-md bg-[#10B981]/15 text-[#10B981] font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-[#25352C] bg-[#080D0B] flex items-center justify-between text-[11px] font-mono text-[#98A69D]">
          <span>XASAN OS Neural Telemetry Engine v1.0</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#142019] text-[#F3F7F4] hover:bg-[#25352C] rounded-lg transition-colors text-xs font-medium cursor-pointer"
          >
            {isUz ? "Yopish" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
