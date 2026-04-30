# UI Component Patterns

Copy-paste patterns for common workbench UI elements. All follow the editorial design system.

## Metric Card
```tsx
<Card className="bg-card border-border">
  <CardContent className="p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-muted-foreground font-medium">Pipeline Value</p>
        <p className="text-2xl font-heading font-semibold text-foreground mt-1 tracking-tight">$2.4M</p>
      </div>
      <div className="w-10 h-10 bg-primary/10 flex items-center justify-center">
        <DollarSign className="w-5 h-5 text-primary" />
      </div>
    </div>
    <p className="text-xs text-muted-foreground mt-2">12 active deals</p>
  </CardContent>
</Card>
```

## Clickable List Item
```tsx
<button
  onClick={() => onSelect(item)}
  className="w-full text-left p-3 bg-secondary/50 hover:bg-secondary transition-colors flex items-center gap-3"
>
  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
  <div className="flex-1 min-w-0">
    <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
    <p className="text-xs text-muted-foreground">{item.subtitle}</p>
  </div>
  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
</button>
```

## Timeline Entry
```tsx
<div className="flex gap-4">
  <div className="relative flex flex-col items-center pt-1">
    <div className="w-8 h-8 bg-secondary flex items-center justify-center shrink-0">
      <Icon className="w-4 h-4 text-muted-foreground" />
    </div>
    {!isLast && <div className="w-px flex-1 bg-border mt-1" />}
  </div>
  <div className="flex-1 min-w-0 pb-4">
    <p className="text-sm font-medium text-foreground truncate">{entry.title}</p>
    <p className="text-xs text-muted-foreground mt-0.5 break-words">{entry.description}</p>
    <span className="text-xs text-muted-foreground">{formatDate(entry.date)}</span>
  </div>
</div>
```

## Status Badge
```tsx
// Health/status indicator
<Badge variant="secondary" className="bg-[#2d7d3a]/10 text-[#2d7d3a]">HEALTHY</Badge>
<Badge variant="secondary" className="bg-[#be552f]/10 text-[#be552f]">WARNING</Badge>
<Badge variant="secondary" className="bg-[#ba1a1a]/10 text-[#ba1a1a]">AT RISK</Badge>
<Badge variant="secondary" className="bg-[#814890]/10 text-[#814890]">IN REVIEW</Badge>
```

## Page Header with Actions
```tsx
<div className="flex items-center justify-between">
  <div>
    <div className="flex items-center gap-3">
      <h1 className="text-2xl font-heading font-semibold text-foreground tracking-tight">Page Title</h1>
      <Badge variant="secondary" className="text-xs bg-success/10 text-success">LIVE</Badge>
    </div>
    <p className="text-muted-foreground text-sm mt-0.5">Description text</p>
  </div>
  <div className="flex items-center gap-2">
    <Button variant="outline" onClick={refresh} disabled={loading} className="gap-2">
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
      Refresh
    </Button>
    <Button className="gap-2">
      <Plus className="w-4 h-4" />
      Action
    </Button>
  </div>
</div>
```

## Empty State
```tsx
<Card className="bg-card border-border">
  <CardContent className="p-12 text-center">
    <Inbox className="w-14 h-14 text-muted-foreground mx-auto mb-4 opacity-40" />
    <p className="text-lg font-heading font-medium text-foreground">No items yet</p>
    <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
      Description of what will appear here and how to get started.
    </p>
    <Button variant="outline" className="mt-4">Get Started</Button>
  </CardContent>
</Card>
```

## Error Banner
```tsx
<div className="p-3 bg-destructive/10 border border-destructive/20">
  <p className="text-xs text-destructive">{error.message}</p>
</div>
```

## Loading Indicator
```tsx
<div className="flex items-center gap-2 text-muted-foreground">
  <Loader2 className="w-4 h-4 animate-spin" />
  <span className="text-sm">Loading data from agent...</span>
</div>
```
