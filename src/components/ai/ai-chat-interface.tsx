"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Sparkles,
  Bot,
  User,
  Plus,
  Search,
  Pin,
  Trash2,
  Edit2,
  Paperclip,
  Check,
  X,
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Terminal,
  ArrowRight,
  Clock,
  ChevronLeft,
  ChevronRight,
  Copy,
  Calendar,
  Code2,
  GraduationCap,
  Wallet,
  BookOpen,
  Layers,
  HelpCircle,
} from "lucide-react";
import {
  AiConversationSummary,
  AiMessageSummary,
  AiProposedAction,
  AiChatMode,
  AiToolCallInfo,
} from "@/types";
import {
  createAiConversationAction,
  renameAiConversationAction,
  deleteAiConversationAction,
  togglePinConversationAction,
  sendAiMessageAction,
  confirmAiActionAction,
} from "@/server/actions/ai-chat";
import { AI_QUICK_DIRECTIVES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

interface AiChatInterfaceProps {
  conversations: AiConversationSummary[];
  activeConversation: AiConversationSummary;
  initialMessages: AiMessageSummary[];
  onSelectConversation: (conv: AiConversationSummary) => void;
  onConversationsChanged: (convs: AiConversationSummary[]) => void;
}

const CONTEXT_OPTIONS = [
  { id: "TASKS", label: "Today's Active Tasks" },
  { id: "STUDY", label: "IELTS & Arabic Progress" },
  { id: "FINANCE", label: "Ledger & Financial Runway" },
  { id: "PROJECTS", label: "Developer Ventures (Aurelius, etc.)" },
  { id: "NOTES", label: "Second Brain Architecture Notes" },
];

export function AiChatInterface({
  conversations,
  activeConversation,
  initialMessages,
  onSelectConversation,
  onConversationsChanged,
}: AiChatInterfaceProps) {
  const [messages, setMessages] = useState<AiMessageSummary[]>(initialMessages);
  const [inputPrompt, setInputPrompt] = useState("");
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const [isContextDropdownOpen, setIsContextDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingConvId, setEditingConvId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Sync initial messages when active conversation changes
  useEffect(() => {
    setMessages(initialMessages);
  }, [activeConversation.id, initialMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSubmitting]);

  // Filter conversations
  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Send message
  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim() || isSubmitting) return;

    const attachment = selectedContext
      ? `[Context attached: ${selectedContext}]`
      : undefined;

    // Optimistic user message
    const tempUserMsg: AiMessageSummary = {
      id: `temp-${Date.now()}`,
      conversationId: activeConversation.id,
      role: "user",
      content: textToSend,
      contextAttachment: attachment || null,
      tokenCount: Math.round(textToSend.split(" ").length * 1.3),
      createdAt: new Date().toISOString(),
    };

    const assistantMsgId = `ast-${Date.now()}`;
    const initialAssistantMsg: AiMessageSummary = {
      id: assistantMsgId,
      conversationId: activeConversation.id,
      role: "assistant",
      content: "",
      tokenCount: 0,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg, initialAssistantMsg]);
    setInputPrompt("");
    setSelectedContext(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConversation.id,
          message: textToSend,
          contextAttachment: attachment,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Streaming endpoint unavailable, using sovereign engine");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedContent = "";
      const toolCalls: AiToolCallInfo[] = [];
      let proposedAction: AiProposedAction | null = null;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.replace("data: ", ""));
              if (data.type === "delta") {
                streamedContent += data.text;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? { ...m, content: streamedContent }
                      : m
                  )
                );
              } else if (data.type === "tool_call") {
                toolCalls.push(data.toolCall);
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? { ...m, toolCalls: [...toolCalls] }
                      : m
                  )
                );
              } else if (data.type === "proposed_action") {
                proposedAction = data.proposedAction;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? { ...m, proposedAction }
                      : m
                  )
                );
              } else if (data.type === "done") {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          content: data.fullContent || streamedContent,
                          toolCalls:
                            data.toolCalls ||
                            (toolCalls.length ? toolCalls : undefined),
                          proposedAction:
                            data.proposedAction || proposedAction,
                        }
                      : m
                  )
                );
              }
            } catch (e) {
              // Partial SSE chunk
            }
          }
        }
      }
    } catch (err) {
      console.warn("Falling back to server action:", err);
      // Fallback directly to server action
      const res = await sendAiMessageAction(
        activeConversation.id,
        textToSend,
        attachment
      );

      if (res.success && res.assistantMessage) {
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== assistantMsgId),
          res.assistantMessage!,
        ]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm / Reject Proposed Action
  const handleConfirmAction = async (messageId: string, confirmed: boolean) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? {
              ...m,
              actionConfirmed: confirmed,
              proposedAction: m.proposedAction
                ? {
                    ...m.proposedAction,
                    status: confirmed ? "CONFIRMED" : "REJECTED",
                  }
                : undefined,
            }
          : m
      )
    );

    const res = await confirmAiActionAction(
      activeConversation.id,
      messageId,
      confirmed
    );

    if (res.success && confirmed) {
      // Append confirmation receipt to messages
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-confirm-${Date.now()}`,
          conversationId: activeConversation.id,
          role: "assistant",
          content: `### Authorization Confirmed & Executed\n\n${res.resultMessage || "Operation written to database."}\n- **Security Invariant**: Explicit user cryptographic approval.`,
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  };

  // Create new conversation
  const handleCreateNewConv = async () => {
    const res = await createAiConversationAction({
      title: `Architectural Session #${conversations.length + 1}`,
      mode: "GENERAL",
    });

    if (res.success && res.conversation) {
      const newConv = res.conversation as AiConversationSummary;
      onConversationsChanged([newConv, ...conversations]);
      onSelectConversation(newConv);
    }
  };

  // Rename conversation
  const handleSaveRename = async (id: string) => {
    if (!renameValue.trim()) return;
    await renameAiConversationAction(id, renameValue.trim());
    onConversationsChanged(
      conversations.map((c) =>
        c.id === id ? { ...c, title: renameValue.trim() } : c
      )
    );
    setEditingConvId(null);
  };

  // Delete conversation
  const handleDeleteConv = async (id: string) => {
    if (conversations.length <= 1) {
      alert("At least one conversation session must remain active.");
      return;
    }
    if (confirm("Delete this conversation and all its memory logs?")) {
      await deleteAiConversationAction(id);
      const remaining = conversations.filter((c) => c.id !== id);
      onConversationsChanged(remaining);
      if (activeConversation.id === id) {
        onSelectConversation(remaining[0]);
      }
    }
  };

  // Toggle pin
  const handleTogglePin = async (id: string, current: boolean) => {
    await togglePinConversationAction(id, current);
    onConversationsChanged(
      conversations.map((c) => (c.id === id ? { ...c, pinned: !current } : c))
    );
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#080D0B]">
      {/* Panel 1: Conversations Drawer */}
      {isSidebarOpen && (
        <div className="w-72 shrink-0 border-r border-[#25352C] bg-[#101915]/60 flex flex-col overflow-hidden animate-in slide-in-from-left duration-200">
          {/* Header & New Chat button */}
          <div className="p-3.5 border-b border-[#25352C] space-y-2.5 bg-[#080D0B]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#F3F7F4] flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#10B981]" />
                Sovereign Sessions
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#142019] text-[#10B981] border border-[#10B981]/20">
                {conversations.length}
              </span>
            </div>

            <button
              onClick={handleCreateNewConv}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] font-bold text-xs transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Conversation</span>
            </button>

            {/* Search sessions */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#98A69D]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sessions..."
                className="w-full pl-8 pr-2.5 py-1 text-xs bg-[#142019] border border-[#25352C] rounded-lg text-[#F3F7F4] placeholder-[#98A69D] focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === activeConversation.id;
              const isEditing = editingConvId === conv.id;

              return (
                <div
                  key={conv.id}
                  onClick={() => !isEditing && onSelectConversation(conv)}
                  className={`p-2.5 rounded-xl cursor-pointer transition-all border group relative ${
                    isSelected
                      ? "bg-[#142019] border-[#10B981] shadow-md shadow-[#10B981]/5"
                      : "bg-[#101915]/50 hover:bg-[#101915] border-[#25352C]/60 hover:border-[#25352C]"
                  }`}
                >
                  {isEditing ? (
                    <div
                      className="flex items-center gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        className="flex-1 bg-[#080D0B] text-xs text-[#F3F7F4] px-2 py-1 rounded border border-[#10B981] focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveRename(conv.id)}
                        className="p-1 text-[#10B981] hover:text-[#059669]"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingConvId(null)}
                        className="p-1 text-[#98A69D] hover:text-[#F3F7F4]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#080D0B] text-[#10B981] border border-[#10B981]/30">
                          {conv.mode}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTogglePin(conv.id, conv.pinned);
                            }}
                            className={`p-0.5 rounded transition-colors ${
                              conv.pinned
                                ? "text-[#10B981]"
                                : "text-transparent group-hover:text-[#98A69D]"
                            }`}
                            title={conv.pinned ? "Unpin session" : "Pin session"}
                          >
                            <Pin className="w-3 h-3 fill-current" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingConvId(conv.id);
                              setRenameValue(conv.title);
                            }}
                            className="p-0.5 text-transparent group-hover:text-[#98A69D] hover:text-[#F3F7F4] transition-colors"
                            title="Rename"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteConv(conv.id);
                            }}
                            className="p-0.5 text-transparent group-hover:text-[#98A69D] hover:text-[#EF4444] transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <h4
                        className={`text-xs font-bold truncate ${
                          isSelected ? "text-[#10B981]" : "text-[#F3F7F4]"
                        }`}
                      >
                        {conv.title}
                      </h4>

                      <p className="text-[11px] text-[#98A69D] truncate mt-0.5 font-sans">
                        {conv.lastMessageSnippet || "No messages yet"}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-[#98A69D]/80 font-mono mt-2 pt-1 border-t border-[#25352C]/40">
                        <span>{conv.messageCount} turns</span>
                        <span>{formatDate(conv.updatedAt)}</span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Panel 2: Active Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#080D0B]">
        {/* Chat Header Bar */}
        <div className="h-14 px-4 border-b border-[#25352C] bg-[#101915]/80 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="p-1.5 rounded-lg text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#142019] border border-[#25352C] transition-colors"
              title={isSidebarOpen ? "Hide Sessions" : "Show Sessions"}
            >
              {isSidebarOpen ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-[#F3F7F4] truncate max-w-xs sm:max-w-md">
                  {activeConversation.title}
                </h3>
                <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                  {activeConversation.mode}
                </span>
              </div>
              <p className="text-[10px] text-[#98A69D] font-mono">
                Model: Claude 3.7 Sonnet / Gemini 3.8 Flash &bull; Deterministic Invariants
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 rounded-lg bg-[#142019] text-[#10B981] border border-[#10B981]/20">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              ONLINE
            </span>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            const isAssistant = msg.role === "assistant";

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${
                  isUser ? "ml-auto justify-end" : "mr-auto justify-start"
                }`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className="space-y-2 max-w-2xl">
                  {/* Context Attachment pill if any */}
                  {msg.contextAttachment && (
                    <div className="text-[10px] font-mono text-[#10B981] bg-[#101915] px-2.5 py-1 rounded-lg border border-[#10B981]/30 inline-flex items-center gap-1.5">
                      <Paperclip className="w-3 h-3" />
                      <span>{msg.contextAttachment}</span>
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl p-4 border text-xs leading-relaxed relative group ${
                      isUser
                        ? "bg-[#10B981] text-[#080D0B] font-medium border-[#10B981] rounded-tr-none shadow-md"
                        : "glass-card bg-[#101915]/90 text-[#F3F7F4] border-[#25352C] rounded-tl-none shadow-sm"
                    }`}
                  >
                    {/* Copy button */}
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className={`absolute top-3 right-3 p-1 rounded transition-colors ${
                        isUser
                          ? "text-[#080D0B]/60 hover:text-[#080D0B]"
                          : "text-[#98A69D] hover:text-[#10B981]"
                      }`}
                      title="Copy to clipboard"
                    >
                      {copiedMsgId === msg.id ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>

                    {/* Markdown Body */}
                    <div className="prose prose-invert max-w-none space-y-2 whitespace-pre-wrap font-sans pr-4">
                      {msg.content ? (
                        <>
                          {msg.content}
                          {isSubmitting && isAssistant && (
                            <span className="inline-block w-1.5 h-3 ml-1 bg-[#10B981] animate-pulse align-middle" />
                          )}
                        </>
                      ) : (
                        <span className="flex items-center gap-2 text-[#10B981] font-mono text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                          <span>Streaming sovereign reasoning & tool execution...</span>
                        </span>
                      )}
                    </div>

                    {/* Read-Only Tool Execution Badge */}
                    {msg.toolCalls && msg.toolCalls.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-[#25352C] flex flex-wrap gap-1.5">
                        {msg.toolCalls.map((tc, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#080D0B] text-[#10B981] border border-[#10B981]/30 flex items-center gap-1"
                          >
                            <Terminal className="w-3 h-3" />
                            Tool: {tc.name}() [Read-Only]
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* MUTATIVE ACTION PROPOSAL CONFIRMATION CARD */}
                  {msg.proposedAction && (
                    <div className="glass-card rounded-2xl p-4 border-2 border-[#10B981] bg-[#142019] space-y-3 shadow-xl animate-in zoom-in-95 duration-200">
                      <div className="flex items-center justify-between pb-2 border-b border-[#25352C]">
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-[#10B981]" />
                          <h4 className="text-xs font-mono font-bold text-[#F3F7F4] uppercase tracking-wide">
                            Explicit Action Authorization
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#080D0B] text-[#10B981] border border-[#10B981]/40 font-bold">
                          {msg.proposedAction.type}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-bold text-[#F3F7F4]">
                          {msg.proposedAction.title}
                        </p>
                        <p className="text-[11px] text-[#98A69D]">
                          {msg.proposedAction.description}
                        </p>
                      </div>

                      {/* Payload preview */}
                      <div className="p-2.5 rounded-xl bg-[#080D0B] border border-[#25352C] font-mono text-[10px] text-[#10B981] space-y-0.5">
                        {Object.entries(msg.proposedAction.payload).map(
                          ([k, v]) => (
                            <div key={k} className="flex justify-between">
                              <span className="text-[#98A69D]">{k}:</span>
                              <span>{String(v)}</span>
                            </div>
                          )
                        )}
                      </div>

                      {/* Confirmation Controls */}
                      <div className="pt-2 border-t border-[#25352C] flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#98A69D]">
                          Zero arbitrary SQL &bull; User token signoff
                        </span>

                        {msg.actionConfirmed === null ||
                        msg.actionConfirmed === undefined ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleConfirmAction(msg.id, false)
                              }
                              className="px-3 py-1.5 rounded-lg bg-[#142019] hover:bg-[#25352C] text-[#EF4444] text-xs font-semibold border border-[#25352C] transition-colors"
                            >
                              Reject & Cancel
                            </button>
                            <button
                              onClick={() => handleConfirmAction(msg.id, true)}
                              className="px-3 py-1.5 rounded-lg bg-[#10B981] hover:bg-[#059669] text-[#080D0B] text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Authorize & Execute
                            </button>
                          </div>
                        ) : msg.actionConfirmed ? (
                          <span className="text-xs font-mono font-bold text-[#10B981] flex items-center gap-1.5">
                            <Check className="w-4 h-4" />
                            Authorized & Executed in DB
                          </span>
                        ) : (
                          <span className="text-xs font-mono font-bold text-[#EF4444] flex items-center gap-1.5">
                            <X className="w-4 h-4" />
                            Action Rejected & Cancelled
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Timestamp & token usage */}
                  <div
                    className={`flex items-center gap-2 text-[10px] font-mono text-[#98A69D] px-1 ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span>{formatDate(msg.createdAt)}</span>
                    {msg.tokenCount && <span>&bull; {msg.tokenCount} tokens</span>}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-[#142019] border border-[#25352C] flex items-center justify-center text-[#F3F7F4] shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Directives Toolbar */}
        <div className="px-4 py-2 border-t border-[#25352C]/60 bg-[#101915]/40 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-mono text-[#98A69D] uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#10B981]" />
            Directives:
          </span>
          {AI_QUICK_DIRECTIVES.map((d) => (
            <button
              key={d.id}
              onClick={() => handleSendMessage(d.prompt)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[#142019] hover:bg-[#10B981]/15 text-[#98A69D] hover:text-[#10B981] border border-[#25352C] hover:border-[#10B981]/30 transition-all shrink-0 flex items-center gap-1"
            >
              <span>{d.label}</span>
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 border-t border-[#25352C] bg-[#101915]/90 space-y-2">
          {selectedContext && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#080D0B] border border-[#10B981]/30 text-[#10B981] text-xs font-mono w-fit">
              <Paperclip className="w-3.5 h-3.5" />
              <span>Attached: {selectedContext}</span>
              <button
                onClick={() => setSelectedContext(null)}
                className="hover:text-[#EF4444] ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#080D0B] border border-[#25352C] focus-within:border-[#10B981] transition-all relative">
            {/* Attachment Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsContextDropdownOpen((prev) => !prev)}
                className="p-2 rounded-xl text-[#98A69D] hover:text-[#10B981] hover:bg-[#142019] transition-colors"
                title="Attach Context from System Database"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {isContextDropdownOpen && (
                <div className="absolute bottom-12 left-0 w-64 bg-[#101915] border border-[#25352C] rounded-xl shadow-2xl p-1.5 z-50 space-y-1">
                  <div className="text-[10px] font-mono font-semibold text-[#98A69D] px-2 py-1 uppercase">
                    Attach Context to Turn:
                  </div>
                  {CONTEXT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setSelectedContext(opt.label);
                        setIsContextDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-[#F3F7F4] hover:text-[#10B981] hover:bg-[#142019] rounded-lg transition-colors flex items-center justify-between"
                    >
                      <span>{opt.label}</span>
                      <Plus className="w-3 h-3 text-[#98A69D]" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input area */}
            <textarea
              rows={1}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask XASAN AI to plan tasks, evaluate IELTS writing, audit projects, or summarize treasury..."
              className="flex-1 bg-transparent text-xs text-[#F3F7F4] placeholder-[#98A69D] px-2 py-1.5 focus:outline-none resize-none max-h-32"
            />

            {/* Submit button */}
            <button
              onClick={() => handleSendMessage()}
              disabled={isSubmitting || !inputPrompt.trim()}
              className="p-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] transition-colors disabled:opacity-40 disabled:hover:bg-[#10B981] shrink-0"
              title="Send Directive"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
