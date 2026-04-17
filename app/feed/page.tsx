"use client"

import { FeedBottomDock } from "@/components/feed/feed-bottom-dock"
import { FeedComposer } from "@/components/feed/feed-composer"
import { FeedHeader } from "@/components/feed/feed-header"
import { FeedPost } from "@/components/feed/feed-post"
import { FeedPromoAmur } from "@/components/feed/feed-promo-amur"
import { FeedPromoArtlenta } from "@/components/feed/feed-promo-artlenta"
import { FeedSideLeft } from "@/components/feed/feed-side-left"
import { FeedSideRight } from "@/components/feed/feed-side-right"
import {
  filterItemsByCategory,
  generateFeedItems,
  type FeedCategory,
  type FeedItem,
} from "@/lib/feed-data"
import { useMemo, useState } from "react"

// Full category list for the feed header and bottom dock. Order is
// editorial: the most-browsed verticals appear first, with niche
// sections ("История", "Барахолка") lower in the strip. The bottom
// dock scrolls horizontally so long labels on mobile never clip.
const categories = [
  { id: "all", label: "Всё" },
  { id: "infra", label: "Инфраструктура" },
  { id: "culture", label: "Культура" },
  { id: "evening", label: "Вечер" },
  { id: "food", label: "Еда" },
  { id: "sport", label: "Спорт" },
  { id: "nature", label: "Природа" },
  { id: "transport", label: "Транспорт" },
  { id: "tech", label: "Технологии" },
  { id: "market", label: "Барахолка" },
  { id: "kids", label: "Дети" },
  { id: "history", label: "История" },
  { id: "books", label: "Книги" },
] as const

type CategoryId = (typeof categories)[number]["id"]

export default function FeedPage() {
  const [active, setActive] = useState<CategoryId>("all")
  // Deterministic generation — SSR and client render identical content.
  // Count is tuned so each of the ~13 categories gets several posts when
  // filtered: we cycle through 22 templates, so 72 slots yields ≈3 posts
  // per vertical plus the two planted promos.
  const items = useMemo(() => generateFeedItems(72), [])

  const visible: FeedItem[] = useMemo(() => {
    const cat: FeedCategory | "all" = active
    return filterItemsByCategory(items, cat)
  }, [items, active])

  return (
    <div
      className="min-h-dvh w-full font-sans"
      style={{
        /* ── АртЛента palette ────────────────────────────────────────────
           Deliberately monotone: a cool near-white paper, dark indigo ink
           with just enough chroma to avoid looking grey, and a single
           warm amber accent for reactions, highlights, and the "+" in
           АРТЛЕНТА+. No hard hairlines — the feed relies on soft shadows
           and a shade of paper (`--feed-muted`) to separate surfaces,
           with a thicker 2px border reserved for focus/picker states.
        */
        ["--feed-bg" as string]: "oklch(0.972 0.004 250)",
        ["--feed-surface" as string]: "#ffffff",
        ["--feed-muted" as string]: "oklch(0.955 0.004 250)",
        ["--feed-muted-strong" as string]: "oklch(0.935 0.006 250)",
        ["--feed-ink" as string]: "oklch(0.22 0.02 255)",
        ["--feed-ink-soft" as string]: "oklch(0.48 0.015 255)",
        ["--feed-ink-faint" as string]: "oklch(0.62 0.012 255)",
        /* Used sparingly — only for the optional thicker outline on
           focused pills / picker popover. */
        ["--feed-line" as string]: "oklch(0.9 0.006 250)",
        ["--feed-line-strong" as string]: "oklch(0.82 0.008 250)",
        /* Single accent — warm amber. */
        ["--feed-accent" as string]: "oklch(0.68 0.15 55)",
        ["--feed-accent-soft" as string]: "oklch(0.955 0.04 70)",
        ["--feed-primary-soft" as string]: "oklch(0.945 0.012 250)",
        ["--feed-primary" as string]: "oklch(0.32 0.035 255)",
        backgroundColor: "var(--feed-bg)",
        color: "var(--feed-ink)",
      }}
    >
      <FeedHeader
        categories={categories}
        active={active}
        onSelect={(id) => setActive(id)}
      />

      {/*
        3-column layout:
          <sm (<640)   : center only (edge-to-edge cards)
          sm..md        : center with padding + rounded cards
          md..lg        : center + right column (narrow)
          lg..xl        : center + right (wider) + left (compact)
          xl+           : left + center + right with full widgets
      */}
      <div
        className="mx-auto flex w-full max-w-[1300px] gap-0 pb-28 sm:gap-5 sm:px-4 sm:pb-32 md:gap-6 md:pb-10 lg:px-6 xl:gap-8"
      >
        {/*
          Left rail — only from xl up (desktop). The aside levitates with
          generous horizontal padding (`px-6`) so the profile badge's
          amber glow shadow breathes in every direction without being
          sliced by the scroll container. Only the top + bottom of the
          content fades out via `mask-image` so scrolling melts into
          the page edges; the sides stay opaque and fully visible.
        */}
        <aside
          className="sticky top-[124px] hidden h-[calc(100dvh-140px)] w-[280px] shrink-0 self-start overflow-y-auto px-6 pb-8 pt-5 xl:block xl:w-[300px] scrollbar-none"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0, black 24px, black calc(100% - 32px), transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, transparent 0, black 24px, black calc(100% - 32px), transparent 100%)",
          }}
        >
          <FeedSideLeft />
        </aside>

        {/* Center column — the feed itself. */}
        <main className="mx-auto flex w-full min-w-0 max-w-[620px] flex-col gap-0 pt-0 sm:gap-5 sm:pt-5 md:max-w-[560px] lg:max-w-[600px] xl:max-w-[620px]">
          <FeedComposer />

          <div className="flex flex-col gap-0 sm:gap-5">
            {visible.map((item) => {
              if (item.kind === "post") {
                return <FeedPost key={item.data.id} post={item.data} />
              }
              if (item.kind === "promo-amur") {
                return <FeedPromoAmur key={item.id} />
              }
              return <FeedPromoArtlenta key={item.id} />
            })}
          </div>

          {visible.length === 0 && (
            <div
              className="mx-4 mt-8 rounded-3xl p-10 text-center sm:mx-0"
              style={{
                backgroundColor: "var(--feed-surface)",
              }}
            >
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--feed-ink-soft)" }}
              >
                В этой категории пока тихо. Загляните позже — город не спит.
              </p>
            </div>
          )}
        </main>

        {/* Right rail — shown from xl up (desktop). Reaches a touch
            higher (top-[112px]) and all the way down to the viewport
            bottom so the column never shows an empty bleed. Both the
            top and the bottom edges fade out via a soft `mask-image`
            gradient so content dissolves into the page on either side
            of the sticky container — matching the left rail's
            treatment. Scrollbar is fully hidden; the column still
            scrolls via wheel / trackpad / touch. */}
        <aside
          className="sticky top-[112px] hidden h-[calc(100dvh-112px)] w-[296px] shrink-0 self-start overflow-y-auto px-4 pb-10 pt-6 xl:block xl:w-[336px] scrollbar-none"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0, black 28px, black calc(100% - 36px), transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, transparent 0, black 28px, black calc(100% - 36px), transparent 100%)",
          }}
        >
          <FeedSideRight />
        </aside>
      </div>

      {/* Floating category dock — mobile + small-tablet only. Lives at
          the page root so it's not affected by the scroll container's
          sticky context and always stays pinned to the viewport bottom. */}
      <FeedBottomDock
        categories={categories}
        active={active}
        onSelect={(id) => setActive(id)}
      />
    </div>
  )
}
