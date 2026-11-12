/** Contacts and facts from the old shop autohim.ps.me (settings + contacts block). */
export const site = {
  name: "AUTOHIM",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://autohim.vercel.app",
  description:
    "AUTOHIM — магазин автохімії та автокосметики в Тернополі. Шампуні, поліролі, кераміка, догляд за салоном і склом, оливи та аксесуари від K2, Koch-Chemie, GYEON, SOFT99, SONAX і MOTUL. Доставка по Україні.",
  phone: "+380 73 429 26 19",
  phoneHref: "tel:+380734292619",
  city: "Тернопіль",
  address: "вул. Пантелеймона Куліша, 2",
  hours: "Щодня 09:00–19:00",
  open: 9,
  close: 19,
  geo: { lat: 49.568038, lng: 25.641162 },
  mapHref: "https://www.google.com/maps/search/?api=1&query=49.568038,25.641162",
  legal: "ФОП Погорілець Василь Михайлович",
  socials: [
    { name: "Instagram", short: "IG", href: "https://www.instagram.com/autohim_ter/", handle: "@autohim_ter" },
    { name: "Telegram", short: "TG", href: "https://t.me/autohim_ter", handle: "@autohim_ter" },
    { name: "TikTok", short: "TT", href: "https://www.tiktok.com/@autohim_ter", handle: "@autohim_ter" },
  ],
};

export const nav = [
  { href: "/katalog", label: "Каталог" },
  { href: "/brendy", label: "Бренди" },
  { href: "/dostavka", label: "Доставка й оплата" },
  { href: "/kontakty", label: "Контакти" },
];

/** Shown on product pages and in the cart. */
export const delivery = [
  { id: "np", title: "Нова пошта", note: "У відділення, поштомат або кур’єром по всій Україні за тарифами перевізника." },
  { id: "pickup", title: "Самовивіз", note: "Тернопіль, вул. Пантелеймона Куліша, 2. Щодня 09:00–19:00." },
  { id: "courier", title: "Кур’єр по Тернополю", note: "Привеземо в зручний час — менеджер погодить деталі телефоном." },
] as const;

export const payment = [
  { id: "cod", title: "При отриманні", note: "Готівкою або карткою в магазині чи на пошті." },
  { id: "card", title: "Карткою онлайн", note: "Менеджер надішле посилання на оплату після підтвердження." },
] as const;
