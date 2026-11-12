"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { reducedMotion, useScrollProgress } from "@/lib/motion";
import { openSearch } from "../Header";
import { Icon } from "../Icons";

const lines: { w: string; em?: boolean }[][] = [[{ w: "Блиск," }, { w: "який" }], [{ w: "видно" }, { w: "здалеку", em: true }]];
const chips = [
  { href: "/katalog/dlya-kuzova?sub=sampuni", label: "Шампуні" },
  { href: "/katalog/dlya-kuzova?sub=voski", label: "Воски" },
  { href: "/katalog/dlya-kuzova?sub=poliruvannya", label: "Полірування" },
  { href: "/katalog/dlya-skla", label: "Антидощ" },
  { href: "/katalog/dlya-salonu?sub=aromatizatori", label: "Ароматизатори" },
  { href: "/katalog/avtopryladdia?sub=mikrofibri", label: "Мікрофібри" },
];

export function Hero({ total, brands }: { total: number; brands: number }) {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useScrollProgress(root, (p) => root.current?.style.setProperty("--p", p.toFixed(3)));

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (reducedMotion()) {
      v.pause();
      return;
    }
    const ready = () => v.classList.add("is-ready");
    if (v.readyState >= 3) ready();
    v.addEventListener("canplay", ready);
    let onScreen = true;
    const sync = () => (onScreen && !document.hidden ? v.play().catch(() => {}) : v.pause());
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      sync();
    });
    io.observe(v);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      v.removeEventListener("canplay", ready);
      document.removeEventListener("visibilitychange", sync);
      io.disconnect();
    };
  }, []);

  let w = 0;
  return (
    <section className="hero" ref={root}>
      <div className="hero-sticky">
        <div className="hero-media">
          <video ref={video} className="hero-video" autoPlay muted loop playsInline preload="auto" poster="/images/hero-poster.webp" aria-hidden="true">
            <source src="/video/hero-mobile.mp4" media="(max-width: 700px) and (orientation: portrait)" type="video/mp4" />
            <source src="/video/hero.mp4" type="video/mp4" />
          </video>
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-scan" aria-hidden="true" />
        </div>

        <div className="container hero-content">
          <p className="hero-badge fade-up" style={{ animationDelay: "var(--intro-d, 0s)" }}>
            <span className="dot" /> Магазин автохімії · Тернопіль · доставка по Україні
          </p>
          <h1 className="hero-title">
            {lines.map((line, i) => (
              <span className="hero-line" key={i}>
                {line.map((x) => (
                  <span className={`word ${x.em ? "is-em" : ""}`} key={x.w}>
                    <span style={{ ["--d" as string]: `${0.05 + w++ * 0.09}s` }}>{x.w}</span>
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <div className="hero-bottom">
            <div className="hero-left fade-up" style={{ animationDelay: "calc(var(--intro-d, 0s) + .45s)" }}>
              <p className="hero-lead">
                Професійна автохімія та автокосметика від K2, Koch-Chemie, GYEON, SOFT99 і SONAX. Для мийки, полірування, захисту кузова й догляду за салоном.
              </p>
              <button type="button" className="hero-search" onClick={() => openSearch()} data-cursor="Пошук">
                <Icon name="search" size={22} />
                <span>Що шукаємо? Напр.: «віск», «антидощ», «MOTUL 5W-30»</span>
                <span className="hero-search-go">
                  <Icon name="arrow" size={20} />
                </span>
              </button>
              <div className="hero-chips">
                {chips.map((c) => (
                  <Link key={c.href} href={c.href} className="chip chip-glass">
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="hero-stats fade-up" style={{ animationDelay: "calc(var(--intro-d, 0s) + .6s)" }}>
              <div>
                <b data-count={total}>{total}</b>
                <span>товарів у каталозі</span>
              </div>
              <div>
                <b data-count={brands} data-suffix="+">{brands}+</b>
                <span>брендів</span>
              </div>
              <div>
                <b>09–19</b>
                <span>щодня без вихідних</span>
              </div>
            </div>
          </div>
        </div>

        <a href="#sections" className="hero-scroll" aria-label="Прокрутити вниз">
          <i />
        </a>
      </div>
    </section>
  );
}
