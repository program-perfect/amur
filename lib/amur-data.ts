import type { LucideIcon } from "lucide-react";
import {
  BookIcon,
  Briefcase,
  Building2,
  Car,
  Coffee,
  CookingPot,
  Drama,
  Film,
  Footprints,
  GraduationCap,
  Heart,
  MapPin,
  Music,
  Plane,
  Ruler,
  Utensils,
  Wine,
} from "lucide-react";

export type Message =
  | {
      id: string;
      kind: "text";
      from: "me" | "them";
      text: string;
      time: string;
      status?: "sent" | "delivered" | "read";
    }
  | {
      id: string;
      kind: "image";
      from: "me" | "them";
      src: string;
      caption?: string;
      time: string;
      status?: "sent" | "delivered" | "read";
    }
  | {
      id: string;
      kind: "system";
      text: string;
    };

/** One strictly ordered step of a scripted conversation. */
export type ScriptStep =
  | { kind: "text"; from: "me" | "them"; text: string }
  | { kind: "image"; from: "me" | "them"; src: string; caption?: string };

export type Fact = { icon: LucideIcon; label: string };
export type Interest = { label: string; icon: LucideIcon };

/**
 * Per-character message-composition timing. Simulates how long a given
 * persona takes to type / send their next line. Delays scale with text
 * length but are clamped by `minDelay` / `maxDelay`.
 */
export type TypingProfile = {
  /** Delay before the "печатает…" indicator appears, in ms. */
  startDelay: number;
  /** Milliseconds per character of the outgoing text. */
  msPerChar: number;
  /** Lower bound for the composition delay, in ms. */
  minDelay: number;
  /** Upper bound for the composition delay, in ms. */
  maxDelay: number;
  /** Fixed delay for image messages, in ms. */
  imageDelay: number;
};

/**
 * Safe fallback used for conversations that don't declare a typing profile.
 * Matches the previous hard-coded behaviour (550 / 1400 / 1800 ms).
 */
export const defaultTypingProfile: TypingProfile = {
  startDelay: 1100,
  msPerChar: 70,
  minDelay: 2200,
  maxDelay: 7500,
  imageDelay: 3800,
};

export type Conversation = {
  id: string;
  name: string;
  /** Dative form of the name, used in the chat composer placeholder
   *  ("Напишите {nameDative}…"). Russian name declensions are irregular
   *  (Данила → Даниле, Лев → Льву), so each name keeps its own form. */
  nameDative: string;
  /** Age is optional — omit it in the seed to hide the age entirely
   *  from the chat header and the profile panel. */
  age?: number;
  avatar: string;
  photos: string[];
  online: boolean;
  status: string;
  verified: boolean;
  city: string;
  distance: string;
  compatibility: number;
  about: string;
  facts: Fact[];
  interests: Interest[];
  matchedLabel: string;
  preview: {
    lastMessage: string;
    time: string;
    unread?: number;
    fromMe?: boolean;
    /** Read-receipt of the last outgoing message. Only meaningful when
     *  `fromMe` is true. Defaults to `true` for seeded history so old
     *  messages appear as already read. */
    read?: boolean;
  };
  suggestion: string;
  /** Per-character message-composition timing. If omitted, the app falls
   *  back to `defaultTypingProfile`. */
  typingProfile?: TypingProfile;
  /** Full scripted dialog. Every scenario starts with `from: "them"`. */
  script: ScriptStep[];
};

/** Matches shown in the "Новые совпадения" strip */
export const newMatches = [
  { id: "n1", name: "Маэстро", avatar: "/profiles/maestro.png", isNew: true },
  { id: "n2", name: "Алексей", avatar: "/profiles/match-4.jpg" },
  { id: "n3", name: "Игорь", avatar: "/profiles/match-4.jpg" },
  { id: "n4", name: "Макс", avatar: "/profiles/max.webp", isNew: true },
];

