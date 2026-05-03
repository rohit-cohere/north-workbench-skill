---
name: north-workbench-builder
description: Generate single-file HTML workbenches powered by North AI agents and automations. Outputs one self-contained HTML file with inline CSS, JavaScript, and the editorial design system. Use when asked to build a dashboard, command center, or workflow UI that connects to North.
---

# North Workbench Builder

Generate **single self-contained HTML files** that serve as workbenches for interacting with North AI agents and automations. Everything — HTML, CSS, JavaScript — lives in one file. No build step, no npm, no framework dependencies.

## Supporting References

- Design system CSS: [design-system/globals.css](design-system/globals.css)
- UI component patterns: [code-blocks/ui/README.md](code-blocks/ui/README.md)
- Agent interaction patterns: [code-blocks/agents/](code-blocks/agents/)
- API reference: [api-reference/north-api.md](api-reference/north-api.md)
- Example outputs: [examples/](examples/)

---

## When to Use

Use when the user asks to:
- Build a dashboard or workbench powered by North agents
- Create a single-page app for a workflow
- Generate an HTML interface for monitoring automations
- Build a UI for reviewing agent outputs
- Create any agent-powered web interface

## Output Format

Always output a **single HTML file** with this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Workbench Name]</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Work+Sans:wght@500;600&family=Space+Grotesk:wght@400;500&display=swap" rel="stylesheet">
  <style>
    /* Design system + all styles inline */
  </style>
</head>
<body>
  <!-- Sidebar + content area -->
  <script>
    /* All application logic inline */
  </script>
</body>
</html>
```

---

## Architecture

```
Single HTML File
├── <style>  — Full design system + component styles
├── <body>   — Sidebar navigation + content panels
└── <script> — Auth, API calls, state management, UI updates
```

### Key Principles

1. **One file, everything inline** — no external dependencies except Google Fonts
2. **Vanilla JS** — no React, no framework. Use `document.getElementById`, template literals, event listeners
3. **Tab-based navigation** — sidebar buttons show/hide content panels
4. **Agent calls via fetch** — call North API directly with Bearer auth
5. **localStorage for persistence** — cache data and auth tokens
6. **Progressive enhancement** — show placeholder content, populate when data loads

---

## Design System (Inline CSS)

Apply the editorial design system. Copy the CSS block from [design-system/inline-styles.md](design-system/inline-styles.md).

Key values:
- Background: `#fbf9f4` (warm paper)
- Cards: `#ffffff` on paper
- Primary: `#9e3d19` (coral)
- Secondary: `#814890` (purple)
- Text: `#1b1c19`
- Muted text: `#57423c`
- Border: `rgba(46,46,46,0.1)`
- Border radius: `0px` everywhere
- Headings: `Work Sans`
- Body: `Inter`
- Mono/labels: `Space Grotesk`, uppercase, letter-spacing

---

## Workflows

### A. Create a New Workbench

1. **Understand the domain** — ask the user:
   - What data sources? (Salesforce, Gmail, Slack, etc.)
   - What should the workbench show?
   - What actions can users take?
   - What's the North API base URL?

2. **Design the views** — typical workbench has:
   - **Home/Today** — summary of what needs attention
   - **List** — browsable items (accounts, tickets, documents)
   - **Detail** — drill into a single item (shown inline or as modal)
   - **Outbox** — automation outputs awaiting review
   - **Settings** — API URL + auth token input

3. **Generate the HTML** — use the patterns below to build:
   - CSS design system (copy from inline-styles reference)
   - Sidebar with navigation tabs
   - Content panels for each view
   - JavaScript for API calls, state, and UI updates
   - Auth setup (token stored in localStorage)

4. **Output one file** — the complete HTML file ready to open in a browser

---

### B. JavaScript Patterns

#### Auth & API Setup
```javascript
const CONFIG = {
  baseUrl: localStorage.getItem('north_url') || 'https://demo.north.cohere.com/api',
  token: localStorage.getItem('north_token') || '',
};

async function northAPI(method, path, body) {
  const res = await fetch(CONFIG.baseUrl + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + CONFIG.token,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
  return res.json();
}
```

#### Chat with Agent
```javascript
async function askAgent(agentId, prompt) {
  const res = await northAPI('POST', '/v1/chat', {
    messages: [{ role: 'user', content: prompt }],
    agent: { id: agentId },
    stream: false,
  });
  const text = res.messages?.[res.messages.length - 1]?.content || '';
  const content = typeof text === 'string' ? text : Array.isArray(text)
    ? text.map(t => t.text || t.content || '').join('') : '';
  // Try to extract JSON
  try {
    const match = content.match(/```json?\s*([\s\S]*?)```/);
    return match ? JSON.parse(match[1]) : JSON.parse(content);
  } catch {
    return { _raw: content };
  }
}
```

