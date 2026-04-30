/**
 * Agent Chat — send prompts to agents and parse JSON responses.
 *
 * Usage:
 *   const result = await askAgent(agentId, "Your prompt here")
 *   if (result.parsed) { /* use structured data */ }
 */

import { northClient } from "../auth/north-client"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface ChatResponse {
  conversation_id: string
  messages: ChatMessage[]
  finish_reason?: string
}

interface AgentChatResult<T = unknown> {
  raw: string       // Full text response
  parsed: T | null  // Extracted JSON (null if not parseable)
}

/** Extract text from response content (handles string or array formats) */
function extractText(content: unknown): string {
  if (typeof content === "string") return content
  if (Array.isArray(content)) {
    return content
      .map((item: any) => typeof item === "string" ? item : item?.text || item?.content || "")
      .join("\n")
  }
  return ""
}

/** Extract JSON from agent response (handles code blocks, embedded JSON) */
function extractJSON<T>(raw: string): T | null {
  const trimmed = raw.trim()
  try { return JSON.parse(trimmed) as T } catch {}
  const block = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (block) try { return JSON.parse(block[1].trim()) as T } catch {}
  const start = Math.min(
    trimmed.indexOf("{") === -1 ? Infinity : trimmed.indexOf("{"),
    trimmed.indexOf("[") === -1 ? Infinity : trimmed.indexOf("[")
  )
  if (start < Infinity) {
    const open = trimmed[start]
    const close = open === "{" ? "}" : "]"
    const end = trimmed.lastIndexOf(close)
    if (end > start) try { return JSON.parse(trimmed.slice(start, end + 1)) as T } catch {}
  }
  return null
}

/** Chat with an agent. Returns raw text + parsed JSON. */
export async function chatWithAgent(agentId: string, messages: ChatMessage[]): Promise<ChatResponse> {
  return northClient.post<ChatResponse>("/chat", {
    messages,
    agent: { id: agentId },
    stream: false,
  })
}

/** Send a prompt and attempt to parse JSON from the response. */
export async function askAgent<T = unknown>(agentId: string, prompt: string): Promise<AgentChatResult<T>> {
  const response = await chatWithAgent(agentId, [{ role: "user", content: prompt }])
  const raw = extractText(response.messages?.[response.messages.length - 1]?.content)
  return { raw, parsed: extractJSON<T>(raw) }
}

// ─── Example: Domain-Specific Query ────────────────────────────────────────

/**
 * Example: Fetch items from Salesforce via agent.
 * Replace the SOQL and mapping with your domain.
 */
export async function fetchItems(sfAgentId: string): Promise<any[]> {
  const result = await askAgent<{ items: any[] }>(
    sfAgentId,
    `Run this SOQL query in Salesforce:
SELECT Id, Name, Status, CreatedDate FROM Case WHERE IsClosed = false LIMIT 50

Return as JSON: { "items": [{ "id": "", "name": "", "status": "", "created": "" }] }
Return ONLY the JSON.`
  )
  return (result.parsed as any)?.items || []
}
