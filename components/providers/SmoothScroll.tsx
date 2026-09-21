"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/scroll";
import { setVelocity } from "@/lib/scene-store";
import { prefersReducedMotion } from "@/lib/motion";

const VELOCITY_SCALE = 50;
const VELOCITY_LIMIT = 1.5;

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ autoRaf: false });
    setLenis(lenis);

    const onScroll = (instance: Lenis) => {
      const normalized = instance.velocity / VELOCITY_SCALE;
      setVelocity(
        Math.max(-VELOCITY_LIMIT, Math.min(VELOCITY_LIMIT, normalized)),
      );
      ScrollTrigger.update();
    };
    lenis.on("scroll", onScroll);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    let cancelled = false;
    document.fonts.ready
      .then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      gsap.ticker.remove(onTick);
      lenis.off("scroll", onScroll);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
