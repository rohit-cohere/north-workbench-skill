---
name: north-workbench-builder
description: Create web-based workbenches (dashboards, command centers, workflow UIs) powered by North AI agents and automations. Generates Next.js + React + Tailwind apps with built-in auth, agent chat integration, automation execution, human review flows, and data caching. Use when asked to build a new workbench, dashboard, or workflow app that connects to North.
---

# North Workbench Builder

Build web-based workbenches powered by North AI agents and automations. A workbench is a purpose-built UI that lets users interact with agents, review automation outputs, and take actions — all through a clean, focused interface.

## Supporting References

- Design system: [design-system/](design-system/)
- Component templates: [templates/](templates/)
- Code blocks: [code-blocks/](code-blocks/) — copy-paste patterns for auth, agent chat, automations, caching, UI
- Examples: [examples/](examples/)
- API reference: [api-reference/](api-reference/)

---

## When to Use This Skill

Use when the user asks to:
- Build a dashboard or command center powered by North agents
- Create a workflow UI with human-in-the-loop review
- Build an app that reads/writes data through AI agents (Salesforce, Gmail, Slack, etc.)
- Create a web interface for monitoring and interacting with automations
- Build any agent-powered web application

## Architecture

Every workbench follows the same architecture:

```
┌─────────────────────────────────────────────────┐
│                    Browser                       │
│  Next.js App (React + Tailwind)                 │
│  ┌─────────┐ ┌──────────┐ ┌───────────────┐   │
│  │ Views   │ │ Hooks    │ │ Data Store    │   │
│  │ (pages) │ │ (state)  │ │ (localStorage)│   │
│  └────┬────┘ └────┬─────┘ └───────┬───────┘   │
│       │           │               │             │
│       └───────────┼───────────────┘             │
│                   │                              │
│          ┌────────┴────────┐                    │
│          │ API Client      │                    │
│          │ (northClient.ts)│                    │
│          └────────┬────────┘                    │
└───────────────────┼─────────────────────────────┘
                    │ HTTP (x-north-token header)
┌───────────────────┼─────────────────────────────┐
│          ┌────────┴────────┐                    │
│          │ API Routes      │  Next.js Server    │
│          │ (/api/north/*)  │                    │
│          └────────┬────────┘                    │
└───────────────────┼─────────────────────────────┘
                    │ HTTP (Bearer auth + optional IAP cookie)
┌───────────────────┼─────────────────────────────┐
│              North API                           │
│  /v2/agents  /v1/chat  /v1/automations          │
└─────────────────────────────────────────────────┘
```

### Key Principles

1. **Agents are the data layer** — don't call external APIs directly. Chat with agents that have tool access (Salesforce, Gmail, Slack, etc.). The agent handles auth and API complexity.

2. **SOQL > natural language** — when querying Salesforce through an agent, provide the exact SOQL query in the prompt. It's 10x faster than asking in natural language.

3. **User-triggered data fetches** — don't auto-fetch on page load. Agent calls can take 30-60 seconds. Show cached data instantly, let users click "Refresh" when they want live data.

4. **Cache everything** — all fetched data goes to localStorage with TTL. The app should feel instant on subsequent loads.

5. **Read-only by default** — agents should read and report, not take actions, unless the user explicitly clicks an action button.

---

## Workflows

### A. Create a New Workbench

1. **Understand the domain** — ask the user:
   - What data sources? (Salesforce, Gmail, Slack, databases, APIs)
   - What actions should users take? (update records, send emails, approve items)
   - Who are the users? (SAs, support agents, analysts, managers)
   - What's the main daily workflow? (morning review → drill into items → take action → review AI drafts)

2. **Design the views** — every workbench needs:
   - **Home/Today view** — what the user sees first. Summary of what needs attention.
   - **List view** — browsable list of items (accounts, tickets, documents, etc.)
   - **Detail view** — drill into a single item with full context + actions
   - **Outbox** — queue of automation outputs awaiting human review
   - **Settings** — auth configuration and agent management

3. **Design the agents** — for each data source:
   - Create an agent with the appropriate tool (gmail, salesforce, slack, web_search, etc.)
   - Write comprehensive instructions (see [code-blocks/agents/agent-instructions.md](code-blocks/agents/agent-instructions.md))
   - Set temperature: 0.1-0.3 for data retrieval, 0.3-0.5 for analysis, 0.5-0.7 for creative drafting

4. **Design the automations** — for multi-step workflows:
   - Use the north-automation-authoring skill to create .north-automation.json files
   - Include Human Review nodes for any action that needs approval
   - Design the output_template to render cleanly in the Outbox

5. **Generate the code** using templates from this skill:
   - Start with [templates/](templates/) for the app shell
   - Use [code-blocks/](code-blocks/) for specific features
   - Apply [design-system/](design-system/) for consistent styling

