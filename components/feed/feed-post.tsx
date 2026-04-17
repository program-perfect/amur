"use client"

import type {
  FeedPostData,
  FeedReactionCounts,
  FeedReactionKey,
} from "@/lib/feed-data"
import { cn } from "@/lib/utils"
import {
  Bookmark,
  Copy,
  Link2,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Send,
  Share2,
} from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"

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
  /** CSS class that applies that reaction's signature hover animation. */
  hoverAnim: string
}

const reactionList: ReactionDef[] = [
  { key: "like", label: "Нравится", glyph: "👍", pickedBg: "oklch(0.92 0.06 240)", pickedFg: "oklch(0.32 0.12 240)", hoverAnim: "reaction-like" },
  { key: "fire", label: "Огонь", glyph: "🔥", pickedBg: "oklch(0.94 0.08 55)", pickedFg: "oklch(0.42 0.18 40)", hoverAnim: "reaction-fire" },
  { key: "haha", label: "Ха-ха", glyph: "😂", pickedBg: "oklch(0.95 0.08 95)", pickedFg: "oklch(0.42 0.15 80)", hoverAnim: "reaction-haha" },
  { key: "wow", label: "Удивительно", glyph: "😮", pickedBg: "oklch(0.93 0.07 195)", pickedFg: "oklch(0.34 0.12 215)", hoverAnim: "reaction-wow" },
  { key: "sad", label: "Грустно", glyph: "😢", pickedBg: "oklch(0.93 0.05 230)", pickedFg: "oklch(0.34 0.1 240)", hoverAnim: "reaction-sad" },
  { key: "angry", label: "Возмутительно", glyph: "😡", pickedBg: "oklch(0.92 0.08 25)", pickedFg: "oklch(0.4 0.18 20)", hoverAnim: "reaction-angry" },
]

const reactionByKey = new Map(reactionList.map((r) => [r.key, r]))

type ShareOption = {
  key: string
  label: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  /** Background tint when hovered / tapped. */
  tint: string
  iconColor: string
}

const shareOptions: ShareOption[] = [
  { key: "copy", label: "Копировать ссылку", icon: Copy, tint: "oklch(0.95 0.015 250)", iconColor: "oklch(0.38 0.05 250)" },
  { key: "link", label: "Открыть ссылку", icon: Link2, tint: "oklch(0.94 0.04 210)", iconColor: "oklch(0.38 0.12 215)" },
  { key: "mail", label: "Отправить почтой", icon: Mail, tint: "oklch(0.94 0.05 25)", iconColor: "oklch(0.42 0.15 25)" },
  { key: "direct", label: "Личное сообщение", icon: Send, tint: "oklch(0.94 0.06 145)", iconColor: "oklch(0.38 0.12 155)" },
]

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

/**
 * Hover-with-bridge controller for a popover.
 *
 * Fixes the "popover closes when I move the cursor onto it" bug by:
 *   1. Treating the trigger and the popover as a single hover region via
 *      shared open/close handlers — moving between them just swaps which
 *      element is hovered without ever firing a "leave" on the group.
 *   2. Delaying the actual close by a short grace period so the cursor
 *      can cross the visual gap (6px) between trigger and popover.
 *   3. Supporting touch: long-press (400 ms) opens the picker, a tap on
 *      the trigger itself falls back to the quick-pick action. A tap
 *      anywhere outside the group closes the popover.
 */
