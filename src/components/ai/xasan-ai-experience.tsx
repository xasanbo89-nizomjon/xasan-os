"use client";

import React, { useState } from "react";
import {
  AiConversationSummary,
  AiMessageSummary,
  AiUserMemorySummary,
  AiUsageSummary,
} from "@/types";
import { AiUsageBar } from "./ai-usage-bar";
import { AiChatInterface } from "./ai-chat-interface";
import { AiMemoryModal } from "./ai-memory-modal";
import { getConversationMessagesAction } from "@/server/actions/ai-chat";

interface XasanAiExperienceProps {
  initialConversations: AiConversationSummary[];
  initialActiveConversation: AiConversationSummary;
  initialMessages: AiMessageSummary[];
  initialMemories: AiUserMemorySummary[];
  initialUsage: AiUsageSummary;
}

export function XasanAiExperience({
  initialConversations,
  initialActiveConversation,
  initialMessages,
  initialMemories,
  initialUsage,
}: XasanAiExperienceProps) {
  const [conversations, setConversations] = useState<AiConversationSummary[]>(initialConversations);
  const [activeConversation, setActiveConversation] = useState<AiConversationSummary>(initialActiveConversation);
  const [messages, setMessages] = useState<AiMessageSummary[]>(initialMessages);
  const [memories, setMemories] = useState<AiUserMemorySummary[]>(initialMemories);
  const [usage, setUsage] = useState<AiUsageSummary>(initialUsage);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);

  // Switch active conversation
  const handleSelectConversation = async (conv: AiConversationSummary) => {
    setActiveConversation(conv);
    try {
      const msgs = await getConversationMessagesAction(conv.id);
      setMessages(msgs);
    } catch (err) {
      console.error("Failed to load messages for session:", err);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] -m-6 overflow-hidden bg-[#080D0B]">
      {/* Top Security & Token Quota Meter */}
      <AiUsageBar
        usage={usage}
        onOpenMemoryModal={() => setIsMemoryModalOpen(true)}
      />

      {/* Main Chat Interface */}
      <AiChatInterface
        conversations={conversations}
        activeConversation={activeConversation}
        initialMessages={messages}
        onSelectConversation={handleSelectConversation}
        onConversationsChanged={(updated) => setConversations(updated)}
      />

      {/* Cognitive Memory & Preferences Modal */}
      <AiMemoryModal
        isOpen={isMemoryModalOpen}
        onClose={() => setIsMemoryModalOpen(false)}
        memories={memories}
        onMemoriesUpdated={(updated) => setMemories(updated)}
      />
    </div>
  );
}
