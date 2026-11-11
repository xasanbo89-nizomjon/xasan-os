"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  Eye,
  Edit3,
  Pin,
  Star,
  Archive,
  Trash2,
  Paperclip,
  Link2,
  Tag,
  Folder,
  Calendar,
  Sparkles,
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Code,
  List,
  CheckSquare,
  Quote,
  Plus,
  X,
  FileText,
} from "lucide-react";
import { KnowledgeNoteSummary, KnowledgeFolderSummary, NoteContentType } from "@/types";
import {
  updateKnowledgeNoteAction,
  deleteKnowledgeNoteAction,
  togglePinNoteAction,
  toggleFavoriteNoteAction,
  toggleArchiveNoteAction,
} from "@/server/actions/knowledge";
import { formatDate } from "@/lib/utils";
import { useTranslation } from "@/stores/language-store";

interface NoteEditorProps {
  note: KnowledgeNoteSummary;
  folders: KnowledgeFolderSummary[];
  allNotes: KnowledgeNoteSummary[];
  onNoteUpdated: (updatedNote: KnowledgeNoteSummary) => void;
  onNoteDeleted: (noteId: string) => void;
  onTriggerAiCopilot: (action: "SUMMARIZE" | "EXPLAIN" | "GENERATE_QUESTIONS" | "EXTRACT_INFO") => void;
}

