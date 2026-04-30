/**
 * Human Review — fetch and submit automation review tasks.
 *
 * When a North automation hits a Human Review node, the execution pauses.
 * This code fetches the review content and submits the user's response.
 */

import { northClient } from "../auth/north-client"

interface ReviewTaskInput {
  input_id: string
  name: string
  input_type: string        // "select" or "text"
  input_type_id?: string    // "inputs::select" or "inputs::text"
  required: boolean
  description?: string
  constraints?: { options?: string[] } | null
}

interface ReviewTask {
  execution_id: string
  node_id: string
  status: string
  rendered_text: string     // The content to review (markdown)
  inputs: ReviewTaskInput[]
}

/**
 * Fetch review task details for a pending execution.
 * Uses the /review endpoint to get rendered_text + input fields.
 */
export async function getReviewTask(executionId: string, nodeId: string): Promise<ReviewTask> {
  return northClient.get<ReviewTask>(`/executions/${executionId}/nodes/${nodeId}`)
  // The API route should forward to: GET /v1/automations/executions/{id}/nodes/{nodeId}/review
}

/**
 * Submit a human review response.
 *
 * Input payload format: each input_id maps to { type, value }
 * Example:
 *   {
 *     "input-Approve": { "type": "select", "value": "Acknowledged" },
 *     "input-Notes": { "type": "text", "value": "Looks good" }
 *   }
 */
export async function submitReview(
  executionId: string,
  nodeId: string,
  inputs: Record<string, { type: string; value: string }>
): Promise<{ event_id: string }> {
  return northClient.post(`/executions/${executionId}/nodes/${nodeId}`, { inputs })
  // The API route should forward to: POST /v1/automations/executions/{id}/nodes/{nodeId}/review
}

/**
 * Find the review node ID from an execution's nodes array.
 * Tries: status "waiting" → name contains "review" → last node
 */
export function findReviewNodeId(nodes: Array<{ node_id: string; status: string }>): string {
  return (
    nodes.find((n) => n.status === "waiting")?.node_id ||
    nodes.find((n) => n.node_id.toLowerCase().includes("review"))?.node_id ||
    nodes[nodes.length - 1]?.node_id ||
    ""
  )
}

// ─── API Route Template ────────────────────────────────────────────────────

/**
 * Next.js API route for /api/north/executions/[executionId]/nodes/[nodeSelector]/route.ts
 *
 * GET  → fetches review task (tries /review endpoint first)
 * POST → submits review response (to /review endpoint)
 */
const API_ROUTE_TEMPLATE = `
import { northGet, northPost, errorResponse } from "@/src/api/northServer"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ executionId: string; nodeSelector: string }> }) {
  try {
    const { executionId, nodeSelector } = await params
    try {
      const data = await northGet(request, \`/v1/automations/executions/\${executionId}/nodes/\${nodeSelector}/review\`)
      return Response.json(data)
    } catch {
      const data = await northGet(request, \`/v1/automations/executions/\${executionId}/nodes/\${nodeSelector}\`)
      return Response.json(data)
    }
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : String(err))
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ executionId: string; nodeSelector: string }> }) {
  try {
    const { executionId, nodeSelector } = await params
    const body = await request.json()
    const result = await northPost(request, \`/v1/automations/executions/\${executionId}/nodes/\${nodeSelector}/review\`, body)
    return Response.json(result)
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : String(err))
  }
}
`
