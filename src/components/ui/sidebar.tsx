
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { PanelLeft } from "lucide-react"

import { useLocalStorage } from "@/hooks/use-local-storage"
import { useIsMobile } from "@/hooks/use-mobile"
import { useSidebar } from "@/hooks/use-sidebar"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

export const SIDEBAR_COOKIE_NAME = "sidebar_state"
export const SIDEBAR_KEYBOARD_SHORTCUT = "b"

export const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [open, setOpen] = useLocalStorage(SIDEBAR_COOKIE_NAME, defaultOpen)

    const toggleSidebar = React.useCallback(() => {
        setOpen(!open);
    }, [open, setOpen])

    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    const contextValue = React.useMemo(
      () => ({
        open,
        setOpen,
        isMobile,
        toggleSidebar,
      }),
      [open, setOpen, isMobile, toggleSidebar]
    )

    return (
      <SidebarProviderContext.Provider value={contextValue}>
        <div ref={ref} {...props}>
            {children}
        </div>
      </SidebarProviderContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"


const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
    collapsible?: "icon" | "none"
  }
>(
  (
    {
      side = "left",
      collapsible = "icon",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, open, setOpen } = useSidebar()

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-full flex-col bg-card text-card-foreground",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      )
    }

    if (isMobile) {
      return (
        <Sheet open={open} onOpenChange={setOpen} {...props}>
          <SheetContent
            className="bg-card p-0 text-card-foreground [&>button]:hidden"
            side={side}
          >
             <SheetHeader className="p-4">
                <SheetTitle className="sr-only">Toolbar</SheetTitle>
             </SheetHeader>
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
        <div
            ref={ref}
            className={cn(
                "hidden md:block text-card-foreground transition-all duration-300 ease-in-out",
                open ? 'w-80' : 'w-0',
                className
            )}
            {...props}
        >
            <div className={cn("h-full", open ? 'w-80' : 'w-0', 'overflow-hidden')}>
                {children}
            </div>
        </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"


const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"


export const SidebarProviderContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
} | null>(null);


export {
  Sidebar,
  SidebarInset,
  SidebarTrigger,
}
