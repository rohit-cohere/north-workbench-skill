/**
 * Main App Shell Template
 *
 * Customize:
 * - Import your domain-specific views
 * - Add your hooks
 * - Update renderContent with your views
 */

"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
// import { TodayView } from "@/src/components/today-view"
// import { DashboardView } from "@/src/components/dashboard-view"
// import { ItemsView } from "@/src/components/items-view"
// import { OutboxView } from "@/src/components/outbox-view"
// import { SettingsView } from "@/src/components/settings-view"

export default function Workbench() {
  const [activeView, setActiveView] = useState("today")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Auth expiry listener
  useEffect(() => {
    const handler = (e: Event) => {
      console.warn("[Auth] Token may have expired.", (e as CustomEvent).detail)
    }
    window.addEventListener("north-auth-expired", handler)
    return () => window.removeEventListener("north-auth-expired", handler)
  }, [])

  // TODO: Add your hooks here
  // const { agents, gmailAgent, salesforceAgent } = useAgentSetup()
  // const { items, refresh } = useItems(salesforceAgent?.id)
  // const { pendingReviews, pendingCount } = useAgentOutbox()

  const renderContent = () => {
    switch (activeView) {
      case "today":
        return <div className="p-6"><h1 className="text-2xl font-heading font-semibold tracking-tight">Today</h1></div>
      case "dashboard":
        return <div className="p-6"><h1 className="text-2xl font-heading font-semibold tracking-tight">Dashboard</h1></div>
      case "items":
        return <div className="p-6"><h1 className="text-2xl font-heading font-semibold tracking-tight">Items</h1></div>
      case "outbox":
        return <div className="p-6"><h1 className="text-2xl font-heading font-semibold tracking-tight">Outbox</h1></div>
      case "settings":
        return <div className="p-6"><h1 className="text-2xl font-heading font-semibold tracking-tight">Settings</h1></div>
      default:
        return <div className="p-6"><h1 className="text-2xl font-heading font-semibold tracking-tight">Today</h1></div>
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        activeView={activeView}
        setActiveView={(view) => setActiveView(view)}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        badgeCounts={{}}  // e.g. { outbox: pendingCount }
      />
      <main className="flex-1 overflow-hidden flex flex-col">
        {renderContent()}
      </main>
    </div>
  )
}
