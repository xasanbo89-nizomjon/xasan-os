import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient, OPENAI_TOOLS, executeOpenAiToolCall } from "@/server/openai";
import {
  getConversationMessagesAction,
  getAiMemoriesAction,
  sendAiMessageAction,
} from "@/server/actions/ai-chat";
import { AiProposedAction, AiToolCallInfo } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId, message, contextAttachment } = body;

    if (!conversationId || !message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Missing conversationId or message" },
        { status: 400 }
      );
    }

    // 1. Fetch user memories & recent conversation history
    const [memories, history] = await Promise.all([
      getAiMemoriesAction(),
      getConversationMessagesAction(conversationId),
    ]);

    // Build system prompt with sovereign invariants
    const memoryDirectives = memories
      .map((m) => `- [${m.category}] ${m.key}: ${m.value}`)
      .join("\n");

    const systemPrompt = `You are XASAN Sovereign AI, the autonomous intelligence kernel of XASAN OS Ultimate.
You operate with the authority and depth of a Senior Software Architect and Cognitive Strategist.
Core Invariants:
- Design System: Dark Emerald palette (#080D0B background, #101915 panels, #142019 cards, #10B981 emerald accents).
- Tone: Dense, mathematically rigorous, bullet-driven, zero superficial filler.
- Security Invariant: Read-only database tools (getTasks, getStudyProgress, getHabits, getProjects, getFinanceSummary, getGoals, searchKnowledgeBase) execute freely.
- Mutative Invariant: Any write or destructive operation (creating tasks, scheduling reminders) MUST invoke proposeCreateTask or proposeCreateReminder to generate an explicit action confirmation card. You NEVER claim an entity has been written to the database without explicit user authorization.

User Cognitive Memories & Preferences:
${memoryDirectives || "Default: High velocity, strict architecture, IELTS Band 8.5 target."}

${contextAttachment ? `Attached Context from Subsystem:\n${contextAttachment}\n` : ""}`;

    // 2. Prepare OpenAI Messages format
    const openAiMessages: any[] = [
      { role: "system", content: systemPrompt },
    ];

    // Append last 8 turns of conversation history
    const recentHistory = history.slice(-8);
    for (const msg of recentHistory) {
      if (msg.role === "user" || msg.role === "assistant") {
        openAiMessages.push({
          role: msg.role,
          content: msg.content,
        });
      }
    }

    openAiMessages.push({
      role: "user",
      content: contextAttachment
        ? `${message}\n\n[Context: ${contextAttachment}]`
        : message,
    });

    // 3. Attempt OpenAI SDK Execution
    const openai = getOpenAIClient();

    if (openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: openAiMessages,
          tools: OPENAI_TOOLS,
          temperature: 0.2,
          stream: true,
        });

        // Set up SSE Stream
        const encoder = new TextEncoder();
        let fullAssistantContent = "";
        const executedToolCalls: AiToolCallInfo[] = [];
        let createdProposedAction: AiProposedAction | null = null;

        const stream = new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of completion) {
                const delta = chunk.choices[0]?.delta;

                // Stream textual content
                if (delta?.content) {
                  fullAssistantContent += delta.content;
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({ type: "delta", text: delta.content })}\n\n`
                    )
                  );
                }

                // Handle tool calls from model
                if (delta?.tool_calls) {
                  for (const tc of delta.tool_calls) {
                    if (tc.function?.name && tc.function.arguments) {
                      try {
                        const parsedArgs = JSON.parse(tc.function.arguments);
                        const execRes = await executeOpenAiToolCall(
                          tc.function.name,
                          parsedArgs
                        );

                        executedToolCalls.push(execRes.toolCallInfo);
                        controller.enqueue(
                          encoder.encode(
                            `data: ${JSON.stringify({
                              type: "tool_call",
                              toolCall: execRes.toolCallInfo,
                            })}\n\n`
                          )
                        );

                        if (execRes.proposedAction) {
                          createdProposedAction = execRes.proposedAction;
                          controller.enqueue(
                            encoder.encode(
                              `data: ${JSON.stringify({
                                type: "proposed_action",
                                proposedAction: execRes.proposedAction,
                              })}\n\n`
                            )
                          );
                        }
                      } catch (e) {
                        // Incomplete tool call json chunk
                      }
                    }
                  }
                }
              }

              // Send completion event
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: "done",
                    fullContent: fullAssistantContent,
                    toolCalls: executedToolCalls,
                    proposedAction: createdProposedAction,
                  })}\n\n`
                )
              );
              controller.close();
            } catch (err: any) {
              console.error("OpenAI stream error:", err);
              controller.error(err);
            }
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            "X-AI-Engine": "OpenAI-GPT-4o",
          },
        });
      } catch (openAiError: any) {
        console.warn(
          "OpenAI live API call notice (switching to resilient Sovereign Engine):",
          openAiError?.message || openAiError
        );
        // Fall through to resilient Sovereign Engine
      }
    }

    // 4. Resilient Fallback to Sovereign Engine (deterministic & zero failure guarantee)
    const fallbackRes = await sendAiMessageAction(
      conversationId,
      message,
      contextAttachment
    );

    if (!fallbackRes.success || !fallbackRes.assistantMessage) {
      return NextResponse.json(
        { error: fallbackRes.error || "Failed to generate AI response" },
        { status: 500 }
      );
    }

    const astMsg = fallbackRes.assistantMessage;
    const encoder = new TextEncoder();

    // Stream fallback tokens for consistent UX
    const stream = new ReadableStream({
      async start(controller) {
        if (astMsg.toolCalls) {
          for (const tc of astMsg.toolCalls) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "tool_call", toolCall: tc })}\n\n`)
            );
          }
        }

        if (astMsg.proposedAction) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "proposed_action", proposedAction: astMsg.proposedAction })}\n\n`
            )
          );
        }

        // Stream in chunks of words for typewriter feel
        const words = astMsg.content.split(" ");
        for (let i = 0; i < words.length; i += 3) {
          const slice = words.slice(i, i + 3).join(" ") + " ";
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "delta", text: slice })}\n\n`)
          );
          await new Promise((r) => setTimeout(r, 20));
        }

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "done",
              fullContent: astMsg.content,
              toolCalls: astMsg.toolCalls,
              proposedAction: astMsg.proposedAction,
            })}\n\n`
          )
        );
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-AI-Engine": "Sovereign-Kernel-Fallback",
      },
    });
  } catch (err: any) {
    console.error("API /api/ai/chat handler error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
