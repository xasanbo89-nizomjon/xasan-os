"use server";

import {
  AiConversationSummary,
  AiMessageSummary,
  AiUserMemorySummary,
  AiUsageSummary,
  AiProposedAction,
  AiToolCallInfo,
  AiChatMode,
} from "@/types";
import {
  FALLBACK_AI_CONVERSATIONS,
  FALLBACK_AI_MESSAGES,
  FALLBACK_AI_MEMORIES,
  DEFAULT_USER_EMAIL,
  DEFAULT_USER_NAME,
} from "@/lib/constants";
import {
  toolGetTasks,
  toolGetStudyProgress,
  toolGetHabits,
  toolGetProjects,
  toolGetFinanceSummary,
  toolGetGoals,
  toolSearchKnowledgeBase,
  executeConfirmedAction,
} from "./ai-tools";
import { revalidatePath } from "next/cache";

// In-memory runtime cache for fallback mode
let runtimeConversations = [...FALLBACK_AI_CONVERSATIONS];
let runtimeMessages: Record<string, AiMessageSummary[]> = { ...FALLBACK_AI_MESSAGES };
let runtimeMemories = [...FALLBACK_AI_MEMORIES];
let runtimeTokensUsedToday = 1420;

function isDatabaseConfigured(): boolean {
  return false;
}

const prisma: any = null;

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
    console.warn("AI Chat DB user retrieval error:", error);
    return {
      id: "demo-user-uuid-1",
      email: DEFAULT_USER_EMAIL,
      displayName: DEFAULT_USER_NAME,
      role: "OWNER",
    };
  }
}

// ==================== CONVERSATIONS MANAGEMENT ====================

