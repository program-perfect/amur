"use client"

type Category = { id: string; label: string }

/**
 * Floating bottom category dock shown on mobile and tablet sizes (< lg).
 * Replaces the horizontal filter row from the top header on those
 * breakpoints so category switching stays thumb-reachable while scrolling.
 *
 * Visual style:
 *  - A chunky, fully-rounded pill (rounded-full) with generous padding so
 *    it reads as a thick floating surface.
 *  - A diffused shadow tinted with the page background color, giving the
 *    dock a subtle "halo" that feels like it's lifted off the feed paper.
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
      className="fixed bottom-4 left-1/2 z-40 w-[min(calc(100vw-24px),580px)] -translate-x-1/2 lg:hidden"
    >
      <div
        className="scrollbar-none flex items-center gap-1.5 overflow-x-auto rounded-full px-3 py-3"
        style={{
          backgroundColor: "var(--feed-surface)",
          /* Thick layered shadow tinted with the background color for a
             cohesive "lifted paper" appearance that blends with the feed. */
          boxShadow: [
            "0 0 0 1px color-mix(in oklab, var(--feed-ink) 6%, transparent)",
            "0 32px 64px -12px color-mix(in oklab, var(--feed-bg) 85%, var(--feed-ink))",
            "0 16px 32px -8px color-mix(in oklab, var(--feed-ink) 22%, transparent)",
            "0 8px 16px -6px color-mix(in oklab, var(--feed-ink) 14%, transparent)",
            "0 2px 6px color-mix(in oklab, var(--feed-ink) 8%, transparent)",
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
              className="shrink-0 cursor-pointer whitespace-nowrap rounded-full px-4 py-2.5 text-[13px] font-semibold transition-colors"
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
