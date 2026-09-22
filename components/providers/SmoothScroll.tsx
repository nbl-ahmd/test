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

    // Touch devices scroll natively (syncTouch: false); Lenis only smooths
    // wheel/trackpad input on fine pointers. The instance still tracks scroll
    // so scene velocity and ScrollTrigger.update() keep working.
    const lenis = new Lenis({ autoRaf: false, syncTouch: false });
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

    // Re-measure triggers once fonts/content settle and on layout changes.
    let cancelled = false;
    let resizeTimer = 0;
    const refresh = () => {
      if (!cancelled) ScrollTrigger.refresh();
    };
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(refresh, 200);
    };

    document.fonts.ready.then(refresh).catch(() => {});
    window.addEventListener("orientationchange", refresh);
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      window.clearTimeout(resizeTimer);
      window.removeEventListener("orientationchange", refresh);
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(onTick);
      lenis.off("scroll", onScroll);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
