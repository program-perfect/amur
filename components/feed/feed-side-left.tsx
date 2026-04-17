"use client"

import {
  Bookmark,
  CalendarRange,
  Compass,
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
      {/* Mini-profile card */}
      <div
        className="rounded-3xl p-4"
        style={{ backgroundColor: "var(--feed-surface)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[15px] font-bold"
            style={{
              backgroundColor: "var(--feed-ink)",
              color: "var(--feed-bg)",
            }}
            aria-hidden="true"
          >
            Т
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
        <div
          className="mt-3 grid grid-cols-3 gap-1 text-center"
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

      {/* Post CTA */}
      <button
        type="button"
        className="w-full cursor-pointer rounded-full px-4 py-3 text-[14px] font-semibold transition-opacity hover:opacity-90"
        style={{
          backgroundColor: "var(--feed-accent)",
          color: "oklch(0.2 0.06 40)",
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
