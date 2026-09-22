"use client";

import { useRef, type ReactNode, type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { DUR, EASE } from "@/lib/motion-tokens";

type LineRevealProps = {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  id?: string;
  stagger?: number;
  yPercent?: number;
  start?: string;
};

/**
 * Masked line-by-line reveal for headings. Each line sits in an overflow-hidden
 * mask and slides up; stagger and direction are tuned per section on purpose.
 */
export default function LineReveal({
  children,
  className,
  as = "h2",
  id,
  stagger = 0.09,
  yPercent = 110,
  start = "top 82%",
}: LineRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        aria: "auto",
      });

      const tween = gsap.from(split.lines, {
        yPercent,
        duration: DUR.base,
        ease: EASE.out,
        stagger,
        scrollTrigger: { trigger: el, start },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        split.revert();
      };
    },
    { scope: ref },
  );

  if (as === "p") {
    return (
      <p
        ref={ref as RefObject<HTMLParagraphElement>}
        id={id}
        className={className}
      >
        {children}
      </p>
    );
  }

  const Tag = as;

  return (
    <Tag
      ref={ref as RefObject<HTMLHeadingElement>}
      id={id}
      className={className}
    >
      {children}
    </Tag>
  );
}
