import type { MetadataRoute } from "next";
import { brands, products, sections } from "@/lib/catalog";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/katalog", "/brendy", "/dostavka", "/kontakty"].map((p) => ({ url: `${site.url}${p}`, priority: p ? 0.8 : 1 }));
  return [
    ...pages,
    ...sections.map((s) => ({ url: `${site.url}/katalog/${s.id}`, priority: 0.8 })),
    ...brands.map((b) => ({ url: `${site.url}/brendy/${b.id}`, priority: 0.6 })),
    ...products.map((p) => ({ url: `${site.url}/tovar/${p.slug}`, priority: p.popular ? 0.7 : 0.5 })),
  ];
}
