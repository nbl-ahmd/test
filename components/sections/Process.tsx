"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { site } from "@/content/site";
import { prefersReducedMotion } from "@/lib/motion";
import Container from "@/components/layout/Container";

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const lineRef = useRef<SVGLineElement>(null);

  useGSAP(
    () => {
      const list = listRef.current;
      const line = lineRef.current;
      if (!list || prefersReducedMotion()) return;

      if (line) {
        gsap.fromTo(
          line,
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: list,
              start: "top 70%",
              end: "bottom 70%",
              scrub: true,
            },
          },
        );
      }

      gsap.from("[data-reveal]", {
        y: 28,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: list, start: "top 78%" },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="process"
      aria-labelledby="process-title"
      className="relative z-10 border-t border-line py-24 md:py-32"
    >
      <Container>
        <p className="label text-muted">{site.process.label}</p>
        <h2
          id="process-title"
          className="mt-6 text-[clamp(2rem,5vw,4rem)] leading-[1.05] font-medium tracking-[-0.03em]"
        >
          {site.process.heading}{" "}
          <em className="accent-italic">{site.process.headingEmphasis}</em>
        </h2>

        <div className="relative mt-16">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute top-2 left-3 h-[calc(100%-1rem)] w-px overflow-visible"
          >
            <line
              ref={lineRef}
              x1="0"
              y1="0"
              x2="0"
              y2="100%"
              pathLength="1"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="1"
              className="text-subtle"
            />
          </svg>

          <ol ref={listRef} className="space-y-16">
            {site.process.steps.map((step) => (
              <li key={step.index} data-reveal className="relative pl-12">
                <span
                  aria-hidden="true"
                  className="absolute top-2 left-3 size-2 -translate-x-1/2 rounded-full bg-accent"
                />
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <p className="label text-muted">({step.index})</p>
                  <h3 className="text-2xl font-medium tracking-[-0.02em] md:text-3xl">
                    {step.name}
                  </h3>
                  <p className="label text-muted">{step.timing}</p>
                </div>

                <ul className="mt-5 space-y-2">
                  {step.tasks.map((task) => (
                    <li key={task} className="text-pretty text-fg/85">
                      {task}
                    </li>
                  ))}
                </ul>

                <p className="mt-5 text-muted">
                  <span className="text-fg">You get:</span> {step.outcome}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}