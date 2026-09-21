"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  selector?: string;
  stagger?: number;
  y?: number;
  start?: string;
};

export default function Reveal({
  children,
  className,
  selector = "[data-reveal]",
  stagger = 0.08,
  y = 28,
  start = "top 80%",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const matched = Array.from(
        el.querySelectorAll<HTMLElement>(selector),
      );
      const list = matched.length
        ? matched
        : (Array.from(el.children) as HTMLElement[]);
      if (!list.length) return;

      gsap.from(list, {
        y,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger,
        scrollTrigger: { trigger: el, start },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}