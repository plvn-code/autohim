import Link from "next/link";
import { goods } from "@/lib/format";
import { Icon } from "../Icons";

type B = { id: string; name: string; origin: string; line: string; art: number; count: number };

/** Brand wall: a big wordmark per brand; on hover its signature product rises out of the card. */
export function Brands({ brands }: { brands: B[] }) {
  return (
    <div className="brands">
      {brands.map((b, i) => (
        <Link key={b.id} href={`/brendy/${b.id}`} className="brand-card spot" data-reveal style={{ ["--d" as string]: `${(i % 4) * 0.07}s` }} data-cursor={b.name}>
          <span className="brand-origin">{b.origin}</span>
          <span className="brand-name">{b.name}</span>
          <span className="brand-line">{b.line}</span>
          <span className="brand-count">
            {goods(b.count)} <Icon name="arrowUpRight" size={16} />
          </span>
          <img className="brand-art" src={`/images/p/${b.art}.webp`} alt="" loading="lazy" aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}
