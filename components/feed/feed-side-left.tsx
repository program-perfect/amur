"use client"

import {
  Bookmark,
  CalendarRange,
  Compass,
  Flame,
  Hash,
  Home,
  Map,
  MessageSquare,
  Settings,
  Undo2,
  Users,
} from "lucide-react"
import Link from "next/link"
import type { ComponentType, SVGProps } from "react"

type NavItem = {
  label: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  active?: boolean
  badge?: string
}

const nav: NavItem[] = [
  { label: "Лента", icon: Home, active: true },
  { label: "Популярное", icon: Compass },
  { label: "Афиша города", icon: CalendarRange, badge: "12" },
  { label: "Сообщества", icon: Users },
  { label: "Карта", icon: Map },
  { label: "Метки", icon: Hash },
  { label: "Сохранённое", icon: Bookmark },
  { label: "Сообщения", icon: MessageSquare, badge: "3" },
]

/**
 * Left rail shown on lg+. Acts like a social-network side navigation —
 * user mini-profile, primary nav list, and (at the very bottom) a
 * subtle link back to the host Amur app.
 */
export function FeedSideLeft() {
  return (
    <nav aria-label="Главная навигация АртЛенты" className="flex flex-col gap-5">
      {/* ── Mini-profile badge ────────────────────────────────────────
          Glowing, slightly translucent card framed with a soft amber
          halo and an inner peach-light highlight. Below the identity
          row sits a Reddit-style karma bar: a thin pill track where an
          orange gradient fills toward the next tier threshold, with a
          soft flame-coloured glow pulsing behind the fill. */}
      <ProfileBadge />

      {/* Mini-profile stats strip — separated from the glowing badge so
          the glow effect stays tight around the identity card without
          spilling over the generic numbers below. */}
      <div
        className="grid grid-cols-3 gap-1 text-center"
        style={{ color: "var(--feed-ink-soft)" }}
      >
        {[
          { v: "142", l: "подписки" },
          { v: "24", l: "посты" },
          { v: "1.2K", l: "чтения" },
        ].map((s) => (
          <div
            key={s.l}
            className="rounded-xl py-2"
            style={{ backgroundColor: "var(--feed-muted)" }}
          >
            <div
              className="text-[14px] font-semibold leading-none"
              style={{ color: "var(--feed-ink)" }}
            >
              {s.v}
            </div>
            <div className="mt-1 text-[10.5px] uppercase tracking-[0.1em]">
              {s.l}
            </div>
          </div>
        ))}
      </div>

      {/* Primary nav */}
      <ul className="flex flex-col gap-0.5">
        {nav.map(({ label, icon: Icon, active, badge }) => (
          <li key={label}>
            <button
              type="button"
              aria-current={active ? "page" : undefined}
              className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-[14px] font-medium transition-colors"
              style={
                active
                  ? {
                      backgroundColor: "var(--feed-ink)",
                      color: "var(--feed-bg)",
                    }
                  : {
                      color: "var(--feed-ink-soft)",
                      backgroundColor: "transparent",
                    }
              }
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
              <span className="flex-1 truncate">{label}</span>
              {badge && (
                <span
                  className="rounded-full px-1.5 py-0.5 text-[10.5px] font-semibold"
                  style={
                    active
                      ? {
                          backgroundColor: "color-mix(in oklab, var(--feed-bg) 18%, transparent)",
                          color: "var(--feed-bg)",
                        }
                      : {
                          backgroundColor: "var(--feed-accent-soft)",
                          color: "var(--feed-accent)",
                        }
                  }
                >
                  {badge}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {/* Post CTA — warm amber pill with crisp white label + subtle
          ink shadow so the word keeps its weight against the glow. */}
      <button
        type="button"
        className="w-full cursor-pointer rounded-full px-4 py-3 text-[14px] font-semibold transition-opacity hover:opacity-90"
        style={{
          backgroundColor: "var(--feed-accent)",
          color: "#ffffff",
          textShadow: "0 1px 1px oklch(0.35 0.12 40 / 0.35)",
          boxShadow:
            "0 8px 20px -8px oklch(0.68 0.2 45 / 0.55), inset 0 1px 0 oklch(1 0 0 / 0.3)",
        }}
      >
        Новая запись
      </button>

      {/* Footer section — settings + subtle escape back to Amur */}
      <div className="mt-2 flex flex-col gap-1">
        <button
          type="button"
          className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-2 text-left text-[13px] transition-colors hover:bg-[color:var(--feed-muted)]"
          style={{ color: "var(--feed-ink-faint)" }}
        >
          <Settings className="h-4 w-4" strokeWidth={1.8} />
          Настройки
        </button>
        <Link
          href="/"
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-[12.5px] transition-colors hover:bg-[color:var(--feed-muted)]"
          style={{ color: "var(--feed-ink-faint)" }}
        >
          <Undo2 className="h-3.5 w-3.5" strokeWidth={1.6} />
          <span>Вернуться в Амур</span>
        </Link>
      </div>
    </nav>
  )
}

/**
 * Glowing profile badge — the hero card of the left rail.
 *
 * Visual composition (back to front):
 *   1. An outer soft amber halo rendered via layered `box-shadow`s that
 *      radiate out from the card. The halo is the "light" leaking from
 *      the badge onto the rose page.
 *   2. A 1px accent-coloured border that acts as the rim of the glow.
 *   3. A slightly transparent white card (92% feed-surface) so the warm
 *      rose page tint faintly bleeds through, giving the badge a
 *      lit-from-behind quality.
 *   4. A gradient overlay in the top-left corner that simulates light
 *      spilling into the card from a warm source.
 *
 * The karma row is Reddit-flavoured: a "Карма" label on the left with
 * a flame glyph, the current score on the right, and a pill track
 * filled with an orange→amber gradient that's wrapped in its own
 * glow so the progress itself emits warmth.
 */
function ProfileBadge() {
  // Demo values — in a real build these'd come from the user session.
  const karma = 4820
  const nextTier = 5000
  const progress = Math.min(100, Math.round((karma / nextTier) * 100))

  return (
    <div className="relative">
      {/* Outer glow halo. Split into multiple box-shadows so the falloff
          feels soft without looking blurry. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-2 rounded-[28px]"
        style={{
          background:
            "radial-gradient(60% 55% at 30% 20%, oklch(0.82 0.14 55 / 0.35), transparent 70%), radial-gradient(50% 50% at 80% 90%, oklch(0.78 0.17 45 / 0.28), transparent 75%)",
          filter: "blur(10px)",
        }}
      />

      <div
        className="relative rounded-3xl p-4 backdrop-blur-sm"
        style={{
          /* 92% opacity card — lets the rose page tint bleed in. */
          backgroundColor:
            "color-mix(in oklab, var(--feed-surface) 92%, transparent)",
          /* Warm rim + soft inner light + lifted drop shadow. */
          boxShadow: [
            // Inner warm light coming from top-left
            "inset 1px 1px 0 oklch(1 0 0 / 0.7)",
            "inset 0 0 24px 2px oklch(0.92 0.1 55 / 0.35)",
            // Outer rim (acts like a backlit border)
            "0 0 0 1px oklch(0.78 0.14 55 / 0.45)",
            // Amber glow
            "0 0 24px -2px oklch(0.78 0.17 50 / 0.45)",
            "0 8px 32px -10px oklch(0.68 0.2 45 / 0.4)",
            // Soft drop shadow on page
            "0 4px 16px -6px oklch(0.22 0.02 255 / 0.12)",
          ].join(", "),
        }}
      >
        {/* Top-left light spill — a soft highlight gradient painted
            over the card to suggest a light source outside the frame. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{
            background:
              "radial-gradient(90% 60% at 15% 0%, oklch(1 0 0 / 0.55), transparent 55%)",
          }}
        />

        {/* Identity row. */}
        <div className="relative flex items-center gap-3">
          <div className="relative shrink-0">
            {/* Avatar rim glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-0.5 rounded-full"
              style={{
                background:
                  "conic-gradient(from 140deg, oklch(0.82 0.17 55), oklch(0.68 0.2 35), oklch(0.85 0.13 65), oklch(0.82 0.17 55))",
                filter: "blur(3px)",
                opacity: 0.85,
              }}
            />
            <div
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-[15px] font-bold"
              style={{
                backgroundColor: "var(--feed-ink)",
                color: "var(--feed-bg)",
                boxShadow:
                  "inset 0 1px 0 oklch(1 0 0 / 0.18), 0 0 0 2px var(--feed-surface)",
              }}
              aria-hidden="true"
            >
              Т
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div
              className="truncate text-[14px] font-semibold leading-tight"
              style={{ color: "var(--feed-ink)" }}
            >
              Татьяна Спиридонова
            </div>
            <div
              className="mt-0.5 truncate text-[12px]"
              style={{ color: "var(--feed-ink-faint)" }}
            >
              @tata.spiri · Артемьевск
            </div>
          </div>
        </div>

        {/* ── Reddit-style karma bar ──────────────────────────────────
            Compact row: label + value on top, filled track below. */}
        <div className="relative mt-4">
          <div className="mb-1.5 flex items-center justify-between">
            <div
              className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.09em]"
              style={{ color: "var(--feed-ink-soft)" }}
            >
              <Flame
                className="h-3.5 w-3.5"
                strokeWidth={2.2}
                style={{ color: "oklch(0.68 0.2 45)" }}
              />
              Карма
            </div>
            <div
              className="text-[12px] font-bold tabular-nums"
              style={{ color: "var(--feed-ink)" }}
            >
              {karma.toLocaleString("ru-RU")}
              <span
                className="ml-1 font-medium"
                style={{ color: "var(--feed-ink-faint)" }}
              >
                / {nextTier.toLocaleString("ru-RU")}
              </span>
            </div>
          </div>

          {/* Track — now taller (h-2.5) and more deeply embossed so the
              fill reads as a physically recessed channel. The bottom
              edge has a bright highlight (light catches the lip) while
              the top carries a darker shadow (as if the track were
              carved into the card surface). */}
          <div
            className="relative h-2.5 overflow-hidden rounded-full"
            style={{
              backgroundColor:
                "color-mix(in oklab, var(--feed-muted-strong) 85%, transparent)",
              boxShadow: [
                // Deep top shadow — gives the "carved-in" feel
                "inset 0 2px 3px oklch(0.22 0.02 255 / 0.18)",
                "inset 0 1px 1px oklch(0.22 0.02 255 / 0.12)",
                // Bright bottom highlight — light catches the lower lip
                "inset 0 -1.5px 0 oklch(1 0 0 / 0.95)",
                "inset 0 -2px 1px oklch(1 0 0 / 0.5)",
                // Thin rim for definition
                "inset 0 0 0 1px oklch(0.22 0.02 255 / 0.06)",
              ].join(", "),
            }}
          >
            {/* Glowing fill */}
            <div
              className="relative h-full rounded-full transition-[width] duration-700 ease-out"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, oklch(0.7 0.21 38) 0%, oklch(0.78 0.2 52) 55%, oklch(0.86 0.17 68) 100%)",
                boxShadow: [
                  // External amber glow that bleeds onto the card
                  "0 0 8px 0 oklch(0.78 0.2 50 / 0.75)",
                  "0 0 18px 0 oklch(0.78 0.2 50 / 0.5)",
                  // Internal highlights — top bright lip, bottom darker seam
                  "inset 0 1px 0 oklch(1 0 0 / 0.6)",
                  "inset 0 -1.5px 0 oklch(0.45 0.14 35 / 0.55)",
                ].join(", "),
              }}
            >
              {/* ── Diagonal chevron pattern ──────────────────────────
                  A tight 45° stripe overlay constrained to the fill
                  using its own rounded mask. The stripes are a bright
                  amber tint at low opacity so they read as polished
                  texture rather than flat graphic hatching. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "repeating-linear-gradient(135deg, oklch(1 0 0 / 0.28) 0 4px, transparent 4px 8px)",
                  mixBlendMode: "overlay",
                }}
              />

              {/* Specular highlight that shimmers along the fill */}
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, oklch(1 0 0 / 0.4) 50%, transparent 100%)",
                  mixBlendMode: "overlay",
                }}
              />
            </div>
          </div>

          <div
            className="mt-1.5 text-[10.5px]"
            style={{ color: "var(--feed-ink-faint)" }}
          >
            До уровня «Летописец» — {(nextTier - karma).toLocaleString("ru-RU")}
          </div>
        </div>
      </div>
    </div>
  )
}
