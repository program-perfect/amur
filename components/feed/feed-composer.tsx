"use client"

import { Camera, MapPin, Send } from "lucide-react"

/**
 * A slim "what's new?" card pinned above the feed.
 * Non-functional — the button is a visual cue only.
 */
export function FeedComposer() {
  return (
    <section
      aria-label="Поделиться новостью"
      className="border-y px-4 py-3 sm:rounded-2xl sm:border sm:px-4 sm:py-3.5"
      style={{
        backgroundColor: "var(--feed-surface)",
        borderColor: "var(--feed-line)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
          style={{
            backgroundColor: "var(--feed-primary-soft)",
            color: "var(--feed-primary)",
          }}
          aria-hidden="true"
        >
          Т
        </div>
        <button
          type="button"
          className="flex-1 cursor-text rounded-full px-4 py-2.5 text-left text-sm transition-colors"
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
          className="hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-[color:var(--feed-muted)] sm:flex"
          style={{ color: "var(--feed-ink-soft)" }}
        >
          <Camera className="h-4.5 w-4.5" strokeWidth={1.8} />
        </button>
      </div>

      <div
        className="mt-3 hidden items-center justify-between border-t pt-3 sm:flex"
        style={{ borderColor: "var(--feed-line)" }}
      >
        <div
          className="flex items-center gap-1.5 text-xs"
          style={{ color: "var(--feed-ink-faint)" }}
        >
          <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
          Артемьевск · центр
        </div>
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold"
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
