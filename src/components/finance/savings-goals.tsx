"use client";

import React, { useState } from "react";
import {
  PiggyBank,
  Plus,
  Target,
  CheckCircle2,
  Calendar,
  Clock,
  Laptop,
  Car,
  ShieldCheck,
  TrendingUp,
  X,
  History,
  Trash2,
  Sparkles,
} from "lucide-react";
import { SavingsGoalSummary } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useFinanceStore } from "@/stores/finance-store";
import { useTranslation } from "@/stores/language-store";

interface SavingsGoalsProps {
  initialGoals: SavingsGoalSummary[];
  onGoalUpdated?: () => void;
}

export function SavingsGoals({ initialGoals, onGoalUpdated }: SavingsGoalsProps) {
  const { isUz } = useTranslation();
  const storeGoals = useFinanceStore((s) => s.savingsGoals);
  const addSavingsGoal = useFinanceStore((s) => s.addSavingsGoal);
  const contributeToGoal = useFinanceStore((s) => s.contributeToGoal);
  const deleteSavingsGoal = useFinanceStore((s) => s.deleteSavingsGoal);
  const isHydrated = useFinanceStore((s) => s.isHydrated);

  const goals = isHydrated ? storeGoals : initialGoals;

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoalSummary | null>(null);

  // Create Form
  const [createForm, setCreateForm] = useState({
    name: "",
    targetAmount: "",
    category: "Hardware",
    targetDate: "",
    color: "#10B981",
  });

  // Deposit Form
  const [depositAmount, setDepositAmount] = useState("");
  const [depositNote, setDepositNote] = useState("");

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name.trim() || !createForm.targetAmount) return;

    const target = parseFloat(createForm.targetAmount);
    addSavingsGoal({
      name: createForm.name,
      targetAmount: target,
      category: createForm.category,
      targetDate: createForm.targetDate || undefined,
      color: createForm.color,
    });

    setIsCreateModalOpen(false);
    setCreateForm({
      name: "",
      targetAmount: "",
      category: "Hardware",
      targetDate: "",
      color: "#10B981",
    });
    onGoalUpdated?.();
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal || !depositAmount || parseFloat(depositAmount) <= 0) return;

    const amt = parseFloat(depositAmount);
    contributeToGoal(selectedGoal.id, amt);

    setIsDepositModalOpen(false);
    setDepositAmount("");
    setDepositNote("");
    onGoalUpdated?.();
  };

  const handleDelete = (id: string) => {
    const confirmMsg = isUz ? "Ushbu jamg‘arma maqsadini o‘chirmoqchimisiz?" : "Delete this savings goal?";
    if (confirm(confirmMsg)) {
      deleteSavingsGoal(id);
      onGoalUpdated?.();
    }
  };

  const renderGoalIcon = (name: string, color: string = "#10B981") => {
    const n = name.toLowerCase();
    if (n.includes("macbook") || n.includes("laptop") || n.includes("hardware"))
      return <Laptop className="w-5 h-5" style={{ color }} />;
    if (n.includes("car") || n.includes("gentra") || n.includes("turbo"))
      return <Car className="w-5 h-5" style={{ color }} />;
    if (n.includes("emergency") || n.includes("reserve") || n.includes("security"))
      return <ShieldCheck className="w-5 h-5" style={{ color }} />;
    return <PiggyBank className="w-5 h-5" style={{ color }} />;
  };

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const overallProgress = totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-card rounded-3xl p-6 border border-[#25352C] bg-gradient-to-b from-[#142019] to-[#101915] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#98A69D]">
              {isUz ? "INTIZOMLI KAPITAL YIG‘ISH" : "DISCIPLINED CAPITAL ACCUMULATION"}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-[#10B981] border border-emerald-500/30">
              {goals.length} {isUz ? "TA FAOL MAQSAD" : "ACTIVE TARGETS"}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-[#F3F7F4]">
            {isUz ? "Strategik Jamg‘arma va Zaxira Mablag‘lari" : "Strategic Savings & Capital Reserves"}
          </h3>
          <p className="text-xs text-[#98A69D] max-w-lg leading-relaxed">
            {isUz
              ? "Qurilmalar, favqulodda xavfsizlik yostig‘i va shaxsiy loyihalar uchun maqsadli jamg‘armani kuzatib boring."
              : "Track earmarked capital allocations for workstation hardware, venture emergency buffers, and automotive tuning builds."}
          </p>
        </div>

        <div className="w-full md:w-80 space-y-3 bg-[#080D0B]/80 p-5 rounded-2xl border border-[#25352C]">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#98A69D]">{isUz ? "Jami to‘plangan" : "Total Accumulated"}</span>
            <span className="font-bold text-[#10B981]">{formatCurrency(totalSaved)}</span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#98A69D]">{isUz ? "Umumiy rejalashtirilgan maqsad" : "Total Objective Target"}</span>
            <span className="font-bold text-[#F3F7F4]">{formatCurrency(totalTarget)}</span>
          </div>

          <div className="w-full h-2.5 bg-[#101915] rounded-full overflow-hidden border border-[#25352C]">
            <div
              className="h-full bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, parseFloat(overallProgress))}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-[#98A69D]">
            <span>{overallProgress}% {isUz ? "bajarildi" : "of Target"}</span>
            <span>
              {formatCurrency(Math.max(0, totalTarget - totalSaved))} {isUz ? "qoldi" : "remaining"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Header */}
      <div className="glass-card rounded-2xl p-4 border border-[#25352C] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-[#10B981]" />
          <h4 className="text-xs font-mono font-semibold text-[#F3F7F4] uppercase">
            {isUz ? "Faol Jamg‘arma Portfellari" : "Active Savings Portfolios"}
          </h4>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] hover:bg-[#059669] transition-all flex items-center gap-1.5 shadow-md shadow-[#10B981]/20 font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>{isUz ? "Yangi maqsad qo‘yish" : "New Savings Goal"}</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {goals.map((g) => {
          const daysRemaining = g.targetDate
            ? Math.ceil((new Date(g.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            : null;

          return (
            <div
              key={g.id}
              className="glass-card rounded-3xl p-6 border border-[#25352C] hover:border-[#10B981]/40 transition-all flex flex-col justify-between space-y-4 group bg-gradient-to-b from-[#142019] to-[#101915]"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#080D0B] border border-[#25352C] flex items-center justify-center shadow-inner group-hover:border-[#10B981]/50 transition-colors">
                    {renderGoalIcon(g.name, g.color || "#10B981")}
                  </div>

                  <div className="flex items-center gap-2">
                    {g.isCompleted ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-[#10B981] border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{isUz ? "ERISHILDI" : "ACHIEVED"}</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#101915] border border-[#25352C] text-[#98A69D]">
                        {g.category}
                      </span>
                    )}

                    <button
                      onClick={() => handleDelete(g.id)}
                      className="p-1 rounded text-[#98A69D] hover:text-red-400 transition-colors"
                      title={isUz ? "Maqsadni o‘chirish" : "Delete goal"}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-[#F3F7F4] group-hover:text-[#10B981] transition-colors mb-2">
                  {g.name}
                </h4>

                {/* Numbers */}
                <div className="space-y-1 mb-3">
                  <div className="flex items-center justify-between text-xs font-mono text-[#98A69D]">
                    <span>{isUz ? "To‘plandi: " : "Saved: "}<strong className="text-[#10B981]">{formatCurrency(g.currentAmount)}</strong></span>
                    <span>{isUz ? "Maqsad: " : "Target: "}<strong className="text-[#F3F7F4]">{formatCurrency(g.targetAmount)}</strong></span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-[#101915] rounded-full overflow-hidden border border-[#25352C]">
                  <div
                    className="h-full bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, g.progressPercentage)}%` }}
                  />
                </div>
              </div>

              {/* Footer and Contribution CTA */}
              <div className="space-y-3 pt-3 border-t border-[#25352C]">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#98A69D]">
                  <span>{g.progressPercentage}% {isUz ? "Bajarildi" : "Completed"}</span>
                  {daysRemaining !== null && (
                    <span className={daysRemaining < 0 ? "text-amber-400" : "text-[#98A69D]"}>
                      {daysRemaining < 0
                        ? (isUz ? "Marra sanasi yetdi" : "Target reached date")
                        : (isUz ? `${daysRemaining} kun qoldi` : `${daysRemaining}d target`)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedGoal(g);
                      setIsDepositModalOpen(true);
                    }}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold bg-[#101915] border border-[#25352C] hover:border-[#10B981] text-[#F3F7F4] transition-all flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>{isUz ? "Mablag‘ qo‘shish" : "Deposit Funds"}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Goal Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card rounded-2xl border border-[#25352C] p-6 max-w-md w-full bg-[#101915] space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#10B981]" />
                <h3 className="text-sm font-semibold text-[#F3F7F4]">
                  {isUz ? "Yangi Jamg‘arma Maqsadi" : "New Savings Objective"}
                </h3>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-[#98A69D] hover:text-[#F3F7F4]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  {isUz ? "Maqsad nomi *" : "Goal Name *"}
                </label>
                <input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder={isUz ? "Masalan: MacBook Pro M3 Max" : "e.g. M3 Max MacBook Pro"}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                    {isUz ? "Maqsad summa ($) *" : "Target Amount (USD) *"}
                  </label>
                  <input
                    type="number"
                    step="10"
                    min="1"
                    required
                    value={createForm.targetAmount}
                    onChange={(e) => setCreateForm({ ...createForm, targetAmount: e.target.value })}
                    placeholder="3500"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                    {isUz ? "Kategoriya" : "Category"}
                  </label>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                  >
                    <option value="Hardware">{isUz ? "Qurilma va jihozlar" : "Hardware / Gear"}</option>
                    <option value="Security">{isUz ? "Xavfsizlik yostig‘i" : "Security / Emergency"}</option>
                    <option value="Automotive">{isUz ? "Avtomobil" : "Automotive"}</option>
                    <option value="Travel">{isUz ? "Sayohat va Ziyorat" : "Travel / Pilgrimage"}</option>
                    <option value="Education">{isUz ? "Ta’lim" : "Education"}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  {isUz ? "Erishish sanasi" : "Target Completion Date"}
                </label>
                <input
                  type="date"
                  value={createForm.targetDate}
                  onChange={(e) => setCreateForm({ ...createForm, targetDate: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#25352C]">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="text-xs text-[#98A69D]">
                  {isUz ? "Bekor qilish" : "Cancel"}
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] font-bold">
                  {isUz ? "Maqsadni yaratish" : "Create Savings Goal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deposit Funds Modal */}
      {isDepositModalOpen && selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card rounded-2xl border border-[#25352C] p-6 max-w-md w-full bg-[#101915] space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
              <div className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-[#10B981]" />
                <h3 className="text-sm font-semibold text-[#F3F7F4]">
                  {isUz ? `${selectedGoal.name} maqsadiga mablag‘ kiritish` : `Deposit to ${selectedGoal.name}`}
                </h3>
              </div>
              <button onClick={() => setIsDepositModalOpen(false)} className="text-[#98A69D] hover:text-[#F3F7F4]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDeposit} className="space-y-3.5">
              <div className="p-3.5 rounded-xl bg-[#080D0B] border border-[#25352C] space-y-1 text-xs font-mono">
                <div className="text-[#98A69D]">
                  {isUz ? "JORIY MABLAG‘: " : "CURRENT BALANCE: "}{formatCurrency(selectedGoal.currentAmount)}
                </div>
                <div className="text-[#10B981]">
                  {isUz ? "MAQSAD SUMMA: " : "TARGET CEILING: "}{formatCurrency(selectedGoal.targetAmount)}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  {isUz ? "Kiritilayotgan summa ($) *" : "Deposit Amount (USD) *"}
                </label>
                <input
                  type="number"
                  step="10"
                  min="1"
                  required
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="500"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  {isUz ? "Izoh (ixtiyoriy)" : "Contribution Note"}
                </label>
                <input
                  type="text"
                  value={depositNote}
                  onChange={(e) => setDepositNote(e.target.value)}
                  placeholder={isUz ? "Masalan: Noyabr oyi konsalting daromadidan" : "e.g. November consulting milestone allocation"}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#25352C]">
                <button type="button" onClick={() => setIsDepositModalOpen(false)} className="text-xs text-[#98A69D]">
                  {isUz ? "Bekor qilish" : "Cancel"}
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] font-bold">
                  {isUz ? "Mablag‘ni kiritish" : "Confirm Deposit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
