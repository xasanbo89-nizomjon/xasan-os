import OpenAI from "openai";
import {
  toolGetTasks,
  toolGetStudyProgress,
  toolGetHabits,
  toolGetProjects,
  toolGetFinanceSummary,
  toolGetGoals,
  toolSearchKnowledgeBase,
} from "@/server/actions/ai-tools";
import { AiProposedAction, AiToolCallInfo } from "@/types";

// Initialize OpenAI client strictly on the server
export function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.includes("sk-placeholder")) {
    return null;
  }
  return new OpenAI({ apiKey });
}

// ==================== OPENAI FUNCTION / TOOL DEFINITIONS ====================

export const OPENAI_TOOLS: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "getTasks",
      description: "Retrieves user active, pending, or overdue tasks with priority and deadlines from the sovereign task database.",
      parameters: {
        type: "object",
        properties: {
          status: {
            type: "string",
            enum: ["PENDING", "IN_PROGRESS", "COMPLETED"],
            description: "Filter tasks by status",
          },
          priority: {
            type: "string",
            enum: ["LOW", "NORMAL", "HIGH", "URGENT"],
            description: "Filter tasks by priority",
          },
          limit: {
            type: "number",
            description: "Maximum number of tasks to return (default: 5)",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getStudyProgress",
      description: "Retrieves IELTS Band score estimates (target 8.5, estimated 8.0), section breakdown, and Arabic CEFR B2/C1 vocabulary retention stats.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getHabits",
      description: "Retrieves active habit discipline protocols, current streaks, best streaks, and daily completion checks.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getProjects",
      description: "Retrieves Developer Hub personal ventures: Aurelius IELTS, LinguaHub, Ravon Auto Tuning, and 36-School LMS.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getFinanceSummary",
      description: "Retrieves deterministic double-entry ledger balance, monthly income, expenses, net savings rate, and strategic savings goals.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getGoals",
      description: "Retrieves high-level strategic life and educational vision goals with progress percentages.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "searchKnowledgeBase",
      description: "Searches Second Brain documentation, system design memos, and research notes using semantic retrieval.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The conceptual or architectural search query",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "proposeCreateTask",
      description: "Proposes creating a new task. Does NOT execute immediately; generates a pending action confirmation card for explicit user authorization.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Title of the task to create" },
          category: { type: "string", description: "Category (e.g. Technology, Education, General)" },
          priority: { type: "string", enum: ["LOW", "NORMAL", "HIGH", "URGENT"] },
          estimatedMinutes: { type: "number", description: "Estimated duration in minutes" },
        },
        required: ["title"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "proposeCreateReminder",
      description: "Proposes scheduling a reminder. Generates an explicit action confirmation card before write execution.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Title of the reminder" },
          priority: { type: "string", enum: ["LOW", "NORMAL", "HIGH", "URGENT"] },
          minutesFromNow: { type: "number", description: "Minutes from now to trigger reminder (default 120)" },
        },
        required: ["title"],
      },
    },
  },
];

// ==================== SERVER-SIDE TOOL DISPATCHER ====================

export async function executeOpenAiToolCall(
  name: string,
  args: Record<string, any>
): Promise<{
  result: any;
  toolCallInfo: AiToolCallInfo;
  proposedAction?: AiProposedAction;
}> {
  if (name === "getTasks") {
    const data = await toolGetTasks(args);
    return {
      result: data,
      toolCallInfo: { name: "getTasks", arguments: args, isMutative: false, result: { count: data.count } },
    };
  }

  if (name === "getStudyProgress") {
    const data = await toolGetStudyProgress();
    return {
      result: data,
      toolCallInfo: { name: "getStudyProgress", arguments: args, isMutative: false, result: data },
    };
  }

  if (name === "getHabits") {
    const data = await toolGetHabits();
    return {
      result: data,
      toolCallInfo: { name: "getHabits", arguments: args, isMutative: false, result: { count: data.habits.length } },
    };
  }

  if (name === "getProjects") {
    const data = await toolGetProjects();
    return {
      result: data,
      toolCallInfo: { name: "getProjects", arguments: args, isMutative: false, result: { count: data.projects.length } },
    };
  }

  if (name === "getFinanceSummary") {
    const data = await toolGetFinanceSummary();
    return {
      result: data,
      toolCallInfo: { name: "getFinanceSummary", arguments: args, isMutative: false, result: { balance: data.balance } },
    };
  }

  if (name === "getGoals") {
    const data = await toolGetGoals();
    return {
      result: data,
      toolCallInfo: { name: "getGoals", arguments: args, isMutative: false, result: { count: data.savingsGoals.length } },
    };
  }

  if (name === "searchKnowledgeBase") {
    const data = await toolSearchKnowledgeBase(args.query || "");
    return {
      result: data,
      toolCallInfo: { name: "searchKnowledgeBase", arguments: args, isMutative: false, result: { count: data.count } },
    };
  }

  if (name === "proposeCreateTask") {
    const taskTitle = args.title || "New Task";
    const proposedAction: AiProposedAction = {
      id: `prop-${Date.now()}`,
      type: "CREATE_TASK",
      title: taskTitle,
      description: "Structured task proposal generated via OpenAI reasoning. Requires explicit authorization.",
      payload: {
        title: taskTitle,
        category: args.category || "Technology",
        priority: args.priority || "NORMAL",
        estimatedMinutes: args.estimatedMinutes || 45,
      },
      status: "PENDING",
    };
    return {
      result: { status: "PROPOSED", message: "Action proposal created. Awaiting user confirmation." },
      toolCallInfo: { name: "proposeCreateTask", arguments: args, isMutative: true },
      proposedAction,
    };
  }

  if (name === "proposeCreateReminder") {
    const remTitle = args.title || "Reminder";
    const minutes = args.minutesFromNow || 120;
    const proposedAction: AiProposedAction = {
      id: `prop-${Date.now()}`,
      type: "CREATE_REMINDER",
      title: remTitle,
      description: "Scheduled reminder proposed by OpenAI. Requires explicit authorization.",
      payload: {
        title: remTitle,
        priority: args.priority || "HIGH",
        remindAt: new Date(Date.now() + minutes * 60000).toISOString(),
      },
      status: "PENDING",
    };
    return {
      result: { status: "PROPOSED", message: "Reminder proposal created. Awaiting user confirmation." },
      toolCallInfo: { name: "proposeCreateReminder", arguments: args, isMutative: true },
      proposedAction,
    };
  }

  return {
    result: { error: `Unknown tool: ${name}` },
    toolCallInfo: { name, arguments: args, isMutative: false },
  };
}
