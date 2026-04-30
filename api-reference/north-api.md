# North API Quick Reference

## Base URLs
- Demo: `https://demo.north.cohere.com/api`
- Production: `https://north.cohere.com/api` (behind IAP)
- Custom: `https://{org}.north.cohere.com/api`

## Auth
- `Authorization: Bearer <token>` on all requests
- For IAP: also send `Cookie: __Host-GCP_IAP_AUTH_TOKEN_*=...`
- Get token via `POST /v1/signin { email, password }` or from browser cookies (SSO)

---

## Agents (v2)

| Method | Path | Description |
|---|---|---|
| GET | `/v2/agents` | List agents. Params: `limit`, `next_token`, `filter`, `visibility` (public/private) |
| POST | `/v2/agents` | Create agent. Body: `{ name, visibility, instructions, model, tools, temperature }` |
| GET | `/v2/agents/:id` | Get agent |
| PATCH | `/v2/agents/:id` | Update agent |

### Tool Types
`gmail`, `salesforce`, `slack`, `web_search`, `google_calendar`, `google_drive`, `sharepoint`, `notion`, `outlook`

---

## Chat (v1)

| Method | Path | Description |
|---|---|---|
| POST | `/v1/chat` | Chat with agent. Body: `{ messages, agent: { id }, stream: false }` |

### Request
```json
{
  "messages": [{ "role": "user", "content": "Your prompt" }],
  "agent": { "id": "agent-uuid" },
  "stream": false
}
```

### Response
```json
{
  "conversation_id": "conv-uuid",
  "messages": [{ "role": "assistant", "content": "Agent response" }],
  "finish_reason": "end_turn"
}
```

---

## Automations (v1)

| Method | Path | Description |
|---|---|---|
| GET | `/v1/automations` | List. Params: `publication_status` (draft/published), `limit`, `offset` |
| GET | `/v1/automations/:id` | Get automation |
| POST | `/v1/automations/:id/execute` | Execute. Body: `{ inputs: { id: { type, value } } }` |

---

## Executions (v1)

| Method | Path | Description |
|---|---|---|
| GET | `/v1/automations/executions` | List. Params: `automation_id`, `status`, `awaiting_human_review`, `include_nodes` |
| GET | `/v1/automations/executions/:id` | Get execution. Params: `include_nodes` |
| POST | `/v1/automations/executions/:id/cancel` | Cancel |
| GET | `/v1/automations/executions/:id/nodes/:nodeId/review` | Get review task |
| POST | `/v1/automations/executions/:id/nodes/:nodeId/review` | Submit review |

### Execution Statuses
`queued` → `pending` → `running` → `completed` | `failed` | `cancelled` | `awaiting_input`

### Submit Review Body
```json
{
  "inputs": {
    "input-id": { "type": "select", "value": "Acknowledged" },
    "input-notes": { "type": "text", "value": "Optional notes" }
  }
}
```

---

## Common API Route Set (Next.js)

Every workbench needs these API routes:

```
app/api/north/
  signin/route.ts             POST → /v1/signin
  agents/route.ts             GET/POST → /v2/agents
  chat/route.ts               POST → /v1/chat
  executions/route.ts         GET → /v1/automations/executions
  executions/[id]/route.ts    GET → /v1/automations/executions/:id
  executions/[id]/nodes/[nodeId]/route.ts  GET/POST → .../review
```
