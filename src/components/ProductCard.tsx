"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { type Card, img, price } from "@/lib/format";
import { Icon } from "./Icons";

/** «У кошик» turns into a −/+ stepper once the item is in the cart. */
export function AddToCart({ c, size = "md", label = "У кошик" }: { c: Card; size?: "md" | "lg"; label?: string }) {
  const { add, qtyOf, setQty, ready } = useCart();
  const qty = ready ? qtyOf(c.id) : 0;
  if (!c.p) {
    return (
      <button type="button" className={`btn btn-outline ${size === "lg" ? "btn-lg" : "btn-sm"} add-btn`} onClick={() => window.dispatchEvent(new CustomEvent("open-callback", { detail: { product: c.n } }))}>
        Дізнатися ціну
      </button>
    );
  }
  if (qty > 0) {
    return (
      <div className={`stepper ${size === "lg" ? "stepper-lg" : ""}`} role="group" aria-label={`Кількість: ${c.n}`}>
        <button type="button" onClick={() => setQty(c.id, qty - 1)} aria-label="Менше">
          <Icon name="minus" size={16} />
        </button>
        <output aria-live="polite">{qty}</output>
        <button type="button" onClick={(e) => add(c, 1, e.currentTarget)} aria-label="Більше">
          <Icon name="plus" size={16} />
        </button>
      </div>
    );
  }
  return (
    <button type="button" className={`btn ${size === "lg" ? "btn-lg" : "btn-sm"} add-btn`} onClick={(e) => add(c, 1, e.currentTarget)} aria-label={`Додати в кошик: ${c.n}`}>
      <Icon name="bag" size={size === "lg" ? 20 : 17} />
      <span>{label}</span>
    </button>
  );
}

export function ProductImage({ c, eager, large }: { c: Card; eager?: boolean; large?: boolean }) {
  if (!c.img)
    return (
      <span className="stage-empty" aria-hidden="true">
        <img src="/brand/mark-160.webp" alt="" />
      </span>
    );
  return (
    <img
      src={img(c.id, !large)}
      alt={c.n}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={c.cut ? "is-cut" : "is-photo"}
    />
  );
}

export function ProductCard({ c, eager, dark }: { c: Card; eager?: boolean; dark?: boolean }) {
  return (
    <article className={`pcard ${dark ? "pcard-dark" : ""}`}>
      <Link href={`/tovar/${c.s}`} className="pcard-link" data-cursor="Детальніше">
        <span className={`stage ${dark ? "stage-dark" : ""}`}>
          <ProductImage c={c} eager={eager} />
          {c.hot && <span className="badge badge-hot">Хіт</span>}
          {c.v && <span className="badge badge-vol">{c.v}</span>}
        </span>
        <span className="pcard-body">
          {c.bn && <span className="pcard-brand">{c.bn}</span>}
          <span className="pcard-name">{c.n}</span>
        </span>
      </Link>
      <div className="pcard-foot">
        <span className={`pcard-price ${c.p ? "" : "is-request"}`}>{price(c.p)}</span>
        <AddToCart c={c} />
      </div>
    </article>
  );
}
