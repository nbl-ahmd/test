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

      const words = gsap.utils.toArray<HTMLElement>("[data-accent]", statement);
      if (prefersReducedMotion()) {
        gsap.set(words, { backgroundSize: "100% 2px" });
        return;
      }

      const tween = gsap.fromTo(
        words,
        { backgroundSize: "0% 2px" },
        {
          backgroundSize: "100% 2px",
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
        <div className="grid-12">
          <div className="col-span-12 lg:col-span-7">
        <p className="label text-muted">{clients.label}</p>
        <p id="clients-title" className="sr-only">
          Who we work with
        </p>
        <p
          ref={statementRef}
          className="mt-10 max-w-[22ch] text-[clamp(2.2rem,7vw,7.5rem)] leading-[1.02] font-medium tracking-[-0.045em] text-balance max-lg:text-[clamp(1.9rem,6.5vw,4rem)]"
        >
          {clients.statement.map((part, index) =>
            part.accent ? (
              <span key={index} data-accent className="accent-word">
                {part.text}
              </span>
            ) : (
              <span key={index}>{part.text}</span>
            ),
          )}
        </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
