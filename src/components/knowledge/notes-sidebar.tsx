"use client";

import React, { useState } from "react";
import {
  Folder,
  FolderPlus,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Star,
  Pin,
  Archive,
  BookOpen,
  Tag,
  Sparkles,
  Layers,
  FileText,
  Lightbulb,
  BookMarked,
  Code2,
  GraduationCap,
  Compass,
  Microscope,
  Trash2,
  X,
  Plus,
} from "lucide-react";
import { KnowledgeFolderSummary, KnowledgeNoteSummary, NoteContentType } from "@/types";
import { createKnowledgeFolderAction, deleteKnowledgeFolderAction } from "@/server/actions/knowledge";

interface NotesSidebarProps {
  folders: KnowledgeFolderSummary[];
  notes: KnowledgeNoteSummary[];
  activeView: string;
  selectedFolderId: string | null;
  selectedContentType: string;
  selectedTag: string | null;
  onSelectView: (view: "ALL" | "FAVORITES" | "PINNED" | "ARCHIVED") => void;
  onSelectFolder: (folderId: string | null) => void;
  onSelectContentType: (type: string) => void;
  onSelectTag: (tag: string | null) => void;
  onFolderCreated?: (folder: KnowledgeFolderSummary) => void;
}

const CONTENT_TYPES: { id: string; label: string; icon: any }[] = [
  { id: "ALL", label: "All Formats", icon: Layers },
  { id: "NOTE", label: "Quick Notes", icon: FileText },
  { id: "IDEA", label: "Ideas & Concepts", icon: Lightbulb },
  { id: "ARTICLE", label: "Articles", icon: BookOpen },
  { id: "BOOK_SUMMARY", label: "Book Syntheses", icon: BookMarked },
  { id: "PROGRAMMING_DOC", label: "Code & APIs", icon: Code2 },
  { id: "STUDY_NOTE", label: "Study & IELTS", icon: GraduationCap },
  { id: "PERSONAL_JOURNAL", label: "Personal Journal", icon: Compass },
  { id: "RESEARCH", label: "Research Material", icon: Microscope },
];

