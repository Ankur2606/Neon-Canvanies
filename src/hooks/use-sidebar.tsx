
"use client"

import * as React from "react"
import { SidebarProviderContext } from "@/components/ui/sidebar"

export function useSidebar() {
  const context = React.useContext(SidebarProviderContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}
