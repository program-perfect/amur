"use client"

import { PhotoLightbox } from "@/components/amur/photo-lightbox"
import { SiteFooter } from "@/components/amur/site-footer"
import {
  ArrowLeft,
  BookIcon,
  Briefcase,
  Camera,
  Eye,
  FeatherIcon,
  ImageIcon,
  MapPin,
  Pencil,
  Settings,
  Share2,
  Sparkles,
  Star,
  StarIcon
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const photos = [
  "/profiles/tata-1.jpg",
  "/profiles/tata-2.jpg",
  "/profiles/tata-3.jpg",
  "/profiles/tata-4.jpg",
]

const facts = [
	{ icon: Briefcase, label: "Живу, работаю и читаю в библиотеке" },
  { icon: MapPin, label: "Живу в Артемьевске" },
  { icon: StarIcon, label: "Козерог" },
]

const interests = [
  // { icon: Coffee, label: "Кофе на рассвете" },
  // { icon: Plane, label: "Путешествия" },
  // { icon: Music, label: "Джаз и инди" },
  // { icon: Camera, label: "Плёночная съёмка" },
  { icon: BookIcon, label: "Книги" },
  { icon: FeatherIcon, label: "Литература" },
  // { icon: Heart, label: "Йога" },
]

const stats = [
  { label: "Симпатии", value: "5" },
  { label: "Совпадения", value: "5" },
  { label: "Рейтинг", value: "5.0" },
]

export default function ProfilePage() {
  // `null` = lightbox closed; otherwise the index of the photo being
  // inspected. Kept simple (no URL param) because this profile's
  // photos are a fixed static set.
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3 xs:gap-4 xs:px-5 xs:py-3.5 sm:px-8">
          <Link
            href="/m"
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
            <button
              type="button"
              aria-label="Настройки"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Settings className="h-4 w-4" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              className="group ml-1 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
              Редактировать
            </button>
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
              aria-label="Открыть фото"
              className="group relative aspect-4/5 w-full cursor-zoom-in overflow-hidden rounded-3xl text-left shadow-[0_1px_2px_rgba(120,50,20,0.04),0_20px_50px_-18px_rgba(120,50,20,0.25)] ring-1 ring-border"
            >
              <Image
                src={photos[0] || "/placeholder.svg"}
                alt="Аватар"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                priority
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-foreground/75 via-foreground/10 to-transparent" />

              {/* Verified badge */}
              <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/85 px-2.5 py-1 text-[11px] font-medium text-primary backdrop-blur-sm">
                <Star className="h-3 w-3 fill-primary" strokeWidth={0} />
                Профиль подтверждён
              </span>

              {/* Name overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-background">
                <h1 className="font-serif text-5xl leading-none tracking-tight">
                  Татьяна,{" "}
                  <span className="font-sans text-4xl font-light">33</span>
                </h1>
                <div className="mt-3 flex items-center gap-1.5 text-[13px] text-background/85">
                  <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                  <span>г. Артемьевск</span>
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

            {/* Premium CTA */}
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
                    Больше симпатий каждый день
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
            <section>
              <SectionTitle>О себе</SectionTitle>
              <p className="text-[15px] leading-relaxed text-foreground/85">
                Ищу серьёзные отношения и создание крепкой семьи. Люблю литературу, хорошие книги и долгие разговоры под вечер. Верю, что настоящая любовь существует.
              </p>
            </section>

            <section>
              <SectionTitle>Я ищу</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {[
                  "Серьёзные отношения",
                  "Мужчина 27–37",
                  "г. Артемьевск, +10 км",
                ].map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-border bg-card px-3.5 py-1.5 text-[13px] text-foreground/80"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <SectionTitle>Факты</SectionTitle>
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {facts.map(({ icon: Icon, label }) => (
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
                {interests.map(({ icon: Icon, label }) => (
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

            {/*
              Фотографии — полноценный альбомный блок со всеми
              снимками профиля (а не только с «дополнительными»).
              Каждая плитка открывает полноэкранный просмотр через
              общий PhotoLightbox, так что можно листать все
              карточки подряд, включая ту, что вынесена в hero.
            */}
            <section>
              <div className="mb-3 flex items-end justify-between">
                <div className="flex items-center gap-2">
                  <SectionTitle className="mb-0">Фотографии</SectionTitle>
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10.5px] font-medium text-muted-foreground">
                    <ImageIcon className="h-3 w-3" strokeWidth={1.8} />
                    {photos.length}
                  </span>
                </div>
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center gap-1 text-[12px] font-medium text-primary transition-colors hover:text-primary/80"
                >
                  <Camera className="h-3.5 w-3.5" strokeWidth={2} />
                  Добавить фото
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 xs:gap-2.5 xs:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
                {photos.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    aria-label={`Открыть фото ${i + 1}`}
                    className="group relative aspect-3/4 cursor-zoom-in overflow-hidden rounded-2xl ring-1 ring-border transition-all hover:ring-primary/40"
                  >
                    <Image
                      src={src || "/placeholder.svg"}
                      alt={`Фото ${i + 1}`}
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
                <button
                  type="button"
                  aria-label="Добавить фото"
                  className="group flex aspect-3/4 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card/50 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <Camera className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <span className="text-[12px] font-medium">Добавить</span>
                </button>
              </div>
            </section>

            <section className="rounded-2xl bg-card px-5 py-4 ring-1 ring-border/60">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Eye className="h-4 w-4 text-primary" strokeWidth={1.8} />
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13.5px] font-medium text-foreground">
                    Видимость профиля
                  </span>
                  <span className="text-[12.5px] text-muted-foreground">
                    Ваш профиль виден только подтверждённым участникам Амура.
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <SiteFooter />

      <PhotoLightbox
        photos={photos}
        index={lightboxIndex}
        alt="Татьяна"
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
      className={`mb-3 mt-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground ${className ?? ""}`}
    >
      {children}
    </h2>
  )
}
