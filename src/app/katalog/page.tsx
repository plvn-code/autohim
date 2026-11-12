import type { Metadata } from "next";
import { Suspense } from "react";
import { Catalog } from "@/components/Catalog";
import { PageHero } from "@/components/Shared";
import { brands, products, sections, toCard } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Каталог автохімії та автокосметики",
  description: `Понад ${products.length} товарів для догляду за авто: шампуні, поліролі, воски, кераміка, догляд за салоном і склом, оливи, мікрофібри. Доставка по Україні з Тернополя.`,
  alternates: { canonical: "/katalog" },
};

export default function Katalog() {
  return (
    <>
      <PageHero
        eyebrow="Каталог"
        title={<>Усе для <em>догляду за авто</em></>}
        lead={`${products.length} товарів від ${brands.length} брендів. Фільтруйте за розділом, брендом і ціною — або просто почніть вводити назву.`}
        crumbs={[{ href: "/katalog", label: "Каталог" }]}
      />
      <section className="section-tight">
        <div className="container">
          <Suspense fallback={<div className="grid-skeleton" />}>
            <Catalog cards={products.map(toCard)} sections={sections.map(({ id, name, count }) => ({ id, name, count }))} brands={brands.map(({ id, name }) => ({ id, name }))} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
