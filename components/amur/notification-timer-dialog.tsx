"use client"

import { cn } from "@/lib/utils"
import { Heart, X, Bell } from "lucide-react"
import { useState, useEffect, useCallback } from "react"

const STORAGE_KEY = "amur-notification-timer"
const DISMISSED_KEY = "amur-notification-dismissed"

type TimerOption = {
  label: string
  value: number // minutes, 0 = off
}

const timerOptions: TimerOption[] = [
  { label: "Выключить", value: 0 },
  { label: "5 минут", value: 5 },
  { label: "15 минут", value: 15 },
  { label: "30 минут", value: 30 },
  { label: "1 час", value: 60 },
  { label: "2 часа", value: 120 },
]

export function NotificationTimerDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [selectedTimer, setSelectedTimer] = useState<number>(15)
  const [isExiting, setIsExiting] = useState(false)

  // Load saved timer value on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setSelectedTimer(parseInt(saved, 10))
    }
  }, [])

  const handleClose = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => {
      setIsExiting(false)
      onClose()
    }, 200)
  }, [onClose])

  const handleSave = useCallback(async () => {
    localStorage.setItem(STORAGE_KEY, selectedTimer.toString())
    localStorage.setItem(DISMISSED_KEY, "true")

    // Request notification permission if timer is enabled
    if (selectedTimer > 0 && "Notification" in window) {
      const permission = await Notification.requestPermission()
      if (permission === "granted") {
        // Schedule the notification
        scheduleNotification(selectedTimer)
      }
    }

    handleClose()
  }, [selectedTimer, handleClose])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm transition-opacity duration-200",
          isExiting ? "opacity-0" : "opacity-100"
        )}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-dialog-title"
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-sm rounded-3xl bg-card p-6 shadow-xl ring-1 ring-border/60",
          isExiting ? "animate-pop-out" : "animate-pop-in"
        )}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Закрыть"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
            Настройте таймер для получения уведомлений о новых совпадениях
          </p>
        </div>

        {/* Timer options */}
        <div className="mt-6 grid grid-cols-2 gap-2">
          {timerOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelectedTimer(option.value)}
              className={cn(
                "rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                selectedTimer === option.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-foreground hover:bg-muted/80"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Preview message */}
        <div className="mt-5 rounded-2xl border border-border bg-background p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">Амур</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                У вас новое совпадение!
              </p>
            </div>
          </div>
        </div>

        {/* Save button */}
        <button
          type="button"
          onClick={handleSave}
          className="mt-6 w-full rounded-full bg-primary py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Сохранить настройки
        </button>
      </div>
    </>
  )
}

/**
 * Schedule a browser notification after the specified delay
 */
function scheduleNotification(minutes: number) {
  if (!("Notification" in window)) return
  if (Notification.permission !== "granted") return

  // Clear any existing timer
  const existingTimer = window.sessionStorage.getItem("amur-notification-timer-id")
  if (existingTimer) {
    clearTimeout(parseInt(existingTimer, 10))
  }

  // Schedule new notification
  const timerId = window.setTimeout(() => {
    new Notification("Амур", {
      body: "У вас новое совпадение!",
      icon: "/profiles/maestro.png", // Use one of the profile pics as icon
      badge: "/profiles/maestro.png",
      tag: "amur-match",
    })
    // Remove timer ID from storage
    window.sessionStorage.removeItem("amur-notification-timer-id")
  }, minutes * 60 * 1000)

  // Store timer ID for potential cancellation
  window.sessionStorage.setItem("amur-notification-timer-id", timerId.toString())
}

/**
 * Hook to manage notification dialog visibility
 */
export function useNotificationDialog() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if user has already dismissed the dialog this session
    const dismissed = localStorage.getItem(DISMISSED_KEY)
    if (!dismissed) {
      // Show dialog after a short delay for better UX
      const timer = setTimeout(() => setIsOpen(true), 800)
      return () => clearTimeout(timer)
    } else {
      // If previously saved, restore the timer
      const savedTimer = localStorage.getItem(STORAGE_KEY)
      if (savedTimer && parseInt(savedTimer, 10) > 0) {
        scheduleNotification(parseInt(savedTimer, 10))
      }
    }
  }, [])

  return {
    isOpen,
    close: () => setIsOpen(false),
  }
}
