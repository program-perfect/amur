"use client"

import type { Conversation } from "@/lib/amur-data"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { ExpandedView } from "./profile-panel"

/**
 * Overlay dialog version of the profile panel for tablet and mobile (below xl).
 * Instead of sliding in from the right, it pops up in the centre of the
 * screen with a gentle scale + fade animation. Closes on overlay click or
 * Escape.
 */
export function ProfileSheet({
  conversation,
  open,
  onClose,
}: {
  conversation: Conversation
  open: boolean
  onClose: () => void
}) {
  // Keep the dialog mounted briefly after closing so the exit animation
  // can play. `mounted` mirrors `open` with a small trailing delay.
  const [mounted, setMounted] = useState(open)
  useEffect(() => {
    if (open) {
      setMounted(true)
      return
    }
    const t = window.setTimeout(() => setMounted(false), 220)
    return () => clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!mounted) return null

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-50 xl:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      {/* Scrim */}
      <button
        type="button"
        aria-label="Закрыть профиль"
        onClick={onClose}
        className={cn(
          "cursor-pointer absolute inset-0 bg-foreground/40 backdrop-blur-sm transition-opacity duration-300 ease-out",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Centered dialog — pops in with scale + fade */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Профиль ${conversation.name}`}
        className={cn(
          // Mobile keeps its compact sizing; on tablet (md..xl) the dialog
          // switches to a percentage-based width so it reads as a proper
          // aside sized against the viewport rather than a small popup.
          "absolute left-1/2 top-1/2 flex max-h-[90dvh] w-[min(92vw,380px)] flex-col overflow-hidden rounded-3xl md:w-[62vw]",
          "bg-background shadow-[0_24px_72px_-16px_rgba(120,50,20,0.45)] ring-1 ring-border/60",
          open ? "animate-pop-in" : "animate-pop-out",
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="cursor-pointer absolute right-3 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-primary"
        >
          <X className="h-4 w-4" strokeWidth={1.8} />
        </button>

        <ExpandedView conversation={conversation} />
      </aside>
    </div>
  )
}