export function NotesSidebar({
  folders,
  notes,
  activeView,
  selectedFolderId,
  selectedContentType,
  selectedTag,
  onSelectView,
  onSelectFolder,
  onSelectContentType,
  onSelectTag,
  onFolderCreated,
}: NotesSidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "fold-1": true,
  });
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folderParentId, setFolderParentId] = useState<string>("");

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    const res = await createKnowledgeFolderAction({
      name: folderName,
      parentId: folderParentId || undefined,
    });

    if (res.success && res.folder) {
      onFolderCreated?.(res.folder as KnowledgeFolderSummary);
      setFolderName("");
      setFolderParentId("");
      setIsFolderModalOpen(false);
    }
  };

  // Group top-level folders and nested children
  const rootFolders = folders.filter((f) => !f.parentId);
  const getSubfolders = (parentId: string) => folders.filter((f) => f.parentId === parentId);

  // Extract all unique tags
  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags))).slice(0, 16);

  const favoritesCount = notes.filter((n) => n.isFavorite && !n.isArchived).length;
  const pinnedCount = notes.filter((n) => n.isPinned && !n.isArchived).length;
  const archivedCount = notes.filter((n) => n.isArchived).length;
  const totalActiveNotes = notes.filter((n) => !n.isArchived).length;

  return (
    <div className="space-y-6">
      {/* Primary Navigation Views */}
      <div className="space-y-1">
        <button
          onClick={() => {
            onSelectView("ALL");
            onSelectFolder(null);
            onSelectTag(null);
          }}
          className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
            activeView === "ALL" && !selectedFolderId && !selectedTag
              ? "bg-[#10B981] text-[#080D0B] font-bold shadow-md shadow-[#10B981]/20"
              : "text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#101915]"
          }`}
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span>All Knowledge Notes</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/20">
            {totalActiveNotes}
          </span>
        </button>

        <button
          onClick={() => {
            onSelectView("FAVORITES");
            onSelectFolder(null);
            onSelectTag(null);
          }}
          className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
            activeView === "FAVORITES"
              ? "bg-[#10B981] text-[#080D0B] font-bold shadow-md shadow-[#10B981]/20"
              : "text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#101915]"
          }`}
        >
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            <span>Starred Favorites</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/20">
            {favoritesCount}
          </span>
        </button>

        <button
          onClick={() => {
            onSelectView("PINNED");
            onSelectFolder(null);
            onSelectTag(null);
          }}
          className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
            activeView === "PINNED"
              ? "bg-[#10B981] text-[#080D0B] font-bold shadow-md shadow-[#10B981]/20"
              : "text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#101915]"
          }`}
        >
          <div className="flex items-center gap-2">
            <Pin className="w-4 h-4 text-[#10B981]" />
            <span>Pinned Invariants</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/20">
            {pinnedCount}
          </span>
        </button>

        <button
          onClick={() => {
            onSelectView("ARCHIVED");
            onSelectFolder(null);
            onSelectTag(null);
          }}
          className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
            activeView === "ARCHIVED"
              ? "bg-[#10B981] text-[#080D0B] font-bold shadow-md shadow-[#10B981]/20"
              : "text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#101915]"
          }`}
        >
          <div className="flex items-center gap-2">
            <Archive className="w-4 h-4" />
            <span>Archived Notes</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/20">
            {archivedCount}
          </span>
        </button>
      </div>

      {/* Folders & Nested Collections */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-2 text-[11px] font-mono uppercase tracking-wider text-[#98A69D]">
          <span>Notebook Folders</span>
          <button
            onClick={() => setIsFolderModalOpen(true)}
            className="p-1 hover:text-[#10B981] transition-colors"
            title="Create Folder"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-0.5">
          {rootFolders.map((folder) => {
            const subfolders = getSubfolders(folder.id);
            const hasChildren = subfolders.length > 0;
            const isExpanded = !!expandedFolders[folder.id];
            const isSelected = selectedFolderId === folder.id;

            return (
              <div key={folder.id} className="space-y-0.5">
                <div
                  className={`px-3 py-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#101915] text-[#10B981] font-bold border border-[#10B981]/30"
                      : "text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#101915]/60"
                  }`}
                  onClick={() => onSelectFolder(folder.id)}
                >
                  <div className="flex items-center gap-2 truncate">
                    {hasChildren && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFolder(folder.id);
                        }}
                        className="p-0.5 text-[#98A69D] hover:text-[#F3F7F4]"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                    <Folder className="w-3.5 h-3.5 shrink-0" style={{ color: folder.color || "#10B981" }} />
                    <span className="truncate">{folder.name}</span>
                  </div>

                  <span className="text-[10px] font-mono text-[#98A69D]">
                    {notes.filter((n) => n.folderId === folder.id && !n.isArchived).length}
                  </span>
                </div>

                {/* Subfolders */}
                {hasChildren && isExpanded && (
                  <div className="pl-6 space-y-0.5 border-l border-[#25352C] ml-4">
                    {subfolders.map((sub) => {
                      const isSubSelected = selectedFolderId === sub.id;
                      return (
                        <div
                          key={sub.id}
                          className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-all ${
                            isSubSelected
                              ? "bg-[#101915] text-[#10B981] font-bold border border-[#10B981]/30"
                              : "text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#101915]/40"
                          }`}
                          onClick={() => onSelectFolder(sub.id)}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Folder className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span className="truncate">{sub.name}</span>
                          </div>
                          <span className="text-[10px] font-mono text-[#98A69D]">
                            {notes.filter((n) => n.folderId === sub.id && !n.isArchived).length}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Formats */}
      <div className="space-y-2">
        <div className="px-2 text-[11px] font-mono uppercase tracking-wider text-[#98A69D]">
          Content Formats
        </div>
        <div className="space-y-0.5">
          {CONTENT_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedContentType === type.id;
            const count =
              type.id === "ALL"
                ? totalActiveNotes
                : notes.filter((n) => n.contentType === type.id && !n.isArchived).length;

            return (
              <button
                key={type.id}
                onClick={() => onSelectContentType(type.id)}
                className={`w-full px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition-all ${
                  isSelected
                    ? "bg-[#142019] text-[#10B981] font-bold border border-[#25352C]"
                    : "text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#101915]/40"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{type.label}</span>
                </div>
                <span className="text-[10px] font-mono text-[#98A69D]">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tags Cloud */}
      <div className="space-y-2">
        <div className="px-2 text-[11px] font-mono uppercase tracking-wider text-[#98A69D]">
          Semantic Tags
        </div>
        <div className="flex flex-wrap gap-1 px-1">
          {allTags.map((t) => (
            <button
              key={t}
              onClick={() => onSelectTag(selectedTag === t ? null : t)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-all ${
                selectedTag === t
                  ? "bg-[#10B981] text-[#080D0B] font-bold"
                  : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
              }`}
            >
              #{t}
            </button>
          ))}
        </div>
      </div>

      {/* New Folder Modal */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card rounded-2xl border border-[#25352C] p-6 max-w-sm w-full bg-[#101915] space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-[#10B981]" />
                <h3 className="text-sm font-semibold text-[#F3F7F4]">Create Knowledge Folder</h3>
              </div>
              <button onClick={() => setIsFolderModalOpen(false)} className="text-[#98A69D] hover:text-[#F3F7F4]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Folder Name *</label>
                <input
                  type="text"
                  required
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="e.g. System Design, IELTS Speaking"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Parent Folder (Optional)</label>
                <select
                  value={folderParentId}
                  onChange={(e) => setFolderParentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                >
                  <option value="">No Parent (Root Level)</option>
                  {rootFolders.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#25352C]">
                <button type="button" onClick={() => setIsFolderModalOpen(false)} className="text-xs text-[#98A69D]">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] font-bold">
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
