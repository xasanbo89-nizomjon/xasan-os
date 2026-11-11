"use server";

import {
  KnowledgeNoteSummary,
  KnowledgeFolderSummary,
  AiNoteAnalysisResult,
  SemanticSearchResult,
  NoteContentType,
} from "@/types";
import { FALLBACK_NOTES, FALLBACK_FOLDERS } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function getKnowledgeNotesAction(filters?: {
  folderId?: string | null;
  category?: string;
  contentType?: string;
  tag?: string;
  search?: string;
  isPinned?: boolean;
  isFavorite?: boolean;
  isArchived?: boolean;
  includeArchived?: boolean;
}): Promise<KnowledgeNoteSummary[]> {
  let list = [...FALLBACK_NOTES];
  if (filters?.folderId) {
    list = list.filter((n) => n.folderId === filters.folderId);
  }
  if (filters?.isPinned !== undefined) {
    list = list.filter((n) => n.isPinned === filters.isPinned);
  }
  if (filters?.isFavorite !== undefined) {
    list = list.filter((n) => n.isFavorite === filters.isFavorite);
  }
  if (filters?.isArchived !== undefined) {
    list = list.filter((n) => n.isArchived === filters.isArchived);
  }
  return list;
}

export async function getKnowledgeFoldersAction(): Promise<KnowledgeFolderSummary[]> {
  return FALLBACK_FOLDERS;
}

