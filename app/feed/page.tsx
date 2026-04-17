"use client"

import { FeedComposer } from "@/components/feed/feed-composer"
import { FeedHeader } from "@/components/feed/feed-header"
import { FeedPost } from "@/components/feed/feed-post"
import { generateFeed } from "@/lib/feed-data"
import { useMemo, useState } from "react"

const categories = [
  { id: "all", label: "Всё" },
  { id: "infra", label: "Инфраструктура" },
  { id: "culture", label: "Культура" },
  { id: "evening", label: "Вечер" },
  { id: "books", label: "Книги" },
] as const

type CategoryId = (typeof categories)[number]["id"]

export default function FeedPage() {
  const [active, setActive] = useState<CategoryId>("all")
  // Deterministic generation — SSR and client render identical content.
  const posts = useMemo(() => generateFeed(28), [])

  const visible = useMemo(() => {
    if (active === "all") return posts
    return posts.filter((p) => p.category === active)
  }, [posts, active])

  return (
    <div
      className="min-h-dvh w-full font-sans"
      style={{
        // Scoped palette for the feed route — intentionally very different
        // from the rose/blush palette used elsewhere in the app.
        // Warm paper background, deep navy ink, ochre accent.
        ["--feed-bg" as string]: "oklch(0.965 0.014 85)",
        ["--feed-surface" as string]: "#ffffff",
        ["--feed-ink" as string]: "oklch(0.22 0.03 250)",
        ["--feed-ink-soft" as string]: "oklch(0.44 0.025 250)",
        ["--feed-ink-faint" as string]: "oklch(0.6 0.02 250)",
        ["--feed-line" as string]: "oklch(0.9 0.015 85)",
        ["--feed-primary" as string]: "oklch(0.34 0.075 240)",
        ["--feed-primary-soft" as string]: "oklch(0.94 0.025 240)",
        ["--feed-accent" as string]: "oklch(0.68 0.14 70)",
        ["--feed-accent-soft" as string]: "oklch(0.94 0.04 75)",
        ["--feed-muted" as string]: "oklch(0.95 0.01 85)",
        backgroundColor: "var(--feed-bg)",
        color: "var(--feed-ink)",
      }}
    >
      <FeedHeader
        categories={categories}
        active={active}
        onSelect={(id) => setActive(id)}
      />

      <main className="mx-auto w-full max-w-[620px] pb-24 sm:px-5 sm:pt-5">
        <FeedComposer />

        <div className="flex flex-col gap-0 sm:gap-5">
          {visible.map((post) => (
            <FeedPost key={post.id} post={post} />
          ))}
        </div>

        {visible.length === 0 && (
          <div
            className="mx-4 mt-8 rounded-2xl border p-10 text-center sm:mx-0"
            style={{
              borderColor: "var(--feed-line)",
              backgroundColor: "var(--feed-surface)",
            }}
          >
            <p className="text-sm" style={{ color: "var(--feed-ink-soft)" }}>
              В этой категории пока тихо. Загляните позже — город не спит.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
