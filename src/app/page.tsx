import Link from "next/link";
import { CallbackButton } from "@/components/Callback";
import { Brands } from "@/components/home/Brands";
import { Hero } from "@/components/home/Hero";
import { Manifest } from "@/components/home/Manifest";
import { Rail } from "@/components/home/Rail";
import { Ritual } from "@/components/home/Ritual";
import { Sections } from "@/components/home/Sections";
import { BandVideo } from "@/components/home/VideoBand";
import { Icon, SocialIcon } from "@/components/Icons";
import { ProductCard } from "@/components/ProductCard";
import { Marquee, SectionHead } from "@/components/Shared";
import { brands, cards, featuredBrands, products, sections, toCard } from "@/lib/catalog";
import { site } from "@/lib/site";

const HITS = [1019, 1228, 1225, 218, 54, 1226, 216, 1220, 185, 9, 1223, 234, 816, 1059];
const STEPS = [
  { title: "Мийка", text: "Активна піна знімає основний бруд без контакту, шампунь — делікатно доводить кузов до чистоти.", href: "/katalog/dlya-kuzova?sub=sampuni", ids: [67, 960, 414] },
  { title: "Очищення", text: "Бітум, смоли, гальмівний пил на дисках і водний камінь — те, що шампунь не бере.", href: "/katalog/dlya-kuzova?sub=ocishhuvaci", ids: [21, 266, 1091] },
  { title: "Полірування", text: "Пасти різної абразивності прибирають павутинку й голограми, повертають глибину кольору.", href: "/katalog/dlya-kuzova?sub=poliruvannya", ids: [268, 31, 798] },
  { title: "Захист", text: "Віск, силант або кварцова кераміка: гідрофоб, блиск і захист лаку на місяці.", href: "/katalog/dlya-kuzova?sub=voski", ids: [1019, 814, 963] },
  { title: "Салон", text: "Очищення й живлення шкіри, догляд за пластиком і текстилем — без жирного блиску.", href: "/katalog/dlya-salonu", ids: [760, 261, 173] },
  { title: "Скло й аромат", text: "Антидощ для чистого огляду в будь-яку погоду та фінальний штрих — аромат.", href: "/katalog/dlya-skla", ids: [218, 54, 1258] },
];
const PROTECT = [1019, 1122, 1234, 1241];
const WINTER = [129, 165, 292, 194];