export function NoteEditor({
  note,
  folders,
  allNotes,
  onNoteUpdated,
  onNoteDeleted,
  onTriggerAiCopilot,
}: NoteEditorProps) {
  const { isUz } = useTranslation();
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [category, setCategory] = useState(note.category);
  const [contentType, setContentType] = useState<NoteContentType>(note.contentType as NoteContentType);
  const [folderId, setFolderId] = useState<string>(note.folderId || "");
  const [collection, setCollection] = useState(note.collection || "");
  const [tagsInput, setTagsInput] = useState(note.tags.join(", "));
  const [attachments, setAttachments] = useState<string[]>(note.attachments || []);
  const [newAttachment, setNewAttachment] = useState("");
  const [internalLinks, setInternalLinks] = useState<string[]>(note.internalLinks || []);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFavorite, setIsFavorite] = useState(note.isFavorite);
  const [isPinned, setIsPinned] = useState(note.isPinned);
  const [isArchived, setIsArchived] = useState(note.isArchived);

  const contentTypes: { id: NoteContentType; label: string }[] = [
    { id: "NOTE", label: isUz ? "Tezkor qayd" : "Quick Note" },
    { id: "IDEA", label: isUz ? "G‘oya va Konseptsiya" : "Idea & Concept" },
    { id: "ARTICLE", label: isUz ? "Maqola / Memo" : "Article / Memo" },
    { id: "BOOK_SUMMARY", label: isUz ? "Kitob tahlili" : "Book Synthesis" },
    { id: "PROGRAMMING_DOC", label: isUz ? "Dasturlash hujjati" : "Code Documentation" },
    { id: "STUDY_NOTE", label: isUz ? "O‘qish va IELTS qaydi" : "Study & IELTS Note" },
    { id: "PERSONAL_JOURNAL", label: isUz ? "Shaxsiy kundalik" : "Personal Journal" },
    { id: "RESEARCH", label: isUz ? "Tadqiqot materiali" : "Research Material" },
  ];

  // Sync state when active note prop changes
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    setContentType(note.contentType as NoteContentType);
    setFolderId(note.folderId || "");
    setCollection(note.collection || "");
    setTagsInput(note.tags.join(", "));
    setAttachments(note.attachments || []);
    setInternalLinks(note.internalLinks || []);
    setIsFavorite(note.isFavorite);
    setIsPinned(note.isPinned);
    setIsArchived(note.isArchived);
  }, [note.id]);

  // Insert markdown snippet at cursor
  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById("note-content-area") as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end);
    const replacement = prefix + selected + suffix;

    const newContent = content.slice(0, start) + replacement + content.slice(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 10);
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    setIsSaving(true);

    const tagsArray = tagsInput
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean);

    try {
      const res = await updateKnowledgeNoteAction(note.id, {
        title,
        content,
        category,
        contentType,
        folderId: folderId || null,
        collection: collection || null,
        tags: tagsArray,
        attachments,
        internalLinks,
        isPinned,
        isFavorite,
        isArchived,
      });

      if (res.success && res.note) {
        onNoteUpdated(res.note as KnowledgeNoteSummary);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePin = async () => {
    const next = !isPinned;
    setIsPinned(next);
    await togglePinNoteAction(note.id, isPinned);
    onNoteUpdated({ ...note, isPinned: next });
  };

  const handleToggleFavorite = async () => {
    const next = !isFavorite;
    setIsFavorite(next);
    await toggleFavoriteNoteAction(note.id, isFavorite);
    onNoteUpdated({ ...note, isFavorite: next });
  };

  const handleToggleArchive = async () => {
    const next = !isArchived;
    setIsArchived(next);
    await toggleArchiveNoteAction(note.id, isArchived);
    onNoteUpdated({ ...note, isArchived: next });
  };

  const handleDelete = async () => {
    const confirmMsg = isUz
      ? "Haqiqatan ham ushbu qaydni ikkinchi miyadan butunlay o‘chirmoqchimisiz?"
      : "Permanently delete this note from the second brain?";
    if (confirm(confirmMsg)) {
      const res = await deleteKnowledgeNoteAction(note.id);
      if (res.success) {
        onNoteDeleted(note.id);
      }
    }
  };

  const handleAddAttachment = () => {
    if (!newAttachment.trim()) return;
    const updated = [...attachments, newAttachment.trim()];
    setAttachments(updated);
    setNewAttachment("");
  };

  const handleRemoveAttachment = (idx: number) => {
    setAttachments(attachments.filter((_, i) => i !== idx));
  };

  // Render basic markdown live preview
  const renderMarkdownPreview = (text: string) => {
    return (
      <div className="prose prose-invert max-w-none text-xs leading-relaxed space-y-3 font-sans">
        {text.split("\n\n").map((block, idx) => {
          if (block.startsWith("# ")) {
            return (
              <h1 key={idx} className="text-xl font-bold text-[#F3F7F4] border-b border-[#25352C] pb-2">
                {block.replace("# ", "")}
              </h1>
            );
          }
          if (block.startsWith("## ")) {
            return (
              <h2 key={idx} className="text-base font-bold text-[#10B981] mt-4 mb-2">
                {block.replace("## ", "")}
              </h2>
            );
          }
          if (block.startsWith("### ")) {
            return (
              <h3 key={idx} className="text-sm font-semibold text-[#F3F7F4] mt-3 mb-1">
                {block.replace("### ", "")}
              </h3>
            );
          }
          if (block.startsWith("```")) {
            const cleanCode = block.replace(/```[a-z]*\n?/g, "");
            return (
              <pre
                key={idx}
                className="p-3.5 rounded-xl bg-[#080D0B] border border-[#25352C] font-mono text-[11px] text-[#98A69D] overflow-x-auto"
              >
                <code>{cleanCode}</code>
              </pre>
            );
          }
          if (block.startsWith("> ")) {
            return (
              <blockquote
                key={idx}
                className="border-l-2 border-[#10B981] pl-3 italic text-[#98A69D] my-2"
              >
                {block.replace("> ", "")}
              </blockquote>
            );
          }
          if (block.startsWith("* ") || block.startsWith("- ")) {
            const items = block.split("\n");
            return (
              <ul key={idx} className="list-disc pl-5 space-y-1 text-[#F3F7F4]">
                {items.map((it, i) => (
                  <li key={i}>{it.replace(/^[-*]\s/, "")}</li>
                ))}
              </ul>
            );
          }
          return (
            <p key={idx} className="text-[#F3F7F4] leading-relaxed">
              {block}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="glass-card rounded-3xl border border-[#25352C] p-6 space-y-5 bg-[#101915]/80 flex flex-col min-h-[640px]">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#25352C]">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Content Type Selector */}
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value as NoteContentType)}
            className="px-3 py-1.5 rounded-xl bg-[#142019] border border-[#25352C] text-xs font-semibold text-[#10B981] focus:outline-none focus:border-[#10B981]"
          >
            {contentTypes.map((ct) => (
              <option key={ct.id} value={ct.id}>
                {ct.label}
              </option>
            ))}
          </select>

          {/* Folder Selector */}
          <select
            value={folderId}
            onChange={(e) => setFolderId(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#98A69D] focus:outline-none focus:border-[#10B981]"
          >
            <option value="">{isUz ? "Papkasiz / Asosiy daraja" : "Unfiled / Root"}</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>
                📁 {f.name}
              </option>
            ))}
          </select>

          {/* Domain Category */}
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder={isUz ? "Kategoriya (masalan: Arxitektura)" : "Category (e.g. Architecture)"}
            className="w-36 px-3 py-1.5 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePin}
            className={`p-2 rounded-xl border transition-all ${
              isPinned
                ? "bg-[#10B981]/20 border-[#10B981] text-[#10B981]"
                : "bg-[#142019] border-[#25352C] text-[#98A69D] hover:text-[#F3F7F4]"
            }`}
            title={isUz ? "Qadashni o‘zgartirish" : "Toggle Pin"}
          >
            <Pin className={`w-3.5 h-3.5 ${isPinned ? "fill-current" : ""}`} />
          </button>

          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-xl border transition-all ${
              isFavorite
                ? "bg-amber-500/20 border-amber-400 text-amber-400"
                : "bg-[#142019] border-[#25352C] text-[#98A69D] hover:text-[#F3F7F4]"
            }`}
            title={isUz ? "Tanlanganlarga qo‘shish" : "Toggle Favorite"}
          >
            <Star className={`w-3.5 h-3.5 ${isFavorite ? "fill-current" : ""}`} />
          </button>

          <button
            onClick={handleToggleArchive}
            className={`p-2 rounded-xl border transition-all ${
              isArchived
                ? "bg-blue-500/20 border-blue-400 text-blue-400"
                : "bg-[#142019] border-[#25352C] text-[#98A69D] hover:text-[#F3F7F4]"
            }`}
            title={isUz ? "Arxivlashni o‘zgartirish" : "Toggle Archive"}
          >
            <Archive className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleDelete}
            className="p-2 rounded-xl bg-[#142019] border border-[#25352C] text-[#98A69D] hover:text-red-400 transition-colors"
            title={isUz ? "Qaydni o‘chirish" : "Delete Note"}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] hover:bg-[#059669] transition-all flex items-center gap-1.5 shadow-md shadow-[#10B981]/20 font-bold"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? (isUz ? "Saqlanmoqda..." : "Saving...") : (isUz ? "Saqlash" : "Save Note")}</span>
          </button>
        </div>
      </div>

      {/* Note Title Input */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={isUz ? "Qayd sarlavhasi / Invariant nomi..." : "Note Title / Invariant Heading..."}
        className="w-full text-xl md:text-2xl font-bold bg-transparent border-none text-[#F3F7F4] placeholder-[#98A69D]/60 focus:outline-none"
      />

      {/* Markdown Toolbar & Mode Switcher */}
      <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-[#080D0B] border border-[#25352C] flex-wrap">
        <div className="flex items-center gap-1 flex-wrap">
          <button
            type="button"
            onClick={() => insertMarkdown("# ")}
            className="p-1.5 rounded-lg text-[#98A69D] hover:text-[#10B981] hover:bg-[#142019]"
            title="Heading 1"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("## ")}
            className="p-1.5 rounded-lg text-[#98A69D] hover:text-[#10B981] hover:bg-[#142019]"
            title="Heading 2"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("### ")}
            className="p-1.5 rounded-lg text-[#98A69D] hover:text-[#10B981] hover:bg-[#142019]"
            title="Heading 3"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-[#25352C] mx-1" />

          <button
            type="button"
            onClick={() => insertMarkdown("**", "**")}
            className="p-1.5 rounded-lg text-[#98A69D] hover:text-[#10B981] hover:bg-[#142019]"
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("*", "*")}
            className="p-1.5 rounded-lg text-[#98A69D] hover:text-[#10B981] hover:bg-[#142019]"
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("`", "`")}
            className="p-1.5 rounded-lg text-[#98A69D] hover:text-[#10B981] hover:bg-[#142019]"
            title="Inline Code"
          >
            <Code className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-[#25352C] mx-1" />

          <button
            type="button"
            onClick={() => insertMarkdown("- ")}
            className="p-1.5 rounded-lg text-[#98A69D] hover:text-[#10B981] hover:bg-[#142019]"
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("- [ ] ")}
            className="p-1.5 rounded-lg text-[#98A69D] hover:text-[#10B981] hover:bg-[#142019]"
            title="Checklist"
          >
            <CheckSquare className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("> ")}
            className="p-1.5 rounded-lg text-[#98A69D] hover:text-[#10B981] hover:bg-[#142019]"
            title="Quote"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("```typescript\n", "\n```")}
            className="px-2 py-1 rounded-lg text-[10px] font-mono text-[#98A69D] hover:text-[#10B981] hover:bg-[#142019]"
            title="Code Block"
          >
            {"{ } code"}
          </button>
        </div>

        {/* AI & Preview Switch */}
        <div className="flex items-center gap-1.5">
          {/* Quick AI Trigger */}
          <div className="flex items-center bg-[#142019] rounded-xl p-1 border border-[#25352C]">
            <button
              type="button"
              onClick={() => onTriggerAiCopilot("SUMMARIZE")}
              className="px-2 py-0.5 rounded text-[10px] font-mono text-[#98A69D] hover:text-[#10B981]"
              title={isUz ? "Qaydni AI orqali xulosa qilish" : "AI Summarize Note"}
            >
              {isUz ? "✨ Xulosa" : "✨ Summarize"}
            </button>
            <button
              type="button"
              onClick={() => onTriggerAiCopilot("EXPLAIN")}
              className="px-2 py-0.5 rounded text-[10px] font-mono text-[#98A69D] hover:text-cyan-400"
              title={isUz ? "AI orqali chuqur tushuntirish" : "AI Deep Explain"}
            >
              {isUz ? "💡 Tushuntirish" : "💡 Explain"}
            </button>
            <button
              type="button"
              onClick={() => onTriggerAiCopilot("GENERATE_QUESTIONS")}
              className="px-2 py-0.5 rounded text-[10px] font-mono text-[#98A69D] hover:text-amber-400"
              title={isUz ? "O‘quv savollarini tuzish" : "AI Study Questions"}
            >
              {isUz ? "❓ Test" : "❓ Quiz"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className={`px-3 py-1 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
              isPreview
                ? "bg-[#10B981] text-[#080D0B] font-bold"
                : "bg-[#142019] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
            }`}
          >
            {isPreview ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isPreview ? (isUz ? "Tahrirlash" : "Edit Raw") : (isUz ? "Ko‘rinish" : "Live Preview")}</span>
          </button>
        </div>
      </div>

      {/* Editor Main Canvas: Raw Textarea or Markdown Preview */}
      <div className="flex-1 min-h-[340px]">
        {!isPreview ? (
          <textarea
            id="note-content-area"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              isUz
                ? "Arxitektura qoidalari, tadqiqot formulalari yoki kitob xulosalarini Markdown formatida yozing..."
                : "Write architecture invariants, research formulas, or book summaries in Markdown..."
            }
            className="w-full h-full min-h-[340px] bg-transparent text-xs text-[#F3F7F4] placeholder-[#98A69D]/40 font-mono leading-relaxed resize-y focus:outline-none"
          />
        ) : (
          <div className="p-4 rounded-2xl bg-[#080D0B]/60 border border-[#25352C] min-h-[340px] overflow-y-auto">
            {renderMarkdownPreview(content)}
          </div>
        )}
      </div>

      {/* Metadata, Tags & Attachments Footer */}
      <div className="pt-4 border-t border-[#25352C] space-y-3">
        {/* Tags input */}
        <div className="flex items-center gap-2">
          <Tag className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder={
              isUz
                ? "Vergul bilan ajratilgan teglar (masalan: Arxitektura, Raft, Algoritm)..."
                : "Tags separated by commas (e.g. Architecture, Raft, DistributedSystems)..."
            }
            className="flex-1 px-3 py-1 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
          />
        </div>

        {/* Attachments & Internal Links Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono text-[#98A69D] flex items-center gap-1">
              <Paperclip className="w-3 h-3 text-[#10B981]" /> {isUz ? "Fayllar:" : "Attachments:"}
            </span>
            {attachments.map((att, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-lg bg-[#142019] border border-[#25352C] text-[10px] font-mono text-[#F3F7F4] flex items-center gap-1"
              >
                <span>{att}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(i)}
                  className="text-[#98A69D] hover:text-red-400"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}

            <div className="flex items-center gap-1">
              <input
                type="text"
                value={newAttachment}
                onChange={(e) => setNewAttachment(e.target.value)}
                placeholder="fayl_nomi.pdf"
                className="w-28 px-2 py-0.5 rounded bg-[#101915] border border-[#25352C] text-[10px] text-[#F3F7F4]"
              />
              <button
                type="button"
                onClick={handleAddAttachment}
                className="p-1 rounded bg-[#142019] text-[#10B981] hover:bg-[#101915]"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="text-[10px] font-mono text-[#98A69D] flex items-center gap-3">
            <span>{isUz ? "Yaratildi: " : "Created: "}{formatDate(note.createdAt)}</span>
            <span>•</span>
            <span>{isUz ? "O‘zgartirildi: " : "Modified: "}{formatDate(note.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
