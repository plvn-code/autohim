import Link from "next/link";
import type { Section } from "@/lib/catalog";
import { goods } from "@/lib/format";
import { Icon } from "../Icons";

/** Bento of the main sections. Each tile stacks 1–3 cut-out bottles that rise and spread on hover. */
const TILES: { id: string; art: number[]; size?: "xl" | "wide" }[] = [
  { id: "dlya-kuzova", art: [960, 1019, 830], size: "xl" },
  { id: "dlya-salonu", art: [261, 760, 173], size: "wide" },
  { id: "dlya-skla", art: [54, 218] },
  { id: "olyvy", art: [1184, 329] },
  { id: "avtopryladdia", art: [185] },
  { id: "tekhnichni-ridyny", art: [125, 121] },
  { id: "zyma", art: [165] },
  { id: "orhanaizery", art: [1220] },
];

export function Sections({ sections }: { sections: Section[] }) {
  return (
    <div className="bento">
      {TILES.map((t, i) => {
        const s = sections.find((x) => x.id === t.id);
        if (!s) return null;
        return (
          <Link key={t.id} href={`/katalog/${s.id}`} className={`tile spot ${t.size ? `tile-${t.size}` : ""}`} data-reveal style={{ ["--d" as string]: `${i * 0.06}s` }} data-cursor="Відкрити">
            <span className="tile-art" aria-hidden="true" data-n={t.art.length}>
              {t.art.map((id, j) => (
                <img key={id} src={`/images/p/${id}.webp`} alt="" loading="lazy" style={{ ["--j" as string]: j }} />
              ))}
            </span>
            <span className="tile-text">
              <small>{goods(s.count)}</small>
              <b>{s.name}</b>
              {t.size && <span className="tile-lead">{s.lead}</span>}
            </span>
            <span className="tile-go">
              <Icon name="arrowUpRight" size={20} />
            </span>
          </Link>
        );
      })}
    </div>
  );
}
