
"use client"

import * as React from "react"

export const SIDEBAR_COOKIE_NAME = "sidebar_state"
export const SIDEBAR_KEYBOARD_SHORTCUT = "b"

export type SidebarContext = {
  open: boolean
  setOpen: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

export const SidebarProviderContext = React.createContext<SidebarContext | null>(null)

export function useSidebar() {
  const context = React.useContext(SidebarProviderContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}
