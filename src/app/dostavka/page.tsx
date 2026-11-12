import type { Metadata } from "next";
import { CallbackButton } from "@/components/Callback";
import { Icon } from "@/components/Icons";
import { PageHero, SectionHead } from "@/components/Shared";
import { delivery, payment, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Доставка й оплата",
  description: "Доставка автохімії Новою поштою по Україні, кур’єр по Тернополю та самовивіз з магазину AUTOHIM. Оплата при отриманні або карткою онлайн.",
  alternates: { canonical: "/dostavka" },
};

const STEPS = [
  { t: "Оберіть товари", d: "Додайте їх у кошик — або натисніть «Купити в один клік» і залиште номер." },
  { t: "Оформіть замовлення", d: "Вкажіть контакти, спосіб доставки й оплати. Це займає хвилину." },
  { t: "Підтвердження", d: "Менеджер зв’яжеться, перевірить наявність і погодить деталі." },
  { t: "Отримання", d: "Заберіть замовлення на пошті, у магазині або дочекайтеся кур’єра." },
];

const FAQ = [
  { q: "Скільки коштує доставка?", a: "Доставка Новою поштою оплачується за тарифами перевізника під час отримання. Самовивіз із магазину в Тернополі — безкоштовно." },
  { q: "Чи можна оплатити при отриманні?", a: "Так. Оплатити замовлення можна готівкою або карткою в магазині чи на відділенні Нової пошти (накладений платіж)." },
  { q: "Як дізнатися, чи є товар у наявності?", a: "Після оформлення менеджер перевіряє наявність і телефонує вам. Якщо потрібно швидше — зателефонуйте нам." },
  { q: "Чи допоможете підібрати засоби?", a: "Так. Розкажіть, що за авто й яка задача (мийка, полірування, захист, салон) — порадимо засоби та послідовність роботи." },
  { q: "Чи можна повернути товар?", a: "Повернення та обмін — відповідно до Закону України «Про захист прав споживачів». Зв’яжіться з нами, і ми підкажемо, як це зробити." },
];

export default function Delivery() {
  return (
    <>
      <PageHero eyebrow="Покупцям" title={<>Доставка <em>й оплата</em></>} lead="Відправляємо Новою поштою по всій Україні, а в Тернополі — привеземо кур’єром або чекаємо в магазині." crumbs={[{ href: "/dostavka", label: "Доставка й оплата" }]} />

      <section className="section-tight">
        <div className="container">
          <div className="ship-cards">
            {delivery.map((d, i) => (
              <div className="ship-card spot" key={d.id} data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
                <span className="perk-icon">
                  <Icon name={d.id === "np" ? "box" : d.id === "pickup" ? "pin" : "truck"} size={26} stroke={1.4} />
                </span>
                <b>{d.title}</b>
                <p>{d.note}</p>
              </div>
            ))}
            {payment.map((d, i) => (
              <div className="ship-card spot" key={d.id} data-reveal style={{ ["--d" as string]: `${(i + 3) * 0.08}s` }}>
                <span className="perk-icon">
                  <Icon name="card" size={26} stroke={1.4} />
                </span>
                <b>Оплата: {d.title.toLowerCase()}</b>
                <p>{d.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Як це працює" title={<>Чотири кроки <em>до посилки</em></>} />
          <ol className="how">
            {STEPS.map((s, i) => (
              <li key={s.t} data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
                <span>0{i + 1}</span>
                <b>{s.t}</b>
                <p>{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container faq-grid">
          <div>
            <SectionHead eyebrow="Питання" title={<>Часті <em>питання</em></>} />
            <p className="section-lead">Не знайшли відповідь?</p>
            <div className="band-actions">
              <a href={site.phoneHref} className="btn btn-lg btn-glow">
                <Icon name="phone" size={18} /> {site.phone}
              </a>
              <CallbackButton className="btn btn-lg btn-outline">Передзвоніть мені</CallbackButton>
            </div>
          </div>
          <div className="faq">
            {FAQ.map((f) => (
              <details key={f.q} data-reveal>
                <summary>
                  {f.q}
                  <Icon name="plus" size={20} />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
