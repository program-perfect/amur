/**
 * Procedural feed generator for the Артемьевск city news feed.
 *
 * The six seed templates below were supplied by editorial. The generator
 * cycles through them, adding small per-post variations (timestamps,
 * reaction counts, comment counts, image usage) to produce a scroll of
 * plausible city-life posts. Generation is deterministic — index-driven,
 * never Math.random — so server and client render identical output and
 * there are no hydration mismatches.
 *
 * In addition, the generator occasionally (≈1 out of every ~10–14 items)
 * injects a sponsored item. Two kinds exist:
 *  - `promo-amur`: a cross-promotion card for the Amur dating app, the
 *    parent product this feed lives inside.
 *  - `promo-artlenta`: a self-promotion card inviting readers to try
 *    the paid АРТЛЕНТА+ tier.
 */

export type FeedCategory =
  | "infra"
  | "culture"
  | "evening"
  | "books"
  | "food"
  | "sport"
  | "nature"
  | "transport"
  | "tech"
  | "market"
  | "kids"
  | "history"

export type FeedReactionKey =
  | "like"
  | "fire"
  | "haha"
  | "wow"
  | "sad"
  | "angry"

export type FeedReactionCounts = Partial<Record<FeedReactionKey, number>>

export type FeedPostData = {
  id: string
  group: string
  handle: string
  /** Two-letter Cyrillic monogram shown in the avatar circle. */
  monogram: string
  /** Hue rotation (0–360) used to tint the avatar circle so each group
   *  reads as a distinct "publisher". */
  avatarHue: number
  category: FeedCategory
  time: string
  location: string
  text: string
  image?: {
    src: string
    alt: string
    /** Approximate aspect used to size the image block. */
    aspect: "4/5" | "1/1" | "3/2"
  }
  reactions: FeedReactionCounts
  /** Which reaction (if any) the author of the post "picked" — drives the
   *  highlighted reaction badge on the card. */
  topReaction: FeedReactionKey
  comments: number
  shares: number
  views: number
}

/**
 * An entry in the streamed feed list. A "post" is a regular generated
 * entry; "promo-*" variants render as dedicated ad cards with their own
 * colour treatment and call-to-action.
 */
export type FeedItem =
  | { kind: "post"; data: FeedPostData }
  | { kind: "promo-amur"; id: string }
  | { kind: "promo-artlenta"; id: string }

type Template = {
  group: string
  handle: string
  monogram: string
  avatarHue: number
  category: FeedCategory
  location: string
  text: string
  image?: FeedPostData["image"]
  /** Relative "buzz" 0..1 — scales reaction counts. */
  buzz: number
}

