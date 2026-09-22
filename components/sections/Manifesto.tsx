"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { site } from "@/content/site";
import { prefersReducedMotion } from "@/lib/motion";
import Container from "@/components/layout/Container";
import { DUR, EASE } from "@/lib/motion-tokens";

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);
  const statementWrapRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const principles = site.manifesto.principles;

  useGSAP(
    () => {
      const section = sectionRef.current;
      const statement = statementRef.current;
      const statementWrap = statementWrapRef.current;
      const lines = linesRef.current;
      if (!section || !statement || !statementWrap || !lines) return;
      if (prefersReducedMotion()) return;

      const split = SplitText.create(statement, { type: "words", aria: "none" });
      const titles = gsap.utils.toArray<HTMLElement>(
        "[data-principle-title]",
        lines,
      );
      const bodies = gsap.utils.toArray<HTMLElement>(
        "[data-principle-body]",
        lines,
      );

      const mm = gsap.matchMedia();

      // Desktop: one pin carries the scrubbed statement, then hands the stage
      // to three giant lines that light up one after another.
      mm.add("(min-width: 768px)", () => {
        gsap.set(bodies, { maxHeight: 0, autoAlpha: 0 });
        gsap.set(titles, { opacity: 0.15 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=340%",
            pin: true,
            scrub: true,
            anticipatePin: 1,
          },
        });

        tl.fromTo(
          split.words,
          { opacity: 0.15 },
          { opacity: 1, duration: 1, stagger: 0.3, ease: "none" },
          0,
        )
          .to(
            statementWrap,
            { autoAlpha: 0, yPercent: -6, duration: DUR.slow, ease: EASE.in },
            "+=0.3",
          )
          .set(statementWrap, { display: "none" })
          .fromTo(
            lines,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: DUR.base, ease: EASE.out },
          );

        principles.forEach((_, index) => {
          tl.to(
            titles[index],
            { opacity: 1, duration: DUR.base, ease: EASE.out },
            "+=0.4",
          ).to(
            bodies[index],
            { maxHeight: 260, autoAlpha: 1, duration: DUR.base, ease: EASE.out },
            "<",
          );

          if (index < principles.length - 1) {
            tl.to(
              titles[index],
              { opacity: 0.15, duration: DUR.base, ease: EASE.in },
              "+=0.9",
            ).to(
              bodies[index],
              { maxHeight: 0, autoAlpha: 0, duration: DUR.base, ease: EASE.in },
              "<",
            );
          }
        });

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      // Mobile: no pin — scrub the statement, show the lines as a plain stack.
      mm.add("(max-width: 767px)", () => {
        const tween = gsap.fromTo(
          split.words,
          { opacity: 0.15 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.12,
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              end: "bottom 70%",
              scrub: true,
            },
          },
        );
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      return () => {
        mm.revert();
        split.revert();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      aria-label="Manifesto"
      className="relative z-10 flex min-h-svh items-center border-t border-line py-24"
    >
      <Container>
        <div className="relative">
          <div ref={statementWrapRef}>
            <p className="label text-muted">{site.manifesto.label}</p>
            <p className="sr-only">{site.manifesto.body}</p>
            <p
              ref={statementRef}
              aria-hidden="true"
              className="mt-8 max-w-[24ch] text-[clamp(1.8rem,4.5vw,4rem)] leading-[1.25] font-medium tracking-[-0.03em] text-balance"
            >
              {site.manifesto.body}
            </p>
          </div>

          <div
            ref={linesRef}
            className="mt-14 motion-safe:md:absolute motion-safe:md:inset-x-0 motion-safe:md:top-0 motion-safe:md:mt-0"
          >
            {principles.map((principle) => (
              <div
                key={principle.title}
                className="border-b border-line/70 py-5 last:border-b-0 md:py-6"
              >
                <p
                  data-principle-title
                  className="text-[clamp(2.4rem,7.5vw,6.5rem)] leading-[0.95] font-medium tracking-[-0.045em]"
                >
                  {principle.title}.
                </p>
                <div data-principle-body className="overflow-hidden">
                  <p className="max-w-[52ch] pt-4 text-[17px] leading-[1.6] text-muted md:text-[18px]">
                    {principle.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
