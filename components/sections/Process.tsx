"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { site } from "@/content/site";
import { prefersReducedMotion } from "@/lib/motion";
import Container from "@/components/layout/Container";
import LineReveal from "@/components/ui/LineReveal";

const THREAD_PATH =
  "M0 300 C 300 120 500 120 700 300 S 1100 480 1400 300 S 1800 120 2100 300 S 2500 480 2800 300";

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<SVGPathElement>(null);
  const steps = site.process.steps;

  useGSAP(
    () => {
      const pin = pinRef.current;
      const track = trackRef.current;
      const thread = threadRef.current;
      if (!pin || !track || prefersReducedMotion()) return;

      const mm = gsap.matchMedia();

      // Desktop: pin the stage and translate the track sideways, drawing the
      // thread in step with the horizontal travel.
      mm.add("(min-width: 768px)", () => {
        const distance = () => track.scrollWidth - window.innerWidth;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(track, { x: () => -distance(), ease: "none" }, 0);

        if (thread) {
          tl.fromTo(
            thread,
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, ease: "none" },
            0,
          );
        }

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="process"
      aria-labelledby="process-title"
      className="relative z-10 border-t border-line"
    >
      <Container className="pt-24 md:pt-32">
        <p className="label text-muted">{site.process.label}</p>
        <LineReveal
          as="h2"
          id="process-title"
          className="mt-6 text-[clamp(2rem,5vw,4rem)] leading-[1.05] font-medium tracking-[-0.03em]"
          stagger={0.08}
          yPercent={120}
          start="top 78%"
        >
          {site.process.heading}{" "}
          <em className="accent-italic">{site.process.headingEmphasis}</em>
        </LineReveal>
      </Container>

      <div
        ref={pinRef}
        data-cursor="drag"
        className="relative mt-14 motion-safe:md:mt-0 motion-safe:md:h-svh motion-safe:md:overflow-hidden"
      >
        <div
          ref={trackRef}
          className="relative motion-safe:md:flex motion-safe:md:h-svh motion-safe:md:items-stretch"
        >
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 hidden h-full motion-safe:md:block"
            style={{ width: `${steps.length * 70}vw` }}
            viewBox="0 0 2800 600"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              ref={threadRef}
              d={THREAD_PATH}
              pathLength="1"
              stroke="var(--color-accent)"
              strokeOpacity="0.5"
              strokeWidth="1.5"
              strokeDasharray="1"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {steps.map((step) => (
            <article
              key={step.index}
              data-process-panel
              className="flex flex-col justify-center border-t border-line py-16 first:border-t-0 motion-safe:md:h-svh motion-safe:md:w-[70vw] motion-safe:md:shrink-0 motion-safe:md:border-t-0 motion-safe:md:py-0"
            >
              <div className="px-[var(--gutter)] md:max-w-[52ch]">
                <span
                  aria-hidden="true"
                  className="outline-text block text-[clamp(4rem,13vw,11rem)] leading-[0.85] font-medium tracking-[-0.04em]"
                >
                  {step.index}
                </span>
                <p className="label mt-6 text-muted">{step.timing}</p>
                <h3 className="mt-3 text-[clamp(2rem,4vw,3.25rem)] leading-[1.02] font-medium tracking-[-0.03em]">
                  {step.name}
                </h3>
                <p className="mt-5 text-[17px] leading-[1.6] text-fg/90 md:text-[18px]">
                  {step.sentence}
                </p>
                <p className="mt-6 text-muted">
                  <span className="text-fg">You get:</span> {step.outcome}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