function usePopoverGroup() {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const longPressed = useRef(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  const openNow = useCallback(() => {
    clearCloseTimer()
    setOpen(true)
  }, [clearCloseTimer])

  const scheduleClose = useCallback(() => {
    clearCloseTimer()
    closeTimer.current = setTimeout(() => setOpen(false), 220)
  }, [clearCloseTimer])

  const closeNow = useCallback(() => {
    clearCloseTimer()
    setOpen(false)
  }, [clearCloseTimer])

  // Mouse pointer enters the group (trigger or popover).
  const handlePointerEnter = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") openNow()
    },
    [openNow],
  )
  const handlePointerLeave = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") scheduleClose()
    },
    [scheduleClose],
  )

  // Touch long-press on the trigger opens the picker.
  const startLongPress = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType !== "touch" && e.pointerType !== "pen") return
      longPressed.current = false
      if (longPressTimer.current) clearTimeout(longPressTimer.current)
      longPressTimer.current = setTimeout(() => {
        longPressed.current = true
        openNow()
      }, 380)
    },
    [openNow],
  )
  const cancelLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  // Close when the user taps outside the group (touch devices rely on
  // this since they have no "leave" event).
  useEffect(() => {
    if (!open) return
    const onDocPointerDown = (e: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("pointerdown", onDocPointerDown)
    return () => document.removeEventListener("pointerdown", onDocPointerDown)
  }, [open])

  useEffect(() => {
    return () => {
      clearCloseTimer()
      if (longPressTimer.current) clearTimeout(longPressTimer.current)
    }
  }, [clearCloseTimer])

  return {
    open,
    containerRef,
    openNow,
    closeNow,
    handlePointerEnter,
    handlePointerLeave,
    startLongPress,
    cancelLongPress,
    wasLongPress: () => longPressed.current,
  }
}

