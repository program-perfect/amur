/**
 * Procedural feed generator for the Артемьевск city news feed.
 *
 * The six seed templates below were supplied by editorial. The generator
 * cycles through them, adding small per-post variations (timestamps,
 * reaction counts, comment counts, image usage) to produce a scroll of
 * plausible city-life posts. Generation is deterministic — index-driven,
 * never Math.random — so server and client render identical output and
 * there are no hydration mismatches.
 */

export type FeedCategory = "infra" | "culture" | "evening" | "books"

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
  let assigned = 0
  const keys: FeedReactionKey[] = ["like", "fire", "wow", "haha", "sad", "angry"]
  keys.forEach((k, i) => {
    const share = weights[k] / (keys.length * 0.33)
    const n = Math.max(0, Math.round(total * weights[k]) - (i === keys.length - 1 ? 0 : 0))
    if (n > 0) {
      out[k] = n
      assigned += n
    }
    // Silence the unused var warning from the `share` calculation kept
    // for readability above.
    void share
  })
  // Ensure the top reaction is present even if weighting rounded it out.
  if (!out[top]) out[top] = Math.max(1, Math.round(total * 0.1))
  void assigned
  return out
}

function makeTime(index: number): string {
  return timeLabels[index % timeLabels.length]
}

/**
 * Produce `count` posts by cycling the templates and varying metadata.
 * Deterministic in `count` — no randomness, safe for SSR hydration.
 */
export function generateFeed(count: number): FeedPostData[] {
  const posts: FeedPostData[] = []
  for (let i = 0; i < count; i++) {
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

    posts.push({
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
      comments: Math.max(
        0,
        Math.round(buzz * 38) + (((i * 7) % 9) - 4),
      ),
      shares: Math.max(0, Math.round(buzz * 14) + ((i * 3) % 5) - 2),
      views: Math.round(400 + buzz * 4800 + ((i * 97) % 600)),
    })
  }
  return posts
}
