"use client";

import { useRef } from "react";
import { useScrollProgress } from "@/lib/motion";

const text =
  "Ми зібрали в одному магазині засоби, якими працюють професійні детейлери, і ті, що потрібні щодня. Підкажемо засіб під ваш лак, салон і бюджет — і пояснимо, як ним працювати.";
const accent = new Set(["професійні", "детейлери,", "лак,", "салон", "бюджет"]);

/** Words light up one by one while the section is pinned; a light streak crosses the panel. */
export function Manifest() {
  const root = useRef<HTMLElement>(null);
  const words = text.split(" ");
  useScrollProgress(root, (p) => {
    const el = root.current;
    if (!el) return;
    el.style.setProperty("--p", p.toFixed(3));
    const lit = Math.round(p * 1.3 * words.length);
    el.querySelectorAll<HTMLElement>(".mw").forEach((w, i) => w.classList.toggle("is-lit", i < lit));
  });
  return (
    <section className="manifest" ref={root}>
      <div className="manifest-sticky">
        <div className="manifest-streak" aria-hidden="true" />
        <div className="container manifest-inner">
          <p className="eyebrow">Про AUTOHIM</p>
          <p className="manifest-text">
            {words.map((w, i) => (
              <span key={i} className={`mw ${accent.has(w) ? "is-accent" : ""}`}>
                {w}{" "}
              </span>
            ))}
          </p>
          <div className="manifest-facts">
            <span>Оригінальна продукція</span>
            <span>Консультація при виборі</span>
            <span>Доставка по всій Україні</span>
          </div>
        </div>
      </div>
    </section>
  );
}
