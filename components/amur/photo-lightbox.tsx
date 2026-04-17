"use client"

import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"

interface PhotoLightboxProps {
  photos: string[]
  /** Index of the currently opened photo. `null` means closed. */
  index: number | null
  alt: string
  onClose: () => void
  onIndexChange: (next: number) => void
}

/**
 * Fullscreen modal that displays a character's photo at a larger size.
 * Works as an overlay on top of the profile panel / sheet and supports
 * keyboard navigation (Esc, ←, →) plus on-screen controls when the
 * conversation has more than one photo.
 */
export function PhotoLightbox({
  photos,
  index,
  alt,
  onClose,
  onIndexChange,
}: PhotoLightboxProps) {
  // Mirror the open state with a small trailing delay so the exit
  // animation has time to play before unmount.
  const [mounted, setMounted] = useState(index !== null)
  const isOpen = index !== null

  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      return
    }
    const t = window.setTimeout(() => setMounted(false), 220)
    return () => clearTimeout(t)
  }, [isOpen])

  const goPrev = useCallback(() => {
    if (index === null || photos.length < 2) return
    onIndexChange((index - 1 + photos.length) % photos.length)
  }, [index, photos.length, onIndexChange])

  const goNext = useCallback(() => {
    if (index === null || photos.length < 2) return
    onIndexChange((index + 1) % photos.length)
  }, [index, photos.length, onIndexChange])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, onClose, goPrev, goNext])

  if (!mounted) return null

  const current = index ?? 0
  const src = photos[current] ?? "/placeholder.svg"
  const hasMany = photos.length > 1

  return (
    <div
      aria-hidden={!isOpen}
      className={cn(
        "fixed inset-0 z-[60]",
        isOpen ? "pointer-events-auto" : "pointer-events-none",
      )}
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} — просмотр фото`}
    >
      {/* Scrim — closes on click */}
      <button
        type="button"
        aria-label="Закрыть просмотр фото"
        onClick={onClose}
        className={cn(
          "absolute inset-0 cursor-zoom-out bg-foreground/80 backdrop-blur-sm transition-opacity duration-200",
          isOpen ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Закрыть"
        className="absolute right-4 top-4 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-background/95 text-foreground shadow-lg ring-1 ring-border/40 transition-colors hover:bg-background"
      >
        <X className="h-5 w-5" strokeWidth={1.8} />
      </button>

      {/* Image + controls */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center p-4 sm:p-8",
          isOpen ? "animate-pop-in" : "animate-pop-out",
        )}
      >
        {hasMany && (
          <button
            type="button"
            onClick={goPrev}
            aria-label="Предыдущее фото"
            className="absolute left-4 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-background/95 text-foreground shadow-lg ring-1 ring-border/40 transition-colors hover:bg-background sm:left-6"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.8} />
          </button>
        )}

        <div className="relative flex h-full max-h-[88dvh] w-full max-w-4xl items-center justify-center">
          {/* Key forces re-mount so the image animates in on each navigation */}
          <div
            key={current}
            className="relative h-full w-full animate-pop-in"
          >
            <Image
              src={src || "/placeholder.svg"}
              alt={`${alt} — фото ${current + 1}`}
              fill
              priority
              sizes="(min-width: 1024px) 896px, 100vw"
              className="rounded-2xl object-contain"
            />
          </div>
        </div>

        {hasMany && (
          <button
            type="button"
            onClick={goNext}
            aria-label="Следующее фото"
            className="absolute right-4 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-background/95 text-foreground shadow-lg ring-1 ring-border/40 transition-colors hover:bg-background sm:right-6"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={1.8} />
          </button>
        )}

        {hasMany && (
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-1.5">
            {photos.map((_, i) => (
              <span
                key={i}
                aria-hidden
                className={cn(
                  "h-1.5 rounded-full bg-background/50 transition-all",
                  i === current ? "w-5 bg-background" : "w-1.5",
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
