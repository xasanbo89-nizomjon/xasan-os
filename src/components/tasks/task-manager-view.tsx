"use client";

import React, { useState, useMemo } from "react";
import { TaskStatus, Priority, TaskSummary, ProjectSummary } from "@/types";
import {
  CheckSquare,
  Search,
  Filter,
  Plus,
  LayoutGrid,
  Columns3,
  Calendar as CalendarIcon,
  List,
  Sun,
  Clock,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Layers,
} from "lucide-react";
import { TaskListView } from "./task-list-view";
import { TaskKanbanView } from "./task-kanban-view";
import { TaskCalendarView } from "./task-calendar-view";
import { TaskDetailDrawer } from "./task-detail-drawer";
import { CreateTaskModal } from "./create-task-modal";
import { BulkActionsBar } from "./bulk-actions-bar";
import {
  createTaskAction,
  updateTaskAction,
  deleteTaskAction,
  toggleTaskStatusAction,
  bulkUpdateTasksStatusAction,
  bulkDeleteTasksAction,
  createSubtaskAction,
  toggleSubtaskAction,
  deleteSubtaskAction,
} from "@/server/actions/tasks";
import { useDashboardStore } from "@/stores/dashboard-store";

export type TaskTabMode =
  | "all"
  | "my-day"
  | "upcoming"
  | "overdue"
  | "completed"
  | "kanban"
  | "calendar"
  | "list";

interface TaskManagerViewProps {
  initialTasks: TaskSummary[];
  projects: ProjectSummary[];
}

