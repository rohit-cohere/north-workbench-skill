# Inline CSS — Copy into `<style>` tag

```css
/* ─── Reset & Base ─────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', system-ui, sans-serif; background: #fbf9f4; color: #1b1c19; font-size: 14px; line-height: 1.5; }
h1, h2, h3 { font-family: 'Work Sans', sans-serif; font-weight: 600; letter-spacing: -0.02em; }

/* ─── App Layout ───────────────────────────────────────────────── */
.app { display: flex; height: 100vh; }
.sidebar { width: 220px; background: #f0eee9; border-right: 1px solid rgba(46,46,46,0.1); display: flex; flex-direction: column; flex-shrink: 0; }
.content { flex: 1; overflow-y: auto; padding: 24px; }

/* ─── Sidebar ──────────────────────────────────────────────────── */
.sidebar-logo { padding: 16px; border-bottom: 1px solid rgba(46,46,46,0.1); display: flex; align-items: center; gap: 8px; }
.logo-mark { width: 28px; height: 28px; background: #9e3d19; color: #fff; display: flex; align-items: center; justify-content: center; font-family: 'Space Grotesk', monospace; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; }
.logo-title { font-family: 'Work Sans', sans-serif; font-size: 14px; font-weight: 600; color: #1b1c19; }
.logo-org { font-family: 'Space Grotesk', monospace; font-size: 11px; color: #57423c; text-transform: uppercase; letter-spacing: 0.1em; }
.sidebar-nav { flex: 1; padding: 12px 8px; display: flex; flex-direction: column; gap: 2px; }
.sidebar-footer { padding: 8px; border-top: 1px solid rgba(46,46,46,0.1); }
.nav-item { display: flex; align-items: center; gap: 12px; padding: 8px 12px; border: none; background: none; color: #57423c; font-size: 14px; cursor: pointer; width: 100%; text-align: left; transition: all 150ms; }
.nav-item:hover { background: #eae8e3; color: #1b1c19; }
.nav-item.active { background: #eae8e3; color: #9e3d19; }
.nav-icon { font-size: 16px; width: 20px; text-align: center; }
.nav-label { flex: 1; }
.nav-badge { font-family: 'Space Grotesk', monospace; font-size: 10px; background: rgba(190,85,47,0.15); color: #be552f; padding: 2px 6px; text-transform: uppercase; letter-spacing: 0.05em; }

/* ─── Cards ────────────────────────────────────────────────────── */
.card { background: #ffffff; border: 1px solid rgba(46,46,46,0.1); margin-bottom: 16px; }
.card-header { padding: 16px 16px 8px; display: flex; justify-content: space-between; align-items: center; }
.card-title { font-family: 'Work Sans', sans-serif; font-size: 14px; font-weight: 500; }
.card-body { padding: 0 16px 16px; }

/* ─── Metric Cards ─────────────────────────────────────────────── */
.metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
.metric-card { background: #ffffff; border: 1px solid rgba(46,46,46,0.1); padding: 16px; }
.metric-label { font-family: 'Space Grotesk', monospace; font-size: 11px; color: #57423c; text-transform: uppercase; letter-spacing: 0.05em; }
.metric-value { font-family: 'Work Sans', sans-serif; font-size: 28px; font-weight: 600; color: #1b1c19; margin-top: 4px; letter-spacing: -0.02em; }
.metric-sub { font-size: 12px; color: #57423c; margin-top: 4px; }

/* ─── List Items ───────────────────────────────────────────────── */
.list-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(245,243,238,0.5); cursor: pointer; transition: background 150ms; margin-bottom: 4px; }
.list-item:hover { background: rgba(245,243,238,1); }
.list-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.list-content { flex: 1; min-width: 0; }
.list-title { font-size: 14px; font-weight: 500; color: #1b1c19; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.list-subtitle { font-size: 12px; color: #57423c; margin-top: 2px; }
.list-meta { font-size: 12px; color: #57423c; flex-shrink: 0; }

/* ─── Badges ───────────────────────────────────────────────────── */
.badge { font-family: 'Space Grotesk', monospace; font-size: 10px; font-weight: 500; padding: 2px 8px; text-transform: uppercase; letter-spacing: 0.05em; display: inline-flex; align-items: center; gap: 4px; }
.badge-success { background: rgba(45,125,58,0.1); color: #2d7d3a; }
.badge-warning { background: rgba(190,85,47,0.1); color: #be552f; }
.badge-error { background: rgba(186,26,26,0.1); color: #ba1a1a; }
.badge-info { background: rgba(129,72,144,0.1); color: #814890; }
.badge-neutral { background: rgba(92,92,92,0.1); color: #5c5c5c; }

/* ─── Buttons ──────────────────────────────────────────────────── */
.btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; font-size: 13px; font-weight: 500; border: none; cursor: pointer; transition: all 150ms; font-family: 'Inter', sans-serif; }
.btn-primary, .btn { background: #1b1c19; color: #fff; }
.btn-primary:hover, .btn:hover { background: #333; }
.btn-accent { background: #9e3d19; color: #fff; }
.btn-accent:hover { background: #812904; }
.btn-outline { background: transparent; border: 1px solid rgba(46,46,46,0.2); color: #1b1c19; }
.btn-outline:hover { border-color: #9e3d19; color: #9e3d19; }
.btn-ghost { background: transparent; border: none; color: #57423c; }
.btn-ghost:hover { color: #1b1c19; background: rgba(46,46,46,0.05); }
.btn-sm { padding: 4px 10px; font-size: 12px; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* ─── Forms ────────────────────────────────────────────────────── */
.form-group { margin-bottom: 16px; }
.form-label { display: block; font-family: 'Space Grotesk', monospace; font-size: 11px; color: #57423c; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
.form-input, .form-textarea, .form-select { width: 100%; padding: 8px 12px; font-size: 14px; font-family: 'Inter', sans-serif; background: #f5f3ee; border: 1px solid rgba(46,46,46,0.1); color: #1b1c19; outline: none; transition: border 150ms; }
.form-input:focus, .form-textarea:focus, .form-select:focus { border-color: #9e3d19; }
.form-textarea { min-height: 80px; resize: vertical; }
.form-hint { font-size: 12px; color: #57423c; margin-top: 4px; }

/* ─── States ───────────────────────────────────────────────────── */
.empty-state { text-align: center; padding: 48px 24px; }
.empty-icon { font-size: 48px; opacity: 0.3; margin-bottom: 12px; }
.empty-title { font-family: 'Work Sans', sans-serif; font-size: 18px; font-weight: 500; }
.empty-text { font-size: 14px; color: #57423c; margin-top: 4px; max-width: 400px; margin-left: auto; margin-right: auto; }
.loading { display: flex; align-items: center; gap: 8px; color: #57423c; font-size: 14px; padding: 24px; justify-content: center; }
.spinner { width: 16px; height: 16px; border: 2px solid rgba(46,46,46,0.1); border-top-color: #9e3d19; border-radius: 50%; animation: spin 600ms linear infinite; }
@keyframes spin { to { transform: rotate(360deg) } }
.error-banner { padding: 12px; background: rgba(186,26,26,0.08); border: 1px solid rgba(186,26,26,0.2); color: #ba1a1a; font-size: 13px; margin-bottom: 16px; }
.success-banner { padding: 12px; background: rgba(45,125,58,0.08); border: 1px solid rgba(45,125,58,0.2); color: #2d7d3a; font-size: 13px; margin-bottom: 16px; }

/* ─── Section Headers ──────────────────────────────────────────── */
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.page-title { font-family: 'Work Sans', sans-serif; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; }
.page-subtitle { font-size: 14px; color: #57423c; margin-top: 2px; }
.section-title { font-family: 'Work Sans', sans-serif; font-size: 14px; font-weight: 500; margin-bottom: 12px; }

/* ─── Utility ──────────────────────────────────────────────────── */
.flex { display: flex; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.mt-2 { margin-top: 8px; }
.mt-4 { margin-top: 16px; }
.mb-4 { margin-bottom: 16px; }
.text-primary { color: #9e3d19; }
.text-muted { color: #57423c; }
.text-sm { font-size: 13px; }
.text-xs { font-size: 12px; }
.font-mono { font-family: 'Space Grotesk', monospace; }
.truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.hidden { display: none; }
```
