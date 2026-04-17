"use client"

import { cn } from "@/lib/utils"
import { Bell, Compass, Radio, Search } from "lucide-react"

type Category = { id: string; label: string }

export function FeedHeader<T extends Category>({
  categories,
  active,
  onSelect,
}: {
  categories: readonly T[]
  active: T["id"]
  onSelect: (id: T["id"]) => void
}) {
  return (
    <header
      className="sticky top-0 z-30 w-full backdrop-blur-lg"
      style={{
        backgroundColor: "color-mix(in oklab, var(--feed-bg) 82%, transparent)",
        borderBottom: "1px solid var(--feed-line)",
      }}
    >
      <div className="mx-auto flex h-14 w-full max-w-[620px] items-center justify-between gap-3 px-4 sm:h-16 sm:px-5">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{
              backgroundColor: "var(--feed-ink)",
              color: "var(--feed-bg)",
            }}
            aria-hidden="true"
          >
            <Radio className="h-4.5 w-4.5" strokeWidth={2} />
          </div>
          <div className="flex flex-col leading-none">
            <span
              className="font-serif text-[22px] tracking-tight"
              style={{ color: "var(--feed-ink)" }}
            >
              АРТЛЕНТА
            </span>
            <span
              className="text-[10px] font-medium uppercase tracking-[0.18em]"
              style={{ color: "var(--feed-ink-faint)" }}
            >
              Артемьевск · сегодня
            </span>
          </div>
        </div>

        {/* Header actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Поиск по ленте"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-[color:var(--feed-muted)]"
            style={{ color: "var(--feed-ink-soft)" }}
          >
            <Search className="h-4.5 w-4.5" strokeWidth={1.8} />
          </button>
          <button
            type="button"
            aria-label="Открытия дня"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-[color:var(--feed-muted)]"
            style={{ color: "var(--feed-ink-soft)" }}
          >
            <Compass className="h-4.5 w-4.5" strokeWidth={1.8} />
          </button>
          <button
            type="button"
            aria-label="Уведомления"
            className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-[color:var(--feed-muted)]"
            style={{ color: "var(--feed-ink-soft)" }}
          >
            <Bell className="h-4.5 w-4.5" strokeWidth={1.8} />
            <span
              className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "var(--feed-accent)" }}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* Category tabs — horizontally scrollable on mobile */}
      <nav
        aria-label="Рубрики"
        className="scrollbar-none mx-auto flex w-full max-w-[620px] items-center gap-1.5 overflow-x-auto px-4 pb-2.5 sm:px-5"
      >
        {categories.map((c) => {
          const isActive = c.id === active
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c.id)}
              aria-pressed={isActive}
              className={cn(
                "shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              )}
              style={
                isActive
                  ? {
                      backgroundColor: "var(--feed-ink)",
                      color: "var(--feed-bg)",
                    }
                  : {
                      backgroundColor: "var(--feed-surface)",
                      color: "var(--feed-ink-soft)",
                      border: "1px solid var(--feed-line)",
                    }
              }
            >
              {c.label}
            </button>
          )
        })}
      </nav>
    </header>
  )
}