6. **Stack**: Next.js 16+ with App Router, React 19, Tailwind CSS 4, shadcn/ui components

---

### B. Code Generation Patterns

When generating workbench code, follow these patterns:

#### Project Structure
```
app/
  layout.tsx              # Root layout + fonts
  globals.css             # Design system CSS variables
  page.tsx                # Main app shell with view routing
  api/north/              # API routes proxying to North
    signin/route.ts
    agents/route.ts
    chat/route.ts
    executions/route.ts
    executions/[id]/route.ts
    executions/[id]/nodes/[nodeId]/route.ts

src/
  api/
    northClient.ts        # Client HTTP + token management
    northServer.ts        # Server-side North API proxy
    agents.ts             # Agent CRUD + chat
    agentService.ts       # Domain-specific agent prompts
    executions.ts         # Execution management
  hooks/
    usePolling.ts         # Generic polling hook
    use[Domain].ts        # Domain-specific data hooks with caching
  components/
    [view]-view.tsx       # One per view
    [feature]-panel.tsx   # Feature-specific panels
  lib/
    data-store.ts         # Centralized localStorage cache
    [domain]-utils.ts     # Domain-specific helpers
  types/
    north.ts              # North API types

components/
  sidebar.tsx             # Navigation sidebar
  ui/                     # shadcn/ui components
```

#### View Pattern
Every view follows this structure:
```tsx
export function [Name]View({ data, onAction, agentId }: Props) {
  const [state, setState] = useState(initialState)

  // Load from cache on mount
  useEffect(() => {
    const cached = store.[type].get()
    if (cached) setState(cached.data)
  }, [])

  // User-triggered refresh
  const refresh = useCallback(async () => {
    setLoading(true)
    const result = await askAgent(agentId, prompt)
    setState(result)
    store.[type].set(result)  // Cache
    setLoading(false)
  }, [agentId])

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      {/* Header with title + action buttons */}
      {/* Content cards */}
      {/* Empty/loading/error states */}
    </div>
  )
}
```

#### Agent Call Pattern
```tsx
// In agentService.ts — always provide specific prompts
export async function fetch[Items](agentId: string): Promise<Result> {
  const result = await askAgent(agentId, `
    [Specific query or SOQL]
    Return as JSON: { "items": [...] }
    Return ONLY the JSON.
  `)
  return parseResult(result)
}
```

#### Caching Pattern
```tsx
// In data-store.ts
export const store = {
  [type]: {
    get: () => get<Type>("type_key"),
    set: (data: Type) => set("type_key", data, undefined, TTL_MS),
  },
}
```

---

### C. Design System Application

Apply the editorial design system from [design-system/](design-system/):

1. Copy `design-system/globals.css` → `app/globals.css`
2. Set fonts in `layout.tsx`: Work Sans (headings), Inter (body), Space Grotesk (mono/labels)
3. All border-radius: 0px (sharp corners)
4. Cards: white (#fff) on paper (#fbf9f4) background
5. Primary: coral (#9e3d19), Secondary: purple (#814890)
6. Badges: Space Grotesk, uppercase, letter-spacing

---

### D. Auth Setup

Support three auth modes (see [code-blocks/auth/](code-blocks/auth/)):

1. **Email/Password** — for demo North instances with /v1/signin
2. **Token + IAP** — for production behind Google IAP
3. **Full Cookies** — paste entire browser cookie string (easiest for IAP)

The Settings page should include all three options.

---

### E. Human Review (Outbox) Pattern

For automations with Human Review nodes:

1. Poll `GET /v1/automations/executions?awaiting_human_review=true`
2. For each pending execution, find the review node (status: "waiting")
3. Fetch review details: `GET .../nodes/{nodeId}/review` → gets `rendered_text` + `inputs`
4. Display the rendered content + input fields (select dropdowns, text areas)
5. Submit: `POST .../nodes/{nodeId}/review` with `{ inputs: { inputId: { type, value } } }`

See [code-blocks/automations/human-review.ts](code-blocks/automations/human-review.ts) for the complete pattern.

---

## Checklist for New Workbenches

- [ ] Next.js project with App Router
- [ ] Design system CSS applied (globals.css)
- [ ] Fonts loaded (Work Sans, Inter, Space Grotesk)
- [ ] Auth flow (Settings page with 3 auth modes)
- [ ] API routes proxying to North (/api/north/*)
- [ ] Agent configs defined with comprehensive instructions
- [ ] Home view with summary/briefing
- [ ] List view with search/filter
- [ ] Detail view with actions
- [ ] Outbox for human review
- [ ] Data cached in localStorage with TTL
- [ ] Error handling (401 detection, timeout messages)
- [ ] Loading states (user-triggered, not auto-fetch)
