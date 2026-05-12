---
name: north-workbench-builder
description: Generate single-file HTML workbenches powered by North AI agents and automations. One self-contained HTML file with inline CSS + JS. No build step, no dependencies. Use when asked to build a dashboard, command center, or workflow UI.
---

# North Workbench Builder

Generate a **single self-contained HTML file** — a workbench UI powered by North agents and automations. Everything inline: HTML structure, CSS design system, JavaScript logic. No build step, no npm, no frameworks.

---

## Output Rules

1. Output exactly **one HTML file**
2. **All CSS inline** in a `<style>` tag
3. **All JavaScript inline** in a `<script>` tag
4. **Only external dependency**: Google Fonts CDN link
5. **Vanilla JS only** — no React, no jQuery, no frameworks
6. Use `fetch()` for North API calls with `Authorization: Bearer` header
7. Store auth token and cached data in `localStorage`

---

## Design System

### Colors (Warm Editorial)

```
Background:     #fbf9f4   (warm paper)
Surface:        #ffffff   (cards, containers)
Surface-dim:    #f0eee9   (sidebar, secondary areas)
Surface-tint:   #f5f3ee   (hover states, subtle highlights)

Text:           #1b1c19   (primary text)
Text-muted:     #57423c   (secondary text, labels)

Primary:        #9e3d19   (coral — CTAs, active states, brand accent)
Primary-hover:  #812904   (darker coral)
Secondary:      #814890   (purple — tags, categories, data viz)

Success:        #2d7d3a   (green — healthy, completed, positive)
Warning:        #be552f   (orange — attention, pending, caution)
Error:          #ba1a1a   (red — critical, failed, destructive)

Border:         rgba(46,46,46,0.1)   (thin, low-contrast)
```

### Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Headings | `Work Sans` | 500-600 | Page titles, section headers, metric values |
| Body | `Inter` | 400-500 | All body text, buttons, inputs |
| Labels | `Space Grotesk` | 400-500 | Badges, metadata, timestamps, code. Always `uppercase` with `letter-spacing: 0.05em` |

Google Fonts link:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Work+Sans:wght@500;600&family=Space+Grotesk:wght@400;500&display=swap" rel="stylesheet">
```

### Shapes & Elevation
- **Border radius: 0px** everywhere — buttons, cards, inputs, badges. Sharp corners only.
- **No shadows** — depth through tonal layering (white cards on paper background)
- **Borders**: 1px `rgba(46,46,46,0.1)` — thin, subtle
- **Transitions**: 150ms — fast, responsive

---

## Layout Structure

```html
<div class="app">
  <aside class="sidebar">
    <!-- Logo + nav items + settings -->
  </aside>
  <main class="content">
    <!-- Tab panels, one per nav item -->
  </main>
</div>
```

Sidebar: `220px` fixed width, `#f0eee9` background.
Content: fills remaining width, `#fbf9f4` background, `24px` padding, scrollable.

---

## North API Patterns

### Config & Auth
```javascript
const CONFIG = {
  get url() { return localStorage.getItem('north_url') || '' },
  set url(v) { localStorage.setItem('north_url', v) },
  get token() { return localStorage.getItem('north_token') || '' },
  set token(v) { localStorage.setItem('north_token', v) },
};
```

### API Call
```javascript
async function northAPI(method, path, body) {
  const res = await fetch(CONFIG.url + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + CONFIG.token,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
```

### Chat with Agent
```javascript
async function askAgent(agentId, prompt) {
  const res = await northAPI('POST', '/v1/chat', {
    messages: [{ role: 'user', content: prompt }],
    agent: { id: agentId },
    stream: false,
  });
  const content = res.messages?.[res.messages.length - 1]?.content || '';
  const text = typeof content === 'string' ? content
    : Array.isArray(content) ? content.map(c => c.text || c.content || '').join('') : '';
  try {
    const m = text.match(/```json?\s*([\s\S]*?)```/);
    return m ? JSON.parse(m[1]) : JSON.parse(text);
  } catch { return { _raw: text }; }
}
```

### List Agents
```javascript
async function listAgents() {
  const res = await northAPI('GET', '/v2/agents?limit=100');
  return res.data || res || [];
}
```

### Execute Automation
```javascript
async function executeAutomation(automationId, inputs) {
  return northAPI('POST', `/v1/automations/${automationId}/execute`, { inputs });
}
```

### List Pending Reviews
```javascript
async function listPendingReviews() {
  const res = await northAPI('GET', '/v1/automations/executions?awaiting_human_review=true&include_nodes=true');
  return res.executions || res || [];
}
```

