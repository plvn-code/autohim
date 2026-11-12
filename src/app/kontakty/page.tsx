import type { Metadata } from "next";
import { CallbackForm } from "@/components/Callback";
import { Icon, SocialIcon } from "@/components/Icons";
import { PageHero } from "@/components/Shared";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Контакти магазину в Тернополі",
  description: `Магазин автохімії AUTOHIM: ${site.city}, ${site.address}. ${site.hours}. Телефон ${site.phone}.`,
  alternates: { canonical: "/kontakty" },
};

export default function Contacts() {
  return (
    <>
      <PageHero eyebrow="Контакти" title={<>Магазин <em>у Тернополі</em></>} lead="Приїжджайте подивитися, понюхати ароматизатори й порадитися — або телефонуйте, підкажемо дистанційно." crumbs={[{ href: "/kontakty", label: "Контакти" }]} />
      <section className="section-tight">
        <div className="container contacts">
          <div className="contacts-card" data-reveal>
            <ul className="store-facts">
              <li>
                <Icon name="pin" size={22} />
                <span>
                  <small>Адреса</small>
                  {site.city}, {site.address}
                </span>
              </li>
              <li>
                <Icon name="clock" size={22} />
                <span>
                  <small>Графік роботи</small>
                  {site.hours}
                </span>
              </li>
              <li>
                <Icon name="phone" size={22} />
                <span>
                  <small>Телефон</small>
                  <a href={site.phoneHref}>{site.phone}</a>
                </span>
              </li>
            </ul>
            <div className="band-actions">
              <a href={site.mapHref} className="btn btn-lg btn-glow" target="_blank" rel="noopener noreferrer">
                Прокласти маршрут <Icon name="arrowUpRight" size={18} />
              </a>
              <a href={site.phoneHref} className="btn btn-lg btn-outline">
                Зателефонувати
              </a>
            </div>
            <div className="socials socials-lg">
              {site.socials.map((s) => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer">
                  <SocialIcon name={s.name} size={20} /> {s.handle}
                </a>
              ))}
            </div>
          </div>

          <a href={site.mapHref} target="_blank" rel="noopener noreferrer" className="map" data-reveal data-cursor="Відкрити карту" aria-label="Відкрити магазин на Google Maps">
            <svg viewBox="0 0 600 420" className="map-svg" aria-hidden="true">
              <defs>
                <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0" stopColor="#2a7fff" stopOpacity=".55" />
                  <stop offset="1" stopColor="#2a7fff" stopOpacity="0" />
                </radialGradient>
              </defs>
              <g className="map-roads">
                <path d="M-20 120 C 120 140, 220 90, 330 130 S 520 170, 640 120" />
                <path d="M-20 300 C 140 280, 260 330, 380 300 S 560 260, 640 290" />
                <path d="M160 -20 C 170 120, 140 260, 190 440" />
                <path d="M420 -20 C 400 100, 450 240, 410 440" />
                <path d="M-20 210 L 640 230" className="major" />
                <path d="M300 -20 C 290 140, 320 260, 300 440" className="major" />
                <path d="M40 40 L 260 380 M 560 30 L 360 400" />
              </g>
              <circle cx="300" cy="220" r="120" fill="url(#mapGlow)" className="map-pulse" />
              <circle cx="300" cy="220" r="9" fill="#6fd3ff" />
              <circle cx="300" cy="220" r="18" fill="none" stroke="#6fd3ff" strokeOpacity=".5" />
            </svg>
            <span className="map-label">
              <b>AUTOHIM</b>
              {site.address}
            </span>
            <span className="map-cta">
              Google Maps <Icon name="arrowUpRight" size={16} />
            </span>
          </a>

          <div className="contacts-form" data-reveal>
            <p className="eyebrow">Консультація</p>
            <h2 className="display-sm">Підкажемо, що обрати</h2>
            <CallbackForm topic />
          </div>
        </div>
      </section>
    </>
  );
}
