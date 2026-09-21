"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { site } from "@/content/site";
import { onRevealed } from "@/lib/intro";
import { prefersReducedMotion } from "@/lib/motion";
import { setSceneTarget } from "@/lib/scene-store";
import LocalTime from "@/components/ui/LocalTime";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const title = titleRef.current;
      if (!section || !title) return;

      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onEnter: () =>
          setSceneTarget({ shape: 0, dim: 1, camZ: 6.5, turbulence: 0.35 }),
        onEnterBack: () =>
          setSceneTarget({ shape: 0, dim: 1, camZ: 6.5, turbulence: 0.35 }),
      });

      if (prefersReducedMotion()) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const pin = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=80%",
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        });
        return () => pin.kill();
      });

      if (document.documentElement.dataset.preloaded === "true") {
        return () => mm.revert();
      }

      const split = SplitText.create(title, {
        type: "lines",
        mask: "lines",
        aria: "auto",
      });

      const timeline = gsap.timeline({ paused: true });
      timeline
        .from(split.lines, {
          yPercent: 110,
          duration: 1,
          ease: "power4.out",
          stagger: 0.08,
        })
        .from(
          "[data-hero-fade]",
          { y: 24, autoAlpha: 0, duration: 0.7, ease: "power3.out", stagger: 0.09 },
          0.3,
        );
      timelineRef.current = timeline;

      return () => {
        mm.revert();
        split.revert();
        timelineRef.current = null;
      };
    },
    { scope: sectionRef },
  );

  useEffect(
    () =>
      onRevealed(() => {
        delete document.documentElement.dataset.intro;
        timelineRef.current?.play();
      }),
    [],
  );

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-labelledby="hero-title"
      className="relative z-10 flex min-h-svh flex-col px-5 pt-24 pb-8 md:px-8 md:pt-28 md:pb-10"
    >
      <p data-intro-hide data-hero-fade className="label text-muted">
        {site.hero.label}
      </p>

      <div className="mt-auto">
        <h1
          ref={titleRef}
          id="hero-title"
          data-intro-hide
          className="display max-w-[14ch] text-balance"
        >
          {site.hero.titleBefore}{" "}
          <em className="accent-italic">{site.hero.titleEmphasis}</em>{" "}
          {site.hero.titleAfter}
        </h1>
        <p
          data-intro-hide
          data-hero-fade
          className="mt-8 max-w-xl text-lg text-pretty text-muted md:text-xl"
        >
          {site.hero.sub}
        </p>
      </div>

      <div
        data-intro-hide
        data-hero-fade
        className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t border-line pt-5"
      >
        <span className="label text-muted">{site.hero.scrollLabel}</span>
        <span className="label inline-flex items-center gap-2 text-muted">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
          {site.status}
        </span>
        <LocalTime />
      </div>
    </section>
  );
}