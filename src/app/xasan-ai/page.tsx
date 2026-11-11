import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { XasanAiExperience } from "@/components/ai/xasan-ai-experience";
import {
  getAiConversationsAction,
  getConversationMessagesAction,
  getAiMemoriesAction,
  getAiUsageQuotaAction,
} from "@/server/actions/ai-chat";

export const metadata = {
  title: "XASAN AI | XASAN OS",
  description:
    "Autonomous cognitive copilot, controlled server-side tool caller, explicit action authorization, and personalized memory kernel.",
};

export default async function XasanAiPage() {
  const [conversations, memories, usage] = await Promise.all([
    getAiConversationsAction(),
    getAiMemoriesAction(),
    getAiUsageQuotaAction(),
  ]);

  const activeConv =
    conversations[0] || {
      id: "conv-1",
      userId: "demo-user-uuid-1",
      title: "Architecture Advisory & Consensus Invariants",
      mode: "ARCHITECT",
      pinned: true,
      messageCount: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

  const messages = await getConversationMessagesAction(activeConv.id);

  return (
    <AppShell>
      <XasanAiExperience
        initialConversations={conversations}
        initialActiveConversation={activeConv}
        initialMessages={messages}
        initialMemories={memories}
        initialUsage={usage}
      />
    </AppShell>
  );
}
