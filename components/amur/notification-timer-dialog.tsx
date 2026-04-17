"use client"

import { conversations } from "@/lib/amur-data"
import { cn } from "@/lib/utils"
import { Heart, X } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useMemo, useState } from "react"

const STORAGE_KEY = "amur-notification-timer"
const DISMISSED_KEY = "amur-notification-dismissed"
const SENDER_KEY = "amur-notification-sender"
const BODY_KEY = "amur-notification-body"

const DEFAULT_BODY = "У вас новое совпадение!"
const DEFAULT_SENDER_ID = "c5" // Макс

type TimerOption = {
  label: string
  value: number // seconds, 0 = off
}

const timerOptions: TimerOption[] = [
  { label: "Выключить", value: 0 },
  { label: "10 секунд", value: 10 },
  { label: "30 секунд", value: 30 },
  { label: "45 секунд", value: 45 },
  { label: "1 минута", value: 60 },
  { label: "2 минуты", value: 120 },
]

/**
 * Lightweight sender descriptor — we only need the three fields the
 * browser notification actually uses (name + avatar) plus the id we
 * persist in localStorage.
 */
type Sender = {
  id: string
  name: string
  avatar: string
}

function getSenders(): Sender[] {
  return conversations.map((c) => ({
    id: c.id,
    name: c.name,
    avatar: c.avatar,
  }))
}

function resolveSender(id: string | null, senders: Sender[]): Sender {
  return (
    senders.find((s) => s.id === id) ??
    senders.find((s) => s.id === DEFAULT_SENDER_ID) ??
    senders[0]
  )
}

export function NotificationTimerDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const senders = useMemo(() => getSenders(), [])

  const [selectedTimer, setSelectedTimer] = useState<number>(30)
  const [senderId, setSenderId] = useState<string>(DEFAULT_SENDER_ID)
  const [body, setBody] = useState<string>(DEFAULT_BODY)
  const [isExiting, setIsExiting] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    const savedTimer = localStorage.getItem(STORAGE_KEY)
    if (savedTimer) setSelectedTimer(parseInt(savedTimer, 10))
    const savedSender = localStorage.getItem(SENDER_KEY)
    if (savedSender) setSenderId(savedSender)
    const savedBody = localStorage.getItem(BODY_KEY)
    if (savedBody !== null) setBody(savedBody)
  }, [])

  const selectedSender = resolveSender(senderId, senders)
  const previewBody = body.trim().length > 0 ? body : DEFAULT_BODY

  const handleClose = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => {
      setIsExiting(false)
      onClose()
    }, 200)
  }, [onClose])

  const handleResetBody = useCallback(() => {
    setBody(DEFAULT_BODY)
  }, [])

  const handleSave = useCallback(async () => {
    const bodyToSave = body.trim().length > 0 ? body.trim() : DEFAULT_BODY

    localStorage.setItem(STORAGE_KEY, selectedTimer.toString())
    localStorage.setItem(SENDER_KEY, senderId)
    localStorage.setItem(BODY_KEY, bodyToSave)
    localStorage.setItem(DISMISSED_KEY, "true")

    // Request permission only when the user actually wants a push.
    if (selectedTimer > 0 && "Notification" in window) {
      const permission = await Notification.requestPermission()
      if (permission === "granted") {
        scheduleNotification(selectedTimer, selectedSender, bodyToSave)
      }
    }

    handleClose()
  }, [selectedTimer, senderId, body, selectedSender, handleClose])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm transition-opacity duration-200",
          isExiting ? "opacity-0" : "opacity-100",
        )}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Centering layer — flex keeps the dialog exactly in the middle of the
         viewport regardless of its content height, avoiding the drift that
         can happen when combining Tailwind translate utilities with a
         keyframe animation that also manipulates `transform`. */}
      <div
        className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4"
        aria-hidden="true"
      >
        {/* Dialog */}
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="notification-dialog-title"
          className={cn(
            "pointer-events-auto w-[92vw] max-w-md rounded-3xl bg-card p-6 shadow-xl ring-1 ring-border/60",
            "max-h-[calc(100dvh-2rem)] overflow-y-auto scrollbar-thin",
            isExiting ? "animate-scale-out" : "animate-scale-in",
          )}
        >
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Закрыть"
          className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" strokeWidth={1.8} />
        </button>

        {/* Header with heart icon */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Heart
              className="h-8 w-8 text-primary"
              fill="currentColor"
              strokeWidth={1.5}
            />
          </div>
          <h2
            id="notification-dialog-title"
            className="mt-4 font-serif text-xl text-foreground"
          >
            Уведомления о совпадениях
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Настройте таймер, отправителя и текст уведомления.
          </p>
        </div>

        {/* Timer options */}
        <section className="mt-6">
          <h3 className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Когда прислать
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {timerOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedTimer(option.value)}
                className={cn(
                  "cursor-pointer rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  selectedTimer === option.value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-foreground hover:bg-muted/80",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        {/* Sender picker */}
        <section className="mt-5">
          <h3 className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            От кого придёт
          </h3>
          <div
            role="radiogroup"
            aria-label="Отправитель уведомления"
            className="flex flex-wrap gap-2"
          >
            {senders.map((s) => {
              const active = s.id === senderId
              return (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSenderId(s.id)}
                  className={cn(
                    "group flex cursor-pointer items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 text-sm transition-all",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-foreground hover:bg-muted/80",
                  )}
                >
                  <span
                    className={cn(
                      "relative h-7 w-7 overflow-hidden rounded-full ring-2 transition-colors",
                      active ? "ring-primary-foreground/50" : "ring-border",
                    )}
                  >
                    <Image
                      src={s.avatar}
                      alt=""
                      fill
                      sizes="28px"
                      className="object-cover"
                    />
                  </span>
                  <span className="font-medium">{s.name}</span>
                </button>
              )
            })}
          </div>
        </section>

        {/* Body editor */}
        <section className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Текст уведомления
            </h3>
            {body !== DEFAULT_BODY && (
              <button
                type="button"
                onClick={handleResetBody}
                className="cursor-pointer text-xs font-medium text-primary hover:underline"
              >
                Сбросить
              </button>
            )}
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={2}
            maxLength={160}
            placeholder={DEFAULT_BODY}
            aria-label="Текст уведомления"
            className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Оставьте поле пустым, чтобы использовать стандартный текст.
          </p>
        </section>

        {/* Live preview */}
        <div className="mt-5 rounded-2xl border border-border bg-background p-4">
          <div className="flex items-start gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
              <Image
                src={selectedSender.avatar}
                alt=""
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                Амур · {selectedSender.name}
              </p>
              <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                {previewBody}
              </p>
            </div>
          </div>
        </div>

        {/* Save button */}
        <button
          type="button"
          onClick={handleSave}
          className="mt-6 w-full cursor-pointer rounded-full bg-primary py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Сохранить настройки
        </button>
      </div>
    </>
  )
}

