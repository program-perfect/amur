import { Heart } from "lucide-react"

/**
 * Shared static footer used on the full profile pages.
 *
 * The link-looking entries are intentionally rendered as plain <span>
 * elements — product spec calls for a "типа справки, политика
 * конфиденциальности и т.д." row that reads like a site footer but
 * is not actually interactive yet. Keeping them non-focusable also
 * prevents keyboard users from tab-landing on dead affordances.
 *
 * The footer is organised into four thematic columns so it scales
 * from narrow mobile (stacked, single column) to wide desktop
 * (four-up grid), staying readable at every breakpoint without
 * any hard-coded widths.
 */
export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border bg-card/40">
      <div className="mx-auto max-w-5xl px-4 py-10 xs:px-5 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {col.items.map((item) => (
                  <li
                    key={item}
                    aria-disabled="true"
                    className="cursor-default text-[13.5px] leading-relaxed text-foreground/70"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar — brand, copyright, meta */}
        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 text-[12px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10"
            >
              <Heart
                className="h-3.5 w-3.5 fill-primary text-primary"
                strokeWidth={0}
              />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="font-serif text-[15px] tracking-tight text-foreground">
                Амур
              </span>
              <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Знакомства Артемьевска
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <span className="cursor-default">© 2026 Амур</span>
            <span aria-hidden className="hidden h-3 w-px bg-border sm:inline-block" />
            <span className="cursor-default">ИНН 7712345678</span>
            <span aria-hidden className="hidden h-3 w-px bg-border sm:inline-block" />
            <span className="cursor-default">г. Артемьевск, ул. Парковая, 14</span>
          </div>
        </div>

        <p className="mt-4 cursor-default text-[11.5px] leading-relaxed text-muted-foreground/80">
          Сервис «Амур» предназначен исключительно для знакомств и общения
          совершеннолетних пользователей. Используя сайт, вы соглашаетесь с
          правилами сообщества и подтверждаете достижение возраста 18 лет.
          Все изображения и сведения о людях, размещённые в профилях, являются
          художественным вымыслом.
        </p>
      </div>
    </footer>
  )
}

/**
 * Footer navigation copy. Kept as module-level data (not inlined in
 * JSX) so it's easy to audit, translate, or swap with a CMS feed
 * later without touching the layout.
 */
const FOOTER_COLUMNS: { title: string; items: string[] }[] = [
  {
    title: "Амур",
    items: ["О проекте", "Истории знакомств", "Блог", "Пресс-центр", "Карьера"],
  },
  {
    title: "Помощь",
    items: [
      "Справка",
      "Частые вопросы",
      "Обратная связь",
      "Сообщить о проблеме",
      "Статус сервиса",
    ],
  },
  {
    title: "Безопасность",
    items: [
      "Правила сообщества",
      "Рекомендации по свиданиям",
      "Модерация профилей",
      "Верификация анкеты",
      "Доверие и безопасность",
    ],
  },
  {
    title: "Право",
    items: [
      "Пользовательское соглашение",
      "Политика конфиденциальности",
      "Использование файлов cookie",
      "Обработка персональных данных",
      "Реквизиты компании",
    ],
  },
]
