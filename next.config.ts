import type { NextConfig } from "next";
import data from "./src/data/catalog.json";

/** Fonts, images and video are self-hosted, so the policy only allows our own origin. */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'" + (process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

/** Old autohim.ps.me addresses → new pages, so links shared in Instagram/Telegram keep working after the domain moves. */
const permanent = (source: string, destination: string) => ({ source, destination, permanent: true });
type S = { id: string; old: string; subs: { id: string }[] };
const sections = data.sections as S[];
const BRAND_CATS: Record<string, string> = { geyon: "gyeon", koch: "koch", wolf: "wolf", soft99: "soft99", rituals: "rituals", sonax: "sonax" };

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/video/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/brand/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
  async redirects() {
    return [
      ...sections.map((s) => permanent(`/category/${s.old}`, `/katalog/${s.id}`)),
      ...sections.flatMap((s) => s.subs.map((sub) => permanent(`/category/${sub.id}`, `/katalog/${s.id}?sub=${sub.id}`))),
      ...Object.entries(BRAND_CATS).map(([o, n]) => permanent(`/category/${o}`, `/brendy/${n}`)),
      permanent("/category/:slug", "/katalog"),
      permanent("/contacts", "/kontakty"),
      permanent("/legal/terms-of-use", "/dostavka"),
      permanent("/checkoutFinish", "/koshyk"),
    ];
  },
};

export default nextConfig;