const templates: Template[] = [
  {
    group: "Артемьевск / инфраструктура",
    handle: "artemyevsk.city",
    monogram: "АИ",
    avatarHue: 220,
    category: "infra",
    location: "Набережная у старого моста",
    text: "Работы на участке набережной у старого моста завершены. Обновили плитку, добавили локальные светильники, поставили новые скамейки. В вечернее время зона быстро заполняется — особенно в сухую погоду.",
    image: {
      src: "/feed/promenade.jpg",
      alt: "Вечерний вид обновлённой набережной Артемьевска",
      aspect: "4/5",
    },
    buzz: 0.9,
  },
  {
    group: "Канал «Слово и полка»",
    handle: "slovo_i_polka",
    monogram: "СП",
    avatarHue: 30,
    category: "books",
    location: "Библиотека на Мира",
    text: "В библиотеке на Мира открыли доступ к подборке редких изданий рубежа XIX–XX веков. Часть экземпляров с владельческими отметками и следами старых библиотечных штампов. Формат посещения пока только читальный зал, без выдачи на руки.",
    image: {
      src: "/feed/rare-books.jpg",
      alt: "Редкие издания XIX–XX веков на читальном столе",
      aspect: "3/2",
    },
    buzz: 0.55,
  },
  {
    group: "Городской радар | Артемьевск",
    handle: "gorod.radar",
    monogram: "ГР",
    avatarHue: 260,
    category: "infra",
    location: "Центральная площадь",
    text: "На центральной площади запустили тестовый режим обновлённого освещения. Светильники меняют интенсивность автоматически. В ночные часы заметен более тёплый и приглушённый режим.",
    image: {
      src: "/feed/square-lights.jpg",
      alt: "Тёплое адаптивное освещение центральной площади ночью",
      aspect: "1/1",
    },
    buzz: 0.7,
  },
  {
    group: "Литературное сообщество «Черновик»",
    handle: "chernovik.lit",
    monogram: "Ч",
    avatarHue: 340,
    category: "culture",
    location: "Клуб «Черновик»",
    text: "Обсуждают короткую прозу и малые формы песни. В последней подборке всплывал авторский проект Son&Dog (vk.com/son_n_dog) — в обсуждении отмечали ровную интонацию и отсутствие перегруженных образов в тексте.",
    buzz: 0.4,
  },
  {
    group: "Листаем вместе",
    handle: "listaem.vmeste",
    monogram: "ЛВ",
    avatarHue: 140,
    category: "books",
    location: "Двор на Лесной",
    text: "Во дворе на Лесной поставили открытый шкаф для обмена книгами. Формат простой: принёс — взял. За несколько дней полки заметно обновились, особенно быстро уходят сборники рассказов и эссе.",
    image: {
      src: "/feed/book-exchange.jpg",
      alt: "Открытый шкаф для обмена книгами во дворе на Лесной",
      aspect: "4/5",
    },
    buzz: 0.6,
  },
  {
    group: "Вечерний Артемьевск",
    handle: "vecherniy.art",
    monogram: "ВА",
    avatarHue: 25,
    category: "evening",
    location: "Набережная",
    text: "У набережной периодически появляется уличный музыкант со струнным инструментом. Игры без афиш и объявлений, чаще всего ближе к закату. Слушатели не задерживаются надолго, но точка уже стала узнаваемой.",
    image: {
      src: "/feed/musician.jpg",
      alt: "Уличный музыкант у набережной на закате",
      aspect: "3/2",
    },
    buzz: 0.75,
  },
  // ── Expanded editorial coverage ───────────────────────────────────
  // New verticals added to widen the feed: food, sport, nature,
  // transport, tech, market, kids, history. Each template carries a
  // plausible Artemyevsk-local hook so the feed reads as a coherent
  // city newsroom rather than a generic lifestyle stream.
  {
    group: "Артемьевск / еда",
    handle: "arthub.food",
    monogram: "АЕ",
    avatarHue: 10,
    category: "food",
    location: "Старый рынок",
    text: "На Старом рынке в субботу открыли ряд фермерских прилавков с сезонным урожаем. На стойках — корнеплоды, соленья, пасеки из пригородов. Очередь к сыроделам растянулась почти до входа.",
    image: {
      src: "/feed/market-stalls.jpg",
      alt: "Фермерские прилавки Старого рынка Артемьевска",
      aspect: "3/2",
    },
    buzz: 0.7,
  },
  {
    group: "Кафе «Перелив»",
    handle: "pereliv.cafe",
    monogram: "П",
    avatarHue: 40,
    category: "food",
    location: "Улица Садовая, 14",
    text: "Новое зимнее меню выкатили без анонса: тыквенный крем-суп, форель на подушке из чечевицы и пряный компот из облепихи. Порции скромные, подача аккуратная — место быстро заполняется по вечерам.",
    buzz: 0.5,
  },
  {
    group: "Артемьевск / спорт",
    handle: "sport.art",
    monogram: "АС",
    avatarHue: 200,
    category: "sport",
    location: "Стадион «Заря»",
    text: "Юношеская команда выиграла полуфинал областного первенства в дополнительное время. На трибунах собрались родители и соседние школы, поле держалось достойно даже под мокрым снегом.",
    image: {
      src: "/feed/stadium.jpg",
      alt: "Матч юношеской команды на стадионе Заря",
      aspect: "3/2",
    },
    buzz: 0.8,
  },
  {
    group: "Беговой клуб «Поток»",
    handle: "potok.run",
    monogram: "ПК",
    avatarHue: 180,
    category: "sport",
    location: "Парк у реки",
    text: "В воскресенье стартует еженедельная дистанция 5 км вдоль реки. Темп свободный, после финиша — горячий чай и разбор техники с тренером. Регистрации не нужно, достаточно просто прийти к 9:00.",
    buzz: 0.45,
  },
  {
    group: "Природа Артемьевска",
    handle: "priroda.art",
    monogram: "ПА",
    avatarHue: 130,
    category: "nature",
    location: "Сосновый бор за городом",
    text: "В сосновом бору за городом второй раз за месяц замечена пара журавлей. Лесники просят не подходить ближе тридцати метров и не использовать приманки — площадка стала частью сезонного маршрута.",
    image: {
      src: "/feed/forest.jpg",
      alt: "Сосновый бор на рассвете",
      aspect: "4/5",
    },
    buzz: 0.6,
  },
  {
    group: "Городские птицы",
    handle: "ptitsy.city",
    monogram: "ГП",
    avatarHue: 160,
    category: "nature",
    location: "Пруд в Лесопарке",
    text: "На пруду в Лесопарке задержались поздние утки — вода ещё не схватилась льдом. Волонтёры просят не подкармливать хлебом: в пунктах у входа лежит подходящий корм в бумажных пакетах.",
    buzz: 0.35,
  },
  {
    group: "Транспорт Артемьевска",
    handle: "transport.art",
    monogram: "ТА",
    avatarHue: 280,
    category: "transport",
    location: "Маршрут №12",
    text: "На маршруте №12 ввели новое расписание: интервал в час пик сокращён до 7–9 минут. На конечных установили табло с обратным отсчётом. Частично обновили подвижной состав — три машины новые.",
    image: {
      src: "/feed/bus.jpg",
      alt: "Новый автобус на конечной остановке маршрута 12",
      aspect: "3/2",
    },
    buzz: 0.65,
  },
  {
    group: "Веломаршрут 64",
    handle: "velo64",
    monogram: "В",
    avatarHue: 100,
    category: "transport",
    location: "Улица Октябрьская",
    text: "Разметку велополосы на Октябрьской доводят до финала: поставили отбойники у сложных поворотов, обновили знаки. Полоса пока тестовая, обратная связь собирается через форму на сайте мэрии.",
    buzz: 0.4,
  },
  {
    group: "Техцех",
    handle: "techceh",
    monogram: "ТЦ",
    avatarHue: 250,
    category: "tech",
    location: "Коворкинг «Сетка»",
    text: "В коворкинге «Сетка» прошёл первый митап инженеров из локальных студий. Доклады без слайдов, по 15 минут: рассказывали о своих пет-проектах, отвечали на вопросы. Следующий — через две недели.",
    buzz: 0.5,
  },
  {
    group: "Цифровая мэрия",
    handle: "gov.digital",
    monogram: "ЦМ",
    avatarHue: 230,
    category: "tech",
    location: "Портал услуг",
    text: "Портал городских услуг обновили: заявки на вывоз крупногабаритного мусора и ремонт дворовых участков теперь подаются в пару кликов. История обращений видна прямо в личном кабинете.",
    buzz: 0.55,
  },
  {
    group: "Артемьевск / барахолка",
    handle: "art.market",
    monogram: "АМ",
    avatarHue: 320,
    category: "market",
    location: "Площадь Искусств",
    text: "В выходные на Площади Искусств пройдёт сезонная барахолка: винтажные книги, пластинки, старая оптика, керамика. Вход свободный, около сотни продавцов заявились заранее.",
    image: {
      src: "/feed/flea-market.jpg",
      alt: "Столы с винтажными вещами на барахолке",
      aspect: "4/5",
    },
    buzz: 0.7,
  },
  {
    group: "Мастерская на Чехова",
    handle: "master.chehova",
    monogram: "МЧ",
    avatarHue: 50,
    category: "market",
    location: "Улица Чехова, 7",
    text: "Мастерская на Чехова открыла короткий курс по починке кожаных изделий. Три встречи по вечерам, материалы и инструменты на месте. Набор в группу идёт до конца недели.",
    buzz: 0.35,
  },
  {
    group: "Дети Артемьевска",
    handle: "deti.art",
    monogram: "ДА",
    avatarHue: 345,
    category: "kids",
    location: "Центр «Ромашка»",
    text: "В центре «Ромашка» стартует бесплатный цикл лекций для родителей младших школьников. Темы — адаптация, сон, экранное время. Записываться можно через администратора или мессенджер центра.",
    buzz: 0.4,
  },
  {
    group: "Детская площадка на Зелёной",
    handle: "zel.park",
    monogram: "ДЗ",
    avatarHue: 120,
    category: "kids",
    location: "Улица Зелёная",
    text: "На детской площадке в сквере на Зелёной заменили песок и починили качели. Новое покрытие — мягкая резиновая крошка, от старой гравийной насыпи отказались полностью.",
    image: {
      src: "/feed/playground.jpg",
      alt: "Обновлённая детская площадка на улице Зелёной",
      aspect: "3/2",
    },
    buzz: 0.5,
  },
  {
    group: "Артемьевск / история",
    handle: "art.history",
    monogram: "АИ",
    avatarHue: 15,
    category: "history",
    location: "Краеведческий музей",
    text: "В краеведческом музее выложили оцифрованный фонд фотографий начала XX века: ярмарки, мастерские, городские праздники. Коллекция доступна онлайн, с возможностью скачивать изображения в высоком разрешении.",
    image: {
      src: "/feed/archive.jpg",
      alt: "Архивные фотографии начала XX века",
      aspect: "4/5",
    },
    buzz: 0.6,
  },
  {
    group: "Клуб «Старый город»",
    handle: "stary.gorod",
    monogram: "СГ",
    avatarHue: 20,
    category: "history",
    location: "Улица Толстого",
    text: "Экскурсия по старому центру: маршрут от пожарной каланчи до бывшей почтовой станции. Группы по 10–12 человек, сбор у фонаря на Толстого. В программе — неизвестные широкой публике дворы и арки.",
    buzz: 0.45,
  },
]

