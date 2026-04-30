# Design System — Editorial Technical

Warm paper palette with sharp geometry. Designed for data-rich enterprise UIs.

## Quick Start
Copy `globals.css` into your `app/globals.css`. Add fonts in `layout.tsx`:

```tsx
import { Inter, Work_Sans, Space_Grotesk } from 'next/font/google'
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const workSans = Work_Sans({ subsets: ["latin"], variable: "--font-work-sans" })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" })

// In body:
<body className={`${inter.variable} ${workSans.variable} ${spaceGrotesk.variable} font-sans`}>
```

## Colors

| Token | Value | Usage |
|---|---|---|
| `--background` | #fbf9f4 | Page background (warm paper) |
| `--card` | #ffffff | Card/container background |
| `--foreground` | #1b1c19 | Primary text |
| `--primary` | #9e3d19 | Coral — CTAs, active states, brand |
| `--secondary` | #f5f3ee | Light paper — secondary containers |
| `--muted-foreground` | #57423c | Secondary text |
| `--border` | rgba(46,46,46,0.1) | Thin borders, no shadows |
| `--success` | #2d7d3a | Green — healthy, completed |
| `--warning` | #be552f | Orange — attention, pending |
| `--destructive` | #ba1a1a | Red — error, at risk |
| `--chart-1` | #9e3d19 | Coral (primary) |
| `--chart-2` | #814890 | Purple (secondary) |
| `--chart-3` | #5c5c5c | Grey (tertiary) |

## Typography

| Style | Font | Weight | Size | Usage |
|---|---|---|---|---|
| Headline | Work Sans | 500-600 | 24-40px | Page titles, section headers |
| Body | Inter | 400 | 14-16px | All body text |
| Label/Mono | Space Grotesk | 500 | 11-13px | Badges, metadata, code, timestamps |

```css
/* In Tailwind classes */
font-heading    /* Work Sans */
font-sans       /* Inter (default) */
font-mono       /* Space Grotesk */
```

## Shapes
All border-radius: **0px**. Sharp corners everywhere.
CSS variables `--radius-sm/md/lg/xl` are all set to `0px`.

## Elevation
No shadows. Depth through:
- White cards on paper background
- Thin 1px borders (`border-border`)
- Tonal backgrounds (`bg-secondary/50`, `bg-accent`)

## Components

### Buttons
```tsx
<Button>Primary Action</Button>           // Solid primary (coral)
<Button variant="outline">Secondary</Button>  // 1px border
<Button variant="ghost">Tertiary</Button>      // No border
```

### Badges
Auto-styled via CSS: Space Grotesk, uppercase, letter-spacing.
```tsx
<Badge variant="secondary" className="bg-success/10 text-success">HEALTHY</Badge>
<Badge variant="secondary" className="bg-warning/10 text-warning">AT RISK</Badge>
```

### Cards
```tsx
<Card className="bg-card border-border">  // White on paper, thin border
  <CardHeader><CardTitle>Title</CardTitle></CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Metric Cards
```tsx
<Card>
  <CardContent className="p-4">
    <p className="text-xs text-muted-foreground font-medium">Label</p>
    <p className="text-2xl font-heading font-semibold tracking-tight mt-1">42</p>
  </CardContent>
</Card>
```