#### Tab Navigation
```javascript
function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + tabId).style.display = 'block';
  document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
}
```

#### Render List
```javascript
function renderItems(containerId, items, template) {
  const el = document.getElementById(containerId);
  el.innerHTML = items.length === 0
    ? '<div class="empty-state">No items</div>'
    : items.map(template).join('');
}
```

#### Loading State
```javascript
function setLoading(containerId, loading) {
  const el = document.getElementById(containerId);
  if (loading) {
    el.innerHTML = '<div class="loading"><div class="spinner"></div> Loading...</div>';
  }
}
```

---

### C. HTML Structure Pattern

```html
<body>
  <div class="app">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-logo">
        <div class="logo-mark">WB</div>
        <div class="logo-text">
          <div class="logo-title">Workbench</div>
          <div class="logo-org">COMPANY</div>
        </div>
      </div>
      <nav class="sidebar-nav">
        <button class="nav-item active" data-tab="today" onclick="showTab('today')">
          <span class="nav-icon">☀</span>
          <span class="nav-label">Today</span>
        </button>
        <button class="nav-item" data-tab="items" onclick="showTab('items')">
          <span class="nav-icon">☰</span>
          <span class="nav-label">Items</span>
        </button>
        <!-- More tabs -->
      </nav>
      <div class="sidebar-footer">
        <button class="nav-item" data-tab="settings" onclick="showTab('settings')">
          <span class="nav-icon">⚙</span>
          <span class="nav-label">Settings</span>
        </button>
      </div>
    </aside>

    <!-- Content -->
    <main class="content">
      <div id="tab-today" class="tab-content" style="display:block">
        <!-- Today view content -->
      </div>
      <div id="tab-items" class="tab-content" style="display:none">
        <!-- Items list content -->
      </div>
      <div id="tab-settings" class="tab-content" style="display:none">
        <!-- Settings content -->
      </div>
    </main>
  </div>
</body>
```

---

### D. Component HTML Patterns

#### Metric Card
```html
<div class="metric-card">
  <div class="metric-label">Pipeline Value</div>
  <div class="metric-value">$2.4M</div>
  <div class="metric-sub">12 active deals</div>
</div>
```

#### List Item (clickable)
```html
<div class="list-item" onclick="showDetail('${item.id}')">
  <div class="list-dot" style="background:${color}"></div>
  <div class="list-content">
    <div class="list-title">${item.title}</div>
    <div class="list-subtitle">${item.subtitle}</div>
  </div>
  <div class="list-badge ${badgeClass}">${item.status}</div>
</div>
```

#### Card with Header
```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Section Title</h3>
    <button class="btn btn-outline btn-sm" onclick="refresh()">Refresh</button>
  </div>
  <div class="card-body" id="content-area">
    <!-- Dynamic content -->
  </div>
</div>
```

#### Status Badge
```html
<span class="badge badge-success">HEALTHY</span>
<span class="badge badge-warning">AT RISK</span>
<span class="badge badge-error">CRITICAL</span>
<span class="badge badge-info">IN REVIEW</span>
```

#### Empty State
```html
<div class="empty-state">
  <div class="empty-icon">📋</div>
  <div class="empty-title">No items yet</div>
  <div class="empty-text">Click refresh to load data from your agents.</div>
  <button class="btn" onclick="refresh()">Get Started</button>
</div>
```

#### Settings Form (Auth)
```html
<div class="form-group">
  <label class="form-label">North API URL</label>
  <input type="url" class="form-input" id="api-url"
    value="${CONFIG.baseUrl}" onchange="saveConfig()">
</div>
<div class="form-group">
  <label class="form-label">Auth Token</label>
  <input type="password" class="form-input" id="api-token"
    placeholder="Paste your authToken..."
    onchange="saveConfig()">
</div>
<button class="btn" onclick="testConnection()">Test Connection</button>
```

---

## Checklist

Before outputting the HTML file:

- [ ] Single file, no external dependencies (except Google Fonts CDN)
- [ ] Design system CSS inline (colors, typography, shapes)
- [ ] Sidebar with tab navigation
- [ ] Settings tab with API URL + token inputs
- [ ] At least one data-driven view that calls an agent
- [ ] Loading states and empty states
- [ ] Error handling for API failures
- [ ] Token stored in localStorage
- [ ] Data cached in localStorage
- [ ] All border-radius: 0px
- [ ] Headings use Work Sans
- [ ] Labels/badges use Space Grotesk uppercase
- [ ] No shadows on cards (border only)
