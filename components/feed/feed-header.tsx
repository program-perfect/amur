"use client"

import { cn } from "@/lib/utils"
import { Bell, Compass, Radio, Search, Undo2 } from "lucide-react"
import Link from "next/link"

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
      }}
    >
      <div className="mx-auto flex h-14 w-full max-w-[1300px] items-center justify-between gap-3 px-4 sm:h-16 sm:px-5 md:px-5 lg:h-[72px] lg:px-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5 xs:gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl xs:h-10 xs:w-10"
            style={{
              backgroundColor: "var(--feed-ink)",
              color: "var(--feed-bg)",
            }}
            aria-hidden="true"
          >
            <Radio className="h-[18px] w-[18px] xs:h-5 xs:w-5" strokeWidth={2} />
          </div>
          <div className="flex flex-col leading-none">
            <span
              className="font-serif text-[20px] tracking-tight xs:text-[22px] md:text-[24px]"
              style={{ color: "var(--feed-ink)" }}
            >
              АРТЛЕНТА
            </span>
            <span
              className="mt-0.5 hidden text-[10px] font-medium uppercase tracking-[0.18em] xs:inline-block"
              style={{ color: "var(--feed-ink-faint)" }}
            >
              Артемьевск · сегодня
            </span>
          </div>
        </div>

        {/* Header actions */}
        <div className="flex items-center gap-0.5 xs:gap-1">
          <button
            type="button"
            aria-label="Поиск по ленте"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-[color:var(--feed-muted)]"
            style={{ color: "var(--feed-ink-soft)" }}
          >
            <Search className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </button>
          <button
            type="button"
            aria-label="Открытия дня"
            className="hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-[color:var(--feed-muted)] xs:flex"
            style={{ color: "var(--feed-ink-soft)" }}
          >
            <Compass className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </button>
          <button
            type="button"
            aria-label="Уведомления"
            className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-[color:var(--feed-muted)]"
            style={{ color: "var(--feed-ink-soft)" }}
          >
            <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
            <span
              className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "var(--feed-accent)" }}
              aria-hidden="true"
            />
          </button>

          {/* Subtle "back to Amur" escape hatch. Icon-only on mobile,
              text+icon on larger screens. Intentionally low contrast
              and uses a ghost style so it doesn't compete with the
              primary actions. */}
          <Link
            href="/"
            aria-label="Вернуться в Амур"
            title="Вернуться в Амур"
            className="ml-1 flex h-10 cursor-pointer items-center gap-1.5 rounded-full px-2.5 text-[12px] transition-colors hover:bg-[color:var(--feed-muted)] md:pl-2.5 md:pr-3.5"
            style={{ color: "var(--feed-ink-faint)" }}
          >
            <Undo2 className="h-3.5 w-3.5" strokeWidth={1.6} />
            <span className="hidden md:inline">В Амур</span>
          </Link>
        </div>
      </div>

      {/* Category tabs — only shown from xl up (desktop). On mobile and
          tablet sizes the chips are replaced by a floating FeedBottomDock,
          so switching categories stays thumb-reachable while scrolling and
          doesn't compete with the sticky header height. */}
      <nav
        aria-label="Рубрики"
        className="scrollbar-none mx-auto hidden w-full max-w-[1300px] items-center gap-1.5 overflow-x-auto px-4 pb-2.5 sm:px-5 lg:px-6 xl:flex xl:gap-2"
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
                "shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors xs:text-sm md:px-4 md:py-2",
              )}
              style={
                isActive
                  ? {
                      backgroundColor: "var(--feed-ink)",
                      color: "var(--feed-bg)",
                    }
                  : {
                      backgroundColor: "var(--feed-muted)",
                      color: "var(--feed-ink-soft)",
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