export function TaskManagerView({ initialTasks, projects }: TaskManagerViewProps) {
  const [tasks, setTasks] = useState<TaskSummary[]>(initialTasks);
  const [activeTab, setActiveTab] = useState<TaskTabMode>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedPriority, setSelectedPriority] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  // Drawer & modal states
  const [activeTaskForDrawer, setActiveTaskForDrawer] = useState<TaskSummary | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  const { startFocusSession } = useDashboardStore();

  // Metrics counts
  const todayStr = new Date().toISOString().slice(0, 10);
  const now = Date.now();

  const tabCounts = useMemo(() => {
    const myDay = tasks.filter((t) => {
      if (t.status === TaskStatus.COMPLETED) return false;
      if (t.dueDate && new Date(t.dueDate).toISOString().slice(0, 10) === todayStr) return true;
      if (t.priority === Priority.URGENT) return true;
      return false;
    }).length;

    const upcoming = tasks.filter((t) => {
      if (t.status === TaskStatus.COMPLETED) return false;
      if (!t.dueDate) return false;
      return new Date(t.dueDate).getTime() > now;
    }).length;

    const overdue = tasks.filter((t) => {
      if (t.status === TaskStatus.COMPLETED) return false;
      if (!t.dueDate) return false;
      return new Date(t.dueDate).getTime() < now;
    }).length;

    const completed = tasks.filter((t) => t.status === TaskStatus.COMPLETED).length;

    return {
      all: tasks.length,
      myDay,
      upcoming,
      overdue,
      completed,
    };
  }, [tasks, todayStr, now]);

  // Filtered tasks based on activeTab, category, priority, and search
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 1. Tab filter
      if (activeTab === "my-day") {
        const isToday = task.dueDate && new Date(task.dueDate).toISOString().slice(0, 10) === todayStr;
        const isUrgent = task.priority === Priority.URGENT;
        if (task.status === TaskStatus.COMPLETED || (!isToday && !isUrgent)) return false;
      } else if (activeTab === "upcoming") {
        if (task.status === TaskStatus.COMPLETED || !task.dueDate) return false;
        if (new Date(task.dueDate).getTime() <= now) return false;
      } else if (activeTab === "overdue") {
        if (task.status === TaskStatus.COMPLETED || !task.dueDate) return false;
        if (new Date(task.dueDate).getTime() >= now) return false;
      } else if (activeTab === "completed") {
        if (task.status !== TaskStatus.COMPLETED) return false;
      }

      // 2. Category filter
      if (selectedCategory !== "ALL") {
        if (task.category?.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }

      // 3. Priority filter
      if (selectedPriority !== "ALL") {
        if (task.priority !== selectedPriority) return false;
      }

      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(q);
        const matchDesc = task.description?.toLowerCase().includes(q);
        const matchTags = task.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchTags) return false;
      }

      return true;
    });
  }, [tasks, activeTab, selectedCategory, selectedPriority, searchQuery, todayStr, now]);

  // Handlers
  const handleSelectTask = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedTaskIds((prev) => [...prev, id]);
    } else {
      setSelectedTaskIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleClearSelection = () => {
    setSelectedTaskIds([]);
  };

  const handleToggleTaskStatus = async (task: TaskSummary) => {
    const nextStatus =
      task.status === TaskStatus.COMPLETED
        ? TaskStatus.PENDING
        : task.status === TaskStatus.PENDING
        ? TaskStatus.IN_PROGRESS
        : TaskStatus.COMPLETED;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t))
    );

    if (activeTaskForDrawer?.id === task.id) {
      setActiveTaskForDrawer((prev) => (prev ? { ...prev, status: nextStatus } : null));
    }

    await toggleTaskStatusAction(task.id, task.status);
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    await updateTaskAction(taskId, { status: newStatus });
  };

  const handleOpenTaskDetail = (task: TaskSummary) => {
    setActiveTaskForDrawer(task);
    setIsDrawerOpen(true);
  };

  const handleUpdateTask = async (taskId: string, updates: any) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    );
    await updateTaskAction(taskId, updates);
  };

  const handleDeleteTask = async (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setSelectedTaskIds((prev) => prev.filter((id) => id !== taskId));
    await deleteTaskAction(taskId);
  };

  const handleCreateTask = async (data: any) => {
    const res = await createTaskAction(data);
    if (res.success && res.task) {
      const createdTask: TaskSummary = {
        ...res.task,
        subtasks: res.task.subtasks || [],
        tags: res.task.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTasks((prev) => [createdTask, ...prev]);
    }
  };

  const handleBulkStatusUpdate = async (status: TaskStatus) => {
    setIsProcessingBulk(true);
    try {
      setTasks((prev) =>
        prev.map((t) =>
          selectedTaskIds.includes(t.id) ? { ...t, status } : t
        )
      );
      await bulkUpdateTasksStatusAction(selectedTaskIds, status);
      setSelectedTaskIds([]);
    } finally {
      setIsProcessingBulk(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedTaskIds.length} selected tasks?`)) return;
    setIsProcessingBulk(true);
    try {
      setTasks((prev) => prev.filter((t) => !selectedTaskIds.includes(t.id)));
      await bulkDeleteTasksAction(selectedTaskIds);
      setSelectedTaskIds([]);
    } finally {
      setIsProcessingBulk(false);
    }
  };

  const handleCreateSubtask = async (taskId: string, title: string) => {
    const res = await createSubtaskAction(taskId, title);
    if (res.success && res.subtask) {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t;
          return {
            ...t,
            subtasks: [...(t.subtasks || []), res.subtask],
          };
        })
      );
      if (activeTaskForDrawer?.id === taskId) {
        setActiveTaskForDrawer((prev) =>
          prev
            ? { ...prev, subtasks: [...(prev.subtasks || []), res.subtask] }
            : null
        );
      }
    }
  };

  const handleToggleSubtask = async (subtaskId: string, completed: boolean) => {
    setTasks((prev) =>
      prev.map((t) => ({
        ...t,
        subtasks: t.subtasks?.map((st) =>
          st.id === subtaskId ? { ...st, completed: !completed } : st
        ),
      }))
    );
    if (activeTaskForDrawer) {
      setActiveTaskForDrawer((prev) =>
        prev
          ? {
              ...prev,
              subtasks: prev.subtasks?.map((st) =>
                st.id === subtaskId ? { ...st, completed: !completed } : st
              ),
            }
          : null
      );
    }
    await toggleSubtaskAction(subtaskId, completed);
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => ({
        ...t,
        subtasks: t.subtasks?.filter((st) => st.id !== subtaskId),
      }))
    );
    if (activeTaskForDrawer) {
      setActiveTaskForDrawer((prev) =>
        prev
          ? {
              ...prev,
              subtasks: prev.subtasks?.filter((st) => st.id !== subtaskId),
            }
          : null
      );
    }
    await deleteSubtaskAction(subtaskId);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar & Primary Navigation Tabs */}
      <div className="glass-card rounded-2xl p-3 sm:p-4 border border-[#25352C] bg-[#101915] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "all"
                ? "bg-[#10B981] text-[#080D0B] shadow-md shadow-[#10B981]/20 font-bold"
                : "bg-[#142019] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            All Tasks
            <span className="font-mono text-[10px] opacity-80">({tabCounts.all})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("my-day")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "my-day"
                ? "bg-[#10B981] text-[#080D0B] shadow-md shadow-[#10B981]/20 font-bold"
                : "bg-[#142019] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-[#F59E0B]" />
            My Day
            {tabCounts.myDay > 0 && (
              <span className="font-mono text-[10px] px-1 rounded bg-[#F59E0B]/20 text-[#F59E0B]">
                {tabCounts.myDay}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("upcoming")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "upcoming"
                ? "bg-[#10B981] text-[#080D0B] shadow-md shadow-[#10B981]/20 font-bold"
                : "bg-[#142019] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#3B82F6]" />
            Upcoming
            <span className="font-mono text-[10px] opacity-80">({tabCounts.upcoming})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("overdue")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "overdue"
                ? "bg-[#EF4444] text-[#F3F7F4] shadow-md shadow-[#EF4444]/20 font-bold"
                : "bg-[#142019] text-[#98A69D] hover:text-[#EF4444] border border-[#25352C]"
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-[#EF4444]" />
            Overdue
            {tabCounts.overdue > 0 && (
              <span className="font-mono text-[10px] px-1 rounded bg-[#EF4444]/20 text-[#EF4444]">
                {tabCounts.overdue}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("completed")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "completed"
                ? "bg-[#10B981] text-[#080D0B] shadow-md shadow-[#10B981]/20 font-bold"
                : "bg-[#142019] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
            Completed
            <span className="font-mono text-[10px] opacity-80">({tabCounts.completed})</span>
          </button>
        </div>

        {/* View Switchers (Kanban, Calendar, List) & New Task Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-[#142019] rounded-xl p-1 border border-[#25352C]">
            <button
              type="button"
              onClick={() => setActiveTab("list")}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "list" || activeTab === "all" || activeTab === "my-day" || activeTab === "upcoming" || activeTab === "overdue" || activeTab === "completed"
                  ? "bg-[#101915] text-[#10B981]"
                  : "text-[#98A69D] hover:text-[#F3F7F4]"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("kanban")}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "kanban"
                  ? "bg-[#101915] text-[#10B981]"
                  : "text-[#98A69D] hover:text-[#F3F7F4]"
              }`}
              title="Kanban Board View"
            >
              <Columns3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("calendar")}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "calendar"
                  ? "bg-[#101915] text-[#10B981]"
                  : "text-[#98A69D] hover:text-[#F3F7F4]"
              }`}
              title="Calendar Schedule View"
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] font-bold text-xs transition-colors shadow-lg shadow-[#10B981]/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      {/* Filter Matrix & Search Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#101915] border border-[#25352C]">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-4 h-4 text-[#98A69D] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, descriptions, or tags..."
            className="w-full bg-[#142019] border border-[#25352C] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#F3F7F4] placeholder-[#98A69D] focus:outline-none focus:border-[#10B981]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-mono text-[#98A69D] flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3 text-[#10B981]" /> Domain:
          </span>
          {["ALL", "Dev", "Study", "Work", "Health", "Personal"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                selectedCategory === cat
                  ? "bg-[#142019] text-[#10B981] border border-[#10B981]/40 font-semibold"
                  : "bg-[#142019]/60 text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-mono text-[#98A69D]">Priority:</span>
          {["ALL", "URGENT", "HIGH", "NORMAL", "LOW"].map((pri) => (
            <button
              key={pri}
              type="button"
              onClick={() => setSelectedPriority(pri)}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono transition-colors ${
                selectedPriority === pri
                  ? "bg-[#142019] text-[#10B981] border border-[#10B981]/40 font-bold"
                  : "bg-[#142019]/60 text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
              }`}
            >
              {pri}
            </button>
          ))}
        </div>
      </div>

      {/* Main View Presentation */}
      <div>
        {activeTab === "kanban" ? (
          <TaskKanbanView
            tasks={filteredTasks}
            selectedTaskIds={selectedTaskIds}
            onSelectTask={handleSelectTask}
            onToggleStatus={handleToggleTaskStatus}
            onOpenTaskDetail={handleOpenTaskDetail}
            onOpenCreateTask={() => setIsCreateModalOpen(true)}
            onUpdateTaskStatus={handleUpdateTaskStatus}
          />
        ) : activeTab === "calendar" ? (
          <TaskCalendarView
            tasks={filteredTasks}
            onOpenTaskDetail={handleOpenTaskDetail}
            onOpenCreateTask={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <TaskListView
            tasks={filteredTasks}
            selectedTaskIds={selectedTaskIds}
            onSelectTask={handleSelectTask}
            onToggleStatus={handleToggleTaskStatus}
            onOpenTaskDetail={handleOpenTaskDetail}
            onOpenCreateTask={() => setIsCreateModalOpen(true)}
          />
        )}
      </div>

      {/* Bulk Operations Floating Bar */}
      <BulkActionsBar
        selectedCount={selectedTaskIds.length}
        onClearSelection={handleClearSelection}
        onBulkStatusUpdate={handleBulkStatusUpdate}
        onBulkDelete={handleBulkDelete}
        isProcessing={isProcessingBulk}
      />

      {/* Task Specification / Detail Drawer */}
      <TaskDetailDrawer
        task={activeTaskForDrawer}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setActiveTaskForDrawer(null);
        }}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        onCreateSubtask={handleCreateSubtask}
        onToggleSubtask={handleToggleSubtask}
        onDeleteSubtask={handleDeleteSubtask}
        onStartFocusOnTask={(task) => {
          startFocusSession(task.estimatedMinutes || 25);
        }}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        projects={projects}
        onCreateTask={handleCreateTask}
      />
    </div>
  );
}
