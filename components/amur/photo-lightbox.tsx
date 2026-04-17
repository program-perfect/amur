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
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose, goPrev, goNext])

  if (!mounted) return null

  const current = index ?? 0
  const src = photos[current] ?? "/placeholder.svg"
  const hasMany = photos.length > 1

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      aria-label={`${alt} — просмотр фото`}
      className={cn(
        "fixed inset-0 z-[60] overflow-hidden",
        isOpen ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <button
        type="button"
        aria-label="Закрыть просмотр фото"
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-200",
          isOpen ? "opacity-100" : "opacity-0",
        )}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div
          className={cn(
            "relative flex h-full max-h-[88dvh] w-full max-w-6xl items-center justify-center",
            isOpen ? "animate-scale-in" : "animate-scale-out",
          )}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="absolute right-2 top-2 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg ring-1 ring-border/50 transition-colors hover:bg-background sm:right-4 sm:top-4"
          >
            <X className="h-5 w-5" strokeWidth={1.8} />
          </button>

          {hasMany && (
            <button
              type="button"
              onClick={goPrev}
              aria-label="Предыдущее фото"
              className="absolute left-2 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg ring-1 ring-border/50 transition-colors hover:bg-background sm:left-4"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.8} />
            </button>
          )}

          <div className="relative h-full w-full overflow-hidden rounded-2xl">
            <div key={current} className="relative h-full w-full animate-scale-in">
              <Image
                src={src || "/placeholder.svg"}
                alt={`${alt} — фото ${current + 1}`}
                fill
                priority
                sizes="(min-width: 1280px) 1152px, (min-width: 768px) 80vw, 100vw"
                className="object-contain"
              />
            </div>
          </div>

          {hasMany && (
            <button
              type="button"
              onClick={goNext}
              aria-label="Следующее фото"
              className="absolute right-2 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg ring-1 ring-border/50 transition-colors hover:bg-background sm:right-4"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.8} />
            </button>
          )}

          {hasMany && (
            <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/35 px-3 py-2 backdrop-blur-sm sm:bottom-4">
              {photos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onIndexChange(i)}
                  aria-label={`Открыть фото ${i + 1}`}
                  aria-pressed={i === current}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === current ? "w-5 bg-white" : "w-2 bg-white/55 hover:bg-white/75",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}