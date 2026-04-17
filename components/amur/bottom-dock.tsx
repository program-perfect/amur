"use client"

import { cn } from "@/lib/utils"
import {
  Compass,
  Flame,
  Heart,
  MessageCircle,
  Sparkles,
} from "lucide-react"
import Image from "next/image"

const items = [
  { icon: Flame, label: "Лента", key: "feed" },
  { icon: Compass, label: "Поиск", key: "discover" },
  { icon: Heart, label: "Симпатии", key: "likes" },
  { icon: MessageCircle, label: "Сообщения", key: "messages", active: true },
  { icon: Sparkles, label: "Амур+", key: "premium" },
]

/**
 * Floating glass navigation dock shown on tablet and mobile (below xl).
 * Overlays the messenger with a smooth gradient fade. On mobile, the
 * page hides this dock while the chat view is active — see page.tsx.
 */
export function BottomDock({
  hidden: hiddenOnMobile = false,
}: {
  /**
   * When true (mobile chat view), hide the dock entirely on screens
   * below md; on md+ it stays visible.
   */
  hidden?: boolean
}) {
  return (
    <div
      aria-hidden={hiddenOnMobile ? true : undefined}
      className={cn(
        // Anchor to the bottom of the viewport and span the safe area.
        "pointer-events-none fixed inset-x-0 bottom-0 z-40 flex flex-col items-center justify-end px-3 pt-16",
        "pb-[max(16px,env(safe-area-inset-bottom))]",
        "xl:hidden",
        // Smooth enter/exit animation instead of a hard hide.
        "transition-[opacity,transform] duration-300 ease-out",
        hiddenOnMobile
          ? "pointer-events-none translate-y-4 opacity-0 md:translate-y-0 md:opacity-100"
          : "translate-y-0 opacity-100",
      )}
    >
      {/* Smooth gradient fade — softens the content under the dock */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-sidebar via-sidebar/70 to-transparent"
      />

      <nav
        aria-label="Основная навигация"
        className={cn(
          "pointer-events-auto relative flex items-center gap-1 rounded-full",
          // Pinkish-white surface — matches the messenger search input.
          "border border-border/60 bg-background/80 px-2 py-2",
          "shadow-[0_14px_40px_-14px_rgba(120,50,20,0.4)]",
          "backdrop-blur-2xl backdrop-saturate-150",
          "supports-[backdrop-filter]:bg-background/70",
          // Thicker on mobile/tablet
          "md:gap-1.5 md:px-2.5 md:py-2.5",
          "max-[420px]:gap-0.5 max-[420px]:px-1.5",
        )}
      >
        {/* Brand mark — site mark from the assets folder, hidden on the
            narrowest phones to save room. */}
        <div className="relative mx-0.5 hidden h-11 w-11 shrink-0 items-center justify-center sm:flex">
          <Image
            src="/amur-mark.png"
            alt="Амур"
            fill
            priority
            sizes="44px"
            className="object-contain object-center"
          />
        </div>
        <div className="hidden h-5 w-px bg-border/60 sm:block" />

        {items.map(({ icon: Icon, label, key, active }) => (
          <button
            key={key}
            type="button"
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className={cn(
              "cursor-pointer relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors",
              "max-[420px]:h-10 max-[420px]:w-10",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-sidebar-accent/80 hover:text-foreground",
            )}
          >
            <Icon className="h-[19px] w-[19px]" strokeWidth={1.7} />
            <span className="sr-only">{label}</span>
          </button>
        ))}

        {/* Avatar stays visible on all tablet and mobile sizes */}
        <div className="h-5 w-px bg-border/60" />
        <button
          type="button"
          aria-label="Мой профиль"
          className={cn(
            "cursor-pointer relative block h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-background transition-transform hover:scale-105",
            "max-[420px]:h-10 max-[420px]:w-10",
          )}
        >
          <Image
            src="/profiles/user-me.jpg"
            alt="Ваш профиль"
            fill
            className="object-cover"
            sizes="44px"
          />
        </button>
      </nav>
    </div>
  )
}
