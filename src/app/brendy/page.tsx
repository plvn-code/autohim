import type { Metadata } from "next";
import Link from "next/link";
import { Brands } from "@/components/home/Brands";
import { PageHero, SectionHead } from "@/components/Shared";
import { brands, featuredBrands } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Бренди автохімії",
  description: "GYEON, Koch-Chemie, SOFT99, SONAX, K2, MOTUL, WOLF, RITUALS та інші бренди автохімії й автокосметики в магазині AUTOHIM.",
  alternates: { canonical: "/brendy" },
};

export default function BrandsPage() {
  const featured = featuredBrands.map((b) => ({ ...b, count: brands.find((x) => x.id === b.id)?.count ?? 0 }));
  const rest = brands.filter((b) => !featuredBrands.some((f) => f.id === b.id)).sort((a, b) => a.name.localeCompare(b.name, "uk"));
  return (
    <>
      <PageHero eyebrow={`${brands.length} брендів`} title={<>Бренди, яким <em>довіряють</em></>} lead="Професійна хімія для детейлінгу та перевірені засоби на кожен день — з Японії, Кореї, Німеччини, Польщі та України." crumbs={[{ href: "/brendy", label: "Бренди" }]} />
      <section className="section-tight">
        <div className="container">
          <Brands brands={featured} />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Від А до Я" title="Усі бренди" />
          <ul className="brand-index">
            {rest.map((b) => (
              <li key={b.id} data-reveal>
                <Link href={`/brendy/${b.id}`}>
                  {b.name} <small>{b.count}</small>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
