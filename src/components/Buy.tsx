"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { type Card, img, price } from "@/lib/format";
import { openCallback } from "./Callback";
import { Icon } from "./Icons";

/** Product photo on a lit stage: the image follows the cursor in 3D and a zoom lens shows the label up close. */
export function Stage({ c }: { c: Card }) {
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  if (!c.img)
    return (
      <div className="pstage pstage-empty">
        <img src="/brand/mark-320.webp" alt="" />
        <p>Фото уточнюйте в менеджера</p>
      </div>
    );
  return (
    <div
      className={`pstage ${zoom ? "is-zoom" : ""}`}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        e.currentTarget.style.setProperty("--rx", `${((0.5 - y) * 8).toFixed(2)}deg`);
        e.currentTarget.style.setProperty("--ry", `${((x - 0.5) * 10).toFixed(2)}deg`);
        setZoom({ x, y });
      }}
      onPointerLeave={() => setZoom(null)}
    >
      <div className="pstage-glow" aria-hidden="true" />
      <img className={`pstage-img ${c.cut ? "is-cut" : "is-photo"}`} src={img(c.id)} alt={c.n} fetchPriority="high" />
      {zoom && (
        <div className="pstage-lens" aria-hidden="true" style={{ left: `${zoom.x * 100}%`, top: `${zoom.y * 100}%`, backgroundImage: `url(${img(c.id)})`, backgroundPosition: `${zoom.x * 100}% ${zoom.y * 100}%` }} />
      )}
      <span className="pstage-hint" aria-hidden="true">
        <Icon name="search" size={14} /> Наведіть, щоб збільшити
      </span>
    </div>
  );
}

export function BuyBox({ c }: { c: Card }) {
  const { add, qtyOf, setOpen, ready } = useCart();
  const [qty, setQty] = useState(1);
  const inCart = ready ? qtyOf(c.id) : 0;
  return (
    <div className="buy">
      <div className="buy-price">
        <b className={c.p ? "" : "is-request"}>{price(c.p)}</b>
        {c.v && <span className="chip chip-sm">{c.v}</span>}
      </div>
      {c.p > 0 ? (
        <>
          <div className="buy-row">
            <div className="stepper stepper-lg" role="group" aria-label="Кількість">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Менше" disabled={qty <= 1}>
                <Icon name="minus" size={18} />
              </button>
              <output aria-live="polite">{qty}</output>
              <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Більше">
                <Icon name="plus" size={18} />
              </button>
            </div>
            <button type="button" className="btn btn-lg btn-glow buy-add" onClick={(e) => add(c, qty, e.currentTarget)}>
              <Icon name="bag" size={20} /> У кошик {qty > 1 && <small>· {price(c.p * qty)}</small>}
            </button>
          </div>
          {inCart > 0 && (
            <button type="button" className="buy-incart" onClick={() => setOpen(true)}>
              <Icon name="check" size={16} /> У кошику вже {inCart} шт. — оформити
            </button>
          )}
          <button type="button" className="btn btn-outline btn-lg btn-block" onClick={() => openCallback(`${c.n} × ${qty}`)}>
            Купити в один клік
          </button>
        </>
      ) : (
        <button type="button" className="btn btn-lg btn-glow btn-block" onClick={() => openCallback(c.n)}>
          Дізнатися ціну й наявність
        </button>
      )}
    </div>
  );
}
