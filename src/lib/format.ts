/** Client-safe helpers (no catalogue import). */

export type Card = {
  id: number;
  s: string; // slug
  n: string; // name
  p: number; // price, 0 = on request
  b: string | null; // brand id
  bn: string | null; // brand name
  sec: string;
  sub: string | null;
  v: string | null; // volume label
  img: boolean;
  cut: boolean;
  hot?: boolean;
};

export const price = (n: number) => (n ? `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₴` : "Ціна за запитом");

export const img = (id: number, small = false) => `/images/p/${id}${small ? "s" : ""}.webp`;

export function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

export const goods = (n: number) => `${n} ${plural(n, "товар", "товари", "товарів")}`;

/** Lower-cased, Latin/Cyrillic look-alikes folded, so «к2», «K2» and «k2» match. */
export function fold(s: string) {
  return s
    .toLowerCase()
    .replace(/[ʼ’'`"«»]/g, "")
    .replace(/[кk]2/g, "k2")
    .replace(/ё/g, "е")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/** Every query word must appear in the haystack; earlier/brand hits rank higher. */
export function searchCards(cards: Card[], q: string, limit = 60) {
  const words = fold(q).split(" ").filter(Boolean);
  if (!words.length) return [];
  const out: { c: Card; score: number }[] = [];
  for (const c of cards) {
    const hay = fold(`${c.bn ?? ""} ${c.n}`);
    let score = 0;
    let ok = true;
    for (const w of words) {
      const i = hay.indexOf(w);
      if (i < 0) {
        ok = false;
        break;
      }
      score += i === 0 || hay[i - 1] === " " ? 3 : 1;
      score -= i / 400;
    }
    if (ok) out.push({ c, score: score + (c.hot ? 0.5 : 0) + (c.img ? 0.3 : 0) });
  }
  return out
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.c);
}
