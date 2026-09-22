"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { site } from "@/content/site";
import { prefersReducedMotion } from "@/lib/motion";
import Container from "@/components/layout/Container";
import LineReveal from "@/components/ui/LineReveal";
import { EASE } from "@/lib/motion-tokens";

export default function Why() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { why } = site;

  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;

      // Flip the header to dark while the paper sheet is under it.
      const themeTrigger = ScrollTrigger.create({
        trigger: panel,
        start: "top 72px",
        end: "bottom 72px",
        onToggle: (self) => {
          if (self.isActive) {
            document.documentElement.dataset.paper = "true";
          } else {
            delete document.documentElement.dataset.paper;
          }
        },
      });

      if (prefersReducedMotion()) {
        return () => {
          themeTrigger.kill();
          delete document.documentElement.dataset.paper;
        };
      }

      const enter = gsap.fromTo(
        panel,
        {
          clipPath: "inset(6% 4% 6% 4% round 28px)",
          scale: 0.98,
        },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          scale: 1,
          ease: EASE.out,
          scrollTrigger: {
            trigger: panel,
            start: "top 90%",
            end: "top 40%",
            scrub: true,
          },
        },
      );

      const strikes = gsap.fromTo(
        "[data-strike]",
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          ease: "none",
          stagger: 0.35,
          scrollTrigger: {
            trigger: panel,
            start: "top 72%",
            end: "bottom 68%",
            scrub: true,
          },
        },
      );

      return () => {
        themeTrigger.kill();
        delete document.documentElement.dataset.paper;
        enter.scrollTrigger?.kill();
        enter.kill();
        strikes.scrollTrigger?.kill();
        strikes.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="why" className="relative z-10 bg-bg">
      <div
        ref={panelRef}
        className="bg-[#ecebe6] text-[#0a0a0b]"
        style={{ willChange: "clip-path, transform" }}
      >
        <Container className="py-20 md:py-40">
          <p className="label text-[#0a0a0b]/70">{why.label}</p>
          <LineReveal
            as="h2"
            id="why-title"
            className="mt-6 max-w-[18ch] text-[clamp(2.4rem,4.5vw,3.75rem)] leading-[1.08] font-medium tracking-[-0.03em] text-balance"
            stagger={0.09}
            start="top 80%"
          >
            {why.heading}
          </LineReveal>

          <div className="mt-16 border-t border-[#0a0a0b]/15">
            {why.rows.map((row) => (
              <div
                key={row.label}
                className="grid gap-2 border-b border-[#0a0a0b]/15 py-6 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1fr)_minmax(0,1.1fr)] lg:items-baseline lg:gap-10 lg:py-8"
              >
                <span className="label text-[#0a0a0b]/70">{row.label}</span>
                <span className="relative inline-block w-fit text-[clamp(1.15rem,2.4vw,1.9rem)] leading-[1.25] text-[#0a0a0b]/65">
                  {row.typical}
                  <span
                    data-strike
                    aria-hidden="true"
                    className="absolute top-1/2 left-0 h-px w-full origin-left scale-x-0 bg-[#0a0a0b]"
                  />
                </span>
                <span className="text-[clamp(1.15rem,2.4vw,1.9rem)] leading-[1.25] font-semibold tracking-[-0.01em] text-[#0a0a0b]">
                  {row.domweave}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