export function FeedPost({ post }: { post: FeedPostData }) {
  const [picked, setPicked] = useState<FeedReactionKey | null>(null)
  const [lastPickedAt, setLastPickedAt] = useState(0)
  const [saved, setSaved] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const reactionPopover = usePopoverGroup()
  const sharePopover = usePopoverGroup()

  const counts: FeedReactionCounts = { ...post.reactions }
  if (picked) {
    counts[picked] = (counts[picked] ?? 0) + 1
  }
  const total = sumReactions(counts)
  const top = topReactions(counts, picked ?? post.topReaction)

  const pickedDef = picked ? reactionByKey.get(picked)! : reactionList[0]

  const handleTriggerClick = (e: React.MouseEvent) => {
    // If the user just long-pressed to open the picker, swallow the
    // synthetic click that browsers fire on release.
    if (reactionPopover.wasLongPress()) {
      e.preventDefault()
      return
    }
    // Clicking the primary button commits a "like" (or removes it when
    // already picked). Works the same whether the picker is open from
    // hover or closed — a click is always a deliberate commit.
    setPicked((cur) => (cur ? null : "like"))
    setLastPickedAt(Date.now())
    reactionPopover.closeNow()
  }

  const handlePickReaction = (key: FeedReactionKey) => {
    setPicked((cur) => (cur === key ? null : key))
    setLastPickedAt(Date.now())
    reactionPopover.closeNow()
  }

  const handleShareOption = (_key: string) => {
    sharePopover.closeNow()
  }

  return (
    <article
      className={cn(
        "w-full overflow-hidden sm:rounded-3xl",
        "transition-shadow duration-300",
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
          className="touch-manipulate flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-all duration-200 hover:bg-[color:var(--feed-muted)] active:scale-95"
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

      {/* Image + skeleton placeholder. The skeleton occupies the same
          aspect ratio as the image so the card doesn't shift when the
          real asset streams in. */}
      {post.image && (
        <div
          className="relative w-full overflow-hidden"
          style={{
            aspectRatio: post.image.aspect.replace("/", " / "),
            backgroundColor: "var(--feed-muted)",
          }}
        >
          {!imageLoaded && (
            <div
              aria-hidden="true"
              className="feed-skeleton absolute inset-0"
            />
          )}
          <Image
            src={post.image.src}
            alt={post.image.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 560px, 620px"
            className={cn(
              "object-cover transition-opacity duration-500",
              imageLoaded ? "opacity-100" : "opacity-0",
            )}
            onLoad={() => setImageLoaded(true)}
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
            className="touch-manipulate flex cursor-pointer items-center gap-1.5 transition-colors hover:underline"
            aria-label={`${formatCount(total)} реакций`}
          >
            <span className="flex -space-x-1" aria-hidden="true">
              {top.map((k, i) => {
                const def = reactionByKey.get(k)!
                return (
                  <span
                    key={k}
                    className="flex h-[22px] w-[22px] items-center justify-center rounded-full text-[12px] transition-transform duration-200"
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
        {/* Reaction button with hover/long-press picker. */}
        <div
          ref={reactionPopover.containerRef}
          className="relative flex-1"
          onPointerEnter={reactionPopover.handlePointerEnter}
          onPointerLeave={reactionPopover.handlePointerLeave}
        >
          <button
            type="button"
            onPointerDown={reactionPopover.startLongPress}
            onPointerUp={reactionPopover.cancelLongPress}
            onPointerCancel={reactionPopover.cancelLongPress}
            onPointerLeave={reactionPopover.cancelLongPress}
            onClick={handleTriggerClick}
            aria-label={
              picked
                ? `Реакция: ${pickedDef.label}. Нажмите, чтобы убрать`
                : "Поставить реакцию. Удерживайте, чтобы выбрать"
            }
            aria-haspopup="menu"
            aria-expanded={reactionPopover.open}
            className="touch-manipulate flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl py-2.5 text-[13px] font-semibold transition-all duration-200 hover:bg-[color:var(--feed-muted)] active:scale-[0.97] xs:text-sm"
            style={{
              color: picked ? pickedDef.pickedFg : "var(--feed-ink-soft)",
            }}
          >
            <span
              key={`${picked ?? "none"}-${lastPickedAt}`}
              className={cn(
                "text-[18px] leading-none",
                picked && "animate-reaction-pop",
              )}
              aria-hidden="true"
            >
              {picked ? pickedDef.glyph : "👍"}
            </span>
            <span>{picked ? pickedDef.label : "Нравится"}</span>
          </button>

          {reactionPopover.open && (
            <div
              role="menu"
              aria-label="Выбрать реакцию"
              className="animate-picker-in absolute bottom-[calc(100%+6px)] left-1 z-20 flex items-center gap-1 rounded-full px-2 py-2"
              style={{
                backgroundColor: "var(--feed-surface)",
                /* Soft drop shadow only — no outline ring, so the picker
                   floats cleanly over the feed paper. */
                boxShadow:
                  "0 12px 28px -10px rgba(15, 23, 42, 0.22), 0 4px 10px -4px rgba(15, 23, 42, 0.12)",
              }}
            >
              {/* Invisible bridge covering the 6px gap between the
                  picker and the trigger so a moving cursor never
                  "leaves" the hover group. */}
              <span
                aria-hidden="true"
                className="absolute -bottom-[10px] left-0 right-0 h-[10px]"
              />
              {reactionList.map((r) => {
                const isSelected = picked === r.key
                return (
                  <button
                    key={r.key}
                    type="button"
                    role="menuitem"
                    onClick={() => handlePickReaction(r.key)}
                    aria-label={r.label}
                    title={r.label}
                    className={cn(
                      "touch-manipulate flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-[24px] transition-transform duration-200",
                      "hover:-translate-y-1 active:scale-90",
                      r.hoverAnim,
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
          className="touch-manipulate flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl py-2.5 text-[13px] font-semibold transition-all duration-200 hover:bg-[color:var(--feed-muted)] active:scale-[0.97] xs:text-sm"
          style={{ color: "var(--feed-ink-soft)" }}
          aria-label={`Комментировать · ${post.comments}`}
        >
          <MessageCircle className="h-[18px] w-[18px]" strokeWidth={1.8} />
          <span className="hidden xs:inline">Комментарий</span>
          <span className="xs:hidden">Комм.</span>
        </button>

        {/* Share button with its own hover/long-press popover that
            mirrors the reaction picker's interaction pattern. */}
        <div
          ref={sharePopover.containerRef}
          className="relative flex-1"
          onPointerEnter={sharePopover.handlePointerEnter}
          onPointerLeave={sharePopover.handlePointerLeave}
        >
          <button
            type="button"
            onPointerDown={(e) => {
              sharePopover.startLongPress(e)
              // On touch, pointerdown is also used to toggle: if the
              // popover is already open (from a previous tap), a new
              // tap dismisses it. We stash the pre-tap state on the
              // button so the click handler can decide correctly.
              if (e.pointerType === "touch" || e.pointerType === "pen") {
                ;(e.currentTarget as HTMLElement).dataset.openBefore =
                  sharePopover.open ? "1" : "0"
              } else {
                ;(e.currentTarget as HTMLElement).dataset.openBefore = "hover"
              }
            }}
            onPointerUp={sharePopover.cancelLongPress}
            onPointerCancel={sharePopover.cancelLongPress}
            onPointerLeave={sharePopover.cancelLongPress}
            onClick={(e) => {
              if (sharePopover.wasLongPress()) {
                e.preventDefault()
                return
              }
              const openBefore = (e.currentTarget as HTMLElement).dataset
                .openBefore
              if (openBefore === "hover") {
                // Desktop: hover already opened it. A click is a no-op
                // so we don't flicker the popover closed under the
                // cursor that's still resting on the button.
                return
              }
              // Touch: tap toggles.
              if (openBefore === "1") sharePopover.closeNow()
              else sharePopover.openNow()
            }}
            aria-haspopup="menu"
            aria-expanded={sharePopover.open}
            className="touch-manipulate flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl py-2.5 text-[13px] font-semibold transition-all duration-200 hover:bg-[color:var(--feed-muted)] active:scale-[0.97] xs:text-sm"
            style={{ color: "var(--feed-ink-soft)" }}
            aria-label={`Поделиться · ${post.shares}`}
          >
            <Share2 className="h-[18px] w-[18px]" strokeWidth={1.8} />
            <span className="hidden xs:inline">Поделиться</span>
          </button>

          {sharePopover.open && (
            <div
              role="menu"
              aria-label="Поделиться публикацией"
              className="animate-picker-in absolute bottom-[calc(100%+6px)] left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full px-2 py-2"
              style={{
                backgroundColor: "var(--feed-surface)",
                boxShadow:
                  "0 12px 28px -10px rgba(15, 23, 42, 0.22), 0 4px 10px -4px rgba(15, 23, 42, 0.12)",
              }}
            >
              <span
                aria-hidden="true"
                className="absolute -bottom-[10px] left-0 right-0 h-[10px]"
              />
              {shareOptions.map((opt) => {
                const Icon = opt.icon
                return (
                  <button
                    key={opt.key}
                    type="button"
                    role="menuitem"
                    onClick={() => handleShareOption(opt.key)}
                    aria-label={opt.label}
                    title={opt.label}
                    className="touch-manipulate flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition-all duration-200 hover:-translate-y-1 hover:scale-110 active:scale-90"
                    style={{
                      backgroundColor: "transparent",
                      color: opt.iconColor,
                    }}
                    onPointerEnter={(e) => {
                      if (e.pointerType === "mouse") {
                        ;(e.currentTarget as HTMLElement).style.backgroundColor =
                          opt.tint
                      }
                    }}
                    onPointerLeave={(e) => {
                      ;(e.currentTarget as HTMLElement).style.backgroundColor =
                        "transparent"
                    }}
                  >
                    <Icon
                      className="h-5 w-5 transition-transform duration-200"
                      strokeWidth={1.8}
                    />
                    <span className="sr-only">{opt.label}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setSaved((v) => !v)}
          className="touch-manipulate flex w-11 shrink-0 cursor-pointer items-center justify-center rounded-2xl py-2.5 transition-all duration-200 hover:bg-[color:var(--feed-muted)] active:scale-90"
          aria-label={saved ? "Убрать из сохранённого" : "Сохранить"}
          aria-pressed={saved}
          style={{
            color: saved ? "var(--feed-accent)" : "var(--feed-ink-soft)",
          }}
        >
          <Bookmark
            className="h-[18px] w-[18px] transition-transform duration-200"
            strokeWidth={1.8}
            fill={saved ? "currentColor" : "none"}
          />
        </button>
      </div>
    </article>
  )
}
