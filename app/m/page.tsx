"use client"

import { BottomDock } from "@/components/amur/bottom-dock"
import { ChatView } from "@/components/amur/chat-view"
import { ConversationsList } from "@/components/amur/conversations-list"
import { LeftNav } from "@/components/amur/left-nav"
import {
  NotificationTimerDialog,
  useNotificationDialog,
} from "@/components/amur/notification-timer-dialog"
import { ProfilePanel } from "@/components/amur/profile-panel"
import { ProfileSheet } from "@/components/amur/profile-sheet"
import {
  defaultTypingProfile,
  conversations as seed,
  type Conversation,
  type Message,
  type ScriptStep,
  type TypingProfile,
} from "@/lib/amur-data"
import { getChatId, getConversationId } from "@/lib/chat-ids"
import { cn } from "@/lib/utils"
import { useSearchParams } from "next/navigation"
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react"

function MessengerPageLoader() {
  return (
    <div className="flex h-dvh w-full items-center justify-center bg-sidebar">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-pulse rounded-full bg-primary/20" />
        <span className="text-sm text-muted-foreground">Загрузка...</span>
      </div>
    </div>
  )
}

type ConvState = {
  messages: Message[]
  /** Next scripted step to consume. When >= script.length, the scenario is over. */
  scriptIndex: number
  isTyping: boolean
  preview: {
    lastMessage: string
    time: string
    unread?: number
    fromMe?: boolean
    /** Mirrors the last outgoing message's read-receipt for the list view. */
    read?: boolean
  }
  /** True once the user has opened this chat at least once. The scripted
   *  scenario only starts messaging once this is true AND the character
   *  is online. */
  visited: boolean
  /** Current online presence. Flips dynamically while the app runs. */
  online: boolean
  /** Millis since the character last went offline (null if currently online). */
  goneOfflineAt: number | null
  /** Millis at which the character will come back online. Null if online. */
  nextOnlineAt: number | null
  /** Millis since the scenario completed (drives the "только что" label). */
  scenarioFinishedAt: number | null
  /** Millis since the character's most recent scripted message that awaits
   *  a user reply. Null if we are not currently waiting for the user. */
  waitingForUserSince: number | null
}

/* ── Online-presence timings ────────────────────────────────────────────── */
/** A character reconnects randomly between 1 and 5 minutes from going offline. */
const MIN_OFFLINE_MS = 1 * 60 * 1000
const MAX_OFFLINE_MS = 5 * 60 * 1000
/** If the user doesn't reply within 30 s while the scenario expects them,
 *  the character goes offline and comes back later. */
const IDLE_BEFORE_OFFLINE_MS = 90 * 1000
/** How long the "только что" status lingers after scenario completion. */
const JUST_NOW_WINDOW_MS = 2 * 60 * 1000

function randomReconnectAt(from: number): number {
  return (
    from +
    Math.floor(Math.random() * (MAX_OFFLINE_MS - MIN_OFFLINE_MS + 1)) +
    MIN_OFFLINE_MS
  )
}

function buildInitialState(): Record<string, ConvState> {
  const map: Record<string, ConvState> = {}
  const now = Date.now()
  for (const c of seed) {
    map[c.id] = {
      messages: [{ id: `${c.id}-system`, kind: "system", text: c.matchedLabel }],
      scriptIndex: 0,
      isTyping: false,
      preview: c.preview,
      visited: false,
      online: c.online,
      goneOfflineAt: c.online
        ? null
        : now - Math.floor(Math.random() * 55 * 60 * 1000 + 5 * 60 * 1000),
      nextOnlineAt: c.online ? null : randomReconnectAt(now),
      scenarioFinishedAt: null,
      waitingForUserSince: null,
    }
  }
  return map
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
}

function pluralize(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few
  return many
}

/** Dynamic "last seen" label based on presence state. */
function formatStatusLabel(
  state: ConvState,
  conv: Conversation,
  now: number,
): string {
  if (state.online) return 'В сети'
  if (
    state.scenarioFinishedAt !== null &&
    now - state.scenarioFinishedAt < JUST_NOW_WINDOW_MS
  ) {
    return 'Был в сети только что'
  }
  if (state.goneOfflineAt !== null) {
    const diffMs = Math.max(0, now - state.goneOfflineAt)
    const minutes = Math.floor(diffMs / 60_000)
    if (minutes < 1) return 'Был в сети только что'
    if (minutes < 60) {
      return `Был в сети ${minutes} ${pluralize(minutes, 'минуту', 'минуты', 'минут')} назад`
    }
    const hours = Math.floor(minutes / 60)
    if (hours < 24) {
      return `Был в сети ${hours} ${pluralize(hours, 'час', 'часа', 'часов')} назад`
    }
    return 'Был в сети давно'
  }
  return conv.status
}

