"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { type Card, img, price } from "@/lib/format";
import { useScrollProgress } from "@/lib/motion";
import { Icon } from "../Icons";
import { AddToCart } from "../ProductCard";

export type Step = { title: string; text: string; href: string; cards: Card[] };

/**
 * «Ритуал догляду»: the section pins while the six steps scroll by; the bottles on the right
 * change with the active step. Phones get the steps as a plain list, each with its products.
 */
export function Ritual({ steps }: { steps: Step[] }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useScrollProgress(root, (p) => {
    root.current?.style.setProperty("--p", p.toFixed(3));
    setActive(Math.min(steps.length - 1, Math.floor(p * steps.length * 0.999)));
  });
  const cur = steps[active];

  return (
    <section className="ritual" ref={root} style={{ ["--n" as string]: steps.length }}>
      <div className="ritual-sticky">
        <div className="container ritual-grid">
          <div className="ritual-left">
            <p className="eyebrow">Ритуал догляду</p>
            <h2 className="display-md">
              Шість кроків до <em>ідеального</em> авто
            </h2>
            <ol className="ritual-steps">
              {steps.map((s, i) => (
                <li key={s.title} className={i === active ? "is-on" : i < active ? "is-done" : ""}>
                  <button
                    type="button"
                    onClick={() => {
                      const el = root.current;
                      if (!el) return;
                      const top = el.getBoundingClientRect().top + window.scrollY;
                      const span = el.offsetHeight - window.innerHeight;
                      window.scrollTo({ top: top + span * ((i + 0.5) / steps.length), behavior: "smooth" });
                    }}
                  >
                    <span className="ritual-num">0{i + 1}</span>
                    <span className="ritual-title">{s.title}</span>
                  </button>
                  <p className="ritual-text">{s.text}</p>
                </li>
              ))}
            </ol>
            <div className="ritual-bar" aria-hidden="true">
              <span />
            </div>
          </div>

          <div className="ritual-stage" aria-live="polite">
            <div className="ritual-ring" aria-hidden="true" />
            {steps.map((s, i) => (
              <div key={s.title} className={`ritual-set ${i === active ? "is-on" : ""}`} aria-hidden={i !== active}>
                {s.cards.slice(0, 3).map((c, j) => (
                  <Link key={c.id} href={`/tovar/${c.s}`} className="ritual-bottle" style={{ ["--j" as string]: j }} tabIndex={i === active ? 0 : -1} data-cursor="Детальніше">
                    <img src={img(c.id)} alt={c.n} loading="lazy" />
                  </Link>
                ))}
              </div>
            ))}
            <div className="ritual-picks" key={active}>
              {cur.cards.slice(0, 3).map((c, j) => (
                <div className="ritual-pick" key={c.id} style={{ ["--j" as string]: j }}>
                  <Link href={`/tovar/${c.s}`}>
                    <small>{c.bn}</small>
                    {c.n}
                  </Link>
                  <span>{price(c.p)}</span>
                  <AddToCart c={c} label="" />
                </div>
              ))}
              <Link href={cur.href} className="link-arrow">
                Більше для кроку «{cur.title.toLowerCase()}» <Icon name="arrow" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container ritual-mobile">
        {steps.map((s, i) => (
          <div key={s.title} className="ritual-m" data-reveal>
            <span className="ritual-num">0{i + 1}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
            <div className="ritual-m-row">
              {s.cards.slice(0, 3).map((c) => (
                <Link key={c.id} href={`/tovar/${c.s}`} className="ritual-m-card">
                  <img src={img(c.id, true)} alt="" loading="lazy" />
                  <span>{c.n}</span>
                  <b>{price(c.p)}</b>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