### Submit Review
```javascript
async function submitReview(executionId, nodeId, inputs) {
  return northAPI('POST',
    `/v1/automations/executions/${executionId}/nodes/${nodeId}/review`,
    { inputs }
  );
}
```

---

## UI Component Patterns

### Metric Card
```html
<div class="metric-card">
  <div class="metric-label">LABEL</div>
  <div class="metric-value">42</div>
  <div class="metric-sub">Description</div>
</div>
```

### List Item
```html
<div class="list-item" onclick="handleClick()">
  <div class="list-dot" style="background:#2d7d3a"></div>
  <div class="list-content">
    <div class="list-title">Title</div>
    <div class="list-subtitle">Subtitle</div>
  </div>
  <span class="badge badge-success">STATUS</span>
</div>
```

### Card
```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Title</h3>
    <button class="btn btn-outline btn-sm" onclick="action()">Action</button>
  </div>
  <div class="card-body">Content</div>
</div>
```

### Badges
```html
<span class="badge badge-success">HEALTHY</span>
<span class="badge badge-warning">PENDING</span>
<span class="badge badge-error">CRITICAL</span>
<span class="badge badge-info">REVIEW</span>
```

### Empty State
```html
<div class="empty-state">
  <div class="empty-icon">📋</div>
  <div class="empty-title">Nothing here yet</div>
  <div class="empty-text">Description of what to do.</div>
</div>
```

### Loading
```html
<div class="loading"><div class="spinner"></div> Loading...</div>
```

### Error / Success Banners
```html
<div class="error-banner">Error message</div>
<div class="success-banner">Success message</div>
```

### Form Input
```html
<div class="form-group">
  <label class="form-label">FIELD NAME</label>
  <input type="text" class="form-input" placeholder="...">
</div>
```

### Buttons
```html
<button class="btn">Primary (black)</button>
<button class="btn btn-accent">Accent (coral)</button>
<button class="btn btn-outline">Outline</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-sm">Small</button>
```

---

## Page Structure

Every workbench should include these tabs:

1. **Home** — summary view, key metrics, items needing attention
2. **[Domain items]** — list/grid of the main data (accounts, tickets, documents, etc.)
3. **Outbox** (if automations are used) — pending human reviews
4. **Settings** — North API URL + auth token input + connection test

---

## Workflow: Creating a Workbench

1. Ask the user: What data? What agents? What actions? What should the home page show?
2. Build the HTML with:
   - Sidebar with nav items for each view
   - Tab panels with content
   - Settings tab with auth form
   - JavaScript functions calling the right agents with the right prompts
3. Use specific prompts for agents (SOQL for Salesforce, search queries for Gmail, etc.)
4. Cache responses in `localStorage` — show cached data on load, refresh on button click
5. Output the complete HTML file

---

## CSS Reference (complete inline block)

Include this entire block in the `<style>` tag:

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', system-ui, sans-serif; background: #fbf9f4; color: #1b1c19; font-size: 14px; line-height: 1.5; }
h1, h2, h3 { font-family: 'Work Sans', sans-serif; font-weight: 600; letter-spacing: -0.02em; }

