"use client"

import { PhotoLightbox } from "@/components/amur/photo-lightbox"
import { SiteFooter } from "@/components/amur/site-footer"
import { conversations } from "@/lib/amur-data"
import { getChatId, getConversationId } from "@/lib/chat-ids"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  BellOff,
  Camera,
  Eye,
  Flag,
  ImageIcon,
  MapPin,
  MessageCircle,
  Share2,
  Sparkles,
  Star,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useMemo, useState } from "react"

/**
 * Per-character profile page — mirrors the layout of Tatyana's `/me`
 * profile but is populated from the `conversations` seed, so each
 * match listed in the messenger has their own dedicated profile
 * screen.
 *
 * The URL segment is the URL-safe chat ID produced by
 * `lib/chat-ids.ts` (e.g. `maestro-xxxx-0`). That lookup doubles as
 * the unique per-profile identifier the user requested — each
 * profile route resolves to exactly one character and is shareable.
 *
 * All photos (avatar + `photos`) are browsable in a fullscreen
 * lightbox; users can tap the hero image or any gallery tile to
 * open it, then paginate with on-screen arrows or keyboard arrows.
 */
export default function CharacterProfilePage() {
  const params = useParams<{ profileId: string }>()
  const profileId = params?.profileId ?? ""
  const conversationId = getConversationId(profileId)
  const conversation = conversationId
    ? conversations.find((c) => c.id === conversationId)
    : undefined

  // Combine avatar + photos into a single deduplicated list so the
  // gallery always has every reference image available, and so the
  // lightbox can paginate through avatars too when they differ from
  // the main photos.
  const allPhotos = useMemo(() => {
    if (!conversation) return [] as string[]
    const merged = [conversation.avatar, ...conversation.photos].filter(
      (p): p is string => typeof p === "string" && p.length > 0,
    )
    return Array.from(new Set(merged))
  }, [conversation])

  // `null` = closed; otherwise the index of the photo being inspected.
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!conversation) {
    return <ProfileNotFound id={profileId} />
  }

  const chatHref = `/m${(() => {
    const id = getChatId(conversation.id)
    return id ? `?chat=${id}` : ""
  })()}`

  const stats = [
    { label: "Совместимость", value: `${conversation.compatibility}%` },
    { label: "Расстояние", value: conversation.distance },
    { label: "Статус", value: conversation.online ? "В сети" : "Не в сети" },
  ]

  const heroSrc = allPhotos[0]

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3 xs:gap-4 xs:px-5 xs:py-3.5 sm:px-8">
          <Link
            href={chatHref}
            className="group inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
              strokeWidth={1.8}
            />
            Назад в мессенджер
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Поделиться профилем"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Share2 className="h-4 w-4" strokeWidth={1.8} />
            </button>
            <Link
              href={chatHref}
              className="group ml-1 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} />
              Написать
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6 xs:px-5 xs:py-8 sm:px-8 sm:py-10">
        <div className="grid gap-6 xs:gap-8 md:grid-cols-[320px_1fr] lg:grid-cols-[400px_1fr]">
          {/* Left: Hero photo card */}
          <div className="md:sticky md:top-24 md:self-start">
            <button
              type="button"
              onClick={() => setLightboxIndex(0)}
              aria-label={`Открыть фото ${conversation.name}`}
              className={cn(
                "group relative aspect-4/5 w-full cursor-zoom-in overflow-hidden rounded-3xl text-left",
                "shadow-[0_1px_2px_rgba(120,50,20,0.04),0_20px_50px_-18px_rgba(120,50,20,0.25)] ring-1 ring-border",
              )}
            >
              <Image
                src={heroSrc || "/placeholder.svg"}
                alt={conversation.name}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                priority
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-foreground/75 via-foreground/10 to-transparent" />

              {/* Verified badge */}
              {conversation.verified && (
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/85 px-2.5 py-1 text-[11px] font-medium text-primary backdrop-blur-sm">
                  <Star className="h-3 w-3 fill-primary" strokeWidth={0} />
                  Профиль подтверждён
                </span>
              )}

              {/* Photo count indicator — hints that the hero can be
                  opened into a fullscreen gallery. */}
              {allPhotos.length > 1 && (
                <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/85 px-2.5 py-1 text-[11px] font-medium text-foreground/80 backdrop-blur-sm">
                  <Camera className="h-3 w-3" strokeWidth={1.8} />
                  {allPhotos.length}
                </span>
              )}

              {/* Photo tracker dots — mirrors the on-profile-panel pattern */}
              <div className="pointer-events-none absolute bottom-20 left-0 right-0 flex justify-center gap-1 px-6">
                {allPhotos.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-[3px] rounded-full bg-background/40 transition-all",
                      i === 0 ? "w-8 bg-background" : "w-4",
                    )}
                    aria-hidden
                  />
                ))}
              </div>

              {/* Name overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-background">
                <h1 className="font-serif text-5xl leading-none tracking-tight">
                  {conversation.name}
                  {conversation.age != null && (
                    <>
                      ,{" "}
                      <span className="font-sans text-4xl font-light">
                        {conversation.age}
                      </span>
                    </>
                  )}
                </h1>
                <div className="mt-3 flex items-center gap-1.5 text-[13px] text-background/85">
                  <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                  <span>{conversation.city}</span>
                  <span className="mx-1 opacity-60">·</span>
                  <span>{conversation.distance}</span>
                </div>
              </div>
            </button>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-card p-2 ring-1 ring-border">
              {stats.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex flex-col items-center rounded-xl px-2 py-3 text-center transition-colors hover:bg-muted/60"
                >
                  <span className="font-serif text-2xl leading-none text-foreground">
                    {value}
                  </span>
                  <span className="mt-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Amur+ promo — identical treatment to /me so the whole
                /m/* profile surface feels part of the same product. */}
            <Link
              href="#"
              className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-linear-to-br from-[#2a1418] to-[#4a1e24] px-5 py-4 text-background shadow-sm transition-transform hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 backdrop-blur-sm">
                  <Sparkles className="h-5 w-5 text-accent" strokeWidth={1.8} />
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="text-[13px] font-semibold">Амур+</span>
                  <span className="text-[11.5px] text-background/70">
                    Узнайте, как повысить совпадение
                  </span>
                </div>
              </div>
              <span className="rounded-full bg-background px-3 py-1 text-[11px] font-medium text-foreground">
                Попробовать
              </span>
            </Link>
          </div>

          {/* Right: Details */}
          <div className="flex flex-col gap-8">
            {conversation.about && (
              <section>
                <SectionTitle>О себе</SectionTitle>
                <p className="text-[15px] leading-relaxed text-foreground/85">
                  {conversation.about}
                </p>
              </section>
            )}

            <section>
              <SectionTitle>Факты</SectionTitle>
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {conversation.facts.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-center gap-3 rounded-2xl bg-card px-3.5 py-3 text-[13.5px] text-foreground/85 ring-1 ring-border/60"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" strokeWidth={1.8} />
                    </span>
                    {label}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <SectionTitle>Интересы</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {conversation.interests.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/5 px-3.5 py-1.5 text-[13px] text-primary"
                  >
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                    {label}
                  </span>
                ))}
              </div>
            </section>

            {allPhotos.length > 0 && (
              <section>
                <div className="mb-3 flex items-end justify-between">
                  <div className="flex items-center gap-2">
                    <SectionTitle className="mb-0">Фотографии</SectionTitle>
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10.5px] font-medium text-muted-foreground">
                      <ImageIcon className="h-3 w-3" strokeWidth={1.8} />
                      {allPhotos.length}
                    </span>
                  </div>
                  <span className="text-[11.5px] text-muted-foreground">
                    Нажмите, чтобы открыть
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 xs:gap-2.5 xs:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
                  {allPhotos.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setLightboxIndex(i)}
                      aria-label={`Открыть фото ${i + 1}`}
                      className="group relative aspect-3/4 cursor-zoom-in overflow-hidden rounded-2xl ring-1 ring-border transition-all hover:ring-primary/40"
                    >
                      <Image
                        src={src || "/placeholder.svg"}
                        alt={`Фото ${conversation.name} ${i + 1}`}
                        fill
                        sizes="(min-width: 640px) 200px, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {i === 0 && (
                        <span className="absolute left-2 top-2 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-medium text-foreground/80 backdrop-blur-sm">
                          Главное
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section className="rounded-2xl bg-card px-5 py-4 ring-1 ring-border/60">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Eye className="h-4 w-4 text-primary" strokeWidth={1.8} />
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13.5px] font-medium text-foreground">
                    {conversation.matchedLabel}
                  </span>
                  <span className="text-[12.5px] text-muted-foreground">
                    Профиль виден только подтверждённым участникам Амура.
                  </span>
                </div>
              </div>
            </section>

            <div className="flex items-center justify-between gap-3 border-t border-border pt-5 text-[12px] text-muted-foreground">
              <button
                type="button"
                className="cursor-pointer flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <BellOff className="h-3.5 w-3.5" strokeWidth={1.6} />
                Выключить уведомления
              </button>
              <button
                type="button"
                className="cursor-pointer flex items-center gap-1.5 transition-colors hover:text-destructive"
              >
                <Flag className="h-3.5 w-3.5" strokeWidth={1.6} />
                Пожаловаться
              </button>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />

      <PhotoLightbox
        photos={allPhotos}
        index={lightboxIndex}
        alt={conversation.name}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </main>
  )
}

function SectionTitle({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h2
      className={`mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground ${className ?? ""}`}
    >
      {children}
    </h2>
  )
}

function ProfileNotFound({ id }: { id: string }) {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Eye className="h-6 w-6" strokeWidth={1.6} />
      </span>
      <h1 className="font-serif text-3xl text-foreground">Профиль не найден</h1>
      <p className="max-w-md text-[14px] leading-relaxed text-muted-foreground">
        Мы не смогли найти профиль с идентификатором{" "}
        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12.5px] text-foreground">
          {id || "—"}
        </span>
        . Возможно, ссылка устарела или пользователь удалил свою страницу.
      </p>
      <Link
        href="/m"
        className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
        Вернуться в мессенджер
      </Link>
    </main>
  )
}
