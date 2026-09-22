"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { DUR, EASE } from "@/lib/motion-tokens";

export default function RollingCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const chars = value.split("");

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const reels = Array.from(el.querySelectorAll<HTMLElement>("[data-reel]"));
      if (!reels.length) return;

      gsap.fromTo(
        reels,
        { yPercent: 0 },
        {
          yPercent: (_index, target) =>
            -Number((target as HTMLElement).dataset.digit ?? 0) * 10,
          duration: DUR.slow,
          ease: EASE.out,
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: "top 85%" },
        },
      );
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className="inline-flex items-baseline">
      {chars.map((char, index) =>
        /[0-9]/.test(char) ? (
          <span
            key={index}
            aria-hidden="true"
            className="relative inline-block overflow-hidden text-center"
            style={{ height: "1em", width: "0.6em" }}
          >
            <span
              data-reel
              data-digit={char}
              className="absolute inset-x-0 top-0 flex flex-col leading-none"
            >
              {Array.from({ length: 10 }, (_, digit) => (
                <span key={digit} style={{ height: "1em" }}>
                  {digit}
                </span>
              ))}
            </span>
          </span>
        ) : (
          <span key={index} aria-hidden="true">
            {char}
          </span>
        ),
      )}
      <span className="sr-only">{value}</span>
    </span>
  );
}