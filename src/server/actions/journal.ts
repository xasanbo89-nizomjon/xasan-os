"use server";

import prisma from "@/lib/prisma";
import { JournalEntrySummary } from "@/types";
import { FALLBACK_JOURNAL_ENTRIES, DEFAULT_USER_EMAIL, DEFAULT_USER_NAME } from "@/lib/constants";
import { revalidatePath } from "next/cache";

function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  if (url.includes("johndoe:randompassword")) return false;
  return true;
}

async function getOrCreateCurrentUser() {
  if (!isDatabaseConfigured()) {
    return {
      id: "demo-user-uuid-1",
      email: DEFAULT_USER_EMAIL,
      displayName: DEFAULT_USER_NAME,
      role: "OWNER",
    };
  }

  try {
    let user = await prisma.user.findUnique({
      where: { email: DEFAULT_USER_EMAIL },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: DEFAULT_USER_EMAIL,
          displayName: DEFAULT_USER_NAME,
          role: "OWNER",
        },
      });
    }

    return user;
  } catch (error) {
    console.warn("DB user retrieval error, fallback:", error);
    return {
      id: "demo-user-uuid-1",
      email: DEFAULT_USER_EMAIL,
      displayName: DEFAULT_USER_NAME,
      role: "OWNER",
    };
  }
}

export async function getJournalEntriesAction(filters?: {
  search?: string;
  mood?: string;
  includeArchived?: boolean;
}): Promise<JournalEntrySummary[]> {
  if (!isDatabaseConfigured()) {
    let entries = [...FALLBACK_JOURNAL_ENTRIES];
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      entries = entries.filter((e) => e.title.toLowerCase().includes(q) || e.content.toLowerCase().includes(q));
    }
    if (filters?.mood && filters.mood !== "ALL") {
      entries = entries.filter((e) => e.mood.toLowerCase() === filters.mood?.toLowerCase());
    }
    if (!filters?.includeArchived) {
      entries = entries.filter((e) => !e.isArchived);
    }
    return entries;
  }

  try {
    const user = await getOrCreateCurrentUser();
    const whereClause: any = {
      userId: user.id,
      ...(filters?.includeArchived ? {} : { isArchived: false }),
    };

    if (filters?.mood && filters.mood !== "ALL") {
      whereClause.mood = filters.mood;
    }
    if (filters?.search) {
      whereClause.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { content: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const entries = await prisma.journalEntry.findMany({
      where: whereClause,
      orderBy: { date: "desc" },
    });

    if (entries.length === 0 && !filters?.search) {
      return FALLBACK_JOURNAL_ENTRIES;
    }

    return entries.map((e) => ({
      id: e.id,
      userId: e.userId,
      title: e.title,
      content: e.content,
      date: e.date,
      mood: e.mood,
      tags: e.tags,
      isPrivate: e.isPrivate,
      isArchived: e.isArchived,
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.warn("DB journal query fallback:", error);
    return FALLBACK_JOURNAL_ENTRIES;
  }
}

export async function createJournalEntryAction(data: {
  title: string;
  content: string;
  date?: string;
  mood?: string;
  tags?: string[];
  isPrivate?: boolean;
}) {
  try {
    const user = await getOrCreateCurrentUser();
    const date = data.date || new Date().toISOString().slice(0, 10);
    const mood = data.mood || "Reflective";
    const tags = data.tags || [];

    if (!isDatabaseConfigured()) {
      const newEntry: JournalEntrySummary = {
        id: `jrnl-sim-${Date.now()}`,
        userId: user.id,
        title: data.title,
        content: data.content,
        date,
        mood,
        tags,
        isPrivate: data.isPrivate || false,
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { success: true, entry: newEntry };
    }

    const entry = await prisma.journalEntry.create({
      data: {
        userId: user.id,
        title: data.title,
        content: data.content,
        date,
        mood,
        tags,
        isPrivate: data.isPrivate || false,
        isArchived: false,
      },
    });

    revalidatePath("/life-tracker");
    return { success: true, entry };
  } catch (error) {
    console.error("Failed to create journal entry:", error);
    return { success: false, error: "Could not create journal entry." };
  }
}

export async function updateJournalEntryAction(
  id: string,
  data: {
    title?: string;
    content?: string;
    mood?: string;
    tags?: string[];
    isPrivate?: boolean;
    isArchived?: boolean;
  }
) {
  try {
    if (!isDatabaseConfigured()) {
      return { success: true };
    }

    const entry = await prisma.journalEntry.update({
      where: { id },
      data,
    });

    revalidatePath("/life-tracker");
    return { success: true, entry };
  } catch (error) {
    console.error("Failed to update journal entry:", error);
    return { success: false, error: "Could not update journal entry." };
  }
}

export async function toggleArchiveJournalEntryAction(id: string, currentArchived: boolean) {
  try {
    if (!isDatabaseConfigured()) {
      return { success: true, isArchived: !currentArchived };
    }

    const entry = await prisma.journalEntry.update({
      where: { id },
      data: { isArchived: !currentArchived },
    });

    revalidatePath("/life-tracker");
    return { success: true, entry };
  } catch (error) {
    console.error("Failed to toggle archive journal entry:", error);
    return { success: false, error: "Could not archive entry." };
  }
}

export async function deleteJournalEntryAction(id: string) {
  try {
    if (!isDatabaseConfigured()) {
      return { success: true };
    }

    await prisma.journalEntry.delete({
      where: { id },
    });

    revalidatePath("/life-tracker");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete journal entry:", error);
    return { success: false, error: "Could not delete journal entry." };
  }
}
