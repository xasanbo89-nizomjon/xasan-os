"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  KnowledgeFolderSummary,
  KnowledgeNoteSummary,
  NoteContentType,
} from "@/types";
import { FALLBACK_FOLDERS, FALLBACK_NOTES } from "@/lib/constants";

interface KnowledgeState {
  folders: KnowledgeFolderSummary[];
  notes: KnowledgeNoteSummary[];
  isHydrated: boolean;

  // Note Actions
  addNote: (data: {
    title: string;
    content: string;
    summary?: string;
    folderId?: string | null;
    category?: string;
    collection?: string | null;
    contentType?: NoteContentType;
    tags?: string[];
    isPinned?: boolean;
    isFavorite?: boolean;
  }) => KnowledgeNoteSummary;

  updateNote: (id: string, updates: Partial<KnowledgeNoteSummary>) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  toggleFavoriteNote: (id: string) => void;
  archiveNote: (id: string) => void;

  // Folder Actions
  addFolder: (data: {
    name: string;
    color?: string | null;
    icon?: string | null;
    parentId?: string | null;
  }) => KnowledgeFolderSummary;

  deleteFolder: (id: string) => void;

  // Reset & Purge
  resetKnowledgeToDefault: () => void;
  clearAllKnowledge: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useKnowledgeStore = create<KnowledgeState>()(
  persist(
    (set, get) => ({
      folders: FALLBACK_FOLDERS,
      notes: FALLBACK_NOTES,
      isHydrated: false,

      addNote: (data) => {
        const id = `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const folder = get().folders.find((f) => f.id === data.folderId);

        const newNote: KnowledgeNoteSummary = {
          id,
          userId: "local-user",
          folderId: data.folderId || null,
          folderName: folder?.name || null,
          title: data.title,
          content: data.content,
          summary: data.summary || (data.content.length > 100 ? data.content.slice(0, 100) + "..." : data.content),
          contentType: data.contentType || "NOTE",
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

        set((state) => ({
          notes: [newNote, ...state.notes],
        }));

        return newNote;
      },

      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id
              ? { ...n, ...updates, updatedAt: new Date().toISOString() }
              : n
          ),
        }));
      },

      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        }));
      },

      togglePinNote: (id) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, isPinned: !n.isPinned, updatedAt: new Date().toISOString() } : n
          ),
        }));
      },

      toggleFavoriteNote: (id) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, isFavorite: !n.isFavorite, updatedAt: new Date().toISOString() } : n
          ),
        }));
      },

      archiveNote: (id) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, isArchived: !n.isArchived, updatedAt: new Date().toISOString() } : n
          ),
        }));
      },

      addFolder: (data) => {
        const id = `fld-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const newFolder: KnowledgeFolderSummary = {
          id,
          userId: "local-user",
          parentId: data.parentId || null,
          name: data.name,
          slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "folder",
          color: data.color || "#10B981",
          icon: data.icon || "Folder",
          noteCount: 0,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          folders: [...state.folders, newFolder],
        }));

        return newFolder;
      },

      deleteFolder: (id) => {
        set((state) => ({
          folders: state.folders.filter((f) => f.id !== id),
          // Dissociate folder from notes
          notes: state.notes.map((n) =>
            n.folderId === id ? { ...n, folderId: null, folderName: null } : n
          ),
        }));
      },

      resetKnowledgeToDefault: () =>
        set({
          folders: FALLBACK_FOLDERS,
          notes: FALLBACK_NOTES,
        }),

      clearAllKnowledge: () =>
        set({
          folders: [],
          notes: [],
        }),

      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: "xasan_knowledge_storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
