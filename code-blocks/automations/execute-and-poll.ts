/**
 * Execute an automation and poll for completion.
 *
 * Usage:
 *   const result = await executeAndWait(automationId, { key: "value" })
 */

import { northClient } from "../auth/north-client"

interface Execution {
  id: string
  status: string
  awaiting_human_review: boolean
  output?: string
}

/** Execute an automation with inputs */
export async function executeAutomation(
  automationId: string,
  inputs: Record<string, { type: string; value: string }>
): Promise<{ id: string }> {
  return northClient.post(`/automations/${automationId}/execute`, { inputs })
}

/** Get execution status */
export async function getExecution(executionId: string): Promise<Execution> {
  return northClient.get(`/executions/${executionId}?include_nodes=true`)
}

/** List executions with filters */
export async function listExecutions(filters: {
  automationId?: string
  status?: string
  awaitingHumanReview?: boolean
} = {}): Promise<Execution[]> {
  const params: Record<string, string> = {}
  if (filters.automationId) params.automation_id = filters.automationId
  if (filters.status) params.status = filters.status
  if (filters.awaitingHumanReview) params.awaiting_human_review = "true"
  params.include_nodes = "true"
  const result = await northClient.get<any>("/executions", params)
  return Array.isArray(result) ? result : result?.executions || []
}

/** List pending human reviews */
export async function listPendingReviews(): Promise<Execution[]> {
  return listExecutions({ awaitingHumanReview: true })
}

/**
 * Execute and poll until completion (or human review pause).
 * Returns the final execution state.
 *
 * WARNING: This blocks for the duration of the execution (could be minutes).
 * Better to execute and poll from a React hook with setInterval.
 */
export async function executeAndWait(
  automationId: string,
  inputs: Record<string, { type: string; value: string }>,
  pollIntervalMs = 10000,
  timeoutMs = 600000
): Promise<Execution> {
  const { id } = await executeAutomation(automationId, inputs)
  const deadline = Date.now() + timeoutMs

  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, pollIntervalMs))
    const exec = await getExecution(id)
    if (["completed", "failed", "cancelled"].includes(exec.status) || exec.awaiting_human_review) {
      return exec
    }
  }
  throw new Error(`Execution ${id} timed out after ${timeoutMs / 1000}s`)
}