export const conversations: Conversation[] = [
  {
    id: "c1",
    name: "Маэстро",
    nameDative: "Маэстро",
    avatar: "/profiles/maestro.png",
    photos: ["/profiles/maestro.png"],
    online: true,
    status: "В сети · отвечает быстро",
    verified: true,
    city: "Артемьевск",
    distance: "3 км",
    compatibility: 96,
    about: "Ищу достойную женщину, которая сможет украсить мою жизнь.",
    facts: [{ icon: MapPin, label: "Артемьевск · 8 км от вас" }],
    interests: [
      { label: "Кино", icon: Film },
      { label: "Рестораны", icon: Utensils },
      { label: "Книги", icon: BookIcon },
    ],
    matchedLabel: "Вы совпали сегодня",
    preview: {
      lastMessage: "Вы совпали сегодня",
      time: "только что",
      unread: 1,
    },
    suggestion: "Хорошо, собираюсь.",
    // Маэстро пишет размеренно и с паузами — как будто подбирает слова.
    typingProfile: {
      startDelay: 1800,
      msPerChar: 110,
      minDelay: 3800,
      maxDelay: 11000,
      imageDelay: 5400,
    },
    script: [
      {
        kind: "text",
        from: "them",
        text: "Какие фильмы из Новой волны тебе нравятся?",
      },
      {
        kind: "text",
        from: "me",
        text: "Люблю ту Новую волну, где есть вкус к жизни: красивые диалоги, красивые люди, лёгкая дерзость. Годар, конечно. Хотя хороший собеседник иногда интереснее любого кино...",
      },
      {
        kind: "text",
        from: "them",
        text: "Вы меня очаровали. Позвольте вас пригласить в ваш любимый «Купидон» через час",
      },
      {
        kind: "text",
        from: "me",
        text: "Почему именно «Купидон»?",
      },
    ],
  },

  {
    id: "c2",
    name: "Алексей",
    nameDative: "Алексею",
    age: 38,
    avatar: "/profiles/match-3.jpg",
    photos: ["/profiles/match-3.jpg"],
    online: false,
    status: "Был в сети 20 минут назад",
    verified: true,
    city: "Артемьевск",
    distance: "4,5 км",
    compatibility: 85,
    about: "",
    facts: [
      { icon: MapPin, label: "Артемьевск · 4,5 км от вас" },
      { icon: Ruler, label: "179 см" },
    ],
    interests: [
      { label: "Кино", icon: Film },
      { label: "Прогулки", icon: Footprints },
      { label: "Кофе", icon: Coffee },
    ],
    matchedLabel: "Вы совпали 3 дня назад",
    preview: {
      lastMessage: "Вы совпали 3 дня назад",
      time: "—",
    },
    suggestion: "Нужен фрагмент сценария с его сообщениями",
    // Алексей — спокойный собеседник среднего темпа.
    typingProfile: {
      startDelay: 1300,
      msPerChar: 80,
      minDelay: 2500,
      maxDelay: 7800,
      imageDelay: 4200,
    },
    script: [
      // TODO:
      // В приложенном фрагменте сценария нет пригодимой чат-переписки Рыжова,
      // которую можно вставить сюда прямыми цитатами без додумывания.
    ],
  },

  {
    id: "c3",
    name: "Игорь",
    nameDative: "Игорю",
    age: 36,
    avatar: "/profiles/match-4.jpg",
    photos: ["/profiles/match-4.jpg"],
    online: false,
    status: "В сети",
    verified: true,
    city: "Артемьевск",
    distance: "4 км",
    compatibility: 89,
    about: "Лёгкий на подъём, обаятельный, умею делать женщину счастливой. Жизнь слишком коротка для скучных людей.",
    facts: [
      { icon: Briefcase, label: "Предприниматель" },
      { icon: GraduationCap, label: "Высшее" },
      { icon: MapPin, label: "Артемьевск · 2 км от вас" },
      { icon: Ruler, label: "183 см" },
      { icon: Wine, label: "Шампанское по поводу и без" },
    ],
    interests: [
      { label: "Путешествия", icon: Plane },
      { label: "Рестораны", icon: Utensils },
      { label: "Театр", icon: Drama },
      { label: "Авто", icon: Car },
    ],
    matchedLabel: "Вы совпали неделю назад",
    preview: {
      lastMessage: "Вы совпали неделю назад",
      time: "—",
    },
    suggestion: "Привет!) Как дела?",
    // Игорь — пишет быстро, порывисто, почти не задумываясь.
    typingProfile: {
      startDelay: 600,
      msPerChar: 48,
      minDelay: 1400,
      maxDelay: 5200,
      imageDelay: 3000,
    },
    script: [
      // TODO:
      // В приложенном фрагменте сценария нет пригодимой чат-переписки Лёлика
      // прямыми цитатами. Текущие реплики нужно не выдумывать, а брать из сцен.
    ],
  },

  {
    id: "c4",
    name: "Влад",
    nameDative: "Владиславу",
    age: 29,
    avatar: "/profiles/match-5.jpg",
    photos: ["/profiles/match-5.jpg"],
    online: false,
    status: "В сети",
    verified: true,
    city: "Артемьевск",
    distance: "2,5 км",
    compatibility: 89,
    about: "",
    facts: [{ icon: MapPin, label: "Артемьевск · 2,5 км от вас" }],
    interests: [
      { label: "Путешествия", icon: Plane },
      { label: "Рестораны", icon: Utensils },
      { label: "Театр", icon: Drama },
    ],
    matchedLabel: "Вы совпали 2 недели назад",
    preview: {
      lastMessage: "Вы совпали недели назад",
      time: "—",
    },
    suggestion: "Привет!) Как дела?",
    // Влад — пишет неспешно, часто отвлекается.
    typingProfile: {
      startDelay: 2200,
      msPerChar: 120,
      minDelay: 4200,
      maxDelay: 12500,
      imageDelay: 5000,
    },
    script: [
      // TODO:
      // В приложенном фрагменте сценария нет пригодимой чат-переписки Лёлика
      // прямыми цитатами. Текущие реплики нужно не выдумывать, а брать из сцен.
    ],
  },

  {
    id: "c5",
    name: "Макс",
    nameDative: "Максу",
    age: 28,
    avatar: "/profiles/max.webp",
    photos: ["/profiles/max.webp"],
    online: true,
    status: "В сети",
    verified: true,
    city: "Артемьевск",
    distance: "5 км",
    compatibility: 92,
    about: "Люблю красивые места, лёгких людей и когда вечер складывается сам собой.",
    facts: [{ icon: MapPin, label: "Артемьевск · 5 км от вас" }],
    interests: [
      { label: "Рестораны", icon: Utensils },
      { label: "Гастрономия", icon: CookingPot },
      { label: "Музыка", icon: Music },
      { label: "Город", icon: Building2 },
    ],
    matchedLabel: "Вы совпали недавно",
    preview: {
      lastMessage: "Вы совпали недавно",
      time: "сегодня",
      unread: 1,
    },
    suggestion: "Я РАБОТАЮ В БИБЛИОТЕКЕ. СЕГОДНЯ У НАС ТЕАТРАЛИЗОВАННАЯ ПОСТАНОВКА. МОЖЕТ БЫТЬ ХОЧЕШЬ ПРИЙТИ?",
    // Макс пишет каждое слово капсом — чуть медленнее среднего, настойчиво.
    typingProfile: {
      startDelay: 1000,
      msPerChar: 70,
      minDelay: 2300,
      maxDelay: 7200,
      imageDelay: 4000,
    },
    script: [
      {
        kind: "text",
        from: "me",
        text: "МАКСИМ, ПРИВЕТ!",
      },
      {
        kind: "text",
        from: "me",
        text: "Я РАБОТАЮ В БИБЛИОТЕКЕ. СЕГОДНЯ У НАС ТЕАТРАЛИЗОВАННАЯ ПОСТАНОВКА. МОЖЕТ БЫТЬ ХОЧЕШЬ ПРИЙТИ?",
      },
      {
        kind: "text",
        from: "them",
        text: "ПРИГЛАШЕНИЕ ОТ ТАКОЙ КРАСИВОЙ ДЕВУШКИ - БОЛЬШАЯ ЧЕСТЬ",
      },
    ],
  },
];

/** "Heart" icon re-export so the chat view can decorate suggestion chips */
export { Heart as SuggestionIcon };
