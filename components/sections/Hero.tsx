"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { site } from "@/content/site";
import { onRevealed } from "@/lib/intro";
import { prefersReducedMotion } from "@/lib/motion";
import { DESKTOP } from "@/lib/media";
import { DUR, EASE } from "@/lib/motion-tokens";
import { scrollToId } from "@/lib/scroll";
import LocalTime from "@/components/ui/LocalTime";
import Magnetic from "@/components/ui/Magnetic";
import Container from "@/components/layout/Container";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const title = titleRef.current;
      if (!section || !title) return;

      if (prefersReducedMotion()) return;

      const mm = gsap.matchMedia();
      mm.add(DESKTOP, () => {
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
          duration: DUR.slow,
          ease: EASE.out,
          stagger: 0.08,
        })
        .from(
          "[data-hero-fade]",
          {
            y: 24,
            autoAlpha: 0,
            duration: DUR.base,
            ease: EASE.out,
            stagger: 0.09,
          },
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

  const handleNav = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    scrollToId(id);
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-labelledby="hero-title"
      className="relative z-10 flex min-h-svh flex-col pt-24 pb-8 [@media(max-height:500px)]:min-h-0 md:pt-28 md:pb-10"
    >
      <Container className="flex flex-1 flex-col">
        <p data-intro-hide data-hero-fade className="label text-muted">
          {site.hero.label}
        </p>

        <div className="mt-auto grid-12">
          <div className="col-span-12 lg:col-span-7">
            <h1
              ref={titleRef}
              id="hero-title"
              data-intro-hide
              className="display max-w-[14ch] text-balance [@media(max-height:500px)]:text-[clamp(2rem,9vh,3rem)]"
            >
              {site.hero.titleBefore}{" "}
              <em className="accent-italic">{site.hero.titleEmphasis}</em>{" "}
              {site.hero.titleAfter}
            </h1>
            <p
              data-intro-hide
              data-hero-fade
              className="text-scrim mt-8 max-w-xl text-[1.125rem] leading-[1.6] text-pretty text-fg/85 md:text-[1.375rem]"
            >
              {site.hero.sub}
            </p>

            <div
              data-intro-hide
              data-hero-fade
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            >
              <Magnetic>
                <a
                  href={site.hero.primaryCta.href}
                  data-cursor="open"
                  onClick={(event) => handleNav(event, "contact")}
                  className="label inline-flex min-h-11 w-full items-center justify-center rounded-full bg-accent px-5 py-3 whitespace-nowrap text-bg transition-colors hover:bg-fg sm:w-auto"
                >
                  {site.hero.primaryCta.label}
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href={site.hero.secondaryCta.href}
                  data-cursor="view"
                  onClick={(event) => handleNav(event, "work")}
                  className="label inline-flex min-h-11 w-full items-center justify-center rounded-full border border-line px-5 py-3 transition-colors hover:border-fg sm:w-auto"
                >
                  {site.hero.secondaryCta.label}
                </a>
              </Magnetic>
            </div>

            <p
              data-intro-hide
              data-hero-fade
              className="text-scrim label mt-6 text-muted"
            >
              {site.hero.trustStrip.join(" · ")}
            </p>
          </div>
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
          <span className="hidden sm:inline-block">
            <LocalTime />
          </span>
        </div>
      </Container>
    </section>
  );
}