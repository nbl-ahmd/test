"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { site } from "@/content/site";
import { isMobileViewport, prefersReducedMotion } from "@/lib/motion";
import { setSceneTarget } from "@/lib/scene-store";
import { SERVICE_STEP_ROTATION } from "@/lib/scene-keyframes";
import Container from "@/components/layout/Container";
import LineReveal from "@/components/ui/LineReveal";

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const steps = site.services.items;

  const activate = (index: number) => {
    if (index === activeRef.current) return;
    activeRef.current = index;
    setActive(index);
  };

  useGSAP(
    () => {
      const pin = pinRef.current;
      if (!pin || prefersReducedMotion()) return;

      const mm = gsap.matchMedia();

      // Desktop: the pinned scroll advances the active row while the cube
      // rotates one quarter per service.
      mm.add("(min-width: 768px)", () => {
        const total = steps.length;
        const trigger = ScrollTrigger.create({
          trigger: pin,
          start: "top top",
          end: `+=${(total - 1) * 100}%`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (!self.isActive) return;
            activate(Math.round(self.progress * (total - 1)));
            setSceneTarget({
              rotY: gsap.utils.interpolate(
                SERVICE_STEP_ROTATION[0],
                SERVICE_STEP_ROTATION[total - 1],
                self.progress,
              ),
            });
          },
        });

        return () => trigger.kill();
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      aria-labelledby="services-title"
      className="relative z-10 border-t border-line"
    >
      <div className="pt-24 md:pt-32">
        <Container>
          <p className="label text-muted">{site.services.label}</p>
          <LineReveal
            as="h2"
            id="services-title"
            className="mt-6 text-[clamp(2rem,5vw,4rem)] leading-[1.05] font-medium tracking-[-0.03em]"
            stagger={0.1}
            start="top 80%"
          >
            {site.services.heading}{" "}
            <em className="accent-italic">{site.services.headingEmphasis}</em>
          </LineReveal>
          <p className="label mt-4 text-muted">{site.services.note}</p>
        </Container>
      </div>

      <div
        ref={pinRef}
        className="relative mt-12 md:mt-0 md:flex md:items-center motion-safe:md:h-svh motion-safe:md:overflow-hidden"
      >
        <Container>
          <ul className="w-full">
            {steps.map((step, index) => {
              const isActive = active === index;
              return (
                <li
                  key={step.index}
                  data-service-row
                  className="border-t border-line last:border-b"
                >
                  <button
                    type="button"
                    aria-expanded={isActive}
                    onClick={() =>
                      activate(
                        isActive && isMobileViewport() ? -1 : index,
                      )
                    }
                    className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-x-4 py-4 text-left md:gap-x-8 md:py-6"
                  >
                    <span className="label text-muted">({step.index})</span>
                    <span
                      className={`text-[clamp(2.1rem,6.5vw,5.5rem)] leading-[1] font-medium tracking-[-0.045em] transition-opacity duration-500 ${
                        isActive ? "opacity-100" : "opacity-25"
                      }`}
                    >
                      {step.title}
                    </span>
                    <span className="label text-muted md:text-right">
                      {step.timeline}
                    </span>
                  </button>

                  <div
                    className="grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none"
                    style={{ gridTemplateRows: isActive ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <div className="max-w-[62ch] pb-8 md:pb-10">
                        <p className="text-[17px] leading-[1.6] text-fg/90 md:text-[18px]">
                          {step.summary}
                        </p>
                        <p className="label mt-4 text-muted">
                          {step.deliverables.join(" / ")}
                        </p>
                        <p className="mt-4 text-muted">
                          <span className="text-fg">Best for:</span>{" "}
                          {step.bestFor}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Container>
      </div>
    </section>
  );
}
