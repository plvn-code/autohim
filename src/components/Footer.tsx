import Link from "next/link";
import { featuredBrands, sections } from "@/lib/catalog";
import { nav, site } from "@/lib/site";
import { CallbackButton } from "./Callback";
import { Icon, SocialIcon } from "./Icons";
import { Logo } from "./Logo";
import { MadeBy } from "./MadeBy";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-glow" aria-hidden="true" />
      <div className="container">
        <div className="footer-cta" data-reveal>
          <div>
            <p className="eyebrow">Не знаєте, що обрати?</p>
            <h2 className="display-md">
              Підберемо засоби <em>під ваше авто</em>
            </h2>
          </div>
          <div className="footer-cta-actions">
            <a href={site.phoneHref} className="btn btn-lg btn-glow">
              <Icon name="phone" size={18} /> {site.phone}
            </a>
            <CallbackButton className="btn btn-lg btn-outline">Передзвоніть мені</CallbackButton>
          </div>
        </div>

        <div className="footer-grid">
          <div className="footer-brand">
            <Logo size={46} />
            <p>Автохімія та автокосметика для тих, хто любить своє авто. Магазин у Тернополі й доставка по всій Україні.</p>
            <div className="socials">
              {site.socials.map((s) => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.name} ${s.handle}`}>
                  <SocialIcon name={s.name} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="footer-h">Каталог</p>
            <ul>
              {sections.slice(0, 8).map((s) => (
                <li key={s.id}>
                  <Link href={`/katalog/${s.id}`}>{s.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="footer-h">Бренди</p>
            <ul>
              {featuredBrands.map((b) => (
                <li key={b.id}>
                  <Link href={`/brendy/${b.id}`}>{b.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="footer-h">Покупцям</p>
            <ul>
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href}>{n.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/koshyk">Кошик</Link>
              </li>
            </ul>
          </div>
          <div className="footer-contacts">
            <p className="footer-h">Магазин</p>
            <a href={site.mapHref} target="_blank" rel="noopener noreferrer">
              <Icon name="pin" size={16} /> {site.city}, {site.address}
            </a>
            <span>
              <Icon name="clock" size={16} /> {site.hours}
            </span>
            <a href={site.phoneHref}>
              <Icon name="phone" size={16} /> {site.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="footer-word" aria-hidden="true">
        AUTO<b>HIM</b>
      </div>

      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} AUTOHIM · {site.legal}
        </span>
        <MadeBy />
      </div>
    </footer>
  );
}
