import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyBox, Stage } from "@/components/Buy";
import { CallbackButton } from "@/components/Callback";
import { Icon } from "@/components/Icons";
import { ProductCard } from "@/components/ProductCard";
import { Crumbs } from "@/components/Shared";
import { getBrand, getProduct, getSection, products, related, subName, toCard } from "@/lib/catalog";
import { price } from "@/lib/format";
import { delivery, payment, site } from "@/lib/site";

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const text = p.desc.find((d) => d[0] === "p")?.[1];
  return {
    title: p.name,
    description: `${p.name}${p.price ? ` — ${price(p.price)}` : ""}. ${text ? text.slice(0, 120) + "… " : ""}Купити в AUTOHIM (Тернопіль) з доставкою по Україні.`,
    alternates: { canonical: `/tovar/${p.slug}` },
    openGraph: p.img ? { images: [`/images/p/${p.id}.webp`] } : undefined,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const c = toCard(p);
  const sec = getSection(p.section);
  const brand = p.brand ? getBrand(p.brand) : undefined;
  const sub = subName(p.section, p.sub);
  const more = related(p, 8);
  const sameBrand = brand ? products.filter((q) => q.brand === brand.id && q.id !== p.id && q.section !== p.section).slice(0, 4).map(toCard) : [];

  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: String(p.id),
    image: p.img ? `${site.url}/images/p/${p.id}.webp` : undefined,
    brand: brand ? { "@type": "Brand", name: brand.name } : undefined,
    category: sec?.name,
    offers: p.price ? { "@type": "Offer", price: p.price, priceCurrency: "UAH", url: `${site.url}/tovar/${p.slug}`, seller: { "@type": "Organization", name: "AUTOHIM" } } : undefined,
  };

  const crumbs = [{ href: "/katalog", label: "Каталог" }];
  if (sec) crumbs.push({ href: `/katalog/${sec.id}`, label: sec.name });
  if (sec && p.sub && sub) crumbs.push({ href: `/katalog/${sec.id}?sub=${p.sub}`, label: sub });

  return (
    <>
      <section className="product">
        <div className="product-glow" aria-hidden="true" />
        <div className="container">
          <Crumbs items={[...crumbs, { href: `/tovar/${p.slug}`, label: p.name }]} />
          <div className="product-grid">
            <div className="product-media fade-up">
              <Stage c={c} />
            </div>
            <div className="product-info">
              <div className="product-tags fade-up">
                {brand && (
                  <Link href={`/brendy/${brand.id}`} className="product-brand">
                    {brand.name}
                  </Link>
                )}
                {p.popular && <span className="badge badge-hot">Хіт продажів</span>}
              </div>
              <h1 className="product-title fade-up" style={{ animationDelay: ".06s" }}>
                {p.name}
              </h1>
              <div className="fade-up" style={{ animationDelay: ".12s" }}>
                <BuyBox c={c} />
              </div>
              <ul className="product-perks fade-up" style={{ animationDelay: ".18s" }}>
                <li>
                  <Icon name="truck" size={20} />
                  <span>
                    <b>Нова пошта по Україні</b> у відділення, поштомат або кур’єром
                  </span>
                </li>
                <li>
                  <Icon name="pin" size={20} />
                  <span>
                    <b>Самовивіз у Тернополі</b> {site.address}, {site.hours.toLowerCase()}
                  </span>
                </li>
                <li>
                  <Icon name="card" size={20} />
                  <span>
                    <b>Оплата</b> при отриманні або карткою онлайн
                  </span>
                </li>
              </ul>
              <div className="product-help fade-up" style={{ animationDelay: ".24s" }}>
                <span>Не впевнені, що підійде?</span>
                <CallbackButton className="link-btn" product={undefined}>
                  Запитайте консультанта
                </CallbackButton>
                <a href={site.phoneHref}>{site.phone}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight product-details">
        <div className="container product-details-grid">
          <div className="product-desc">
            <h2 className="h3">Опис</h2>
            {p.desc.length ? (
              <div className="rich">
                {groupDesc(p.desc).map((b, i) =>
                  b.kind === "ul" ? (
                    <ul key={i}>
                      {b.items.map((t, j) => (
                        <li key={j}>{t}</li>
                      ))}
                    </ul>
                  ) : b.kind === "h" ? (
                    <h3 key={i}>{b.items[0]}</h3>
                  ) : (
                    <p key={i}>{b.items[0]}</p>
                  ),
                )}
              </div>
            ) : (
              <p className="muted">
                Детальний опис, спосіб нанесення та сумісність уточнюйте в консультанта — підкажемо, як правильно використовувати засіб саме на вашому авто.
              </p>
            )}
            <dl className="specs">
              {brand && (
                <div>
                  <dt>Бренд</dt>
                  <dd>
                    <Link href={`/brendy/${brand.id}`}>{brand.name}</Link>
                  </dd>
                </div>
              )}
              {sec && (
                <div>
                  <dt>Розділ</dt>
                  <dd>
                    <Link href={`/katalog/${sec.id}`}>{sec.name}</Link>
                    {sub && p.sub && (
                      <>
                        {" · "}
                        <Link href={`/katalog/${sec.id}?sub=${p.sub}`}>{sub}</Link>
                      </>
                    )}
                  </dd>
                </div>
              )}
              {p.vol && (
                <div>
                  <dt>Об’єм / вага</dt>
                  <dd>{p.vol}</dd>
                </div>
              )}
              <div>
                <dt>Код товару</dt>
                <dd>{p.id}</dd>
              </div>
            </dl>
          </div>
          <aside className="product-ship">
            <h2 className="h3">Доставка</h2>
            <ul>
              {delivery.map((d) => (
                <li key={d.id}>
                  <b>{d.title}</b>
                  <span>{d.note}</span>
                </li>
              ))}
            </ul>
            <h2 className="h3">Оплата</h2>
            <ul>
              {payment.map((d) => (
                <li key={d.id}>
                  <b>{d.title}</b>
                  <span>{d.note}</span>
                </li>
              ))}
            </ul>
            <Link href="/dostavka" className="link-arrow">
              Детальніше <Icon name="arrow" size={16} />
            </Link>
          </aside>
        </div>
      </section>

      {more.length > 0 && (
        <section className="section-tight">
          <div className="container">
            <div className="section-head">
              <h2 className="display-sm">Схожі товари</h2>
              {sec && (
                <Link href={`/katalog/${sec.id}${p.sub ? `?sub=${p.sub}` : ""}`} className="link-arrow">
                  Усі в розділі <Icon name="arrow" size={18} />
                </Link>
              )}
            </div>
            <div className="grid grid-scroll">
              {more.map((x) => (
                <div className="grid-cell" key={x.id}>
                  <ProductCard c={x} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {sameBrand.length > 0 && brand && (
        <section className="section-tight">
          <div className="container">
            <div className="section-head">
              <h2 className="display-sm">Ще від {brand.name}</h2>
              <Link href={`/brendy/${brand.id}`} className="link-arrow">
                Усі товари бренду <Icon name="arrow" size={18} />
              </Link>
            </div>
            <div className="grid grid-scroll">
              {sameBrand.map((x) => (
                <div className="grid-cell" key={x.id}>
                  <ProductCard c={x} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}

/** Consecutive list items become one <ul>. */
function groupDesc(desc: [string, string][]) {
  const out: { kind: "p" | "h" | "ul"; items: string[] }[] = [];
  for (const [k, t] of desc) {
    if (k === "li") {
      const last = out[out.length - 1];
      if (last?.kind === "ul") last.items.push(t);
      else out.push({ kind: "ul", items: [t] });
    } else out.push({ kind: k === "h" ? "h" : "p", items: [t] });
  }
  return out;
}