.app { display: flex; height: 100vh; }
.sidebar { width: 220px; background: #f0eee9; border-right: 1px solid rgba(46,46,46,0.1); display: flex; flex-direction: column; flex-shrink: 0; }
.content { flex: 1; overflow-y: auto; padding: 24px; }

.sidebar-logo { padding: 16px; border-bottom: 1px solid rgba(46,46,46,0.1); display: flex; align-items: center; gap: 8px; }
.logo-mark { width: 28px; height: 28px; background: #9e3d19; color: #fff; display: flex; align-items: center; justify-content: center; font-family: 'Space Grotesk', monospace; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; }
.logo-title { font-family: 'Work Sans', sans-serif; font-size: 14px; font-weight: 600; }
.logo-org { font-family: 'Space Grotesk', monospace; font-size: 11px; color: #57423c; text-transform: uppercase; letter-spacing: 0.1em; }
.sidebar-nav { flex: 1; padding: 12px 8px; display: flex; flex-direction: column; gap: 2px; }
.sidebar-footer { padding: 8px; border-top: 1px solid rgba(46,46,46,0.1); }

.nav-item { display: flex; align-items: center; gap: 12px; padding: 8px 12px; border: none; background: none; color: #57423c; font-size: 14px; cursor: pointer; width: 100%; text-align: left; transition: all 150ms; }
.nav-item:hover { background: #eae8e3; color: #1b1c19; }
.nav-item.active { background: #eae8e3; color: #9e3d19; }
.nav-icon { font-size: 16px; width: 20px; text-align: center; }
.nav-badge { font-family: 'Space Grotesk', monospace; font-size: 10px; background: rgba(190,85,47,0.15); color: #be552f; padding: 2px 6px; text-transform: uppercase; letter-spacing: 0.05em; }

.card { background: #fff; border: 1px solid rgba(46,46,46,0.1); margin-bottom: 16px; }
.card-header { padding: 16px 16px 8px; display: flex; justify-content: space-between; align-items: center; }
.card-title { font-family: 'Work Sans', sans-serif; font-size: 14px; font-weight: 500; }
.card-body { padding: 0 16px 16px; }

.metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px; }
.metric-card { background: #fff; border: 1px solid rgba(46,46,46,0.1); padding: 16px; }
.metric-label { font-family: 'Space Grotesk', monospace; font-size: 11px; color: #57423c; text-transform: uppercase; letter-spacing: 0.05em; }
.metric-value { font-family: 'Work Sans', sans-serif; font-size: 28px; font-weight: 600; margin-top: 4px; letter-spacing: -0.02em; }
.metric-sub { font-size: 12px; color: #57423c; margin-top: 4px; }

.list-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(245,243,238,0.5); cursor: pointer; transition: background 150ms; margin-bottom: 4px; }
.list-item:hover { background: rgba(245,243,238,1); }
.list-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.list-content { flex: 1; min-width: 0; }
.list-title { font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.list-subtitle { font-size: 12px; color: #57423c; margin-top: 2px; }

.badge { font-family: 'Space Grotesk', monospace; font-size: 10px; font-weight: 500; padding: 2px 8px; text-transform: uppercase; letter-spacing: 0.05em; }
.badge-success { background: rgba(45,125,58,0.1); color: #2d7d3a; }
.badge-warning { background: rgba(190,85,47,0.1); color: #be552f; }
.badge-error { background: rgba(186,26,26,0.1); color: #ba1a1a; }
.badge-info { background: rgba(129,72,144,0.1); color: #814890; }

.btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; font-size: 13px; font-weight: 500; border: none; cursor: pointer; transition: all 150ms; font-family: 'Inter', sans-serif; background: #1b1c19; color: #fff; }
.btn:hover { background: #333; }
.btn-accent { background: #9e3d19; color: #fff; }
.btn-accent:hover { background: #812904; }
.btn-outline { background: transparent; border: 1px solid rgba(46,46,46,0.2); color: #1b1c19; }
.btn-outline:hover { border-color: #9e3d19; color: #9e3d19; }
.btn-ghost { background: transparent; border: none; color: #57423c; }
.btn-ghost:hover { color: #1b1c19; }
.btn-sm { padding: 4px 10px; font-size: 12px; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }

.form-group { margin-bottom: 16px; }
.form-label { display: block; font-family: 'Space Grotesk', monospace; font-size: 11px; color: #57423c; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
.form-input, .form-textarea { width: 100%; padding: 8px 12px; font-size: 14px; font-family: 'Inter', sans-serif; background: #f5f3ee; border: 1px solid rgba(46,46,46,0.1); color: #1b1c19; outline: none; }
.form-input:focus, .form-textarea:focus { border-color: #9e3d19; }
.form-textarea { min-height: 80px; resize: vertical; }

.empty-state { text-align: center; padding: 48px 24px; }
.empty-icon { font-size: 48px; opacity: 0.3; margin-bottom: 12px; }
.empty-title { font-family: 'Work Sans', sans-serif; font-size: 18px; font-weight: 500; }
.empty-text { font-size: 14px; color: #57423c; margin-top: 4px; }
.loading { display: flex; align-items: center; gap: 8px; color: #57423c; padding: 24px; justify-content: center; }
.spinner { width: 16px; height: 16px; border: 2px solid rgba(46,46,46,0.1); border-top-color: #9e3d19; border-radius: 50%; animation: spin 600ms linear infinite; }
@keyframes spin { to { transform: rotate(360deg) } }
.error-banner { padding: 12px; background: rgba(186,26,26,0.08); border: 1px solid rgba(186,26,26,0.2); color: #ba1a1a; font-size: 13px; margin-bottom: 16px; }
.success-banner { padding: 12px; background: rgba(45,125,58,0.08); border: 1px solid rgba(45,125,58,0.2); color: #2d7d3a; font-size: 13px; margin-bottom: 16px; }

.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.page-title { font-size: 24px; }
.page-subtitle { font-size: 14px; color: #57423c; margin-top: 2px; }

.tab-content { display: none; }
.tab-content.active { display: block; }
```
