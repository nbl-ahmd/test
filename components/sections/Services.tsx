"use client";

import { useRef, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { site } from "@/content/site";
import { prefersReducedMotion } from "@/lib/motion";
import { setSceneTarget } from "@/lib/scene-store";
import { SERVICE_STEP_ROTATION } from "@/lib/scene-keyframes";
import Tick from "@/components/ui/Tick";
import Container from "@/components/layout/Container";

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const steps = site.services.items;

  useGSAP(
    () => {
      const pin = pinRef.current;
      const track = trackRef.current;
      if (!pin || !track || prefersReducedMotion()) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const total = steps.length;
        const tween = gsap.to(track, {
          yPercent: -((total - 1) / total) * 100,
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: `+=${(total - 1) * 100}%`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (!self.isActive) return;
              setSceneTarget({
                rotY: gsap.utils.interpolate(
                  SERVICE_STEP_ROTATION[0],
                  SERVICE_STEP_ROTATION[total - 1],
                  self.progress,
                ),
              });
            },
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
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
          <h2
            id="services-title"
            className="mt-6 text-[clamp(2rem,5vw,4rem)] leading-[1.05] font-medium tracking-[-0.03em]"
          >
            {site.services.heading}{" "}
            <em className="accent-italic">{site.services.headingEmphasis}</em>
          </h2>
          <p className="label mt-4 text-muted md:hidden">
            {site.services.note}
          </p>
        </Container>
      </div>

      <div
        ref={pinRef}
        className="relative mt-12 md:mt-0 md:h-svh md:overflow-hidden"
      >
        <div
          ref={trackRef}
          className="md:flex md:h-[calc(var(--services-count,4)*100svh)] md:flex-col"
          style={{ "--services-count": steps.length } as CSSProperties}
        >
          {steps.map((step) => (
            <article
              key={step.index}
              data-service-step
              className="flex border-t border-line py-16 first:border-t-0 md:h-svh md:items-center md:border-t-0 md:py-0"
            >
              <Container className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <div>
                  <p className="label text-muted">({step.index})</p>
                  <h3 className="mt-4 text-[clamp(2.2rem,5vw,4rem)] leading-[1.02] font-medium tracking-[-0.03em]">
                    {step.title}
                  </h3>
                  <p className="mt-5 max-w-md text-lg text-fg/85">
                    {step.summary}
                  </p>
                  <dl className="mt-8 space-y-2">
                    <div className="flex gap-3">
                      <dt className="label pt-1 text-muted">Best for</dt>
                      <dd className="text-pretty text-fg/85">{step.bestFor}</dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="label pt-1 text-muted">Timeline</dt>
                      <dd className="text-fg/85">{step.timeline}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <p className="text-pretty text-muted">{step.detail}</p>
                  <ul className="mt-8 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                    {step.deliverables.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <Tick />
                        <span className="text-pretty text-fg/85">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Container>
            </article>
          ))}
        </div>
      </div>

      <div className="hidden pb-16 md:block">
        <Container>
          <p className="label text-muted">{site.services.note}</p>
        </Container>
      </div>
    </section>
  );
}