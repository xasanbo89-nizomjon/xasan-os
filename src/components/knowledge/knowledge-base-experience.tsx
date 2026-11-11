"use client";

import React, { useState, useMemo } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Sparkles,
  Pin,
  Star,
  Archive,
  Folder,
  Tag,
  Filter,
  Layers,
  ChevronLeft,
  ChevronRight,
  Brain,
  FileText,
  Clock,
  CheckCircle2,
  ListFilter,
  Flame,
} from "lucide-react";
import {
  KnowledgeFolderSummary,
  KnowledgeNoteSummary,
  NoteContentType,
} from "@/types";
import { NotesSidebar } from "./notes-sidebar";
import { NoteEditor } from "./note-editor";
import { AiKnowledgeCopilot } from "./ai-knowledge-copilot";
import { SemanticSearchModal } from "./semantic-search-modal";
import { useKnowledgeStore } from "@/stores/knowledge-store";
import { formatDate } from "@/lib/utils";

interface KnowledgeBaseExperienceProps {
  initialFolders: KnowledgeFolderSummary[];
  initialNotes: KnowledgeNoteSummary[];
}

export function KnowledgeBaseExperience({
  initialFolders,
  initialNotes,
}: KnowledgeBaseExperienceProps) {
  const storeFolders = useKnowledgeStore((s) => s.folders);
  const storeNotes = useKnowledgeStore((s) => s.notes);
  const addNote = useKnowledgeStore((s) => s.addNote);
  const updateNote = useKnowledgeStore((s) => s.updateNote);
  const deleteNote = useKnowledgeStore((s) => s.deleteNote);
  const addFolder = useKnowledgeStore((s) => s.addFolder);
  const isHydrated = useKnowledgeStore((s) => s.isHydrated);

  const folders = isHydrated ? storeFolders : initialFolders;
  const notes = isHydrated ? storeNotes : initialNotes;

  const [activeView, setActiveView] = useState<"ALL" | "FAVORITES" | "PINNED" | "ARCHIVED">("ALL");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedContentType, setSelectedContentType] = useState<string>("ALL");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(
    initialNotes[0]?.id || null
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSemanticSearchOpen, setIsSemanticSearchOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotAction, setCopilotAction] = useState<
    "SUMMARIZE" | "EXPLAIN" | "GENERATE_QUESTIONS" | "EXTRACT_INFO" | null
  >("SUMMARIZE");
  const [isCreating, setIsCreating] = useState(false);

  // Filter notes based on active view, folder, content type, tag, search query
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      // Archive filter
      if (activeView === "ARCHIVED") {
        if (!note.isArchived) return false;
      } else {
        if (note.isArchived) return false;
      }

      // View filters
      if (activeView === "FAVORITES" && !note.isFavorite) return false;
      if (activeView === "PINNED" && !note.isPinned) return false;

      // Folder filter
      if (selectedFolderId && note.folderId !== selectedFolderId) return false;

      // Content Type filter
      if (selectedContentType !== "ALL" && note.contentType !== selectedContentType) return false;

      // Tag filter
      if (selectedTag && !note.tags.includes(selectedTag)) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = note.title.toLowerCase().includes(q);
        const inContent = note.content.toLowerCase().includes(q);
        const inTag = note.tags.some((t) => t.toLowerCase().includes(q));
        const inCat = note.category.toLowerCase().includes(q);
        if (!inTitle && !inContent && !inTag && !inCat) return false;
      }

      return true;
    });
  }, [notes, activeView, selectedFolderId, selectedContentType, selectedTag, searchQuery]);

  // Selected or first visible note
  const activeNote = useMemo(() => {
    if (selectedNoteId) {
      const match = notes.find((n) => n.id === selectedNoteId);
      if (match) return match;
    }
    return filteredNotes[0] || notes[0] || null;
  }, [notes, selectedNoteId, filteredNotes]);

  // Create new note
  const handleCreateNewNote = () => {
    const folder = folders.find((f) => f.id === selectedFolderId);
    const defaultCategory = folder ? folder.name : "Architecture";
    const count = notes.length + 1;
    const defaultTitle = `Architectural Note #${count}`;

    const newNote = addNote({
      title: defaultTitle,
      content: `# ${defaultTitle}\n\n## Objective & Invariants\n- Define core requirements, invariants, and architectural constraints.\n\n## System Design & Trade-offs\nDescribe the trade-offs, state machines, and concurrency considerations here...`,
      contentType: (selectedContentType !== "ALL" ? selectedContentType : "NOTE") as any,
      category: defaultCategory,
      folderId: selectedFolderId || undefined,
      tags: selectedTag ? [selectedTag, "second-brain"] : ["architecture", "invariants"],
      isPinned: false,
      isFavorite: false,
    });

    setSelectedNoteId(newNote.id);
  };

  const handleNoteUpdated = (updatedNote: KnowledgeNoteSummary) => {
    updateNote(updatedNote.id, updatedNote);
  };

  const handleNoteDeleted = (noteId: string) => {
    deleteNote(noteId);
    if (selectedNoteId === noteId) {
      const remaining = notes.filter((n) => n.id !== noteId);
      setSelectedNoteId(remaining[0]?.id || null);
    }
  };

  const handleFolderCreated = (folder: KnowledgeFolderSummary) => {
    addFolder(folder);
    setSelectedFolderId(folder.id);
  };

  const handleTriggerAiCopilot = (
    action: "SUMMARIZE" | "EXPLAIN" | "GENERATE_QUESTIONS" | "EXTRACT_INFO"
  ) => {
    setCopilotAction(action);
    setIsCopilotOpen(true);
  };

  const handleSelectFromSemanticSearch = (note: KnowledgeNoteSummary) => {
    setSelectedNoteId(note.id);
    if (note.isArchived && activeView !== "ARCHIVED") {
      setActiveView("ARCHIVED");
    } else if (!note.isArchived && activeView === "ARCHIVED") {
      setActiveView("ALL");
    }
    if (selectedFolderId && note.folderId !== selectedFolderId) {
      setSelectedFolderId(null);
    }
  };

  // Stats calculation
  const totalNotesCount = notes.filter((n) => !n.isArchived).length;
  const pinnedCount = notes.filter((n) => n.isPinned && !n.isArchived).length;
  const favoriteCount = notes.filter((n) => n.isFavorite && !n.isArchived).length;
  const archivedCount = notes.filter((n) => n.isArchived).length;

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] -m-6 overflow-hidden bg-[#080D0B]">
      {/* Top Knowledge Action Bar */}
      <div className="h-14 px-6 border-b border-[#25352C] bg-[#101915]/90 backdrop-blur-md flex items-center justify-between shrink-0 gap-4">
        {/* Left: View & Folder Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="p-1.5 rounded-lg text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#142019] border border-[#25352C] transition-colors"
            title={isSidebarOpen ? "Collapse Folders Tree" : "Expand Folders Tree"}
          >
            {isSidebarOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#F3F7F4] tracking-wide flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#10B981]" />
              SECOND BRAIN
            </span>
            <div className="hidden md:flex items-center gap-1.5 text-[10px] font-mono text-[#98A69D] border-l border-[#25352C] pl-2.5">
              <span className="px-1.5 py-0.5 rounded bg-[#142019] border border-[#25352C]">
                {totalNotesCount} Notes
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#142019] border border-[#25352C] text-[#10B981]">
                {pinnedCount} Pinned
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#142019] border border-[#25352C] text-amber-400">
                {favoriteCount} Starred
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search & Semantic Search Trigger */}
        <div className="flex-1 max-w-md hidden sm:flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#98A69D]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, markdown text or tags..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#080D0B] border border-[#25352C] rounded-xl text-[#F3F7F4] placeholder-[#98A69D] focus:outline-none focus:border-[#10B981] transition-colors"
            />
          </div>

          <button
            onClick={() => setIsSemanticSearchOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10B981]/15 text-[#10B981] hover:bg-[#10B981]/25 border border-[#10B981]/30 text-xs font-mono font-medium transition-colors shrink-0"
            title="Semantic Conceptual Search"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Semantic Search</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setCopilotAction("SUMMARIZE");
              setIsCopilotOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#142019] hover:bg-[#101915] text-[#F3F7F4] border border-[#25352C] hover:border-[#10B981]/40 text-xs font-medium transition-colors"
            title="Open AI Copilot"
          >
            <Brain className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="hidden sm:inline">AI Copilot</span>
          </button>

          <button
            onClick={handleCreateNewNote}
            disabled={isCreating}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] font-bold text-xs transition-colors shadow-sm disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* Main Multi-Panel Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Panel 1: Notes Sidebar (Folders & Taxonomy) */}
        {isSidebarOpen && (
          <div className="w-64 shrink-0 border-r border-[#25352C] bg-[#101915]/50 flex flex-col overflow-hidden animate-in slide-in-from-left duration-200">
            <NotesSidebar
              folders={folders}
              notes={notes}
              activeView={activeView}
              selectedFolderId={selectedFolderId}
              selectedContentType={selectedContentType}
              selectedTag={selectedTag}
              onSelectView={(v) => {
                setActiveView(v);
                setSelectedFolderId(null);
                setSelectedTag(null);
              }}
              onSelectFolder={(fId) => {
                setSelectedFolderId(fId);
                if (activeView === "ARCHIVED") setActiveView("ALL");
              }}
              onSelectContentType={(t) => setSelectedContentType(t)}
              onSelectTag={(t) => setSelectedTag(t)}
              onFolderCreated={handleFolderCreated}
            />
          </div>
        )}

        {/* Panel 2: Notes List / Grid Column */}
        <div className="w-80 sm:w-88 shrink-0 border-r border-[#25352C] bg-[#080D0B] flex flex-col overflow-hidden">
          {/* List Header */}
          <div className="p-3.5 border-b border-[#25352C] bg-[#101915]/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-[#F3F7F4]">
                {activeView === "ALL" && !selectedFolderId && "All Documents"}
                {activeView === "FAVORITES" && "Starred Notes"}
                {activeView === "PINNED" && "Pinned Invariants"}
                {activeView === "ARCHIVED" && "Archived Material"}
                {selectedFolderId && (
                  <span className="text-[#10B981]">
                    {folders.find((f) => f.id === selectedFolderId)?.name || "Folder"}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#142019] text-[#98A69D] border border-[#25352C]">
                {filteredNotes.length}
              </span>
            </div>

            {(selectedTag || selectedContentType !== "ALL") && (
              <button
                onClick={() => {
                  setSelectedTag(null);
                  setSelectedContentType("ALL");
                }}
                className="text-[10px] font-mono text-[#10B981] hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#25352C]/60 p-2 space-y-1.5">
            {filteredNotes.length === 0 ? (
              <div className="p-8 text-center space-y-2 text-[#98A69D]">
                <FileText className="w-8 h-8 text-[#25352C] mx-auto stroke-1" />
                <p className="text-xs font-medium text-[#F3F7F4]">No Notes Found</p>
                <p className="text-[11px] leading-relaxed">
                  No notes match the current filters. Create a new document to start recording.
                </p>
                <button
                  onClick={handleCreateNewNote}
                  className="mt-2 text-xs font-mono text-[#10B981] hover:underline"
                >
                  + Create New Note
                </button>
              </div>
            ) : (
              filteredNotes.map((note) => {
                const isSelected = activeNote?.id === note.id;
                return (
                  <div
                    key={note.id}
                    onClick={() => setSelectedNoteId(note.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? "bg-[#142019] border-[#10B981] shadow-md shadow-[#10B981]/5"
                        : "bg-[#101915]/60 hover:bg-[#101915] border-[#25352C]/60 hover:border-[#25352C]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#080D0B] text-[#10B981] border border-[#10B981]/30 shrink-0">
                          {note.contentType}
                        </span>
                        <span className="text-[10px] text-[#98A69D] truncate">
                          {note.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 text-[#98A69D]">
                        {note.isPinned && (
                          <Pin className="w-3 h-3 text-[#10B981] fill-current" />
                        )}
                        {note.isFavorite && (
                          <Star className="w-3 h-3 text-amber-400 fill-current" />
                        )}
                      </div>
                    </div>

                    <h4
                      className={`text-xs font-bold leading-snug line-clamp-1 mb-1 ${
                        isSelected ? "text-[#10B981]" : "text-[#F3F7F4]"
                      }`}
                    >
                      {note.title}
                    </h4>

                    <p className="text-[11px] text-[#98A69D] line-clamp-2 leading-relaxed mb-2 font-sans">
                      {note.summary || note.content.replace(/^#+.*$/gm, "").trim()}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-[#98A69D]/80 font-mono">
                      <div className="flex items-center gap-1 truncate max-w-[150px]">
                        {note.tags.slice(0, 2).map((t) => (
                          <span key={t} className="text-[#98A69D]">
                            #{t}
                          </span>
                        ))}
                        {note.tags.length > 2 && <span>+{note.tags.length - 2}</span>}
                      </div>
                      <span>{formatDate(note.updatedAt)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Panel 3: Active Note Editor */}
        <div className="flex-1 flex flex-col bg-[#080D0B] overflow-hidden">
          {activeNote ? (
            <NoteEditor
              note={activeNote}
              folders={folders}
              allNotes={notes}
              onNoteUpdated={handleNoteUpdated}
              onNoteDeleted={handleNoteDeleted}
              onTriggerAiCopilot={handleTriggerAiCopilot}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-[#98A69D]">
              <BookOpen className="w-12 h-12 text-[#25352C] mb-3 stroke-1" />
              <h3 className="text-sm font-semibold text-[#F3F7F4]">
                No Document Selected
              </h3>
              <p className="text-xs text-[#98A69D] mt-1 max-w-sm">
                Select a document from the left list or create a new note to start building your second brain.
              </p>
              <button
                onClick={handleCreateNewNote}
                className="mt-4 px-4 py-2 bg-[#10B981] text-[#080D0B] font-bold text-xs rounded-xl hover:bg-[#059669] transition-colors"
              >
                + Create New Note
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Semantic Search Modal */}
      <SemanticSearchModal
        isOpen={isSemanticSearchOpen}
        onClose={() => setIsSemanticSearchOpen(false)}
        onSelectNote={handleSelectFromSemanticSearch}
      />

      {/* AI Knowledge Copilot Drawer */}
      <AiKnowledgeCopilot
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        activeNote={activeNote}
        initialAction={copilotAction}
      />
    </div>
  );
}
