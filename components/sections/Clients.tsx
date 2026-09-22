"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { site } from "@/content/site";
import { prefersReducedMotion } from "@/lib/motion";
import Container from "@/components/layout/Container";

export default function Clients() {
  const sectionRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);
  const { clients } = site;

  useGSAP(
    () => {
      const statement = statementRef.current;
      if (!statement) return;

      if (prefersReducedMotion()) {
        gsap.set("[data-underline]", { scaleX: 1 });
        return;
      }

      const tween = gsap.fromTo(
        "[data-underline]",
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          ease: "none",
          stagger: 0.45,
          scrollTrigger: {
            trigger: statement,
            start: "top 78%",
            end: "bottom 72%",
            scrub: true,
          },
        },
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="clients"
      aria-labelledby="clients-title"
      className="relative z-10 flex min-h-svh items-center border-t border-line py-32 md:py-40"
    >
      <Container>
        <p className="label text-muted">{clients.label}</p>
        <p id="clients-title" className="sr-only">
          Who we work with
        </p>
        <p
          ref={statementRef}
          className="mt-10 max-w-[22ch] text-[clamp(2.2rem,7vw,7.5rem)] leading-[1.02] font-medium tracking-[-0.045em] text-balance"
        >
          {clients.statement.map((part, index) =>
            part.accent ? (
              <span key={index} className="relative inline-block whitespace-nowrap">
                {part.text}
                <span
                  data-underline
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-[0.04em] h-[0.055em] origin-left scale-x-0 rounded-full bg-accent"
                />
              </span>
            ) : (
              <span key={index}>{part.text}</span>
            ),
          )}
        </p>
      </Container>
    </section>
  );
}