/** Relative timestamps cycled across the feed so each post has its own
 *  "freshness" label. */
const timeLabels = [
  "только что",
  "5 мин",
  "14 мин",
  "32 мин",
  "час назад",
  "2 ч",
  "3 ч",
  "5 ч",
  "вчера",
  "2 дня назад",
]

/** Pick a "top" reaction that feels natural for the category. */
function pickTopReaction(
  category: FeedCategory,
  index: number,
): FeedReactionKey {
  const wheel: Record<FeedCategory, FeedReactionKey[]> = {
    infra: ["like", "fire", "wow", "like"],
    culture: ["like", "haha", "wow", "fire"],
    evening: ["fire", "wow", "like", "fire"],
    books: ["like", "wow", "like", "fire"],
    food: ["like", "fire", "wow", "like"],
    sport: ["fire", "like", "wow", "fire"],
    nature: ["wow", "like", "fire", "wow"],
    transport: ["like", "angry", "wow", "like"],
    tech: ["wow", "fire", "like", "wow"],
    market: ["like", "fire", "like", "wow"],
    kids: ["like", "haha", "wow", "like"],
    history: ["wow", "like", "fire", "wow"],
  }
  const options = wheel[category]
  return options[index % options.length]
}

function makeReactions(
  buzz: number,
  seed: number,
  top: FeedReactionKey,
): FeedReactionCounts {
  // Deterministic "random-feeling" numbers derived from the index.
  const base = Math.round(12 + buzz * 180)
  const jitter = ((seed * 37) % 23) - 11
  const total = Math.max(3, base + jitter)

  const weights: Record<FeedReactionKey, number> = {
    like: 0.55,
    fire: 0.18,
    wow: 0.12,
    haha: 0.08,
    sad: 0.04,
    angry: 0.03,
  }
  // Bump the "top" reaction so it dominates.
  weights[top] += 0.15

  const out: FeedReactionCounts = {}
  const keys: FeedReactionKey[] = ["like", "fire", "wow", "haha", "sad", "angry"]
  keys.forEach((k) => {
    const n = Math.max(0, Math.round(total * weights[k]))
    if (n > 0) out[k] = n
  })
  // Ensure the top reaction is present even if weighting rounded it out.
  if (!out[top]) out[top] = Math.max(1, Math.round(total * 0.1))
  return out
}