/**
 * Schedule a browser notification after the specified delay.
 */
function scheduleNotification(seconds: number, sender: Sender, body: string) {
  if (!("Notification" in window)) return
  if (Notification.permission !== "granted") return

  // Clear any existing timer
  const existingTimer = window.sessionStorage.getItem("amur-notification-timer-id")
  if (existingTimer) {
    clearTimeout(parseInt(existingTimer, 10))
  }

  const timerId = window.setTimeout(() => {
    new Notification(`Амур · ${sender.name}`, {
      body,
      icon: sender.avatar,
      badge: sender.avatar,
      tag: "amur-match",
    })
    window.sessionStorage.removeItem("amur-notification-timer-id")
  }, seconds * 1000)

  window.sessionStorage.setItem("amur-notification-timer-id", timerId.toString())
}

/**
 * Hook to manage notification dialog visibility.
 * Also restores any previously scheduled notification on reload.
 */
export function useNotificationDialog() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISSED_KEY)
    if (!dismissed) {
      const timer = setTimeout(() => setIsOpen(true), 800)
      return () => clearTimeout(timer)
    }

    // Previously configured — reschedule with the saved settings.
    const savedTimer = localStorage.getItem(STORAGE_KEY)
    const seconds = savedTimer ? parseInt(savedTimer, 10) : 0
    if (!seconds || Number.isNaN(seconds)) return

    const savedSenderId = localStorage.getItem(SENDER_KEY)
    const savedBody = localStorage.getItem(BODY_KEY) ?? DEFAULT_BODY
    const senders = getSenders()
    const sender = resolveSender(savedSenderId, senders)

    scheduleNotification(seconds, sender, savedBody)
  }, [])

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }
}
