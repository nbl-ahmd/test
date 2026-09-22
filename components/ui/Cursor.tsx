"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { isFinePointer, prefersReducedMotion } from "@/lib/motion";
import { DUR, EASE } from "@/lib/motion-tokens";

const INTERACTIVE = "a, button, [data-cursor], summary, input, textarea, select";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return;
    document.documentElement.dataset.customCursor = "true";
    return () => {
      delete document.documentElement.dataset.customCursor;
    };
  }, []);

  useGSAP(
    () => {
      const dot = dotRef.current;
      const label = labelRef.current;
      if (!dot || !label) return;
      if (!isFinePointer() || prefersReducedMotion()) return;

      gsap.set(dot, { xPercent: -50, yPercent: -50, scale: 0.178, opacity: 0 });
      gsap.set(label, { scale: 0.7, opacity: 0 });

      const xTo = gsap.quickTo(dot, "x", { duration: DUR.fast, ease: EASE.out });
      const yTo = gsap.quickTo(dot, "y", { duration: DUR.fast, ease: EASE.out });

      let hovered: Element | null = null;
      let visible = false;

      const grow = (text: string | null) => {
        gsap.to(dot, { scale: 1, duration: DUR.fast, ease: EASE.out });
        label.textContent = text ?? "";
        gsap.to(label, {
          opacity: text ? 1 : 0,
          scale: text ? 1 : 0.7,
          duration: DUR.fast,
          ease: EASE.out,
        });
      };

      const shrink = () => {
        hovered = null;
        gsap.to(dot, { scale: 0.178, duration: DUR.fast, ease: EASE.out });
        gsap.to(label, { opacity: 0, scale: 0.7, duration: DUR.fast });
      };

      const onPointerMove = (event: PointerEvent) => {
        xTo(event.clientX);
        yTo(event.clientY);
        if (visible) return;
        visible = true;
        gsap.to(dot, { opacity: 1, duration: DUR.fast, ease: EASE.out });
      };

      const onPointerOver = (event: PointerEvent) => {
        const target = event.target as Element | null;
        const hit = target?.closest?.(INTERACTIVE) ?? null;
        if (!hit || hit === hovered) return;
        hovered = hit;
        grow(hit.getAttribute("data-cursor"));
      };

      const onPointerOut = (event: PointerEvent) => {
        const next = event.relatedTarget as Element | null;
        if (next?.closest?.(INTERACTIVE)) return;
        if (hovered) shrink();
      };

      const onWindowLeave = () => {
        visible = false;
        gsap.to(dot, { opacity: 0, duration: DUR.fast, ease: EASE.out });
      };

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerover", onPointerOver);
      document.addEventListener("pointerout", onPointerOut);
      document.addEventListener("mouseleave", onWindowLeave);

      return () => {
        window.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerover", onPointerOver);
        document.removeEventListener("pointerout", onPointerOut);
        document.removeEventListener("mouseleave", onWindowLeave);
      };
    },
    { scope: dotRef },
  );

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[90] flex size-14 items-center justify-center rounded-full bg-fg opacity-0 mix-blend-difference"
    >
      <span
        ref={labelRef}
        className="label text-[10px] text-bg opacity-0 select-none"
      />
    </div>
  );
}