function makeTime(index: number): string {
  return timeLabels[index % timeLabels.length]
}

function makePost(i: number): FeedPostData {
  const t = templates[i % templates.length]
  const top = pickTopReaction(t.category, i)
  // Drop the image every 3rd cycle for the templates that have one —
  // keeps the feed varied, like a real news stream.
  const hideImage = t.image && i >= templates.length && i % 3 === 2
  const buzz = Math.max(
    0.15,
    Math.min(1, t.buzz + (((i * 13) % 7) - 3) / 40),
  )
  const reactions = makeReactions(buzz, i + 1, top)

  return {
    id: `post-${i}`,
    group: t.group,
    handle: t.handle,
    monogram: t.monogram,
    avatarHue: t.avatarHue,
    category: t.category,
    time: makeTime(i),
    location: t.location,
    text: t.text,
    image: hideImage ? undefined : t.image,
    reactions,
    topReaction: top,
    comments: Math.max(0, Math.round(buzz * 38) + (((i * 7) % 9) - 4)),
    shares: Math.max(0, Math.round(buzz * 14) + ((i * 3) % 5) - 2),
    views: Math.round(400 + buzz * 4800 + ((i * 97) % 600)),
  }
}

/**
 * Produce `count` mixed feed items: posts interleaved with exactly two
 * sponsored cards — one of each kind. Deterministic — no randomness,
 * safe for SSR hydration.
 *
 * The feed contains only two ads total to keep sponsored content from
 * feeling intrusive:
 *   - АртЛента+ self-promo appears near the start of the feed
 *   - Амур cross-promo appears around the middle of the feed
 *
 * Ads are kept at least 4 posts apart from each other so readers get
 * several pieces of editorial content between the two placements.
 */
const ARTLENTA_PROMO_SLOT = 3
const AMUR_PROMO_SLOT = 15

export function generateFeedItems(count: number): FeedItem[] {
  const out: FeedItem[] = []
  let postIdx = 0

  for (let slot = 0; slot < count; slot++) {
    if (slot === ARTLENTA_PROMO_SLOT) {
      out.push({ kind: "promo-artlenta", id: `promo-al-${slot}` })
      continue
    }
    if (slot === AMUR_PROMO_SLOT) {
      out.push({ kind: "promo-amur", id: `promo-amur-${slot}` })
      continue
    }

    out.push({ kind: "post", data: makePost(postIdx) })
    postIdx++
  }

  return out
}

/** Convenience filter — derive only the posts (for category-filtered
 *  views where promos should still sprinkle in naturally). */
export function filterItemsByCategory(
  items: FeedItem[],
  category: FeedCategory | "all",
): FeedItem[] {
  if (category === "all") return items
  return items.filter((it) => it.kind !== "post" || it.data.category === category)
}
