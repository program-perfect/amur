"use client"

import { Camera, MapPin, Send } from "lucide-react"

/**
 * Slim "what's new?" card pinned above the feed. Borderless — sits on
 * the paper background as a pure surface differentiated only by a warmer
 * white and a barely-there shadow. Non-functional; the button is a
 * visual cue only.
 */
export function FeedComposer() {
  return (
    <section
      aria-label="Поделиться новостью"
      className="w-full px-4 py-3.5 sm:rounded-3xl sm:px-5 sm:py-4"
      style={{
        backgroundColor: "var(--feed-surface)",
        boxShadow: "0 1px 2px rgba(15, 23, 42, 0.025)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
          style={{
            backgroundColor: "var(--feed-ink)",
            color: "var(--feed-bg)",
          }}
          aria-hidden="true"
        >
          Т
        </div>
        <button
          type="button"
          className="flex-1 cursor-text rounded-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-[color:var(--feed-muted-strong)]"
          style={{
            backgroundColor: "var(--feed-muted)",
            color: "var(--feed-ink-faint)",
          }}
        >
          Что происходит в Артемьевске?
        </button>
        <button
          type="button"
          aria-label="Добавить фото"
          className="hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-[color:var(--feed-muted)] xs:flex"
          style={{ color: "var(--feed-ink-soft)" }}
        >
          <Camera className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </button>
      </div>

      <div className="mt-3 hidden items-center justify-between pt-3 sm:flex">
        <div
          className="flex items-center gap-1.5 text-xs"
          style={{ color: "var(--feed-ink-faint)" }}
        >
          <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
          Артемьевск · центр
        </div>
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "var(--feed-ink)",
            color: "var(--feed-bg)",
          }}
        >
          <Send className="h-3.5 w-3.5" strokeWidth={2} />
          Опубликовать
        </button>
      </div>
    </section>
  )
}
