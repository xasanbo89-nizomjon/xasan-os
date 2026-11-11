"use server";

import { JournalEntrySummary } from "@/types";
import { FALLBACK_JOURNAL_ENTRIES } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function getJournalEntriesAction(filters?: {
  search?: string;
  mood?: string;
  includeArchived?: boolean;
}): Promise<JournalEntrySummary[]> {
  let entries = [...FALLBACK_JOURNAL_ENTRIES];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    entries = entries.filter(
      (e) => e.title.toLowerCase().includes(q) || e.content.toLowerCase().includes(q)
    );
  }
  if (filters?.mood && filters.mood !== "ALL") {
    entries = entries.filter((e) => e.mood?.toLowerCase() === filters.mood?.toLowerCase());
  }
  return entries;
}

export async function createJournalEntryAction(data: {
  title?: string;
  content: string;
  mood?: string;
  tags?: string[];
  date?: string;
  isPrivate?: boolean;
  isArchived?: boolean;
}) {
  const newEntry: JournalEntrySummary = {
    id: `jrnl-local-${Date.now()}`,
    userId: "local-user",
    title: data.title || "Daily Reflection",
    content: data.content,
    date: data.date || new Date().toISOString().slice(0, 10),
    mood: data.mood || "Focused",
    tags: data.tags || ["Reflection"],
    isPrivate: data.isPrivate || false,
    isArchived: data.isArchived || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  revalidatePath("/life-tracker");
  return { success: true, entry: newEntry };
}

export async function updateJournalEntryAction(id: string, updates: Partial<JournalEntrySummary>) {
  revalidatePath("/life-tracker");
  return { success: true, id, updates };
}

export async function toggleArchiveJournalEntryAction(id: string, isArchived: boolean) {
  revalidatePath("/life-tracker");
  return { success: true, id, isArchived: !isArchived };
}

export async function deleteJournalEntryAction(id: string) {
  revalidatePath("/life-tracker");
  return { success: true, id };
}
