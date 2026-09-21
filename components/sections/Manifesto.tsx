"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { site } from "@/content/site";
import { prefersReducedMotion } from "@/lib/motion";
import Reveal from "@/components/ui/Reveal";

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const text = textRef.current;
      if (!section || !text) return;
      if (prefersReducedMotion()) return;

      const split = SplitText.create(text, { type: "words", aria: "none" });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const tween = gsap.fromTo(
          split.words,
          { opacity: 0.15 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.5,
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=140%",
              scrub: true,
              pin: true,
              anticipatePin: 1,
            },
          },
        );
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });
      mm.add("(max-width: 767px)", () => {
        const tween = gsap.fromTo(
          split.words,
          { opacity: 0.15 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.15,
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "bottom 60%",
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
    <>
      <section
        ref={sectionRef}
        id="manifesto"
        aria-label="Manifesto"
        className="relative z-10 flex min-h-svh items-center border-t border-line px-5 py-24 md:px-8"
      >
        <div className="text-scrim mx-auto w-full max-w-5xl">
          <p className="label text-muted">{site.manifesto.label}</p>
          <p className="sr-only">{site.manifesto.body}</p>
          <p
            ref={textRef}
            aria-hidden="true"
            className="mt-8 text-[clamp(1.6rem,4vw,3.4rem)] leading-[1.5] font-medium tracking-[-0.03em] text-balance"
          >
            {site.manifesto.body}
          </p>
        </div>
      </section>

      <section
        id="principles"
        aria-label="Principles"
        className="relative z-10 border-t border-line px-5 py-20 md:px-8 md:py-28"
      >
        <Reveal className="text-scrim mx-auto grid w-full max-w-5xl gap-10 md:grid-cols-3">
          {site.manifesto.principles.map((principle) => (
            <article key={principle.title} data-reveal>
              <p className="label text-muted">{principle.index}</p>
              <h2 className="mt-4 text-xl font-medium tracking-[-0.02em] md:text-2xl">
                {principle.title}
              </h2>
              <p className="mt-3 text-pretty text-muted">{principle.body}</p>
            </article>
          ))}
        </Reveal>
      </section>
    </>
  );
}