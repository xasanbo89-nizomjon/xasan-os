"use client";

import React, { useState, useMemo } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Calendar,
  CreditCard,
  Tag,
  X,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react";
import { TransactionSummary, TransactionType } from "@/types";
import { useFinanceStore } from "@/stores/finance-store";
import { formatCurrency, formatDate } from "@/lib/utils";

interface TransactionManagementProps {
  initialTransactions: TransactionSummary[];
  onTransactionUpdated?: () => void;
}

const CATEGORIES = [
  "Food",
  "Transport",
  "Education",
  "Technology",
  "Entertainment",
  "Shopping",
  "Health",
  "Other",
];

const PAYMENT_METHODS = [
  "Uzcard / Humo",
  "Visa / Mastercard",
  "Bank Wire",
  "Cash",
  "Crypto",
];

export function TransactionManagement({
  initialTransactions,
  onTransactionUpdated,
}: TransactionManagementProps) {
  const storeTransactions = useFinanceStore((s) => s.transactions);
  const addTransaction = useFinanceStore((s) => s.addTransaction);
  const updateTransaction = useFinanceStore((s) => s.updateTransaction);
  const deleteTransaction = useFinanceStore((s) => s.deleteTransaction);
  const isHydrated = useFinanceStore((s) => s.isHydrated);

  const transactions = isHydrated ? storeTransactions : initialTransactions;
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionSummary | null>(null);

  // Form State
  interface TransactionFormData {
    title: string;
    amount: string;
    type: TransactionType;
    category: string;
    account: string;
    currency: string;
    paymentMethod: string;
    date: string;
    notes: string;
    tags: string;
  }

  const [formData, setFormData] = useState<TransactionFormData>({
    title: "",
    amount: "",
    type: TransactionType.EXPENSE,
    category: "Technology",
    account: "Main Checking",
    currency: "USD",
    paymentMethod: "Visa / Mastercard",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    tags: "",
  });

  // Filtered
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (typeFilter !== "ALL" && t.type !== typeFilter) return false;
      if (categoryFilter !== "ALL" && t.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.account.toLowerCase().includes(q) ||
          t.notes?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [transactions, typeFilter, categoryFilter, searchQuery]);

  const handleOpenCreate = () => {
    setEditingTransaction(null);
    setFormData({
      title: "",
      amount: "",
      type: TransactionType.EXPENSE,
      category: "Food",
      account: "Personal Card",
      currency: "USD",
      paymentMethod: "Uzcard / Humo",
      date: new Date().toISOString().split("T")[0],
      notes: "",
      tags: "Daily",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tx: TransactionSummary) => {
    setEditingTransaction(tx);
    setFormData({
      title: tx.title,
      amount: String(tx.amount),
      type: tx.type,
      category: tx.category,
      account: tx.account,
      currency: tx.currency || "USD",
      paymentMethod: tx.paymentMethod || "Visa / Mastercard",
      date: new Date(tx.date).toISOString().split("T")[0],
      notes: tx.notes || "",
      tags: tx.tags.join(", "),
    });
    setIsModalOpen(true);
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.amount) return;

    const tagsArray = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, {
        title: formData.title,
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: formData.category,
        account: formData.account,
        currency: formData.currency,
        paymentMethod: formData.paymentMethod,
        date: new Date(formData.date).toISOString(),
        notes: formData.notes,
        tags: tagsArray,
      });
    } else {
      addTransaction({
        title: formData.title,
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: formData.category,
        account: formData.account,
        date: new Date(formData.date).toISOString(),
        notes: formData.notes,
        tags: tagsArray,
      });
    }

    setIsModalOpen(false);
    setEditingTransaction(null);
    onTransactionUpdated?.();
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this financial record permanently?")) {
      deleteTransaction(id);
      if (editingTransaction?.id === id) {
        setIsModalOpen(false);
        setEditingTransaction(null);
      }
      onTransactionUpdated?.();
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="glass-card rounded-2xl p-4 border border-[#25352C] flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#98A69D]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, notes, account..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#101915] border border-[#25352C] text-xs text-[#F3F7F4] placeholder-[#98A69D] focus:outline-none focus:border-[#10B981]"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Type Filter */}
          <div className="flex items-center bg-[#101915] border border-[#25352C] rounded-xl p-1 text-xs">
            {["ALL", "INCOME", "EXPENSE", "TRANSFER"].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 rounded-lg text-[11px] font-mono transition-all ${
                  typeFilter === t
                    ? "bg-[#142019] text-[#10B981] font-semibold border border-[#25352C]"
                    : "text-[#98A69D] hover:text-[#F3F7F4]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#101915] border border-[#25352C] text-xs font-semibold text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
          >
            <option value="ALL">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Add Transaction Button */}
        <button
          onClick={handleOpenCreate}
          className="w-full md:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] hover:bg-[#059669] transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-lg shadow-[#10B981]/20 font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Transactions Table */}
      <div className="glass-card rounded-2xl border border-[#25352C] overflow-hidden">
        <div className="p-4 border-b border-[#25352C] bg-[#101915] flex items-center justify-between">
          <span className="text-xs font-mono font-semibold text-[#F3F7F4] uppercase">
            Recorded Ledger Transactions ({filteredTransactions.length})
          </span>
          <span className="text-[11px] font-mono text-[#98A69D]">
            Strict user-verified double-entry records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#25352C] bg-[#142019]/60 text-[#98A69D] font-mono text-[11px]">
                <th className="py-3 px-4">Transaction Details</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Account / Method</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#25352C]">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#101915]/50 transition-colors group">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
                          tx.type === "INCOME"
                            ? "bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]"
                            : tx.type === "EXPENSE"
                            ? "bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]"
                            : "bg-blue-500/10 border-blue-500/30 text-blue-400"
                        }`}
                      >
                        {tx.type === "INCOME" ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : tx.type === "EXPENSE" ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <RefreshCw className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-[#F3F7F4] group-hover:text-[#10B981] transition-colors">
                          {tx.title}
                        </div>
                        {tx.notes && (
                          <div className="text-[11px] text-[#98A69D] truncate max-w-xs mt-0.5">
                            {tx.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.type === "INCOME"
                          ? "bg-emerald-500/15 text-[#10B981] border border-emerald-500/30"
                          : tx.type === "EXPENSE"
                          ? "bg-red-500/15 text-[#EF4444] border border-red-500/30"
                          : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-[#101915] border border-[#25352C] text-[#F3F7F4]">
                      {tx.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-[#98A69D] font-mono text-[11px]">
                    <div>{tx.account}</div>
                    <div className="text-[10px] text-[#98A69D]/70">{tx.paymentMethod || "Card"}</div>
                  </td>

                  <td className="py-3.5 px-4 text-[#98A69D] font-mono text-[11px]">
                    {formatDate(tx.date)}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`text-sm font-bold font-mono ${
                        tx.type === "INCOME"
                          ? "text-[#10B981]"
                          : tx.type === "EXPENSE"
                          ? "text-[#EF4444]"
                          : "text-blue-400"
                      }`}
                    >
                      {tx.type === "INCOME" ? "+" : tx.type === "EXPENSE" ? "-" : ""}
                      {formatCurrency(tx.amount)}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(tx)}
                        className="p-1.5 rounded-lg bg-[#101915] border border-[#25352C] text-[#98A69D] hover:text-[#10B981] transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="p-1.5 rounded-lg bg-[#101915] border border-[#25352C] text-[#98A69D] hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="p-8 text-center text-xs text-[#98A69D] space-y-2">
            <DollarSign className="w-8 h-8 mx-auto text-[#98A69D]" />
            <p className="font-semibold text-[#F3F7F4]">No transactions match criteria</p>
            <p>Try resetting filters or click &quot;Add Transaction&quot; to log a record.</p>
          </div>
        )}
      </div>

      {/* Create / Edit Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card rounded-2xl border border-[#25352C] p-6 max-w-lg w-full bg-[#101915] space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#10B981]" />
                <h3 className="text-sm font-semibold text-[#F3F7F4]">
                  {editingTransaction ? "Edit Transaction Record" : "Log New Transaction"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[#98A69D] hover:text-[#F3F7F4]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                    Transaction Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as TransactionType })}
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                  >
                    <option value={TransactionType.EXPENSE}>Expense (-)</option>
                    <option value={TransactionType.INCOME}>Income (+)</option>
                    <option value={TransactionType.TRANSFER}>Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                    Amount (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="150.00"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  Title / Vendor / Source *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. AWS Cloud GPU Compute, Client Architecture Fee"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                    Payment Method
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                  >
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                    Account / Ledger Name
                  </label>
                  <input
                    type="text"
                    value={formData.account}
                    onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                    placeholder="e.g. Main Checking, Corporate Card"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                    Transaction Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  Notes & Details (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Invoice number, tax receipt notes, client project ID..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#25352C]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#98A69D] hover:text-[#F3F7F4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] hover:bg-[#059669] transition-all font-bold"
                >
                  {editingTransaction ? "Update Record" : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