export default function Home() {
  const brandCards = featuredBrands.map((b) => ({ ...b, count: brands.find((x) => x.id === b.id)?.count ?? 0 }));
  const own = products.filter((p) => p.brand === "autohim").map(toCard).slice(0, 5);
  const gift = products.filter((p) => p.section === "sertyfikaty").map(toCard);

  return (
    <>
      <Hero total={products.length} brands={brands.length} />

      <Marquee className="marquee-brands" items={["GYEON", "KOCH-CHEMIE", "SOFT99", "SONAX", "K2", "MOTUL", "WOLF", "RITUALS", "TURTLE WAX", "MÖLDER", "MOTIP", "PHILIPS"]} />

      <section className="section" id="sections">
        <div className="container">
          <SectionHead eyebrow="Каталог" title={<>Усе для догляду — <em>в одному місці</em></>} link={{ href: "/katalog", label: "Весь каталог" }} />
          <Sections sections={sections} />
        </div>
      </section>

      <Manifest />

      <Rail cards={cards(HITS)} eyebrow="Обирають найчастіше" title={<>Хіти <em>продажів</em></>} href="/katalog" more="Усі товари" />

      <Ritual steps={STEPS.map(({ ids, ...s }) => ({ ...s, cards: cards(ids) }))} />

      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="Бренди"
            title={<>Те, чим працюють <em>професіонали</em></>}
            lead="Японська, корейська та німецька хімія для детейлінгу поруч із перевіреною класикою на кожен день."
            link={{ href: "/brendy", label: `Усі ${brands.length} брендів` }}
          />
          <Brands brands={brandCards} />
        </div>
      </section>

      <section className="band band-protect">
        <BandVideo name="drops" />
        <div className="band-shade" aria-hidden="true" />
        <div className="container band-inner">
          <div className="band-copy">
            <p className="eyebrow">Захист кузова</p>
            <h2 className="display-lg" data-reveal>
              Вода скочується. <em>Бруд — теж.</em>
            </h2>
            <p className="section-lead" data-reveal>
              Кварцова кераміка, силанти й тверді воски створюють гідрофобний шар: авто довше лишається чистим, а мити його — швидше.
            </p>
            <Link href="/katalog/dlya-kuzova?sub=voski" className="btn btn-lg btn-glow" data-reveal>
              Засоби для захисту <Icon name="arrow" size={18} />
            </Link>
          </div>
          <div className="band-cards">
            {cards(PROTECT).map((c) => (
              <ProductCard key={c.id} c={c} dark />
            ))}
          </div>
        </div>
      </section>

      {own.length > 0 && (
        <section className="section own">
          <div className="container">
            <div className="own-head">
              <div>
                <p className="eyebrow" data-reveal>
                  Власна лінійка
                </p>
                <h2 className="display-md" data-reveal>
                  Хімія <span className="own-word">AUTO<b>HIM</b></span>
                </h2>
              </div>
              <p className="section-lead" data-reveal>
                Засоби під власною маркою магазину: універсальні очищувачі, рідкий віск, догляд за гумою, пластиком і текстилем — за доступною ціною.
              </p>
              <Link href="/katalog/khimiia-autohim" className="link-arrow" data-reveal>
                Уся лінійка <Icon name="arrow" size={18} />
              </Link>
            </div>
            <div className="grid grid-5">
              {own.map((c) => (
                <div className="grid-cell" key={c.id} data-reveal>
                  <ProductCard c={c} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section section-tight">
        <div className="container">
          <div className="season">
            <div className="season-head" data-reveal>
              <Icon name="snow" size={34} stroke={1.2} />
              <p className="eyebrow">Сезонне</p>
              <h2 className="display-md">
                Зима <em>вже тут</em>
              </h2>
              <p>Розморожувачі скла й замків, зимовий омивач та антигель — краще мати в багажнику заздалегідь.</p>
              <Link href="/katalog/zyma" className="btn btn-outline">
                Зимові позиції <Icon name="arrow" size={18} />
              </Link>
            </div>
            <div className="season-grid">
              {cards(WINTER).map((c) => (
                <ProductCard key={c.id} c={c} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Чому AUTOHIM" title={<>Купувати — <em>просто</em></>} />
          <div className="perks">
            {[
              { icon: "shield", t: "Перевірені бренди", d: "K2, Koch-Chemie, GYEON, SOFT99, SONAX, MOTUL та ще понад 40 марок." },
              { icon: "truck", t: "Доставка по Україні", d: "Нова пошта у відділення, поштомат або кур’єром." },
              { icon: "pin", t: "Магазин у Тернополі", d: `${site.address}. Самовивіз щодня з 09:00 до 19:00.` },
              { icon: "chat", t: "Підкажемо з вибором", d: "Телефонуйте або пишіть — підберемо засоби під вашу задачу." },
            ].map((x, i) => (
              <div className="perk spot" key={x.t} data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
                <span className="perk-icon">
                  <Icon name={x.icon as "shield"} size={26} stroke={1.4} />
                </span>
                <b>{x.t}</b>
                <p>{x.d}</p>
              </div>
            ))}
          </div>

          {gift.length > 0 && (
            <Link href="/katalog/sertyfikaty" className="gift spot" data-reveal data-cursor="Обрати">
              <span className="gift-card" aria-hidden="true">
                <span className="gift-logo">
                  AUTO<b>HIM</b>
                </span>
                <span className="gift-sum">Сертифікат</span>
                <span className="gift-chip" />
              </span>
              <span className="gift-text">
                <p className="eyebrow">Подарунок</p>
                <b>Подарунковий сертифікат</b>
                <span>Коли не знаєте, що подарувати автомобілісту — дайте йому обрати самому.</span>
              </span>
              <span className="gift-go">
                <Icon name="arrow" size={22} />
              </span>
            </Link>
          )}
        </div>
      </section>

      <section className="band band-store">
        <BandVideo name="wash" />
        <div className="band-shade" aria-hidden="true" />
        <div className="container band-inner">
          <div className="band-copy">
            <p className="eyebrow">Магазин</p>
            <h2 className="display-lg" data-reveal>
              Приїжджайте — <em>покажемо наживо</em>
            </h2>
            <ul className="store-facts" data-reveal>
              <li>
                <Icon name="pin" size={20} />
                <span>
                  <small>Адреса</small>
                  {site.city}, {site.address}
                </span>
              </li>
              <li>
                <Icon name="clock" size={20} />
                <span>
                  <small>Графік</small>
                  {site.hours}
                </span>
              </li>
              <li>
                <Icon name="phone" size={20} />
                <span>
                  <small>Телефон</small>
                  <a href={site.phoneHref}>{site.phone}</a>
                </span>
              </li>
            </ul>
            <div className="band-actions" data-reveal>
              <a href={site.mapHref} className="btn btn-lg btn-glow" target="_blank" rel="noopener noreferrer">
                Прокласти маршрут <Icon name="arrowUpRight" size={18} />
              </a>
              <CallbackButton className="btn btn-lg btn-outline-light">Передзвоніть мені</CallbackButton>
            </div>
            <div className="socials socials-lg" data-reveal>
              {site.socials.map((s) => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer">
                  <SocialIcon name={s.name} size={20} /> {s.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
