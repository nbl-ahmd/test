"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { site } from "@/content/site";
import { prefersReducedMotion } from "@/lib/motion";
import { setSceneTarget } from "@/lib/scene-store";

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const text = textRef.current;
      if (!section || !text) return;
      if (prefersReducedMotion()) return;

      ScrollTrigger.create({
        trigger: section,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () =>
          setSceneTarget({ shape: 1, dim: 1, camZ: 7.2, turbulence: 0.16 }),
        onEnterBack: () =>
          setSceneTarget({ shape: 1, dim: 1, camZ: 7.2, turbulence: 0.16 }),
      });

      const split = SplitText.create(text, { type: "words", aria: "auto" });

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
    <section
      ref={sectionRef}
      id="manifesto"
      aria-label="Manifesto"
      className="relative z-10 flex min-h-svh items-center border-t border-line px-5 py-24 md:px-8"
    >
      <div className="mx-auto w-full max-w-5xl">
        <p className="label text-muted">{site.manifesto.label}</p>
        <p
          ref={textRef}
          className="mt-8 text-[clamp(1.6rem,4vw,3.4rem)] leading-[1.18] font-medium tracking-[-0.03em] text-balance"
        >
          {site.manifesto.body}
        </p>
      </div>
    </section>
  );
}