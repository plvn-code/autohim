"use client";

import { useEffect, useRef } from "react";
import { reducedMotion } from "@/lib/motion";

/** Muted looping clip that plays only while on screen; the poster stays for reduced motion. */
export function BandVideo({ name }: { name: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || reducedMotion()) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { rootMargin: "10% 0px" });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video ref={ref} className="band-video" muted loop playsInline preload="none" poster={`/images/${name}-poster.webp`} aria-hidden="true" data-parallax="0.12">
      <source src={`/video/${name}.mp4`} type="video/mp4" />
    </video>
  );
}
