"use client"

import { Heart, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

/**
 * Sponsored cross-promotion for the Amur dating app.
 *
 * Visually sits inside the АртЛента stream but uses its own warmer
 * claret-and-cream palette so readers immediately recognise it as a
 * promo rather than a regular post. No border — just a tinted surface
 * and a soft shadow — matching the rest of the refreshed feed look.
 *
 * Users can dismiss the card locally; this is a visual flourish and
 * doesn't persist across reloads.
 */
export function FeedPromoAmur() {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <article
      aria-label="Рекламный пост: Амур — сервис знакомств"
      className="relative w-full overflow-hidden sm:rounded-3xl"
      style={{
        // Warm claret wash — intentionally distinct from the cool-paper
        // feed palette so the card reads as "not editorial".
        backgroundColor: "oklch(0.97 0.018 20)",
        boxShadow: "0 1px 2px rgba(80, 20, 30, 0.04), 0 12px 28px -16px rgba(80, 20, 30, 0.18)",
      }}
    >
      {/* Sponsor label + close */}
      <div
        className="flex items-center justify-between px-4 pt-3.5 sm:px-5 sm:pt-4"
        style={{ color: "oklch(0.5 0.08 15)" }}
      >
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em]">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: "oklch(0.62 0.22 14)" }}
            aria-hidden="true"
          />
          Реклама · Амур
        </span>
        <button
          type="button"
          aria-label="Скрыть рекламу"
          onClick={() => setDismissed(true)}
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-[oklch(0.93_0.03_20)]"
          style={{ color: "oklch(0.5 0.06 15)" }}
        >
          <X className="h-4 w-4" strokeWidth={1.8} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 pb-5 pt-3 sm:grid-cols-[1fr_180px] sm:gap-6 sm:px-5 sm:pt-4 md:grid-cols-[1fr_220px] lg:grid-cols-[1fr_240px]">
        {/* Copy block */}
        <div className="flex flex-col justify-center">
          <div className="mb-3 flex items-center gap-2">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-[15px]"
              style={{
                backgroundColor: "oklch(0.62 0.22 14)",
                color: "oklch(0.99 0.01 20)",
              }}
              aria-hidden="true"
            >
              <Heart className="h-4 w-4 fill-current" strokeWidth={0} />
            </span>
            <span
              className="font-serif text-xl leading-none sm:text-2xl"
              style={{ color: "oklch(0.28 0.08 15)" }}
            >
              Амур
            </span>
          </div>

          <h3
            className="font-serif text-[22px] leading-[1.15] tracking-tight xs:text-[24px] sm:text-[26px]"
            style={{ color: "oklch(0.22 0.06 15)" }}
          >
            Любовь — это{" "}
            <span
              className="italic"
              style={{ color: "oklch(0.56 0.2 8)" }}
            >
              алгоритм
            </span>
            , который работает.
          </h3>

          <p
            className="mt-2 max-w-md text-[13.5px] leading-relaxed"
            style={{ color: "oklch(0.42 0.035 15)" }}
          >
            Более 50 000 пар в Артемьевске и других городах уже нашли друг
            друга. Без ботов, без фейков, без платы за регистрацию.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "oklch(0.24 0.04 15)",
                color: "oklch(0.98 0.01 15)",
              }}
            >
              Попробовать Амур
            </Link>
            <span
              className="text-[11.5px]"
              style={{ color: "oklch(0.55 0.04 15)" }}
            >
              Регистрация — минута
            </span>
          </div>
        </div>

        {/* Art */}
        <div
          className="relative aspect-[5/4] w-full overflow-hidden rounded-2xl sm:aspect-[4/5]"
          style={{ backgroundColor: "oklch(0.93 0.03 18)" }}
        >
          <Image
            src="/feed/promo-amur.jpg"
            alt="Две чашки кофе на столике с пионами — тёплая романтичная сцена"
            fill
            sizes="(max-width: 640px) 100vw, 240px"
            className="object-cover"
          />
        </div>
      </div>
    </article>
  )
}
