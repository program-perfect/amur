"use client"

import { cn } from "@/lib/utils"
import { Bell, Compass, Flame, Heart, MessageCircle, PanelLeftClose, PanelLeftOpen, Settings, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from 'next/link'
import { useState } from "react"

type NavItem = {
  icon: typeof Flame
  label: string
  key: string
  active?: boolean
  /** When present, the item renders as a Next.js `<Link>` to this route
   *  instead of a plain button. */
  href?: string
}

const items: NavItem[] = [
  // "Лента" (feed) lives in a separate sub-app at /feed — treat it as a
  // navigational link so clicking it actually routes there.
  { icon: Flame, label: "Лента", key: "feed", href: "/feed" },
  { icon: Compass, label: "Поиск", key: "discover" },
  { icon: Heart, label: "Симпатии", key: "likes" },
  { icon: MessageCircle, label: "Сообщения", key: "messages", active: true },
  { icon: Sparkles, label: "Амур+", key: "premium" },
]

interface LeftNavProps {
  onOpenNotifications?: () => void
}

export function LeftNav({ onOpenNotifications }: LeftNavProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <aside
      className={cn(
        "hidden h-full shrink-0 flex-col justify-between bg-sidebar py-6 transition-[width] duration-300 ease-out xl:flex",
        expanded ? "w-[256px]" : "w-19",
      )}
    >
      <div className={cn("flex flex-col gap-8", expanded ? "items-stretch px-4" : "items-center")}>
        {/* Brand mark + toggle */}
        <div className={cn("flex flex-col", expanded ? "gap-3" : "items-center gap-2")}>
          <Link
            href="/"
            aria-label="Открыть главную страницу"
            className={cn(
              // Taller when expanded so the wordmark can dominate the top
              // of the aside — and wider than the container, with negative
              // horizontal margins, so it visibly bleeds past the edges.
              // `overflow-hidden` guarantees the extra-large wordmark is
              // clipped cleanly by the aside rather than intruding into
              // the neighboring messenger card.
              "relative block overflow-hidden transition-opacity hover:opacity-80",
              expanded ? "-mx-4 h-32 w-[calc(100%+2rem)]" : "h-20 w-34",
            )}
          >
            {/* Wordmark (expanded) — `scale-150` makes it significantly larger
                than its box so it clips the aside edges prominently. */}
            <Image
              src="/amur-logo.png"
              alt="Амур"
              fill
              priority
              sizes="380px"
              className={cn(
                "object-contain object-center transition-opacity duration-200 ease-out filter-[brightness(0)_saturate(100%)_invert(22%)_sepia(88%)_saturate(2490%)_hue-rotate(338deg)_brightness(92%)_contrast(95%)]",
                expanded ? "scale-150 opacity-100 delay-150" : "opacity-0",
              )}
            />
            {/* Cupid mark (collapsed) */}
            <Image
              src="/amur-mark.png"
              alt=""
              aria-hidden="true"
              fill
              priority
              sizes="60px"
              className={cn(
                "object-contain transition-opacity duration-200 ease-out filter-[brightness(0)_saturate(100%)_invert(22%)_sepia(88%)_saturate(2490%)_hue-rotate(338deg)_brightness(92%)_contrast(95%)]",
                expanded ? "opacity-0" : "opacity-100 delay-150",
              )}
            />
          </Link>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "Свернуть панель" : "Развернуть панель"}
            aria-expanded={expanded}
            className={cn(
              "cursor-pointer flex h-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground",
              expanded ? "w-full gap-2 px-3 text-xs font-medium" : "w-8",
            )}
          >
            {expanded ? (
              <>
                <PanelLeftClose className="h-4 w-4" strokeWidth={1.6} />
                <span className="tracking-tight">Свернуть</span>
              </>
            ) : (
              <PanelLeftOpen className="h-4 w-4" strokeWidth={1.6} />
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className={cn("flex flex-col gap-2", expanded ? "items-stretch" : "items-center")}>
          {items.map(({ icon: Icon, label, key, active, href }) => {
            const sharedClassName = cn(
              "cursor-pointer group relative flex h-11 items-center rounded-full transition-colors",
              expanded ? "w-full justify-start gap-3 px-3" : "w-11 justify-center",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
            )
            const inner = (
              <>
                <Icon className="h-4.5 w-4.5 shrink-0" strokeWidth={1.6} />
                {expanded && (
                  <span
                    className={cn(
                      "truncate text-sm tracking-tight",
                      active ? "font-semibold text-primary" : "font-normal text-foreground/80",
                    )}
                  >
                    {label}
                  </span>
                )}
                {active && !expanded && (
                  <span className="absolute -left-4.25 top-1/2 h-5 w-0.75 -translate-y-1/2 rounded-r-full bg-primary" />
                )}
                {active && expanded && (
                  <span className="absolute -left-4 top-1/2 h-5 w-0.75 -translate-y-1/2 rounded-r-full bg-primary" />
                )}
              </>
            )
            // When an `href` is provided the item routes via Next.js
            // Link — otherwise it stays a plain action button.
            if (href) {
              return (
                <Link
                  key={key}
                  href={href}
                  aria-label={label}
                  aria-current={active ? "page" : undefined}
                  className={sharedClassName}
                >
                  {inner}
                </Link>
              )
            }
            return (
              <button
                key={key}
                type="button"
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className={sharedClassName}
              >
                {inner}
              </button>
            )
          })}
        </nav>
      </div>

      <div className={cn("flex flex-col gap-3", expanded ? "items-stretch px-4" : "items-center")}>
        <button
          type="button"
          aria-label="Уведомления"
          onClick={onOpenNotifications}
          className={cn(
            "cursor-pointer flex h-11 items-center rounded-full text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground",
            expanded ? "w-full justify-start gap-3 px-3" : "w-11 justify-center",
          )}
        >
          <Bell className="h-4.5 w-4.5 shrink-0" strokeWidth={1.6} />
          {expanded && (
            <span className="truncate text-sm font-normal tracking-tight text-foreground/80">Уведомления</span>
          )}
        </button>
        <button
          type="button"
          aria-label="Настройки"
          className={cn(
            "cursor-pointer flex h-11 items-center rounded-full text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground",
            expanded ? "w-full justify-start gap-3 px-3" : "w-11 justify-center",
          )}
        >
          <Settings className="h-4.5 w-4.5 shrink-0" strokeWidth={1.6} />
          {expanded && (
            <span className="truncate text-sm font-normal tracking-tight text-foreground/80">Настройки</span>
          )}
        </button>

        <Link
          href="/me"
          aria-label="Открыть мой профиль Татьяна"
          className={cn(
            "group relative block overflow-hidden ring-1 ring-border/60 transition-all hover:ring-primary/40",
            expanded
              ? "aspect-[4/5] w-full rounded-2xl"
              : "aspect-square w-11 shrink-0 rounded-xl",
          )}
        >
          <Image
            src="/profiles/tata-1.jpg"
            alt="Ваш профиль"
            fill
            sizes={expanded ? "224px" : "44px"}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {expanded ? (
            <>
              {/* Soft gradient that fades the photo into a warm shadow
                  at the bottom, giving the name a legible backdrop. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-foreground/85 via-foreground/40 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 px-3.5 pb-3 text-background">
                <span className="font-serif text-3xl leading-tight tracking-tight">
                  Татьяна
                </span>
                <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-background/75">
                  Мой профиль
                </span>
              </div>
            </>
          ) : (
            <span className="sr-only">Татьяна</span>
          )}
        </Link>
      </div>
    </aside>
  )
}
