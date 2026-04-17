"use client"

import {
  CloudSnow,
  Music,
  TrendingUp,
  UserPlus,
} from "lucide-react"
import { useState } from "react"

type TrendingTag = { tag: string; posts: string }
type Community = {
  monogram: string
  name: string
  members: string
  hue: number
}
type Event = { day: string; month: string; title: string; place: string }

const trending: TrendingTag[] = [
  { tag: "набережная", posts: "284 поста" },
  { tag: "черновик", posts: "126 постов" },
  { tag: "свет2026", posts: "94 поста" },
  { tag: "буквари", posts: "71 пост" },
  { tag: "дворлесная", posts: "48 постов" },
]

const communities: Community[] = [
  { monogram: "СП", name: "Слово и полка", members: "2.4K", hue: 30 },
  { monogram: "ГР", name: "Городской радар", members: "5.1K", hue: 260 },
  { monogram: "Ч", name: "Черновик", members: "1.8K", hue: 340 },
]

const events: Event[] = [
  { day: "19", month: "апр", title: "Вечер короткой прозы", place: "Клуб «Черновик»" },
  { day: "22", month: "апр", title: "Открытый микрофон у набережной", place: "Набережная" },
  { day: "27", month: "апр", title: "Книгообмен во дворе", place: "ул. Лесная, 14" },
]

/**
 * Right rail shown on md+. Acts like a classic social-network "what's
 * happening" column — weather card, trending tags, suggested
 * communities, an events mini-agenda.
 */
export function FeedSideRight() {
  const [joined, setJoined] = useState<Record<string, boolean>>({})

  return (
    <aside aria-label="Сводка Артемьевска" className="flex flex-col gap-5">
      {/* Weather today */}
      <section
        className="relative overflow-hidden rounded-3xl p-5"
        style={{
          backgroundColor: "var(--feed-ink)",
          color: "var(--feed-bg)",
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-70">
              Артемьевск · сегодня
            </div>
            <div className="mt-2 font-serif text-4xl leading-none">
              −3°
            </div>
            <div className="mt-2 text-[12.5px] opacity-80">
              Лёгкий снег, ветер 3 м/с
            </div>
          </div>
          <CloudSnow className="h-10 w-10 opacity-80" strokeWidth={1.4} />
        </div>
        <div
          className="mt-4 grid grid-cols-3 gap-2 text-[11px] opacity-85"
        >
          {[
            { t: "15:00", tmp: "−1°" },
            { t: "18:00", tmp: "−3°" },
            { t: "21:00", tmp: "−5°" },
          ].map((h) => (
            <div
              key={h.t}
              className="rounded-xl px-2 py-1.5 text-center"
              style={{
                backgroundColor:
                  "color-mix(in oklab, var(--feed-bg) 14%, transparent)",
              }}
            >
              <div className="opacity-70">{h.t}</div>
              <div className="mt-0.5 font-semibold">{h.tmp}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section
        className="rounded-3xl p-4 xl:p-5"
        style={{ backgroundColor: "var(--feed-surface)" }}
      >
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp
            className="h-4 w-4"
            strokeWidth={2}
            style={{ color: "var(--feed-accent)" }}
          />
          <h3
            className="text-[13px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: "var(--feed-ink)" }}
          >
            В тренде
          </h3>
        </div>
        <ul className="flex flex-col gap-0.5">
          {trending.map((t, i) => (
            <li key={t.tag}>
              <button
                type="button"
                className="group flex w-full cursor-pointer items-start justify-between gap-3 rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-[color:var(--feed-muted)]"
              >
                <div className="min-w-0 flex-1">
                  <div
                    className="text-[11px] uppercase tracking-[0.12em]"
                    style={{ color: "var(--feed-ink-faint)" }}
                  >
                    {i + 1}  ·  Артемьевск
                  </div>
                  <div
                    className="truncate text-[14px] font-semibold leading-tight"
                    style={{ color: "var(--feed-ink)" }}
                  >
                    #{t.tag}
                  </div>
                  <div
                    className="mt-0.5 text-[11.5px]"
                    style={{ color: "var(--feed-ink-faint)" }}
                  >
                    {t.posts}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Suggested communities */}
      <section
        className="rounded-3xl p-4 xl:p-5"
        style={{ backgroundColor: "var(--feed-surface)" }}
      >
        <div className="mb-3 flex items-center gap-2">
          <UserPlus
            className="h-4 w-4"
            strokeWidth={2}
            style={{ color: "var(--feed-accent)" }}
          />
          <h3
            className="text-[13px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: "var(--feed-ink)" }}
          >
            Рекомендуем
          </h3>
        </div>
        <ul className="flex flex-col gap-2">
          {communities.map((c) => {
            const isJoined = !!joined[c.name]
            return (
              <li
                key={c.name}
                className="flex items-center gap-3 rounded-2xl p-1"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold"
                  style={{
                    backgroundColor: `oklch(0.94 0.045 ${c.hue})`,
                    color: `oklch(0.3 0.1 ${c.hue})`,
                  }}
                  aria-hidden="true"
                >
                  {c.monogram}
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className="truncate text-[13.5px] font-semibold leading-tight"
                    style={{ color: "var(--feed-ink)" }}
                  >
                    {c.name}
                  </div>
                  <div
                    className="mt-0.5 text-[11.5px]"
                    style={{ color: "var(--feed-ink-faint)" }}
                  >
                    {c.members} участников
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setJoined((j) => ({ ...j, [c.name]: !j[c.name] }))
                  }
                  aria-pressed={isJoined}
                  className="cursor-pointer rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors"
                  style={
                    isJoined
                      ? {
                          backgroundColor: "var(--feed-muted)",
                          color: "var(--feed-ink-soft)",
                        }
                      : {
                          backgroundColor: "var(--feed-ink)",
                          color: "var(--feed-bg)",
                        }
                  }
                >
                  {isJoined ? "Вы с ними" : "Подписаться"}
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      {/* Events */}
      <section
        className="rounded-3xl p-4 xl:p-5"
        style={{ backgroundColor: "var(--feed-surface)" }}
      >
        <div className="mb-3 flex items-center gap-2">
          <Music
            className="h-4 w-4"
            strokeWidth={2}
            style={{ color: "var(--feed-accent)" }}
          />
          <h3
            className="text-[13px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: "var(--feed-ink)" }}
          >
            Афиша недели
          </h3>
        </div>
        <ul className="flex flex-col gap-1">
          {events.map((e) => (
            <li key={e.title}>
              <button
                type="button"
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-[color:var(--feed-muted)]"
              >
                <div
                  className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: "var(--feed-accent-soft)",
                    color: "var(--feed-accent)",
                  }}
                >
                  <span className="text-[15px] font-bold leading-none">
                    {e.day}
                  </span>
                  <span className="mt-0.5 text-[10px] uppercase tracking-[0.08em]">
                    {e.month}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className="truncate text-[13.5px] font-semibold leading-tight"
                    style={{ color: "var(--feed-ink)" }}
                  >
                    {e.title}
                  </div>
                  <div
                    className="mt-0.5 truncate text-[11.5px]"
                    style={{ color: "var(--feed-ink-faint)" }}
                  >
                    {e.place}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Footer */}
      <footer
        className="px-2 pb-2 text-[11px] leading-relaxed"
        style={{ color: "var(--feed-ink-faint)" }}
      >
        © 2026 АРТЛЕНТА · О проекте · Правила сообщества · Реклама · Помощь
      </footer>
    </aside>
  )
}
