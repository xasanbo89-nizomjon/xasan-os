"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  CheckSquare,
  BookOpen,
  Terminal,
  CircleDollarSign,
  ArrowRight,
  Filter,
} from "lucide-react";
import { TaskSummary, ProjectSummary, KnowledgeNoteSummary, TransactionSummary } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";

interface GlobalSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tasks: TaskSummary[];
  projects: ProjectSummary[];
  notes: KnowledgeNoteSummary[];
  transactions: TransactionSummary[];
}

type SearchCategory = "all" | "tasks" | "projects" | "notes" | "transactions";

export function GlobalSearchDialog({
  open,
  onOpenChange,
  tasks,
  projects,
  notes,
  transactions,
}: GlobalSearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SearchCategory>("all");

  const filteredResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return { tasks: [], projects: [], notes: [], transactions: [] };

    const matchedTasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );

    const matchedProjects = projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        p.techStack.some((tech) => tech.toLowerCase().includes(q))
    );

    const matchedNotes = notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q)
    );

    const matchedTransactions = transactions.filter(
      (tx) =>
        tx.title.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q) ||
        tx.account.toLowerCase().includes(q)
    );

    return {
      tasks: matchedTasks,
      projects: matchedProjects,
      notes: matchedNotes,
      transactions: matchedTransactions,
    };
  }, [query, tasks, projects, notes, transactions]);

  if (!open) return null;

  const totalMatches =
    filteredResults.tasks.length +
    filteredResults.projects.length +
    filteredResults.notes.length +
    filteredResults.transactions.length;

  const handleNavigate = (url: string) => {
    onOpenChange(false);
    router.push(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 sm:px-6 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#080D0B]/80 backdrop-blur-md transition-opacity"
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-2xl bg-[#101915] border border-[#25352C] rounded-2xl shadow-2xl overflow-hidden z-10 emerald-glow">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#25352C] gap-3">
          <Search className="w-5 h-5 text-[#10B981] shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search across Tasks, Architecture Notes, Projects, and Transactions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-[#F3F7F4] placeholder-[#98A69D] text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-[#98A69D] hover:text-[#F3F7F4] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 text-[11px] font-mono bg-[#142019] text-[#98A69D] rounded border border-[#25352C]">
            ESC
          </kbd>
        </div>

        {/* Filter Categories */}
        <div className="flex border-b border-[#25352C] bg-[#080D0B]/60 p-2 gap-1.5 overflow-x-auto">
          {(
            [
              { id: "all", label: "All Items" },
              { id: "tasks", label: "Tasks" },
              { id: "projects", label: "Projects" },
              { id: "notes", label: "Notes" },
              { id: "transactions", label: "Finance" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCategory(tab.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                category === tab.id
                  ? "bg-[#142019] text-[#10B981] border border-[#25352C] shadow-sm"
                  : "text-[#98A69D] hover:text-[#F3F7F4]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="max-h-[420px] overflow-y-auto p-3 space-y-3">
          {!query ? (
            <div className="py-12 text-center text-xs text-[#98A69D] space-y-1">
              <Search className="w-8 h-8 text-[#25352C] mx-auto mb-2" />
              <p className="font-semibold text-[#F3F7F4]">Global Executive Search</p>
              <p>Type keywords like &quot;Whisper&quot;, &quot;IELTS&quot;, &quot;GPU&quot;, or &quot;Raft&quot; to inspect records.</p>
            </div>
          ) : totalMatches === 0 ? (
            <div className="py-12 text-center text-xs text-[#98A69D]">
              No matches found for &quot;{query}&quot;.
            </div>
          ) : (
            <>
              {/* Tasks Results */}
              {(category === "all" || category === "tasks") &&
                filteredResults.tasks.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#98A69D] px-2">
                      Tasks ({filteredResults.tasks.length})
                    </div>
                    {filteredResults.tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => handleNavigate("/tasks")}
                        className="p-2.5 rounded-xl bg-[#142019] hover:bg-[#142019]/90 border border-[#25352C] hover:border-[#10B981]/40 flex items-center justify-between cursor-pointer group transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <CheckSquare className="w-4 h-4 text-[#10B981] shrink-0" />
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-[#F3F7F4] group-hover:text-[#10B981] truncate">
                              {task.title}
                            </h4>
                            <span className="text-[10px] text-[#98A69D]">
                              Priority: {task.priority} • {task.status}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#25352C] group-hover:text-[#10B981] shrink-0" />
                      </div>
                    ))}
                  </div>
                )}

              {/* Projects Results */}
              {(category === "all" || category === "projects") &&
                filteredResults.projects.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#98A69D] px-2">
                      Projects ({filteredResults.projects.length})
                    </div>
                    {filteredResults.projects.map((proj) => (
                      <div
                        key={proj.id}
                        onClick={() => handleNavigate("/developer-hub")}
                        className="p-2.5 rounded-xl bg-[#142019] hover:bg-[#142019]/90 border border-[#25352C] hover:border-[#10B981]/40 flex items-center justify-between cursor-pointer group transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Terminal className="w-4 h-4 text-[#3B82F6] shrink-0" />
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-[#F3F7F4] group-hover:text-[#10B981] truncate">
                              {proj.name}
                            </h4>
                            <span className="text-[10px] text-[#98A69D]">
                              Progress: {proj.progress}% • {proj.techStack.slice(0, 3).join(", ")}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#25352C] group-hover:text-[#10B981] shrink-0" />
                      </div>
                    ))}
                  </div>
                )}

              {/* Knowledge Notes Results */}
              {(category === "all" || category === "notes") &&
                filteredResults.notes.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#98A69D] px-2">
                      Knowledge Notes ({filteredResults.notes.length})
                    </div>
                    {filteredResults.notes.map((note) => (
                      <div
                        key={note.id}
                        onClick={() => handleNavigate("/knowledge-base")}
                        className="p-2.5 rounded-xl bg-[#142019] hover:bg-[#142019]/90 border border-[#25352C] hover:border-[#10B981]/40 flex items-center justify-between cursor-pointer group transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <BookOpen className="w-4 h-4 text-[#10B981] shrink-0" />
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-[#F3F7F4] group-hover:text-[#10B981] truncate">
                              {note.title}
                            </h4>
                            <span className="text-[10px] text-[#98A69D]">
                              Category: {note.category}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#25352C] group-hover:text-[#10B981] shrink-0" />
                      </div>
                    ))}
                  </div>
                )}

              {/* Transactions Results */}
              {(category === "all" || category === "transactions") &&
                filteredResults.transactions.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#98A69D] px-2">
                      Finance ({filteredResults.transactions.length})
                    </div>
                    {filteredResults.transactions.map((tx) => (
                      <div
                        key={tx.id}
                        onClick={() => handleNavigate("/finance")}
                        className="p-2.5 rounded-xl bg-[#142019] hover:bg-[#142019]/90 border border-[#25352C] hover:border-[#10B981]/40 flex items-center justify-between cursor-pointer group transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <CircleDollarSign className="w-4 h-4 text-[#10B981] shrink-0" />
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-[#F3F7F4] group-hover:text-[#10B981] truncate">
                              {tx.title}
                            </h4>
                            <span className="text-[10px] text-[#98A69D]">
                              {tx.category} • {formatCurrency(tx.amount)}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#25352C] group-hover:text-[#10B981] shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
