import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Building2,
  Car,
  Coffee,
  CookingPot,
  Drama,
  Film,
  Footprints,
  Gem,
  GraduationCap,
  Heart,
  MapPin,
  Mountain,
  Music,
  Plane,
  Ruler,
  Utensils,
  Wine,
  Wine as WineIcon,
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
  /** Full scripted dialog. Every scenario starts with `from: "them"`. */
  script: ScriptStep[];
};

/** Matches shown in the "Новые совпадения" strip */
export const newMatches = [
  { id: "n1", name: "Василий", avatar: "/profiles/match-1.jpg", isNew: true },
  { id: "n2", name: "Макс", avatar: "/profiles/match-4.jpg", isNew: true },
  { id: "n3", name: "Лёлик", avatar: "/profiles/match-5.jpg" },
];

export const conversations: Conversation[] = [
  {
    id: "c1",
    name: "Маэстро",
    nameDative: "Маэстро",
    avatar: "/profiles/maestro-main.jpg",
    photos: ["/profiles/maestro-main.jpg", "/profiles/maestro-2.jpg", "/profiles/maestro-3.jpg"],
    online: true,
    status: "В сети · отвечает быстро",
    verified: true,
    city: "Артемьевск",
    distance: "8 км",
    compatibility: 94,
    about:
      "Состоявшийся мужчина старой школы. Ценю красоту, вкус и уважение к статусу. Люблю, когда женщина умеет держать себя.",
    facts: [
      { icon: Briefcase, label: "Бизнесмен" },
      { icon: GraduationCap, label: "Высшее" },
      { icon: MapPin, label: "Артемьевск · 8 км от вас" },
      { icon: Ruler, label: "182 см" },
      { icon: Wine, label: "Любит хорошее вино" },
    ],
    interests: [
      { label: "Рестораны", icon: Utensils },
      { label: "Антиквариат", icon: Gem },
      { label: "Охота", icon: Mountain },
      { label: "Дорогие вина", icon: WineIcon },
    ],
    matchedLabel: "Вы совпали сегодня",
    preview: {
      lastMessage: "Добрый вечер, Татьяна.",
      time: "только что",
      unread: 1,
    },
    suggestion: "В восемь. И только лучшее вино.",
    script: [
      {
        kind: "text",
        from: "them",
        text: "Добрый вечер, Татьяна. Редко вижу здесь женщину с таким лицом и такой подачей.",
      },
      {
        kind: "text",
        from: "me",
        text: "Добрый. Я тоже редко вижу здесь мужчин, умеющих начинать разговор не банально.",
      },
      {
        kind: "text",
        from: "them",
        text: "Банальности оставим мальчикам. Я предпочитаю личные встречи.",
      },
      {
        kind: "text",
        from: "me",
        text: "Тогда не разочаруйте. Я люблю красивые места и плохое вино не пью.",
      },
      {
        kind: "text",
        from: "them",
        text: "Плохого рядом со мной не бывает. Закажете всё, что захотите.",
      },
      {
        kind: "text",
        from: "me",
        text: "Осторожно. Я могу захотеть очень многое.",
      },
      {
        kind: "text",
        from: "them",
        text: "Люблю женщин с аппетитом. Встретимся в «Купидоне» в восемь?",
      },
      {
        kind: "text",
        from: "me",
        text: "В восемь. И только лучшее вино.",
      },
    ],
  },

  {
    id: "c2",
    name: "Рыжов",
    nameDative: "Рыжову",
    age: 45,
    avatar: "/profiles/ryzhov-main.jpg",
    photos: ["/profiles/ryzhov-main.jpg", "/profiles/ryzhov-2.jpg"],
    online: false,
    status: "Был в сети 20 минут назад",
    verified: false,
    city: "Артемьевск",
    distance: "6 км",
    compatibility: 71,
    about: "Без цирка и лишнего пафоса. Люблю честность, спокойные разговоры и когда человек не играет чужую роль.",
    facts: [
      { icon: Briefcase, label: "Следователь" },
      { icon: GraduationCap, label: "Юридическое" },
      { icon: MapPin, label: "Артемьевск · 6 км от вас" },
      { icon: Ruler, label: "179 см" },
      { icon: Wine, label: "Иногда" },
    ],
    interests: [
      { label: "Кино", icon: Film },
      { label: "Прогулки", icon: Footprints },
      { label: "Кофе", icon: Coffee },
    ],
    matchedLabel: "Вы совпали 3 дня назад",
    preview: {
      lastMessage: "Цветы, между прочим, были хорошие.",
      time: "вчера",
    },
    suggestion: "Не сердитесь. Цветы и правда были хорошие.",
    script: [
      {
        kind: "text",
        from: "them",
        text: "Здравствуйте, Татьяна. Судя по фото, вы из тех женщин, с которыми скучно не бывает.",
      },
      {
        kind: "text",
        from: "me",
        text: "Смотря кто рядом. Некоторые и праздник умудряются испортить.",
      },
      {
        kind: "text",
        from: "them",
        text: "Я постараюсь не испортить. Могу пригласить на кофе. Без глупостей.",
      },
      {
        kind: "text",
        from: "me",
        text: "Кофе — это допрос или ухаживание?",
      },
      {
        kind: "text",
        from: "them",
        text: "Пока ухаживание. Но вопросы задавать люблю.",
      },
      {
        kind: "text",
        from: "me",
        text: "Тогда я приду в хорошем настроении и с плохими ответами.",
      },
      {
        kind: "text",
        from: "them",
        text: "Договорились. Только не исчезайте после букета.",
      },
      {
        kind: "text",
        from: "me",
        text: "Не сердитесь. Цветы и правда были хорошие.",
      },
    ],
  },

  {
    id: "c3",
    name: "Лёлик",
    nameDative: "Лёлику",
    age: 35,
    avatar: "/profiles/lelik-main.jpg",
    photos: ["/profiles/lelik-main.jpg", "/profiles/lelik-2.jpg", "/profiles/lelik-3.jpg"],
    online: true,
    status: "В сети",
    verified: true,
    city: "Артемьевск",
    distance: "4 км",
    compatibility: 89,
    about: "Лёгкий на подъём, обаятельный, умею делать женщину счастливой. Жизнь слишком коротка для скучных людей.",
    facts: [
      { icon: Briefcase, label: "Предприниматель" },
      { icon: GraduationCap, label: "Высшее" },
      { icon: MapPin, label: "Артемьевск · 4 км от вас" },
      { icon: Ruler, label: "181 см" },
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
      lastMessage: "С тобой хочется говорить до утра.",
      time: "2 часа назад",
    },
    suggestion: "До утра — дорого. Начнём с ужина.",
    script: [
      {
        kind: "text",
        from: "them",
        text: "Ты из тех женщин, которым невозможно не написать.",
      },
      {
        kind: "text",
        from: "me",
        text: "А ты из тех мужчин, которые это пишут всем подряд?",
      },
      {
        kind: "text",
        from: "them",
        text: "Нет. Только тем, кто действительно цепляет.",
      },
      {
        kind: "text",
        from: "me",
        text: "Хороший ответ. Почти убедил.",
      },
      {
        kind: "text",
        from: "them",
        text: "Давай я доубеждаю тебя ужином. Ты любишь красивые места?",
      },
      {
        kind: "text",
        from: "me",
        text: "Люблю. Ещё больше люблю мужчин, которые умеют за них платить.",
      },
      {
        kind: "text",
        from: "them",
        text: "С этим проблем не будет. С тобой хочется говорить до утра.",
      },
      {
        kind: "text",
        from: "me",
        text: "До утра — дорого. Начнём с ужина.",
      },
    ],
  },

  {
    id: "c4",
    name: "Макс",
    nameDative: "Максу",
    age: 28,
    avatar: "/profiles/max.webp",
    photos: ["/profiles/max.webp", "/profiles/max-2.jpg"],
    online: true,
    status: "В сети",
    verified: true,
    city: "Артемьевск",
    distance: "5 км",
    compatibility: 84,
    about: "Ресторатор. Люблю красивые места, лёгких людей и когда вечер складывается сам собой.",
    facts: [
      { icon: Briefcase, label: "Владелец ресторана «Купидон»" },
      { icon: GraduationCap, label: "Высшее" },
      { icon: MapPin, label: "Артемьевск · 5 км от вас" },
      { icon: Ruler, label: "186 см" },
      { icon: Wine, label: "Разбирается в винах" },
    ],
    interests: [
      { label: "Рестораны", icon: Utensils },
      { label: "Гастрономия", icon: CookingPot },
      { label: "Музыка", icon: Music },
      { label: "Город", icon: Building2 },
    ],
    matchedLabel: "Вы совпали недавно",
    preview: {
      lastMessage: "Заглядывайте в «Купидон».",
      time: "сегодня",
    },
    suggestion: "Если там лучший столик — могу подумать.",
    script: [
      {
        kind: "text",
        from: "them",
        text: "Привет. У тебя профиль такой, будто ты умеешь испортить любой мужчине спокойную жизнь.",
      },
      {
        kind: "text",
        from: "me",
        text: "Только если мужчина сам напрашивается.",
      },
      {
        kind: "text",
        from: "them",
        text: "Рискну. Я Максим. У меня ресторан, хороший вкус и свободный вечер.",
      },
      {
        kind: "text",
        from: "me",
        text: "Скромность явно не твоё главное достоинство.",
      },
      {
        kind: "text",
        from: "them",
        text: "Зато честность — вполне. Заглядывай в «Купидон», проверишь всё сама.",
      },
      {
        kind: "text",
        from: "me",
        text: "А если мне не понравится?",
      },
      {
        kind: "text",
        from: "them",
        text: "Тогда хотя бы скажешь это красиво. Но обычно мне дают второй шанс.",
      },
      {
        kind: "text",
        from: "me",
        text: "Если там лучший столик — могу подумать.",
      },
    ],
  },
];

/** "Heart" icon re-export so the chat view can decorate suggestion chips */
export { Heart as SuggestionIcon };
