import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope, Unbounded } from "next/font/google";
import { CallbackModal } from "@/components/Callback";
import { CartDrawer } from "@/components/CartDrawer";
import { CursorLabel } from "@/components/CursorLabel";
import { Effects } from "@/components/Effects";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Intro } from "@/components/Intro";
import { MobileBar } from "@/components/MobileBar";
import { SearchOverlay } from "@/components/SearchOverlay";
import { featuredBrands, products, sections } from "@/lib/catalog";
import { CartProvider } from "@/lib/cart";
import { site } from "@/lib/site";
import "./globals.css";

const display = Unbounded({ subsets: ["latin", "cyrillic"], weight: ["300", "400", "500", "600"], variable: "--font-display", display: "swap" });
const body = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-body", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin", "cyrillic"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "AUTOHIM — автохімія та автокосметика в Тернополі", template: "%s — AUTOHIM" },
  description: site.description,
  openGraph: { type: "website", locale: "uk_UA", siteName: "AUTOHIM", images: ["/images/hero-poster.webp"] },
  // The redesign stays out of search until the client approves the launch.
  robots: process.env.NEXT_PUBLIC_SITE_LIVE === "1" ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#04060b", colorScheme: "dark" };

/** Product photo shown in the mega menu next to each section. */
const SECTION_ART: Record<string, number> = {
  "khimiia-autohim": 0, "dlya-kuzova": 1019, "dlya-salonu": 760, "dlya-skla": 54, "tekhnichni-ridyny": 121, olyvy: 329,
  avtopryladdia: 185, orhanaizery: 1220, "shchitky-sklooch": 391, zyma: 165, "dlya-domu": 0, sertyfikaty: 0,
};

const store = {
  "@context": "https://schema.org",
  "@type": "AutoPartsStore",
  name: "AUTOHIM",
  url: site.url,
  telephone: site.phone.replace(/\s/g, ""),
  address: { "@type": "PostalAddress", streetAddress: site.address, addressLocality: site.city, addressCountry: "UA" },
  geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
  openingHours: "Mo-Su 09:00-19:00",
  sameAs: site.socials.map((s) => s.href),
};

/** Runs before paint: the intro shows once per session, only on the home page, never with reduced motion. */
const introScript = `try{var d=document.documentElement;if(sessionStorage.getItem('ah-intro')||matchMedia('(prefers-reduced-motion: reduce)').matches||location.pathname!=='/'){d.classList.add('no-intro')}sessionStorage.setItem('ah-intro','1')}catch(e){document.documentElement.classList.add('no-intro')}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const menu = sections.map((s) => ({ id: s.id, name: s.name, count: s.count, subs: s.subs.map(({ id, name }) => ({ id, name })), art: SECTION_ART[s.id] || undefined }));
  const brands = featuredBrands.map(({ id, name }) => ({ id, name }));
  return (
    <html lang="uk" data-scroll-behavior="smooth" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Перейти до змісту
        </a>
        <CartProvider>
          <Intro />
          <Header sections={menu} brands={brands} total={products.length} />
          <main id="main">{children}</main>
          <Footer />
          <MobileBar />
          <SearchOverlay />
          <CartDrawer />
          <CallbackModal />
        </CartProvider>
        <CursorLabel />
        <Effects />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(store) }} />
      </body>
    </html>
  );
}
