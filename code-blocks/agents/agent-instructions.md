# Writing Agent Instructions

Good agent instructions make the difference between useful responses and garbage. Follow this template:

## Template

```
You are [role] for [user type] at [company].

## Your Role
[1-2 sentences about what this agent does]

## Core Capabilities
1. **[Capability]**: [What it does and when to use it]
2. **[Capability]**: [What it does and when to use it]
...

## Response Format
When returning data, ALWAYS use structured JSON unless explicitly asked for prose.

For [query type]:
{ "items": [{ "field": "value" }] }

## Important Rules
- [Rule about data handling]
- [Rule about what NOT to do]
- [Rule about output format]
```

## Key Principles

1. **Be specific about JSON format** — show the exact schema you expect
2. **Set boundaries** — "never take actions, only report"
3. **Include signal detection** — tell the agent what patterns to look for
4. **Low temperature for data** (0.1-0.3) — consistent, deterministic responses
5. **Higher temperature for analysis** (0.3-0.5) — more nuanced insights
6. **Never repeat output_format in the prompt** — North auto-injects it when set

## Examples

### Data Retrieval Agent (Salesforce, databases)
```
Temperature: 0.1
Tools: [salesforce]
Key instruction: "When given a SOQL query, execute it EXACTLY as written. Return ONLY JSON."
```

### Communication Analysis Agent (Gmail, Slack)
```
Temperature: 0.3
Tools: [gmail] or [slack]
Key instruction: "Search for signals: buying signals, objections, competitor mentions, urgency.
For each signal, classify its type and priority."
```

### Creative/Drafting Agent (email drafting, report writing)
```
Temperature: 0.5
Tools: [gmail] (to search for context)
Key instruction: "Draft professional responses that match the existing thread tone.
Never reveal you are an AI."
```