function buildMessage(
  convId: string,
  from: "me" | "them",
  step: ScriptStep,
  time: string,
  status?: "sent" | "read",
): Message {
  const base = {
    id: `${convId}-${from}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    from,
    time,
  }
  if (step.kind === "text") {
    return { ...base, kind: "text", text: step.text, ...(from === "me" ? { status } : {}) }
  }
  return {
    ...base,
    kind: "image",
    src: step.src,
    caption: step.caption,
    ...(from === "me" ? { status } : {}),
  }
}

function previewOf(step: ScriptStep, mine: boolean): string {
  const text = step.kind === "text" ? step.text : step.caption ?? "Фотография"
  return mine ? `Вы: ${text}` : text
}

export default function Page() {
  return (
    <Suspense fallback={<MessengerPageLoader />}>
      <MessengerPage />
    </Suspense>
  )
}

function MessengerPage() {
  const searchParams = useSearchParams()
  const notificationDialog = useNotificationDialog()

  // Resolve initial active conversation from URL or default to first
  const getInitialActiveId = useCallback(() => {
    const chatIdParam = searchParams.get("chat")
    if (chatIdParam) {
      const conversationId = getConversationId(chatIdParam)
      if (conversationId && seed.some((c) => c.id === conversationId)) {
        return conversationId
      }
    }
    return seed[0].id
  }, [searchParams])

  const [activeId, setActiveId] = useState<string>(() => getInitialActiveId())
  const [state, setState] = useState<Record<string, ConvState>>(
    () => buildInitialState(),
  )
  // "now" ticker — drives time-based status labels ("Был в сети X мин назад").
  const [now, setNow] = useState<number>(() => Date.now())
  // Keep a ref to activeId so timers/intervals can read the fresh value
  // without capturing stale closures.
  const activeIdRef = useRef(activeId)
  useEffect(() => {
    activeIdRef.current = activeId
  }, [activeId])

  // Mobile single-pane state: on screens below md, we show either the list
  // or the chat, not both. On md+ both are visible via CSS and this state
  // has no visible effect.
  const [mobileView, setMobileView] = useState<"list" | "chat">("list")
  // Tablet/mobile profile sheet (below xl).
  const [profileOpen, setProfileOpen] = useState(false)

  // Desktop (md+) resizable list width. Below COMPACT_BELOW, the list
  // switches to an icon-only view (avatars + unread-count badges).
  const LIST_MIN = 72
  const LIST_MAX = 460
  const COMPACT_BELOW = 240
  const [listWidth, setListWidth] = useState<number>(340)
  const [isResizing, setIsResizing] = useState(false)
  const listCompact = listWidth < COMPACT_BELOW

  const startResize = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault()
      const startX = e.clientX
      const startW = listWidth
      setIsResizing(true)
      const onMove = (ev: MouseEvent) => {
        const dx = ev.clientX - startX
        const next = Math.min(LIST_MAX, Math.max(LIST_MIN, startW + dx))
        setListWidth(next)
      }
      const onUp = () => {
        window.removeEventListener("mousemove", onMove)
        window.removeEventListener("mouseup", onUp)
        document.body.style.cursor = ""
        document.body.style.userSelect = ""
        setIsResizing(false)
      }
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"
      window.addEventListener("mousemove", onMove)
      window.addEventListener("mouseup", onUp)
    },
    [listWidth],
  )

  const activeConv: Conversation = useMemo(
    () => seed.find((c) => c.id === activeId)!,
    [activeId],
  )
  const activeState = state[activeId]

  const handleSelect = useCallback((id: string) => {
    setActiveId(id)
    // Update URL with the chat ID for shareable links
    const chatId = getChatId(id)
    if (chatId) {
      const url = new URL(window.location.href)
      url.searchParams.set("chat", chatId)
      window.history.replaceState({}, "", url.toString())
    }
    // On mobile, opening a conversation switches the single-pane view
    // to the chat. On md+ this has no visual effect (CSS handles layout).
    setMobileView("chat")
  }, [])

  /* ── Mark visited + clear unread whenever a chat becomes active ──────── */
  useEffect(() => {
    setState((prev) => {
      const cur = prev[activeId]
      if (!cur) return prev
      if (cur.visited && (cur.preview.unread ?? 0) === 0) return prev
      return {
        ...prev,
        [activeId]: {
          ...cur,
          visited: true,
          preview: { ...cur.preview, unread: 0 },
        },
      }
    })
  }, [activeId])

  /* ── Presence ticker ─────────────────────────────────────────────────────
     Every 10 s refresh dynamic "last seen" labels and run presence
     transitions: offline → online when it's time, online → offline when
     the user has been idle for too long during a scripted pause. */
  useEffect(() => {
    const id = window.setInterval(() => {
      const t = Date.now()
      setNow(t)
      setState((prev) => {
        let changed = false
        const next: Record<string, ConvState> = { ...prev }
        for (const conv of seed) {
          const s = next[conv.id]
          if (!s) continue

          // 1. Offline → online: scheduled reconnect time has arrived.
          if (!s.online && s.nextOnlineAt !== null && s.nextOnlineAt <= t) {
            const nextStep = conv.script[s.scriptIndex]
            const shouldWaitForUser =
              s.visited &&
              s.scriptIndex < conv.script.length &&
              nextStep?.from === "me"
            next[conv.id] = {
              ...s,
              online: true,
              nextOnlineAt: null,
              goneOfflineAt: null,
              // Re-arm the idle timer from "now" so the character doesn't
              // immediately disconnect again if the user is still silent.
              waitingForUserSince: shouldWaitForUser ? t : null,
            }
            changed = true
            continue
          }

          // 2. Online → offline: scenario expects user reply, but user
          //    has been silent for too long.
          const step = conv.script[s.scriptIndex]
          const scenarioLive =
            s.visited && s.scriptIndex < conv.script.length
          if (
            s.online &&
            scenarioLive &&
            step &&
            step.from === "me" &&
            s.waitingForUserSince !== null &&
            t - s.waitingForUserSince > IDLE_BEFORE_OFFLINE_MS
          ) {
            next[conv.id] = {
              ...s,
              online: false,
              isTyping: false,
              goneOfflineAt: t,
              nextOnlineAt: randomReconnectAt(t),
              waitingForUserSince: null,
            }
            changed = true
          }
        }
        return changed ? next : prev
      })
    }, 10_000)
    return () => clearInterval(id)
  }, [])

  /* ── Global scripted autoplay ────────────────────────────────────────────
     Runs for every conversation where:
       • the user has opened the chat at least once (visited), AND
       • the character is currently online, AND
       • the next scripted step is "them".
     This lets characters message the user in the background — opening
     their chat is only required to start the scenario once. */
  // Build a compact signature so this effect reruns only when relevant
  // state fragments change (not on every minor update).
  const autoplaySig = useMemo(() => {
    return seed
      .map((c) => {
        const s = state[c.id]
        return `${c.id}:${s.scriptIndex}:${s.isTyping ? 1 : 0}:${
          s.online ? 1 : 0
        }:${s.visited ? 1 : 0}`
      })
      .join("|")
  }, [state])

  useEffect(() => {
    const timers: number[] = []
    for (const conv of seed) {
      const s = state[conv.id]
      if (!s) continue
      if (!s.visited || !s.online) continue
      const step = conv.script[s.scriptIndex]
      if (!step || step.from !== "them") continue

      const profile: TypingProfile = conv.typingProfile ?? defaultTypingProfile
      if (!s.isTyping) {
        // Phase 1 — show typing indicator after a short beat.
        timers.push(
          window.setTimeout(() => {
            setState((prev) => {
              const cur = prev[conv.id]
              if (!cur || !cur.online || !cur.visited) return prev
              const cs = conv.script[cur.scriptIndex]
              if (!cs || cs.from !== "them" || cur.isTyping) return prev
              return {
                ...prev,
                [conv.id]: { ...cur, isTyping: true },
              }
            })
          }, profile.startDelay),
        )
      } else {
        // Phase 2 — reveal the scripted message. Text delays scale with
        // message length but are clamped by the per-character profile.
        const delay =
          step.kind === "image"
            ? profile.imageDelay
            : Math.min(
                profile.maxDelay,
                Math.max(profile.minDelay, step.text.length * profile.msPerChar),
              )
        timers.push(
          window.setTimeout(() => {
            setState((prev) => {
              const cur = prev[conv.id]
              if (!cur || !cur.isTyping) return prev
              const t = Date.now()
              const msg = buildMessage(conv.id, "them", step, formatTime(new Date(t)))
              const newIndex = cur.scriptIndex + 1
              const scenarioDone = newIndex >= conv.script.length
              const nextStep = conv.script[newIndex]
              const isActive = activeIdRef.current === conv.id
              return {
                ...prev,
                [conv.id]: {
                  ...cur,
                  isTyping: false,
                  scriptIndex: newIndex,
                  messages: [...cur.messages, msg],
                  preview: {
                    lastMessage: previewOf(step, false),
                    time: "сейчас",
                    unread: isActive ? 0 : (cur.preview.unread ?? 0) + 1,
                    fromMe: false,
                  },
                  // Track whether we're now waiting for the user's reply.
                  waitingForUserSince:
                    !scenarioDone && nextStep && nextStep.from === "me" ? t : null,
                  // Scenario end — go offline with the "только что" label.
                  ...(scenarioDone
                    ? {
                        online: false,
                        scenarioFinishedAt: t,
                        goneOfflineAt: t,
                        nextOnlineAt: null,
                      }
                    : {}),
                },
              }
            })
          }, delay),
        )
      }
    }
    return () => {
      for (const t of timers) clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplaySig])

  const handleSend = useCallback(
    (text: string): boolean => {
      const id = activeId
      const conv = seed.find((c) => c.id === id)!
      const cur = state[id]
      if (!cur) return false
      const step = conv.script[cur.scriptIndex]

      // During an active scenario, if the next step is "them", the user
      // can't take over — autoplay handles that.
      if (step && step.from === "them") return false

      const nowMs = Date.now()
      const myMsgId = `${id}-me-${nowMs}-${Math.random().toString(36).slice(2, 6)}`
      const timeStr = formatTime(new Date(nowMs))

      setState((prev) => {
        const c = prev[id]
        if (step && step.from === "me") {
          // Consume the scripted "me" step — user's typed text is ignored,
          // the scripted line appears instead.
          const scriptedText =
            step.kind === "text" ? step.text : step.caption ?? ""
          const msg: Message =
            step.kind === "text"
              ? {
                  id: myMsgId,
                  kind: "text",
                  from: "me",
                  text: scriptedText,
                  time: timeStr,
                  status: "sent",
                }
              : {
                  id: myMsgId,
                  kind: "image",
                  from: "me",
                  src: step.src,
                  caption: step.caption,
                  time: timeStr,
                  status: "sent",
                }
          return {
            ...prev,
            [id]: {
              ...c,
              scriptIndex: c.scriptIndex + 1,
              messages: [...c.messages, msg],
              preview: {
                lastMessage: previewOf(step, true),
                time: "сейчас",
                unread: 0,
                fromMe: true,
                // Fresh outgoing — "sent" (single check). Flipped to true
                // by the delayed read-receipt below if the script is live.
                read: false,
              },
              waitingForUserSince: null,
            },
          }
        }

        // Script has finished — free chat. Send exactly what the user typed.
        const msg: Message = {
          id: myMsgId,
          kind: "text",
          from: "me",
          text,
          time: timeStr,
          status: "sent",
        }
        return {
          ...prev,
          [id]: {
            ...c,
            messages: [...c.messages, msg],
            preview: {
              lastMessage: `Вы: ${text}`,
              time: "сейчас",
              unread: 0,
              fromMe: true,
              // Free-chat (after scenario) — the other side does not
              // acknowledge, so this stays on "sent" (single check).
              read: false,
            },
            waitingForUserSince: null,
          },
        }
      })

      // Only flip status to "read" while a scripted exchange is in progress
      // (the other side is following the scenario). After the scripted
      // scenario is finished, free-chat messages stay at "sent" — the
      // other side does not read them.
      const scriptedExchange = !!(step && step.from === "me")
      if (scriptedExchange) {
        window.setTimeout(() => {
          setState((prev) => {
            const c = prev[id]
            return {
              ...prev,
              [id]: {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === myMsgId &&
                  (m.kind === "text" || m.kind === "image")
                    ? { ...m, status: "read" }
                    : m,
                ),
                // Keep the preview in sync — double check appears in the
                // conversation list as soon as the bubble is acknowledged.
                preview: c.preview.fromMe
                  ? { ...c.preview, read: true }
                  : c.preview,
              },
            }
          })
        }, 700)
      }

      return true
    },
    [activeId, state],
  )

  const previews = useMemo(() => {
    const byId: Record<
      string,
      ConvState["preview"] & { online: boolean }
    > = {}
    for (const c of seed) {
      const p = state[c.id].preview
      byId[c.id] = {
        ...p,
        // Default seeded "fromMe" history to already-read so the list
        // shows a double check for the pre-existing outgoing previews.
        read: p.read ?? true,
        online: state[c.id].online,
      }
    }
    return byId
  }, [state])

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setNow(Date.now())
  }, [])

  const scenarioDone =
  activeConv.script.length <= activeState.scriptIndex

  const nextStep = activeConv.script[activeState.scriptIndex]
  const nextHint =
    !scenarioDone && nextStep && nextStep.from === "me"
      ? nextStep.kind === "text"
        ? nextStep.text
        : nextStep.caption ?? "Отправить фотографию"
      : null

  const activeStatusLabel = isMounted
    ? formatStatusLabel(activeState, activeConv, now)
    : activeConv.status

  return (
    <main className="relative flex h-dvh w-full overflow-hidden bg-sidebar">
      {/* Desktop vertical left nav (xl+) */}
      <LeftNav onOpenNotifications={notificationDialog.open} />

      <div className="flex min-w-0 flex-1 gap-2 p-2 md:gap-3 md:p-3">
        {/* Main messenger card — conversations + chat as one rounded surface */}
        <div className="flex min-w-0 flex-1 overflow-hidden rounded-2xl bg-background shadow-[0_1px_2px_rgba(120,50,20,0.04),0_8px_24px_-12px_rgba(120,50,20,0.08)] ring-1 ring-border/60 md:rounded-3xl">
          <ConversationsList
            activeId={activeId}
            onSelect={handleSelect}
            previews={previews}
            width={listWidth}
            compact={listCompact}
            animate={!isResizing}
            className={cn(mobileView === "chat" && "hidden md:flex")}
          />

          {/* Resizer — desktop (md+) only. Drag to resize the list pane. */}
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Изменить ширину списка диалогов"
            onMouseDown={startResize}
            onDoubleClick={() => setListWidth(340)}
            className="group relative hidden w-px shrink-0 cursor-col-resize bg-border md:block"
          >
            {/* Wider invisible hit area + visible highlight bar on hover */}
            <span
              aria-hidden
              className="absolute inset-y-0 left-1/2 w-3 -translate-x-1/2"
            />
            <span
              aria-hidden
              className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 rounded-full bg-transparent transition-colors group-hover:bg-primary/40 group-active:bg-primary/60"
            />
          </div>

          <ChatView
            key={activeConv.id}
            conversation={activeConv}
            online={activeState.online}
            statusLabel={activeStatusLabel}
            messages={activeState.messages}
            isTyping={activeState.isTyping}
            scenarioDone={scenarioDone}
            hint={nextHint}
            onSend={handleSend}
            onBack={() => setMobileView("list")}
            onOpenProfile={() => setProfileOpen(true)}
            className={cn(mobileView === "list" && "hidden md:flex")}
          />
        </div>

        {/* Desktop-only inline profile card (xl+) */}
        <ProfilePanel conversation={activeConv} />
      </div>

      {/* Tablet/mobile profile sheet (below xl) */}
      <ProfileSheet
        conversation={activeConv}
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      />

      {/*
        Tablet/mobile glass bottom dock (below xl).
        On mobile (below md), hide it while the chat view is active.
        On tablet (md..xl) it stays visible regardless.
      */}
      <BottomDock hidden={mobileView === "chat"} />

      {/* Notification timer setup dialog */}
      <NotificationTimerDialog
        open={notificationDialog.isOpen}
        onClose={notificationDialog.close}
      />
    </main>
  )
}
