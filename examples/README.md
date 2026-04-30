# Workbench Examples

## SA Workspace (Full Reference)

The SA Workspace in the parent directory is the primary reference implementation. It demonstrates:

- **3 AI agents**: Gmail+Calendar, Salesforce, Slack
- **2 automations**: Morning Briefing, Post-Meeting Follow-up
- **5 views**: Today, Dashboard, Accounts, Outbox, Settings
- **Full data caching** with localStorage
- **Human review flow** with the Outbox
- **Editorial design system**

See `../DEMO.md` for the complete walkthrough.

### Key patterns to study:

| Pattern | File | What it shows |
|---|---|---|
| Agent as data layer | `src/api/agentService.ts` | SOQL queries via agent chat |
| Structured JSON parsing | `src/api/agentService.ts` → `extractJSON()` | Extracting JSON from agent prose |
| Batch sync | `src/api/agentService.ts` → `batchSyncAccountDetails()` | One agent call for multiple records |
| Per-item caching | `src/hooks/useAccountDetail.ts` | Cache by item name in localStorage |
| User-triggered refresh | `src/hooks/useAccounts.ts` | No auto-fetch, button-triggered |
| Human review | `src/components/outbox-view.tsx` | Full review UI with dynamic inputs |
| Deal health scoring | `src/lib/deal-health.ts` | Client-side scoring from cached data |
| Post-call processing | `src/components/post-call-logger.tsx` | Notes → action items + email draft |
| Pre-meeting brief | `src/components/meeting-brief.tsx` | Parallel agent calls combined |

---

## Other Workbench Ideas

### Support Ticket Triage
- **Agents**: Salesforce (cases), Slack (escalations), Knowledge Base (web_search)
- **Views**: Queue (prioritized tickets), Ticket Detail, Resolution Tracker
- **Automation**: New ticket → classify priority → assign agent → draft response → Human Review

### Content Review Pipeline
- **Agents**: Google Drive (documents), Web Search (fact-checking)
- **Views**: Queue (pending reviews), Document Viewer, Approval History
- **Automation**: New document → quality check → fact verification → reviewer approval

### Customer Success Dashboard
- **Agents**: Salesforce (health scores), Gmail (customer comms), Slack (internal alerts)
- **Views**: Portfolio (all accounts), Account Health, Renewal Tracker
- **Automation**: Weekly health scan → flag at-risk accounts → draft outreach → CSM review

### Sales Enablement Hub
- **Agents**: Salesforce (deals), Google Drive (proposals/decks), Web Search (competitor intel)
- **Views**: Deal Room, Competitive Dashboard, Content Finder
- **Automation**: New deal stage → generate proposal draft → attach relevant case studies → rep review
