"use client"

type Category = { id: string; label: string }

/**
 * Floating bottom category dock shown on mobile and small-tablet sizes
 * (< md). Replaces the horizontal filter row from the top header on those
 * breakpoints so category switching stays thumb-reachable while scrolling.
 *
 * Visual style:
 *  - A chunky, fully-rounded pill (rounded-full) with generous padding so
 *    it reads as a thick floating surface.
 *  - A diffused shadow tinted with the page ink over the page background,
 *    giving the dock a subtle "halo" that feels like it's lifted off the
 *    feed paper rather than stamped onto it.
 *  - Content scrolls horizontally when labels exceed the dock width, so
 *    long Russian category names ("Инфраструктура") never clip.
 */
export function FeedBottomDock<T extends Category>({
  categories,
  active,
  onSelect,
}: {
  categories: readonly T[]
  active: T["id"]
  onSelect: (id: T["id"]) => void
}) {
  return (
    <nav
      aria-label="Рубрики · быстрый переход"
      className="fixed bottom-3 left-1/2 z-40 w-[min(calc(100vw-20px),560px)] -translate-x-1/2 md:hidden"
    >
      <div
        className="scrollbar-none flex items-center gap-1 overflow-x-auto rounded-full p-2"
        style={{
          backgroundColor: "var(--feed-surface)",
          /* Layered shadow — a wide, soft halo tinted toward the page
             background plus a short ink-tinted drop keeps the dock
             legible on any scroll position. */
          boxShadow: [
            "0 24px 48px -16px color-mix(in oklab, var(--feed-ink) 28%, transparent)",
            "0 8px 18px -10px color-mix(in oklab, var(--feed-ink) 18%, transparent)",
            "0 2px 4px color-mix(in oklab, var(--feed-ink) 6%, transparent)",
          ].join(", "),
        }}
      >
        {categories.map((c) => {
          const isActive = c.id === active
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c.id)}
              aria-pressed={isActive}
              className="shrink-0 cursor-pointer whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors"
              style={
                isActive
                  ? {
                      backgroundColor: "var(--feed-ink)",
                      color: "var(--feed-bg)",
                    }
                  : {
                      backgroundColor: "transparent",
                      color: "var(--feed-ink-soft)",
                    }
              }
            >
              {c.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
