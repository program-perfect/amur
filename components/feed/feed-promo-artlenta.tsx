"use client"

import { Check, Sparkles, X } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

/**
 * Self-promotion for the paid АРТЛЕНТА+ tier. Uses the feed's amber
 * accent heavily on a cream wash so it visually "belongs" to the feed
 * but still stands out as a first-party promo.
 */
export function FeedPromoArtlenta() {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <article
      aria-label="Рекламный пост: подписка АРТЛЕНТА+"
      className="relative w-full overflow-hidden sm:rounded-3xl"
      style={{
        // Warm cream wash — one shade off the surface white, amber-tinted.
        backgroundColor: "oklch(0.97 0.025 75)",
        boxShadow: "0 1px 2px rgba(80, 50, 15, 0.04), 0 12px 28px -16px rgba(80, 50, 15, 0.16)",
      }}
    >
      {/* Sponsor label + close */}
      <div
        className="flex items-center justify-between px-4 pt-3.5 sm:px-5 sm:pt-4"
        style={{ color: "oklch(0.42 0.08 60)" }}
      >
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em]">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: "var(--feed-accent)" }}
            aria-hidden="true"
          />
          Продвигаемое · АРТЛЕНТА+
        </span>
        <button
          type="button"
          aria-label="Скрыть рекламу"
          onClick={() => setDismissed(true)}
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-[oklch(0.92_0.03_70)]"
          style={{ color: "oklch(0.44 0.05 60)" }}
        >
          <X className="h-4 w-4" strokeWidth={1.8} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 pb-5 pt-3 sm:grid-cols-[180px_1fr] sm:gap-6 sm:px-5 sm:pt-4 md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]">
        {/* Art */}
        <div
          className="relative order-2 aspect-[5/4] w-full overflow-hidden rounded-2xl sm:order-1 sm:aspect-[4/5]"
          style={{ backgroundColor: "oklch(0.93 0.03 70)" }}
        >
          <Image
            src="/feed/promo-artlenta.jpg"
            alt="Открытая тетрадь, перьевая ручка и эспрессо на льняной скатерти"
            fill
            sizes="(max-width: 640px) 100vw, 240px"
            className="object-cover"
          />
        </div>

        {/* Copy block */}
        <div className="order-1 flex flex-col justify-center sm:order-2">
          <div className="mb-3 flex items-center gap-2">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{
                backgroundColor: "var(--feed-ink)",
                color: "var(--feed-accent)",
              }}
              aria-hidden="true"
            >
              <Sparkles className="h-4 w-4" strokeWidth={1.8} />
            </span>
            <span
              className="font-serif text-xl leading-none sm:text-2xl"
              style={{ color: "var(--feed-ink)" }}
            >
              АРТЛЕНТА<span style={{ color: "var(--feed-accent)" }}>+</span>
            </span>
          </div>

          <h3
            className="font-serif text-[22px] leading-[1.15] tracking-tight xs:text-[24px] sm:text-[26px]"
            style={{ color: "var(--feed-ink)" }}
          >
            Тише, глубже,{" "}
            <span className="italic" style={{ color: "var(--feed-accent)" }}>
              без рекламы
            </span>
            .
          </h3>

          <ul
            className="mt-3 grid gap-1.5 text-[13px]"
            style={{ color: "var(--feed-ink-soft)" }}
          >
            {[
              "Полные лонгриды редакции",
              "Архив публикаций за 3 года",
              "Ни одного рекламного поста",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Check
                  className="h-4 w-4 shrink-0"
                  strokeWidth={2.2}
                  style={{ color: "var(--feed-accent)" }}
                />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--feed-ink)",
                color: "var(--feed-bg)",
              }}
            >
              Попробовать бесплатно
            </button>
            <span
              className="text-[11.5px]"
              style={{ color: "var(--feed-ink-faint)" }}
            >
              149 ₽ / месяц · первый месяц без оплаты
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
