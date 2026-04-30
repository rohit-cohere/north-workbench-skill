/**
 * Sidebar Template — Navigation for workbench apps.
 *
 * Customize:
 * - navItems: change icons and labels for your domain
 * - Logo: replace "WB" with your app abbreviation
 * - Title: replace "Workbench" with your app name
 */

"use client"

import { cn } from "@/lib/utils"
import {
  Sun,            // Today/Home
  LayoutDashboard, // Dashboard
  List,           // List view
  Inbox,          // Outbox/Queue
  Settings,       // Settings
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SidebarProps {
  activeView: string
  setActiveView: (view: string) => void
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  badgeCounts?: Record<string, number>  // e.g. { outbox: 3 }
}

// ─── CUSTOMIZE THESE ───────────────────────────────────────────────────────
const APP_NAME = "Workbench"
const APP_ORG = "COMPANY"
const APP_ABBREV = "WB"

const navItems = [
  { id: "today", label: "Today", icon: Sun },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "items", label: "Items", icon: List },        // Rename for your domain
  { id: "outbox", label: "Outbox", icon: Inbox },
]
// ───────────────────────────────────────────────────────────────────────────

export function Sidebar({ activeView, setActiveView, collapsed, setCollapsed, badgeCounts = {} }: SidebarProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <aside className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-56"
      )}>
        {/* Logo */}
        <div className={cn("flex items-center h-14 px-4 border-b border-sidebar-border", collapsed && "justify-center")}>
          <div className="w-7 h-7 bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs font-mono tracking-wider">{APP_ABBREV}</span>
          </div>
          {!collapsed && (
            <div className="ml-2">
              <h1 className="font-heading font-semibold text-sm text-sidebar-foreground tracking-tight">{APP_NAME}</h1>
              <p className="text-xs text-muted-foreground font-mono tracking-wide">{APP_ORG}</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id
            const badgeCount = badgeCounts[item.id] || 0

            return collapsed ? (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setActiveView(item.id)}
                    className={cn(
                      "w-full flex items-center justify-center h-10 transition-colors relative",
                      isActive ? "bg-sidebar-accent text-sidebar-primary" : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {badgeCount > 0 && <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-warning" />}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}{badgeCount > 0 && ` (${badgeCount})`}</TooltipContent>
              </Tooltip>
            ) : (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 h-10 px-3 transition-colors text-sm",
                  isActive ? "bg-sidebar-accent text-sidebar-primary" : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1 text-left">{item.label}</span>
                {badgeCount > 0 && (
                  <Badge variant="secondary" className="text-xs bg-warning/20 text-warning h-5 min-w-5 justify-center">{badgeCount}</Badge>
                )}
              </button>
            )
          })}
        </nav>

        {/* Collapse */}
        <div className="p-2 border-t border-sidebar-border">
          <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="w-full flex items-center justify-center text-muted-foreground">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!collapsed && <span className="ml-2 text-xs">Collapse</span>}
          </Button>
        </div>

        {/* Settings */}
        <div className="p-2 border-t border-sidebar-border">
          <button
            onClick={() => setActiveView("settings")}
            className={cn(
              "w-full flex items-center gap-3 h-10 px-3 transition-colors text-sm",
              activeView === "settings" ? "bg-sidebar-accent text-sidebar-primary" : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )}
          >
            <Settings className="w-5 h-5" />
            {!collapsed && <span>Settings</span>}
          </button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
