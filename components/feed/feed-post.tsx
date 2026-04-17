"use client"

import type {
  FeedPostData,
  FeedReactionCounts,
  FeedReactionKey,
} from "@/lib/feed-data"
import { cn } from "@/lib/utils"
import { Bookmark, MessageCircle, MoreHorizontal, Share2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

/* ── Reaction definitions ──────────────────────────────────────────────────
   VK/Facebook-style reactions, minus the "heart" — we use fire, wow, haha,
   sad, angry, and a generic "like" thumb. Each reaction has a compact SVG
   glyph so reaction badges read cleanly against both light and colored
   backgrounds without relying on emoji font rendering.
*/
type ReactionDef = {
  key: FeedReactionKey
  label: string
  glyph: string
  /** Background used when the reaction pill is selected by the viewer. */
  pickedBg: string
  /** Text color on picked state. */
  pickedFg: string
}

const reactionList: ReactionDef[] = [
  { key: "like", label: "Нравится", glyph: "👍", pickedBg: "oklch(0.92 0.06 240)", pickedFg: "oklch(0.32 0.12 240)" },
  { key: "fire", label: "Огонь", glyph: "🔥", pickedBg: "oklch(0.94 0.08 55)", pickedFg: "oklch(0.42 0.18 40)" },
  { key: "haha", label: "Ха-ха", glyph: "😂", pickedBg: "oklch(0.95 0.08 95)", pickedFg: "oklch(0.42 0.15 80)" },
  { key: "wow", label: "Удивительно", glyph: "😮", pickedBg: "oklch(0.93 0.07 195)", pickedFg: "oklch(0.34 0.12 215)" },
  { key: "sad", label: "Грустно", glyph: "😢", pickedBg: "oklch(0.93 0.05 230)", pickedFg: "oklch(0.34 0.1 240)" },
  { key: "angry", label: "Возмутительно", glyph: "😡", pickedBg: "oklch(0.92 0.08 25)", pickedFg: "oklch(0.4 0.18 20)" },
]

const reactionByKey = new Map(reactionList.map((r) => [r.key, r]))

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10_000 ? 0 : 1).replace(".0", "")}K`
  return n.toString()
}

function sumReactions(counts: FeedReactionCounts): number {
  let s = 0
  for (const k of Object.keys(counts) as FeedReactionKey[]) s += counts[k] ?? 0
  return s
}

/** Top 3 reactions by count — drives the clustered glyphs shown on the
 *  reaction summary row. */
function topReactions(
  counts: FeedReactionCounts,
  topReaction: FeedReactionKey,
): FeedReactionKey[] {
  const ordered = (Object.entries(counts) as [FeedReactionKey, number][])
    .sort(([, a], [, b]) => b - a)
    .map(([k]) => k)
  // Guarantee the post's "top" reaction is present and first.
  const out = [topReaction, ...ordered.filter((k) => k !== topReaction)]
  return out.slice(0, 3)
}

export function FeedPost({ post }: { post: FeedPostData }) {
  const [picked, setPicked] = useState<FeedReactionKey | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [saved, setSaved] = useState(false)

  const counts: FeedReactionCounts = { ...post.reactions }
  if (picked) {
    counts[picked] = (counts[picked] ?? 0) + 1
  }
  const total = sumReactions(counts)
  const top = topReactions(counts, picked ?? post.topReaction)

  const pickedDef = picked ? reactionByKey.get(picked)! : reactionList[0]

  return (
    <article
      className={cn(
        "w-full overflow-hidden sm:rounded-3xl",
        "transition-shadow",
      )}
      style={{
        backgroundColor: "var(--feed-surface)",
        // Soft, low-contrast lift — replaces the 1px hairline border we
        // used to have. On mobile the card goes edge-to-edge so there
        // isn't even a shadow to draw.
        boxShadow: "0 1px 2px rgba(15, 23, 42, 0.025)",
      }}
    >
      {/* Header */}
      <header className="flex items-center gap-3 px-4 pb-3 pt-4 sm:px-5">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold xs:h-11 xs:w-11"
          style={{
            backgroundColor: `oklch(0.95 0.04 ${post.avatarHue})`,
            color: `oklch(0.3 0.1 ${post.avatarHue})`,
          }}
          aria-hidden="true"
        >
          {post.monogram}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span
              className="truncate text-[14px] font-semibold leading-tight"
              style={{ color: "var(--feed-ink)" }}
            >
              {post.group}
            </span>
          </div>
          <div
            className="mt-0.5 flex items-center gap-1 truncate text-[12px]"
            style={{ color: "var(--feed-ink-faint)" }}
          >
            <span className="truncate">@{post.handle}</span>
            <span aria-hidden="true">·</span>
            <span className="shrink-0">{post.time}</span>
            <span aria-hidden="true" className="hidden xs:inline">·</span>
            <span className="hidden truncate xs:inline">{post.location}</span>
          </div>
        </div>
        <button
          type="button"
          aria-label="Действия с публикацией"
          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-[color:var(--feed-muted)]"
          style={{ color: "var(--feed-ink-soft)" }}
        >
          <MoreHorizontal className="h-5 w-5" strokeWidth={1.8} />
        </button>
      </header>

      {/* Body text */}
      <div className="px-4 pb-3 sm:px-5">
        <p
          className="select-text whitespace-pre-line text-[15px] leading-relaxed"
          style={{ color: "var(--feed-ink)" }}
        >
          {post.text}
        </p>
      </div>

      {/* Image */}
      {post.image && (
        <div
          className="relative w-full overflow-hidden"
          style={{
            aspectRatio: post.image.aspect.replace("/", " / "),
            backgroundColor: "var(--feed-muted)",
          }}
        >
          <Image
            src={post.image.src}
            alt={post.image.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 560px, 620px"
            className="object-cover"
          />
        </div>
      )}

      {/* Reaction summary + comments/views row */}
      {total > 0 && (
        <div
          className="flex items-center justify-between gap-3 px-4 pb-2 pt-3 text-[12.5px] sm:px-5"
          style={{ color: "var(--feed-ink-soft)" }}
        >
          <button
            type="button"
            className="flex cursor-pointer items-center gap-1.5 transition-colors hover:underline"
            aria-label={`${formatCount(total)} реакций`}
          >
            <span className="flex -space-x-1" aria-hidden="true">
              {top.map((k, i) => {
                const def = reactionByKey.get(k)!
                return (
                  <span
                    key={k}
                    className="flex h-[22px] w-[22px] items-center justify-center rounded-full text-[12px]"
                    style={{
                      backgroundColor: def.pickedBg,
                      /* 2px ring punches out the stack on the surface
                         white so the emojis remain legible when they
                         overlap. */
                      boxShadow: "0 0 0 2px var(--feed-surface)",
                      zIndex: 3 - i,
                    }}
                  >
                    {def.glyph}
                  </span>
                )
              })}
            </span>
            <span className="font-medium">{formatCount(total)}</span>
          </button>
          <div className="flex items-center gap-2 xs:gap-3">
            <span>{formatCount(post.comments)} комм.</span>
            <span aria-hidden="true" className="hidden xs:inline">·</span>
            <span className="hidden xs:inline">{formatCount(post.views)} просм.</span>
          </div>
        </div>
      )}

      {/* Action bar */}
      <div className="relative flex items-stretch justify-between gap-0.5 px-2 py-1 sm:px-2.5">
        {/* Reaction button (with hover/long-press picker) */}
        <div
          className="relative flex-1"
          onMouseEnter={() => setPickerOpen(true)}
          onMouseLeave={() => setPickerOpen(false)}
        >
          <button
            type="button"
            onClick={() => {
              // Tap toggles: first tap picks "like" or clears the current pick.
              setPicked((cur) => (cur ? null : "like"))
            }}
            aria-label={
              picked
                ? `Реакция: ${pickedDef.label}. Нажмите, чтобы убрать`
                : "Поставить реакцию"
            }
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl py-2.5 text-[13px] font-semibold transition-colors hover:bg-[color:var(--feed-muted)] xs:text-sm"
            style={{
              color: picked ? pickedDef.pickedFg : "var(--feed-ink-soft)",
            }}
          >
            <span className="text-[18px] leading-none" aria-hidden="true">
              {picked ? pickedDef.glyph : "👍"}
            </span>
            <span>{picked ? pickedDef.label : "Нравится"}</span>
          </button>

          {pickerOpen && (
            <div
              role="menu"
              aria-label="Выбрать реакцию"
              className="absolute bottom-[calc(100%+6px)] left-1 z-20 flex items-center gap-1 rounded-full px-1.5 py-1.5"
              style={{
                backgroundColor: "var(--feed-surface)",
                /* Thicker 2px tinted ring instead of a 1px hairline —
                   feels friendlier and reads as a distinct surface. */
                boxShadow:
                  "0 0 0 2px var(--feed-line-strong), 0 16px 32px -14px rgba(15, 23, 42, 0.22)",
              }}
            >
              {reactionList.map((r) => {
                const isSelected = picked === r.key
                return (
                  <button
                    key={r.key}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setPicked((cur) => (cur === r.key ? null : r.key))
                      setPickerOpen(false)
                    }}
                    aria-label={r.label}
                    title={r.label}
                    className={cn(
                      "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[22px] transition-transform",
                      "hover:-translate-y-1 hover:scale-110",
                    )}
                    style={{
                      backgroundColor: isSelected ? r.pickedBg : "transparent",
                    }}
                  >
                    <span aria-hidden="true">{r.glyph}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <button
          type="button"
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl py-2.5 text-[13px] font-semibold transition-colors hover:bg-[color:var(--feed-muted)] xs:text-sm"
          style={{ color: "var(--feed-ink-soft)" }}
          aria-label={`Комментировать · ${post.comments}`}
        >
          <MessageCircle className="h-[18px] w-[18px]" strokeWidth={1.8} />
          <span className="hidden xs:inline">Комментарий</span>
          <span className="xs:hidden">Комм.</span>
        </button>

        <button
          type="button"
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl py-2.5 text-[13px] font-semibold transition-colors hover:bg-[color:var(--feed-muted)] xs:text-sm"
          style={{ color: "var(--feed-ink-soft)" }}
          aria-label={`Поделиться · ${post.shares}`}
        >
          <Share2 className="h-[18px] w-[18px]" strokeWidth={1.8} />
          <span className="hidden xs:inline">Поделиться</span>
        </button>

        <button
          type="button"
          onClick={() => setSaved((v) => !v)}
          className="flex w-11 shrink-0 cursor-pointer items-center justify-center rounded-2xl py-2.5 transition-colors hover:bg-[color:var(--feed-muted)]"
          aria-label={saved ? "Убрать из сохранённого" : "Сохранить"}
          aria-pressed={saved}
          style={{
            color: saved ? "var(--feed-accent)" : "var(--feed-ink-soft)",
          }}
        >
          <Bookmark
            className="h-[18px] w-[18px]"
            strokeWidth={1.8}
            fill={saved ? "currentColor" : "none"}
          />
        </button>
      </div>
    </article>
  )
}