export async function createKnowledgeNoteAction(data: {
  title: string;
  content: string;
  summary?: string;
  folderId?: string;
  category?: string;
  collection?: string;
  contentType?: string;
  tags?: string[];
  isPinned?: boolean;
  isFavorite?: boolean;
}) {
  const newNote: KnowledgeNoteSummary = {
    id: `note-local-${Date.now()}`,
    userId: "local-user",
    folderId: data.folderId || null,
    folderName: null,
    title: data.title,
    content: data.content,
    summary: data.summary || (data.content.length > 100 ? data.content.slice(0, 100) + "..." : data.content),
    contentType: (data.contentType as NoteContentType) || "NOTE",
    category: data.category || "General",
    collection: data.collection || null,
    tags: data.tags || [],
    attachments: [],
    internalLinks: [],
    isPinned: data.isPinned || false,
    isFavorite: data.isFavorite || false,
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  revalidatePath("/knowledge-base");
  revalidatePath("/");
  return { success: true, note: newNote };
}

export async function updateKnowledgeNoteAction(
  id: string,
  updates: Partial<KnowledgeNoteSummary>
) {
  const existing = FALLBACK_NOTES.find((n) => n.id === id) || FALLBACK_NOTES[0];
  const note: KnowledgeNoteSummary = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  revalidatePath("/knowledge-base");
  revalidatePath("/");
  return { success: true, id, note, updates };
}

export async function deleteKnowledgeNoteAction(id: string) {
  revalidatePath("/knowledge-base");
  revalidatePath("/");
  return { success: true, id };
}

export async function togglePinNoteAction(id: string, isPinned: boolean) {
  revalidatePath("/knowledge-base");
  return { success: true, id, isPinned };
}

export async function toggleFavoriteNoteAction(id: string, isFavorite: boolean) {
  revalidatePath("/knowledge-base");
  return { success: true, id, isFavorite };
}

export async function toggleArchiveNoteAction(id: string, isArchived: boolean) {
  revalidatePath("/knowledge-base");
  return { success: true, id, isArchived };
}

export async function createKnowledgeFolderAction(data: {
  name: string;
  color?: string;
  icon?: string;
  parentId?: string;
}) {
  const newFolder: KnowledgeFolderSummary = {
    id: `fld-local-${Date.now()}`,
    userId: "local-user",
    parentId: data.parentId || null,
    name: data.name,
    slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "folder",
    color: data.color || "#10B981",
    icon: data.icon || "Folder",
    noteCount: 0,
    createdAt: new Date().toISOString(),
  };

  revalidatePath("/knowledge-base");
  return { success: true, folder: newFolder };
}

export async function deleteKnowledgeFolderAction(id: string) {
  revalidatePath("/knowledge-base");
  return { success: true, id };
}

export async function aiSummarizeNoteAction(noteId: string): Promise<AiNoteAnalysisResult> {
  const note = FALLBACK_NOTES.find((n) => n.id === noteId) || FALLBACK_NOTES[0];
  return {
    action: "SUMMARIZE",
    noteId,
    noteTitle: note.title,
    result: `Synthesis of "${note.title}":\n\n${note.content.slice(0, 300)}...`,
    bullets: ["Primary thesis identified", "Key structural arguments verified", "Actionable conclusions highlighted"],
    timestamp: new Date().toISOString(),
  };
}

export async function aiExplainContentAction(noteId: string, customQuery?: string): Promise<AiNoteAnalysisResult> {
  const note = FALLBACK_NOTES.find((n) => n.id === noteId) || FALLBACK_NOTES[0];
  return {
    action: "EXPLAIN",
    noteId,
    noteTitle: note.title,
    result: `Concept Analysis: ${customQuery || note.title}\n\nDeconstructs the foundational primitives and practical implications.`,
    keyPoints: ["Core mechanism", "Failure modes and invariants", "Practical implementation recommendation"],
    timestamp: new Date().toISOString(),
  };
}

export async function aiGenerateQuestionsAction(noteId: string): Promise<AiNoteAnalysisResult> {
  const note = FALLBACK_NOTES.find((n) => n.id === noteId) || FALLBACK_NOTES[0];
  return {
    action: "GENERATE_QUESTIONS",
    noteId,
    noteTitle: note.title,
    result: "Active Recall Assessment Questions generated from note content.",
    questions: [
      { question: `What is the core problem addressed in ${note.title}?`, answer: "Architectural isolation and reliability." },
      { question: "What are the primary performance trade-offs?", answer: "Latency vs strict consistency." },
    ],
    timestamp: new Date().toISOString(),
  };
}

export async function aiExtractKeyInfoAction(noteId: string): Promise<AiNoteAnalysisResult> {
  const note = FALLBACK_NOTES.find((n) => n.id === noteId) || FALLBACK_NOTES[0];
  return {
    action: "EXTRACT_INFO",
    noteId,
    noteTitle: note.title,
    result: "Extracted Invariants, Metrics, and Action Items.",
    bullets: ["Zero unhandled edge cases", "Client-side deterministic execution", "100% offline autonomy"],
    timestamp: new Date().toISOString(),
  };
}

export async function semanticSearchNotesAction(
  query: string,
  limit: number = 5
): Promise<SemanticSearchResult[]> {
  const q = query.toLowerCase();
  const matched = FALLBACK_NOTES.filter(
    (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
  );

  return (matched.length > 0 ? matched : FALLBACK_NOTES).slice(0, limit).map((n) => ({
    note: n,
    similarityScore: 0.94,
    matchedSnippet: n.content.slice(0, 160) + "...",
    relevanceReason: "High semantic overlap with architectural query",
  }));
}

export async function performAiNoteAction(
  noteId: string,
  action: "SUMMARIZE" | "EXPLAIN" | "GENERATE_QUESTIONS" | "EXTRACT_INFO",
  selectedContent?: string
): Promise<AiNoteAnalysisResult> {
  if (action === "SUMMARIZE") return aiSummarizeNoteAction(noteId);
  if (action === "EXPLAIN") return aiExplainContentAction(noteId, selectedContent);
  if (action === "GENERATE_QUESTIONS") return aiGenerateQuestionsAction(noteId);
  return aiExtractKeyInfoAction(noteId);
}

export async function performSemanticSearchAction(
  query: string,
  limit: number = 5
): Promise<SemanticSearchResult[]> {
  return semanticSearchNotesAction(query, limit);
}
