"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { site } from "@/content/site";
import { markRevealed } from "@/lib/intro";
import { startScroll, stopScroll } from "@/lib/scroll";
import { prefersReducedMotion } from "@/lib/motion";

const LETTERS = [...site.wordmark];

export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const persist = () => {
        try {
          sessionStorage.setItem("dw:preloaded", "1");
        } catch {
          /* storage unavailable — animation simply replays next visit */
        }
      };

      const skipped =
        document.documentElement.dataset.preloaded === "true" ||
        prefersReducedMotion();

      if (skipped) {
        gsap.set(root, { autoAlpha: 0, display: "none" });
        persist();
        markRevealed();
        return;
      }

      stopScroll();

      const counterEl = root.querySelector<HTMLElement>("[data-counter]");
      const counter = { value: 0 };

      const timeline = gsap.timeline({
        onComplete: () => {
          gsap.set(root, { display: "none" });
          persist();
          startScroll();
        },
      });

      timeline
        .from(
          "[data-letter]",
          { yPercent: 120, duration: 0.6, stagger: 0.035, ease: "power3.out" },
          0,
        )
        .to(
          counter,
          {
            value: 100,
            duration: 1.1,
            ease: "power2.inOut",
            onUpdate: () => {
              if (counterEl) {
                counterEl.textContent = String(
                  Math.round(counter.value),
                ).padStart(3, "0");
              }
            },
          },
          0,
        )
        .to(
          "[data-letter]",
          { yPercent: -120, duration: 0.5, stagger: 0.03, ease: "power3.in" },
          1,
        )
        .to("[data-counter]", { autoAlpha: 0, duration: 0.3 }, 0.95)
        .add(() => markRevealed(), 1.05)
        .to(
          "[data-panel-top]",
          { yPercent: -100, duration: 0.75, ease: "power4.inOut" },
          1.05,
        )
        .to(
          "[data-panel-bottom]",
          { yPercent: 100, duration: 0.75, ease: "power4.inOut" },
          1.05,
        );
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="preloader fixed inset-0 z-[85]"
    >
      <div data-panel-top className="absolute inset-x-0 top-0 h-1/2 bg-bg" />
      <div
        data-panel-bottom
        className="absolute inset-x-0 bottom-0 h-1/2 bg-bg"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
        <span className="flex overflow-hidden text-2xl font-medium tracking-tight">
          {LETTERS.map((letter, index) => (
            <span key={`${letter}-${index}`} data-letter className="inline-block">
              {letter}
            </span>
          ))}
        </span>
        <span data-counter className="label text-muted tabular-nums">
          000
        </span>
      </div>
    </div>
  );
}