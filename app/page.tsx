import {
	ArrowRight,
	Flame,
	Heart,
	Lock,
	MessageCircle,
	Shield,
	Sparkles,
	Star,
	Zap,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const couples = [
  {
    src: "/images/couple-1.jpg",
    names: "Анна и Дмитрий",
    story: "Познакомились в Амуре в 2023 году. Через 6 месяцев он сделал предложение.",
    date: "Июнь 2024",
  },
  {
    src: "/images/couple-2.jpg",
    names: "Мария и Александр",
    story: "Первое сообщение превратилось в историю любви на всю жизнь.",
    date: "Сентябрь 2025",
  },
  {
    src: "/images/couple-3.jpg",
    names: "Екатерина и Михаил",
    story: "Нашли друг друга благодаря умному подбору Амура.",
    date: "Май 2025",
  },
  {
    src: "/images/couple-4.jpg",
    names: "Ольга и Сергей",
    story: "История, которая началась с простого «Привет» в чате.",
    date: "Август 2024",
  },
  {
    src: "/images/couple-5.jpg",
    names: "Виктория и Андрей",
    story: "Два сердца нашли друг друга на расстоянии тысячи километров.",
    date: "Июль 2025",
  },
  {
    src: "/images/couple-6.jpg",
    names: "Наталья и Павел",
    story: "От первого свидания до «Да, я согласна» — всего 8 месяцев.",
    date: "Октябрь 2026",
  },
]

const features = [
  {
    icon: Heart,
    title: "Умный подбор",
    description:
      "Алгоритм анализирует интересы, ценности и образ жизни — предлагает только тех, с кем действительно совпадаешь.",
  },
  {
    icon: Shield,
    title: "Верификация профилей",
    description:
      "Проверка по фото и документам. Никаких ботов, фейков и пустых анкет — только реальные люди.",
  },
  {
    icon: MessageCircle,
    title: "Живое общение",
    description:
      "Современный мессенджер: голосовые, видео, фото, стикеры. Всё, чтобы разговор был настоящим.",
  },
  {
    icon: Zap,
    title: "Мгновенные матчи",
    description:
      "Первое совпадение — в среднем через 3 минуты после регистрации. Без ожиданий и пустых свайпов.",
  },
  {
    icon: Lock,
    title: "Приватность",
    description:
      "Ты сам решаешь, кто видит твой профиль. Режим инкогнито и сквозное шифрование переписки.",
  },
  {
    icon: Flame,
    title: "Серьёзные отношения",
    description:
      "Амур — для тех, кто ищет не флирт на вечер, а человека на всю жизнь. И находит.",
  },
]

const stats = [
  { value: "50K+", label: "Счастливых пар" },
  { value: "98%", label: "Довольных пользователей" },
  { value: "3 мин", label: "До первого матча" },
  { value: "4.9", label: "Рейтинг в сторах" },
]

const testimonials = [
  {
    text: "Благодаря Амуру я встретила любовь своей жизни. Мы вместе уже два года и недавно поженились.",
    author: "Елена",
    role: "28 лет, Москва",
    rating: 5,
  },
  {
    text: "Очень удобный интерфейс и реальные люди. Нашёл свою вторую половинку за месяц.",
    author: "Максим",
    role: "34 года, Петербург",
    rating: 5,
  },
  {
    text: "После развода думала, что уже не найду любовь. Амур доказал обратное — мы счастливы.",
    author: "Ирина",
    role: "42 года, Казань",
    rating: 5,
  },
]

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fdf7f4] text-[#2a1418]">
      {/* Ambient background layers */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(42,20,24,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(42,20,24,0.06) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-200 w-300 -translate-x-1/2 rounded-full opacity-60 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, oklch(0.82 0.12 8 / 0.7) 0%, oklch(0.82 0.12 8 / 0.25) 40%, transparent 70%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-200 -right-40 h-150 w-150 rounded-full opacity-50 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, oklch(0.88 0.1 50 / 0.6) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      {/* Header */}
      <header className="relative z-50 w-full">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/amur-logo.png"
              alt="Амур"
              width={110}
              height={36}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#stories" className="text-md text-[#2a1418]/60 transition-colors hover:text-[#2a1418]">
              Истории
            </a>
            <a href="#features" className="text-md text-[#2a1418]/60 transition-colors hover:text-[#2a1418]">
              Возможности
            </a>
            <a href="#testimonials" className="text-md text-[#2a1418]/60 transition-colors hover:text-[#2a1418]">
              Отзывы
            </a>
            <a href="#pricing" className="text-md text-[#2a1418]/60 transition-colors hover:text-[#2a1418]">
              Цены
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/auth?l=1"
              className="hidden rounded-full px-4 py-2 text-sm text-[#2a1418]/70 transition-colors hover:text-[#2a1418] sm:inline-block"
            >
              Войти
            </Link>
            <Link
              href="/auth?l=0"
              className="group inline-flex items-center gap-1.5 rounded-full bg-[#2a1418] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#2a1418]/90"
            >
              Начать
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 px-6 pt-16 pb-32 sm:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-[#2a1418]/10 bg-white/60 px-4 py-1.5 text-md backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(0.56_0.2_8)] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[oklch(0.56_0.2_8)]" />
            </span>
            <span className="text-[#2a1418]/80">Более <span className='font-bold'>{`50 000`}</span> счастливых пар уже с нами</span>
          </div>

          <h1 className="mb-5 text-5xl font-semibold tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-[80px] lg:leading-[1.2]">
            Любовь — это{" "}
            <span className="pr-3 font-serif italic font-normal bg-linear-to-r from-[oklch(0.56_0.2_8)] via-[oklch(0.62_0.22_12)] to-[oklch(0.7_0.18_40)] bg-clip-text text-transparent text-9xl underline">
              алгоритм
            </span>
            <br />
            который работает
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-[#2a1418]/60 text-pretty">
            Амур — сервис знакомств для тех, кто ищет серьёзные отношения.
            Умный подбор, настоящие люди, реальные истории любви.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/auth?l=0"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2a1418] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#2a1418]/90 sm:w-auto"
            >
              Начать бесплатно
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#stories"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#2a1418]/10 bg-white/60 px-6 py-3 text-sm font-medium text-[#2a1418] backdrop-blur-sm transition-colors hover:bg-white sm:w-auto"
            >
              Смотреть истории
            </a>
          </div>

          <p className="mt-6 text-xs text-[#2a1418]/40">Без рекламы. Без ботов. Без платы за регистрацию.</p>
        </div>

        {/* Hero visual - floating couple cards */}
        <div className="relative mx-auto mt-20 max-w-6xl">
          <div className="relative">
            {/* Glow behind images */}
            <div
              className="absolute inset-0 -z-10 blur-3xl"
              style={{
                background:
                  "radial-gradient(ellipse at center, oklch(0.82 0.14 8 / 0.6) 0%, transparent 70%)",
              }}
              aria-hidden
            />
            <div className="grid grid-cols-3 gap-3 sm:gap-5">
              <div className="mt-12 overflow-hidden rounded-3xl border border-[#2a1418]/10 bg-white shadow-xl shadow-[oklch(0.56_0.2_8)]/10">
                <div className="relative aspect-3/4">
                  <Image
                    src={couples[0].src || "/placeholder.svg"}
                    alt={couples[0].names}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="mb-12 overflow-hidden rounded-3xl border border-[#2a1418]/10 bg-white shadow-xl shadow-[oklch(0.56_0.2_8)]/10">
                <div className="relative aspect-3/4">
                  <Image
                    src={couples[1].src || "/placeholder.svg"}
                    alt={couples[1].names}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="mt-12 overflow-hidden rounded-3xl border border-[#2a1418]/10 bg-white shadow-xl shadow-[oklch(0.56_0.2_8)]/10">
                <div className="relative aspect-3/4">
                  <Image
                    src={couples[2].src || "/placeholder.svg"}
                    alt={couples[2].names}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 border-y border-[#2a1418]/5 bg-white/40 py-16 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="bg-linear-to-b from-[#2a1418] to-[#2a1418]/60 bg-clip-text font-serif text-8xl font-normal text-transparent sm:text-8xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-md text-[#2a1418]/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 px-6 py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#2a1418]/10 bg-white/60 px-3 py-1 text-xs text-[#2a1418]/60 backdrop-blur-sm">
              <Sparkles className="h-3 w-3" />
              Возможности
            </div>
            <h2 className="text-4xl font-medium tracking-tight text-balance sm:text-5xl">
              Всё для того, чтобы{" "}
              <span className="font-serif italic font-normal text-[oklch(0.56_0.2_8)]">найти своего</span>
            </h2>
            <p className="mt-4 text-lg text-[#2a1418]/60 text-pretty">
              Технологии, которые помогают встретить того самого человека.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-3xl border border-[#2a1418]/10 bg-[#2a1418]/10 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group relative bg-[#fdf7f4] p-8 transition-colors hover:bg-white"
              >
                <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2a1418]/10 bg-linear-to-br from-[oklch(0.56_0.2_8)]/15 to-[oklch(0.8_0.14_50)]/10 text-[oklch(0.56_0.2_8)]">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-[#2a1418]">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-[#2a1418]/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stories */}
      <section id="stories" className="relative z-10 px-6 py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#2a1418]/10 bg-white/60 px-3 py-1 text-xs text-[#2a1418]/60 backdrop-blur-sm">
              <Heart className="h-3 w-3" />
              Истории любви
            </div>
            <h2 className="text-4xl font-medium tracking-tight text-balance sm:text-5xl">
              Их истории начались{" "}
              <span className="font-serif italic font-normal text-[oklch(0.56_0.2_8)]">здесь</span>
            </h2>
            <p className="mt-4 text-lg text-[#2a1418]/60 text-pretty">
              Каждый день сотни людей находят свою любовь благодаря Амуру.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {couples.map((couple, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-[#2a1418]/10 bg-white shadow-sm transition-all hover:border-[#2a1418]/20 hover:shadow-xl hover:shadow-[oklch(0.56_0.2_8)]/10"
              >
                <div className="relative aspect-4/5 overflow-hidden">
                  <Image
                    src={couple.src || "/placeholder.svg"}
                    alt={couple.names}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#2a1418] via-[#2a1418]/30 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-black/30 px-2.5 py-1 text-xs text-white backdrop-blur-md">
                      <Heart className="h-3 w-3 fill-[oklch(0.82_0.14_8)] text-[oklch(0.82_0.14_8)]" />
                      {couple.date}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-serif text-2xl font-normal text-white">{couple.names}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/80">{couple.story}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative z-10 px-6 py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#2a1418]/10 bg-white/60 px-3 py-1 text-xs text-[#2a1418]/60 backdrop-blur-sm">
              <Star className="h-3 w-3" />
              Отзывы
            </div>
            <h2 className="text-4xl font-medium tracking-tight text-balance sm:text-5xl">
              Говорят{" "}
              <span className="font-serif italic font-normal text-[oklch(0.56_0.2_8)]">наши люди</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="relative rounded-2xl border border-[#2a1418]/10 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-[oklch(0.56_0.2_8)] text-[oklch(0.56_0.2_8)]"
                    />
                  ))}
                </div>
                <p className="mb-6 text-base leading-relaxed text-[#2a1418]/80 text-pretty">
                  {`"${testimonial.text}"`}
                </p>
                <div className="flex items-center gap-3 border-t border-[#2a1418]/10 pt-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-[oklch(0.56_0.2_8)] to-[oklch(0.8_0.14_50)] text-xs font-medium text-white">
                    {testimonial.author[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#2a1418]">{testimonial.author}</div>
                    <div className="text-xs text-[#2a1418]/50">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl border border-[#2a1418]/10 bg-linear-to-br from-[oklch(0.92_0.06_8)] via-[#fdf7f4] to-[oklch(0.93_0.05_50)] p-12 text-center shadow-xl shadow-[oklch(0.56_0.2_8)]/10 sm:p-20">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.4]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(42,20,24,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(42,20,24,0.06) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -top-20 left-1/2 h-100 w-150 -translate-x-1/2 rounded-full blur-[100px]"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.75 0.18 12 / 0.5) 0%, transparent 70%)",
              }}
              aria-hidden
            />

            <div className="relative">
              <h2 className="mb-5 text-4xl font-medium tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Твоя история любви{" "}
                <span className="font-serif italic font-normal text-[oklch(0.56_0.2_8)]">ждёт</span>
              </h2>
              <p className="mx-auto mb-10 max-w-xl text-lg text-[#2a1418]/70 text-pretty">
                Присоединяйся к тысячам людей, которые уже нашли своё счастье.
                Регистрация бесплатна и займёт минуту.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/auth?l=0"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2a1418] px-7 py-3.5 text-sm font-medium text-white transition-all hover:bg-[#2a1418]/90 sm:w-auto"
                >
                  Создать профиль
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/auth?l=1"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#2a1418]/15 bg-white/80 px-7 py-3.5 text-sm font-medium text-[#2a1418] backdrop-blur-sm transition-colors hover:bg-white sm:w-auto"
                >
                  Войти
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#2a1418]/5 px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center">
              <Image
                src="/amur-mark.png"
                alt="Амур"
                width={16}
                height={16}
                className="h-20 w-27"
              />
              <span className="text-md text-[#2a1418]/40">Знакомства с характером</span>
            </div>
            <p className="text-md text-[#2a1418]/40">© 2026 Амур. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
