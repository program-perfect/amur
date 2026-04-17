"use client"

import { ArrowRight, Check, Heart, Lock, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import type React from "react"
import { Suspense, useRef, useState, type KeyboardEvent } from "react"

/* ─ Registration scripts ────────────────────────────────────────────────── */
// Whatever the user types, these appear character by character.
const REGISTER_SCRIPTS = {
  name: "Татьяна Спиридонова",
  email: "tata.spiri@mail.com",
  age: "33",
  city: "Артемьевск",
  about:
    "Ищу серьёзные отношения и создание крепкой семьи. Люблю литературу, хорошие книги и долгие разговоры под вечер. Верю, что настоящая любовь существует.",
} as const

type FieldName = keyof typeof REGISTER_SCRIPTS

interface FieldConfig {
  name: FieldName
  label: string
  placeholder: string
  type: "text" | "email" | "textarea"
}

const REGISTER_FIELDS: FieldConfig[] = [
  { name: "name", label: "Имя и фамилия", placeholder: "Как вас зовут?", type: "text" },
  { name: "email", label: "Почта", placeholder: "your@email.com", type: "email" },
  { name: "age", label: "Возраст", placeholder: "Сколько вам лет?", type: "text" },
  { name: "city", label: "Город", placeholder: "Где вы живёте?", type: "text" },
  { name: "about", label: "О себе", placeholder: "Расскажите о себе...", type: "textarea" },
]

/* ─ Pre-filled credentials for login mode ──────────────────────────────── */
const PREFILLED_LOGIN = {
  email: "tata.spiri@mail.com",
  password: "••••••••••••",
}

/* ─ Shared wrapper (background + header) ──────────────────────────────── */
function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#fdf7f4] text-[#2a1418]"
      style={{ fontFamily: "var(--font-geist), system-ui, sans-serif" }}
    >
      {/* Ambient glows */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-175 w-275 -translate-x-1/2 rounded-full opacity-60 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, oklch(0.82 0.12 8 / 0.7) 0%, oklch(0.82 0.12 8 / 0.25) 40%, transparent 70%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 h-150 w-150 rounded-full opacity-50 blur-[120px]"
        style={{
          background: "radial-gradient(circle, oklch(0.88 0.1 50 / 0.6) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <header className="relative z-50 w-full">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/amur-logo.png" alt="Амур" width={110} height={36} className="h-8 w-auto" priority />
          </Link>
          <Link href="/" className="text-sm text-[#2a1418]/60 transition-colors hover:text-[#2a1418]">
            Назад
          </Link>
        </div>
      </header>

      {children}
    </div>
  )
}

/* ─ Login view ─────────────────────────────────────────────────────────── */
function LoginView() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    setSubmitted(true)
    setTimeout(() => router.push("/m"), 1200)
  }

  const noop = (e: React.SyntheticEvent) => {
    e.preventDefault()
  }

  return (
    <main className="relative z-10 px-6 pb-24 pt-12">
      <div className="mx-auto max-w-md">
        <div className="mb-10 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2a1418]/10 bg-white/60 px-4 py-1.5 text-xs backdrop-blur-sm">
            <Heart className="h-3 w-3 fill-[oklch(0.56_0.2_8)] text-[oklch(0.56_0.2_8)]" />
            <span className="text-[#2a1418]/80">Вход в Амур</span>
          </div>
          <h1 className="text-4xl font-medium tracking-tight text-balance sm:text-5xl">
            С возвращением,{" "}<span className="font-serif italic text-7xl font-normal text-[oklch(0.56_0.2_8)]">Тата</span>{" "}<span className="italic">!</span>
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative overflow-hidden rounded-3xl border border-[#2a1418]/10 bg-white/80 p-6 shadow-xl shadow-[oklch(0.56_0.2_8)]/10 backdrop-blur-xl sm:p-8"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#2a1418]/50"
              >
                Почта
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2a1418]/30" />
                <input
                  id="email"
                  type="text"
                  value={PREFILLED_LOGIN.email}
                  readOnly
                  onKeyDown={noop}
                  onChange={noop}
                  onPaste={noop}
                  className="w-full cursor-default rounded-xl border border-[#2a1418]/10 bg-white py-3 pl-10 pr-4 text-sm text-[#2a1418] outline-none transition-all focus:border-[oklch(0.56_0.2_8)]/40 focus:ring-2 focus:ring-[oklch(0.56_0.2_8)]/10"
                  autoComplete="off"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium uppercase tracking-wider text-[#2a1418]/50"
                >
                  Пароль
                </label>
                <span className="text-xs text-[#2a1418]/40">Забыли?</span>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2a1418]/30" />
                <input
                  id="password"
                  type="text"
                  value={PREFILLED_LOGIN.password}
                  readOnly
                  onKeyDown={noop}
                  onChange={noop}
                  onPaste={noop}
                  className="w-full cursor-default rounded-xl border border-[#2a1418]/10 bg-white py-3 pl-10 pr-4 text-sm tracking-widest text-[#2a1418] outline-none transition-all focus:border-[oklch(0.56_0.2_8)]/40 focus:ring-2 focus:ring-[oklch(0.56_0.2_8)]/10"
                  autoComplete="off"
                />
              </div>
            </div>

            <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-[#2a1418]/70">
              <span className="relative inline-flex h-4 w-4 items-center justify-center rounded border border-[#2a1418]/20 bg-[oklch(0.56_0.2_8)]">
                <Check className="h-3 w-3 text-white" strokeWidth={3} />
              </span>
              Запомнить меня на этом устройстве
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2a1418] px-6 py-3.5 text-sm font-medium text-white transition-all hover:bg-[#2a1418]/90 disabled:cursor-not-allowed disabled:opacity-80"
          >
            {submitted ? (
              <>
                <Check className="h-4 w-4" />
                Вход выполнен — переходим в мессенджер
              </>
            ) : (
              <>
                Войти в профиль
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>

          <p className="mt-4 text-center text-xs text-[#2a1418]/40">
            Нет аккаунта?{" "}
            <Link href="/auth?l=0" className="text-[oklch(0.56_0.2_8)] underline-offset-2 hover:underline">
              Создать профиль
            </Link>
          </p>
        </form>
      </div>
    </main>
  )
}

/* ─ Register view ──────────────────────────────────────────────────────── */
function RegisterView() {
  const router = useRouter()
  const [values, setValues] = useState<Record<FieldName, string>>({
    name: "",
    email: "",
    age: "",
    city: "",
    about: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const indicesRef = useRef<Record<FieldName, number>>({
    name: 0,
    email: 0,
    age: 0,
    city: 0,
    about: 0,
  })

  const handleKeyDown = (field: FieldName) => (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return
    const navigationKeys = ["Tab", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"]
    if (navigationKeys.includes(e.key)) return

    e.preventDefault()

    if (e.key === "Backspace") {
      setValues((prev) => {
        const current = prev[field]
        if (!current) return prev
        const next = current.slice(0, -1)
        indicesRef.current[field] = Math.max(0, indicesRef.current[field] - 1)
        return { ...prev, [field]: next }
      })
      return
    }

    if (e.key.length !== 1 && e.key !== "Enter") return

    const script = REGISTER_SCRIPTS[field]
    const idx = indicesRef.current[field]
    if (idx >= script.length) return

    const nextChar = script[idx]
    indicesRef.current[field] = idx + 1
    setValues((prev) => ({ ...prev, [field]: prev[field] + nextChar }))
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
  }

  const handleChange = () => {
    /* controlled via keydown */
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    setSubmitted(true)
    setTimeout(() => router.push("/m"), 1400)
  }

  const allFilled = REGISTER_FIELDS.every((f) => values[f.name].length > 0)

  return (
    <main className="relative z-10 px-6 pb-24 pt-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-10 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2a1418]/10 bg-white/60 px-4 py-1.5 text-xs backdrop-blur-sm">
            <Heart className="h-3 w-3 fill-[oklch(0.56_0.2_8)] text-[oklch(0.56_0.2_8)]" />
            <span className="text-[#2a1418]/80">Регистрация в Амуре</span>
          </div>
          <h1 className="text-4xl font-medium tracking-tight text-balance sm:text-5xl">
            Создайте свой{" "}
            <span className="font-serif italic font-normal text-[oklch(0.56_0.2_8)]">профиль</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-[#2a1418]/60 text-pretty">
            Заполните анкету — это займёт меньше минуты. После этого вы попадёте в мессенджер.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative overflow-hidden rounded-3xl border border-[#2a1418]/10 bg-white/80 p-6 shadow-xl shadow-[oklch(0.56_0.2_8)]/10 backdrop-blur-xl sm:p-10"
        >
          <div className="space-y-5">
            {REGISTER_FIELDS.map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#2a1418]/50"
                >
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={values[field.name]}
                    placeholder={field.placeholder}
                    rows={4}
                    onKeyDown={handleKeyDown(field.name)}
                    onChange={handleChange}
                    onPaste={handlePaste}
                    disabled={submitted}
                    className="w-full resize-none rounded-xl border border-[#2a1418]/10 bg-white px-4 py-3 text-sm text-[#2a1418] placeholder:text-[#2a1418]/30 outline-none transition-all focus:border-[oklch(0.56_0.2_8)]/40 focus:ring-2 focus:ring-[oklch(0.56_0.2_8)]/10 disabled:opacity-60"
                    autoComplete="off"
                  />
                ) : (
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    value={values[field.name]}
                    placeholder={field.placeholder}
                    onKeyDown={handleKeyDown(field.name)}
                    onChange={handleChange}
                    onPaste={handlePaste}
                    disabled={submitted}
                    className="w-full rounded-xl border border-[#2a1418]/10 bg-white px-4 py-3 text-sm text-[#2a1418] placeholder:text-[#2a1418]/30 outline-none transition-all focus:border-[oklch(0.56_0.2_8)]/40 focus:ring-2 focus:ring-[oklch(0.56_0.2_8)]/10 disabled:opacity-60"
                    autoComplete="off"
                  />
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={!allFilled || isSubmitting}
            className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2a1418] px-6 py-3.5 text-sm font-medium text-white transition-all hover:bg-[#2a1418]/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitted ? (
              <>
                <Check className="h-4 w-4" />
                Профиль создан — переходим в мессенджер
              </>
            ) : (
              <>
                Создать профиль и перейти в чат
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>

          <p className="mt-4 text-center text-xs text-[#2a1418]/40">
            Уже есть аккаунт?{" "}
            <Link href="/auth?l=1" className="text-[oklch(0.56_0.2_8)] underline-offset-2 hover:underline">
              Войти
            </Link>
          </p>
        </form>
      </div>
    </main>
  )
}

/* ─ Router: pick the view based on ?l= ─────────────────────────────────── */
function AuthContent() {
  const params = useSearchParams()
  // ?l=1 → login, ?l=0 → register. Default: register.
  const isLogin = params.get("l") === "1"
  return <AuthShell>{isLogin ? <LoginView /> : <RegisterView />}</AuthShell>
}

export default function AuthPage() {
  return (
    <Suspense fallback={<AuthShell>{null}</AuthShell>}>
      <AuthContent />
    </Suspense>
  )
}