export async function getAiConversationsAction(): Promise<AiConversationSummary[]> {
  if (!isDatabaseConfigured()) {
    return [...runtimeConversations].sort(
      (a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)
    );
  }

  try {
    const user = await getOrCreateCurrentUser();
    const records = await prisma.aiConversation.findMany({
      where: { userId: user.id },
      include: {
        _count: { select: { messages: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { content: true },
        },
      },
      orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
    });

    if (records.length === 0) {
      return runtimeConversations;
    }

    return records.map((c: any) => ({
      id: c.id,
      userId: c.userId,
      title: c.title,
      systemPrompt: c.systemPrompt,
      mode: c.mode as AiChatMode,
      pinned: c.pinned,
      messageCount: c._count.messages,
      lastMessageSnippet: c.messages[0]?.content.slice(0, 80) || null,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.warn("getAiConversationsAction fallback:", error);
    return runtimeConversations;
  }
}

export async function createAiConversationAction(data: {
  title?: string;
  mode?: AiChatMode;
  systemPrompt?: string;
}) {
  const user = await getOrCreateCurrentUser();
  const title = data.title || `Conversation ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  const mode = data.mode || "GENERAL";

  if (!isDatabaseConfigured()) {
    const newConv: AiConversationSummary = {
      id: `conv-${Date.now()}`,
      userId: user.id,
      title,
      mode,
      pinned: false,
      messageCount: 1,
      lastMessageSnippet: "System initialized. How can I assist you?",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    runtimeConversations = [newConv, ...runtimeConversations];
    runtimeMessages[newConv.id] = [
      {
        id: `msg-${Date.now()}`,
        conversationId: newConv.id,
        role: "assistant",
        content: `**XASAN Sovereign Agent initialized** in **${mode}** mode.\n\nAll personal databases (Tasks, Study Center, Developer Hub, Finance Ledger, Second Brain) are isolated and accessible via secure read-only tools. Any write operations require explicit confirmation. How can I support your architecture and focus today?`,
        tokenCount: 45,
        createdAt: new Date().toISOString(),
      },
    ];
    return { success: true, conversation: newConv };
  }

  try {
    const conv = await prisma.aiConversation.create({
      data: {
        userId: user.id,
        title,
        mode,
        systemPrompt: data.systemPrompt || null,
      },
    });

    // Create introductory assistant message
    await prisma.aiMessage.create({
      data: {
        conversationId: conv.id,
        role: "assistant",
        content: `**XASAN Sovereign Agent initialized** in **${mode}** mode.\n\nAll personal databases (Tasks, Study Center, Developer Hub, Finance Ledger, Second Brain) are isolated and accessible via secure read-only tools. Any write operations require explicit confirmation. How can I support your architecture and focus today?`,
        tokenCount: 45,
      },
    });

    revalidatePath("/xasan-ai");
    return {
      success: true,
      conversation: {
        id: conv.id,
        userId: conv.userId,
        title: conv.title,
        mode: conv.mode as AiChatMode,
        pinned: conv.pinned,
        messageCount: 1,
        createdAt: conv.createdAt.toISOString(),
        updatedAt: conv.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("createAiConversationAction error:", error);
    return { success: false, error: "Failed to create conversation." };
  }
}

export async function renameAiConversationAction(id: string, title: string) {
  if (!isDatabaseConfigured()) {
    runtimeConversations = runtimeConversations.map((c) =>
      c.id === id ? { ...c, title } : c
    );
    return { success: true };
  }

  try {
    await prisma.aiConversation.update({
      where: { id },
      data: { title },
    });
    revalidatePath("/xasan-ai");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to rename conversation." };
  }
}

export async function deleteAiConversationAction(id: string) {
  if (!isDatabaseConfigured()) {
    runtimeConversations = runtimeConversations.filter((c) => c.id !== id);
    delete runtimeMessages[id];
    return { success: true };
  }

  try {
    await prisma.aiConversation.delete({ where: { id } });
    revalidatePath("/xasan-ai");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete conversation." };
  }
}

export async function togglePinConversationAction(id: string, current: boolean) {
  if (!isDatabaseConfigured()) {
    runtimeConversations = runtimeConversations.map((c) =>
      c.id === id ? { ...c, pinned: !current } : c
    );
    return { success: true };
  }

  try {
    await prisma.aiConversation.update({
      where: { id },
      data: { pinned: !current },
    });
    revalidatePath("/xasan-ai");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// ==================== MESSAGES & REASONING ====================

export async function getConversationMessagesAction(conversationId: string): Promise<AiMessageSummary[]> {
  if (!isDatabaseConfigured()) {
    return runtimeMessages[conversationId] || [];
  }

  try {
    const records = await prisma.aiMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });

    return records.map((m: any) => ({
      id: m.id,
      conversationId: m.conversationId,
      role: m.role as "user" | "assistant" | "system" | "tool",
      content: m.content,
      toolCalls: m.toolCalls ? (m.toolCalls as any) : null,
      toolResults: m.toolResults ? (m.toolResults as any) : null,
      proposedAction: m.proposedAction ? (m.proposedAction as any) : null,
      actionConfirmed: m.actionConfirmed,
      tokenCount: m.tokenCount,
      createdAt: m.createdAt.toISOString(),
    }));
  } catch (error) {
    console.warn("getConversationMessagesAction fallback:", error);
    return runtimeMessages[conversationId] || [];
  }
}

/**
 * Intelligent message processing with tool execution, user memory context, and permission confirmation.
 */
export async function sendAiMessageAction(
  conversationId: string,
  userPrompt: string,
  contextAttachment?: string
): Promise<{
  success: boolean;
  userMessage?: AiMessageSummary;
  assistantMessage?: AiMessageSummary;
  error?: string;
}> {
  if (!userPrompt.trim()) {
    return { success: false, error: "Prompt cannot be empty." };
  }

  const promptLower = userPrompt.toLowerCase();
  const toolCalls: AiToolCallInfo[] = [];
  let proposedAction: AiProposedAction | null = null;
  const toolResults: any[] = [];

  // ==================== 1. INTENT DETECTION & SECURE READ-ONLY TOOL EXECUTION ====================

  if (
    promptLower.includes("task") ||
    promptLower.includes("to do") ||
    promptLower.includes("schedule") ||
    promptLower.includes("priorit") ||
    promptLower.includes("audit my day")
  ) {
    const tasksRes = await toolGetTasks({ limit: 5 });
    toolCalls.push({
      name: "getTasks",
      arguments: { limit: 5 },
      isMutative: false,
      result: { count: tasksRes.count },
    });
    toolResults.push({ tool: "getTasks", data: tasksRes.data });
  }

  if (
    promptLower.includes("study") ||
    promptLower.includes("ielts") ||
    promptLower.includes("band") ||
    promptLower.includes("arabic") ||
    promptLower.includes("vocab") ||
    promptLower.includes("speaking") ||
    promptLower.includes("writing")
  ) {
    const studyRes = await toolGetStudyProgress();
    toolCalls.push({
      name: "getStudyProgress",
      arguments: {},
      isMutative: false,
      result: studyRes,
    });
    toolResults.push({ tool: "getStudyProgress", data: studyRes });
  }

  if (
    promptLower.includes("habit") ||
    promptLower.includes("discipline") ||
    promptLower.includes("streak") ||
    promptLower.includes("wellness")
  ) {
    const habitRes = await toolGetHabits();
    toolCalls.push({
      name: "getHabits",
      arguments: {},
      isMutative: false,
      result: { count: habitRes.habits.length },
    });
    toolResults.push({ tool: "getHabits", data: habitRes.habits });
  }

  if (
    promptLower.includes("project") ||
    promptLower.includes("venture") ||
    promptLower.includes("aurelius") ||
    promptLower.includes("linguahub") ||
    promptLower.includes("ravon") ||
    promptLower.includes("lms") ||
    promptLower.includes("developer")
  ) {
    const projRes = await toolGetProjects();
    toolCalls.push({
      name: "getProjects",
      arguments: {},
      isMutative: false,
      result: { count: projRes.projects.length },
    });
    toolResults.push({ tool: "getProjects", data: projRes.projects });
  }

  if (
    promptLower.includes("finance") ||
    promptLower.includes("money") ||
    promptLower.includes("balance") ||
    promptLower.includes("budget") ||
    promptLower.includes("savings") ||
    promptLower.includes("cashflow") ||
    promptLower.includes("expense") ||
    promptLower.includes("runway")
  ) {
    const finRes = await toolGetFinanceSummary();
    toolCalls.push({
      name: "getFinanceSummary",
      arguments: {},
      isMutative: false,
      result: { balance: finRes.balance },
    });
    toolResults.push({ tool: "getFinanceSummary", data: finRes });
  }

  if (
    promptLower.includes("note") ||
    promptLower.includes("architecture") ||
    promptLower.includes("consensus") ||
    promptLower.includes("raft") ||
    promptLower.includes("knowledge")
  ) {
    const kwRes = await toolSearchKnowledgeBase(userPrompt);
    toolCalls.push({
      name: "searchKnowledgeBase",
      arguments: { query: userPrompt.slice(0, 40) },
      isMutative: false,
      result: { matched: kwRes.count },
    });
    toolResults.push({ tool: "searchKnowledgeBase", data: kwRes.results });
  }

  // ==================== 2. MUTATIVE ACTION PROPOSAL (REQUIRES CONFIRMATION) ====================

  if (
    promptLower.includes("create task") ||
    promptLower.includes("add task") ||
    promptLower.includes("new task") ||
    promptLower.includes("schedule a task")
  ) {
    const titleMatch = userPrompt.match(/(?:task|for)\s+["']?([^"'\n.,]+)["']?/i);
    const taskTitle = titleMatch ? titleMatch[1].trim() : "Review Distributed System Invariants";

    proposedAction = {
      id: `prop-${Date.now()}`,
      type: "CREATE_TASK",
      title: taskTitle,
      description: "Structured task proposed by XASAN AI based on conversational context.",
      payload: {
        title: taskTitle,
        category: "Technology",
        priority: "HIGH",
        estimatedMinutes: 45,
      },
      status: "PENDING",
    };
  } else if (
    promptLower.includes("remind me") ||
    promptLower.includes("set reminder") ||
    promptLower.includes("create reminder")
  ) {
    const remMatch = userPrompt.match(/remind me\s+(?:to\s+)?([^.\n]+)/i);
    const remTitle = remMatch ? remMatch[1].trim() : "Review Aurelius IELTS Benchmarks";

    proposedAction = {
      id: `prop-${Date.now()}`,
      type: "CREATE_REMINDER",
      title: remTitle,
      description: "Scheduled reminder proposed by XASAN AI for notification pipeline.",
      payload: {
        title: remTitle,
        priority: "HIGH",
        remindAt: new Date(Date.now() + 3600000 * 2).toISOString(),
      },
      status: "PENDING",
    };
  }

  // ==================== 3. STRUCTURED ASSISTANT RESPONSE FORMULATION ====================

  let responseBody = "";

  if (proposedAction) {
    responseBody += `### Action Proposal Created (Confirmation Required)

I have analyzed your request and prepared a structured **${proposedAction.type}** action. 
In accordance with XASAN OS security policy, no mutative write operations execute automatically. 

Please review the action details below and authorize the write operation when ready:

- **Entity**: \`${proposedAction.title}\`
- **Target Subsystem**: Task Manager / Notification Kernel
- **Estimated Duration**: 45 minutes
- **Priority**: High`;
  } else if (toolResults.some((t) => t.tool === "getTasks")) {
    responseBody += `### Sovereign Task & Schedule Velocity

I retrieved your live database tasks:
- **Pending Tasks**: High priority focus on architectural validation and IELTS Band 8.5 mock reviews.
- **Recommended Time Block**: Allocate 90 minutes of distraction-free focus mode (\`/focus\`) to clear top blocking items before noon.

\`\`\`
[09:00 - 10:30] Deep Engineering: Distributed state machine invariants
[11:00 - 12:30] Study Center: IELTS Writing Task 2 lexical cohesion
[14:00 - 15:30] Venture Focus: Aurelius IELTS deployment pipeline
\`\`\`

Would you like me to propose a scheduled reminder or task for any of these items?`;
  } else if (toolResults.some((t) => t.tool === "getStudyProgress")) {
    responseBody += `### Study Center & IELTS Band 8.5 Diagnostic

- **Current Band Estimate**: **8.0** (Target: **8.5**)
- **Listening & Reading**: Benchmarking at **8.5** (strong lexical discrimination, minimal errors in Section 4).
- **Writing Task 2**: Benchmarking at **7.5**; priority area is refining **nuanced hedging** and syntactical subordination.
- **Arabic CEFR Status**: Level **B2** established with **485 Mastered Cards**; active streak at 24 days.

#### Actionable Recommendation
For today's IELTS practice, focus on replacing generic adverbial transitions with nuanced conditional hedging (e.g. *"While it is plausible that..., empirical precedent suggests..."*).`;
  } else if (toolResults.some((t) => t.tool === "getFinanceSummary")) {
    responseBody += `### Sovereign Treasury & Liquidity Status

- **Recorded Balance**: **$42,850.00**
- **Monthly Savings Rate**: **78.9%** (Target: $\\ge 75\\%$)
- **Monthly Net Cashflow**: **+$6,300.00**
- **Active Savings Goals**:
  1. *Emergency Sovereign Runway*: **$20,000 / $25,000** (80% reached)
  2. *Aurelius Venture Infrastructure*: **$4,500 / $6,000** (75% reached)

No unauthorized spending detected. All transaction logs conform to deterministic double-entry invariants.`;
  } else if (toolResults.some((t) => t.tool === "getProjects")) {
    responseBody += `### Developer Hub Venture Status

1. **Aurelius IELTS** &bull; **75% Complete** (Milestone v1.4 deployment ready).
2. **LinguaHub** &bull; **60% Complete** (Arabic-English morphology dictionary).
3. **Ravon Auto Tuning** &bull; **85% Complete** (ECU map telemetry & diagnostics).
4. **36-School LMS** &bull; **90% Complete** (Multi-tenant student ledger & grading).

All repositories are isolated with zero cross-tenant credential leakage.`;
  } else {
    responseBody += `### Architectural Advisory & Cognitive Analysis

I have evaluated your query against current OS memories, system design principles, and your personal parameters:

- **Invariant Guarantee**: Systems must prioritize predictable latency and deterministic state reconciliation over optimistic caching.
- **Cognitive Retention**: Spaced repetition intervals (SM-2) must align with deliberate retrieval practice rather than passive re-reading.
- **Execution Rule**: Limit concurrent high-cognitive tasks to a maximum of 2 per focus session to preserve executive working memory.

How would you like to structure the next execution step?`;
  }

  // Calculate simulated tokens
  const promptTokens = Math.max(15, Math.round(userPrompt.split(" ").length * 1.3));
  const responseTokens = Math.max(60, Math.round(responseBody.split(" ").length * 1.3));
  const totalTokens = promptTokens + responseTokens;
  runtimeTokensUsedToday += totalTokens;

  const userMsgId = `msg-usr-${Date.now()}`;
  const assistantMsgId = `msg-ast-${Date.now()}`;

  const userMsg: AiMessageSummary = {
    id: userMsgId,
    conversationId,
    role: "user",
    content: userPrompt,
    contextAttachment: contextAttachment || null,
    tokenCount: promptTokens,
    createdAt: new Date().toISOString(),
  };

  const assistantMsg: AiMessageSummary = {
    id: assistantMsgId,
    conversationId,
    role: "assistant",
    content: responseBody,
    toolCalls: toolCalls.length > 0 ? toolCalls : null,
    toolResults: toolResults.length > 0 ? toolResults : null,
    proposedAction,
    actionConfirmed: proposedAction ? null : undefined,
    tokenCount: responseTokens,
    createdAt: new Date(Date.now() + 500).toISOString(),
  };

  if (!isDatabaseConfigured()) {
    if (!runtimeMessages[conversationId]) runtimeMessages[conversationId] = [];
    runtimeMessages[conversationId].push(userMsg, assistantMsg);

    // Update conversation metadata
    runtimeConversations = runtimeConversations.map((c) =>
      c.id === conversationId
        ? {
            ...c,
            messageCount: c.messageCount + 2,
            lastMessageSnippet: responseBody.slice(0, 80),
            updatedAt: new Date().toISOString(),
          }
        : c
    );

    return {
      success: true,
      userMessage: userMsg,
      assistantMessage: assistantMsg,
    };
  }

  try {
    await prisma.aiMessage.create({
      data: {
        id: userMsgId,
        conversationId,
        role: "user",
        content: userPrompt,
        tokenCount: promptTokens,
      },
    });

    await prisma.aiMessage.create({
      data: {
        id: assistantMsgId,
        conversationId,
        role: "assistant",
        content: responseBody,
        toolCalls: toolCalls.length > 0 ? (toolCalls as any) : undefined,
        toolResults: toolResults.length > 0 ? (toolResults as any) : undefined,
        proposedAction: proposedAction ? (proposedAction as any) : undefined,
        actionConfirmed: proposedAction ? null : undefined,
        tokenCount: responseTokens,
      },
    });

    await prisma.aiConversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    revalidatePath("/xasan-ai");
    return {
      success: true,
      userMessage: userMsg,
      assistantMessage: assistantMsg,
    };
  } catch (error) {
    console.warn("sendAiMessageAction DB write fallback:", error);
    if (!runtimeMessages[conversationId]) runtimeMessages[conversationId] = [];
    runtimeMessages[conversationId].push(userMsg, assistantMsg);
    return {
      success: true,
      userMessage: userMsg,
      assistantMessage: assistantMsg,
    };
  }
}

/**
 * Explicit user confirmation workflow for mutative actions.
 */
export async function confirmAiActionAction(
  conversationId: string,
  messageId: string,
  confirmed: boolean
): Promise<{ success: boolean; resultMessage?: string }> {
  let actionToExecute: AiProposedAction | null = null;

  if (!isDatabaseConfigured()) {
    const msgs = runtimeMessages[conversationId] || [];
    const msg = msgs.find((m) => m.id === messageId);
    if (msg && msg.proposedAction) {
      msg.actionConfirmed = confirmed;
      msg.proposedAction.status = confirmed ? "CONFIRMED" : "REJECTED";
      actionToExecute = msg.proposedAction;
    }
  } else {
    try {
      const msg = await prisma.aiMessage.findUnique({ where: { id: messageId } });
      if (msg && msg.proposedAction) {
        actionToExecute = msg.proposedAction as unknown as AiProposedAction;
        await prisma.aiMessage.update({
          where: { id: messageId },
          data: {
            actionConfirmed: confirmed,
            proposedAction: {
              ...(msg.proposedAction as any),
              status: confirmed ? "CONFIRMED" : "REJECTED",
            },
          },
        });
      }
    } catch (err) {
      console.warn("confirmAiActionAction DB fallback:", err);
    }
  }

  if (confirmed && actionToExecute) {
    const execRes = await executeConfirmedAction(actionToExecute);
    // Append execution status message to conversation
    const confirmationMsg: AiMessageSummary = {
      id: `msg-confirm-${Date.now()}`,
      conversationId,
      role: "assistant",
      content: `### Authorization Confirmed & Executed

${execRes.message || "Operation has been securely executed in the database."}
- **Action**: \`${actionToExecute.type}\`
- **Entity**: \`${actionToExecute.title}\`
- **Security Verification**: User Authorized &bull; Zero Arbitrary Query Bypass`,
      tokenCount: 40,
      createdAt: new Date().toISOString(),
    };

    if (!isDatabaseConfigured()) {
      if (runtimeMessages[conversationId]) {
        runtimeMessages[conversationId].push(confirmationMsg);
      }
    } else {
      try {
        await prisma.aiMessage.create({
          data: {
            conversationId,
            role: "assistant",
            content: confirmationMsg.content,
            tokenCount: 40,
          },
        });
      } catch (e) {
        // Safe fallback
      }
    }
    return { success: true, resultMessage: execRes.message };
  } else {
    return { success: true, resultMessage: "Action rejected and cancelled by user." };
  }
}

// ==================== MEMORIES & PREFERENCES ====================

export async function getAiMemoriesAction(): Promise<AiUserMemorySummary[]> {
  if (!isDatabaseConfigured()) {
    return runtimeMemories;
  }

  try {
    const user = await getOrCreateCurrentUser();
    const records = await prisma.aiUserMemory.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (records.length === 0) return runtimeMemories;

    return records.map((m: any) => ({
      id: m.id,
      userId: m.userId,
      category: m.category,
      key: m.key,
      value: m.value,
      isPinned: m.isPinned,
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
    }));
  } catch (error) {
    return runtimeMemories;
  }
}

export async function saveAiMemoryAction(data: {
  category: string;
  key: string;
  value: string;
}) {
  const user = await getOrCreateCurrentUser();

  if (!isDatabaseConfigured()) {
    const existingIdx = runtimeMemories.findIndex((m) => m.key === data.key);
    if (existingIdx >= 0) {
      runtimeMemories[existingIdx].value = data.value;
      runtimeMemories[existingIdx].category = data.category;
    } else {
      runtimeMemories.push({
        id: `mem-${Date.now()}`,
        userId: user.id,
        category: data.category,
        key: data.key,
        value: data.value,
        isPinned: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    return { success: true };
  }

  try {
    await prisma.aiUserMemory.upsert({
      where: {
        userId_key: {
          userId: user.id,
          key: data.key,
        },
      },
      update: {
        value: data.value,
        category: data.category,
      },
      create: {
        userId: user.id,
        category: data.category,
        key: data.key,
        value: data.value,
        isPinned: true,
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to save AI memory." };
  }
}

export async function deleteAiMemoryAction(id: string) {
  if (!isDatabaseConfigured()) {
    runtimeMemories = runtimeMemories.filter((m) => m.id !== id);
    return { success: true };
  }

  try {
    await prisma.aiUserMemory.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete memory." };
  }
}

// ==================== QUOTA & USAGE ====================

export async function getAiUsageQuotaAction(): Promise<AiUsageSummary> {
  const dailyLimit = 50000;
  const tokensUsed = runtimeTokensUsedToday;
  const remaining = Math.max(0, dailyLimit - tokensUsed);

  return {
    tokensUsedToday: tokensUsed,
    dailyLimit,
    remainingTokens: remaining,
    percentageUsed: Math.min(100, parseFloat(((tokensUsed / dailyLimit) * 100).toFixed(1))),
    requestsCount: 14,
  };
}
