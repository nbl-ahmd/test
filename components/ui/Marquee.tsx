"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { scene } from "@/lib/scene-store";
import { prefersReducedMotion } from "@/lib/motion";

export default function Marquee({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const track = el.querySelector<HTMLElement>("[data-track]");
      if (!track) return;

      const tween = gsap.to(track, {
        xPercent: -50,
        duration: 28,
        ease: "none",
        repeat: -1,
      });

      const onTick = () => {
        tween.timeScale(1 + Math.min(3, Math.abs(scene.velocity) * 1.6));
      };

      gsap.ticker.add(onTick);
      return () => {
        gsap.ticker.remove(onTick);
        tween.kill();
      };
    },
    { scope: ref },
  );

  return (
    <div ref={ref} aria-hidden="true" className="overflow-hidden">
      <div data-track className="flex w-max items-center gap-10 pr-10">
        {[...items, ...items].map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="text-[clamp(1.5rem,3.4vw,3rem)] font-medium tracking-[-0.03em] whitespace-nowrap text-muted"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}