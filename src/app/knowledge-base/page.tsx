import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { KnowledgeBaseExperience } from "@/components/knowledge/knowledge-base-experience";
import {
  getKnowledgeFoldersAction,
  getKnowledgeNotesAction,
} from "@/server/actions/knowledge";

export const metadata = {
  title: "Knowledge Base | XASAN OS",
  description:
    "Second Brain: Hierarchical engineering patterns, IELTS preparation lab, CEFR Arabic linguistic notes, and research archives with AI Copilot & Semantic Retrieval.",
};

export default async function KnowledgeBasePage() {
  const [folders, notes] = await Promise.all([
    getKnowledgeFoldersAction(),
    getKnowledgeNotesAction({ includeArchived: true }),
  ]);

  return (
    <AppShell>
      <KnowledgeBaseExperience
        initialFolders={folders}
        initialNotes={notes}
      />
    </AppShell>
  );
}
