"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { site } from "@/content/site";
import { isFinePointer, prefersReducedMotion } from "@/lib/motion";
import { scrollToId } from "@/lib/scroll";

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const canPreviewRef = useRef(false);
  const [active, setActive] = useState<number | null>(null);
  const projects = site.work.projects;

  useEffect(() => {
    canPreviewRef.current = isFinePointer() && !prefersReducedMotion();
  }, []);

  useGSAP(
    () => {
      const preview = previewRef.current;
      if (!preview || !isFinePointer() || prefersReducedMotion()) return;

      gsap.set(preview, { xPercent: -50, yPercent: -50 });
      const xTo = gsap.quickTo(preview, "x", {
        duration: 0.5,
        ease: "power3.out",
      });
      const yTo = gsap.quickTo(preview, "y", {
        duration: 0.5,
        ease: "power3.out",
      });

      const onPointerMove = (event: PointerEvent) => {
        xTo(event.clientX);
        yTo(event.clientY);
      };

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      return () => window.removeEventListener("pointermove", onPointerMove);
    },
    { scope: sectionRef },
  );

  const handleClosing = (
    event: MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    event.preventDefault();
    scrollToId(id);
  };

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-labelledby="work-title"
      className="relative z-10 border-t border-line px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto w-full max-w-6xl">
        <p className="label text-muted">{site.work.label}</p>
        <h2
          id="work-title"
          className="mt-6 text-[clamp(2rem,5vw,4rem)] leading-[1.05] font-medium tracking-[-0.03em]"
        >
          {site.work.heading}{" "}
          <em className="accent-italic">{site.work.headingEmphasis}</em>
        </h2>

        <ul className="mt-14 border-t border-line">
          {projects.map((project, index) => (
            <li
              key={project.name}
              className="border-b border-line"
              onPointerEnter={() => {
                if (canPreviewRef.current) setActive(index);
              }}
              onPointerLeave={() => setActive(null)}
            >
              <div className="grid items-baseline gap-4 py-8 transition-colors hover:bg-fg/[0.03] md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-8">
                <span className="label text-muted">{project.index}</span>

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-[clamp(1.5rem,3.4vw,2.6rem)] leading-[1.05] font-medium tracking-[-0.03em]">
                      {project.name}
                    </h3>
                    <span className="label rounded-full border border-line px-2 py-1 text-muted">
                      {site.work.sampleTag}
                    </span>
                  </div>
                  <p className="mt-2 max-w-xl text-pretty text-muted">
                    {project.blurb}
                  </p>
                  <p className="label mt-4 text-muted">
                    {project.highlights.join(" · ")}
                  </p>
                  <p className="label mt-2 text-subtle">
                    {project.stack.join(" · ")}
                  </p>
                </div>

                <span className="label text-muted md:text-right">
                  {project.type} · {project.year}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-12">
          <a
            href="#contact"
            data-cursor="open"
            onClick={(event) => handleClosing(event, "contact")}
            className="text-xl font-medium tracking-[-0.02em] transition-colors hover:text-accent md:text-2xl"
          >
            {site.work.closing} →
          </a>
        </div>
      </div>

      <div
        ref={previewRef}
        aria-hidden="true"
        className="preview-only-fine pointer-events-none fixed top-0 left-0 z-[75] h-56 w-80 overflow-hidden rounded-md border border-line"
        style={{
          background: active !== null ? projects[active].gradient : "transparent",
          opacity: active !== null ? 1 : 0,
          clipPath:
            active !== null ? "inset(0% 0 0 0)" : "inset(0 0 100% 0)",
          transition: "clip-path 0.5s ease, opacity 0.3s ease",
        }}
      >
        <span className="label absolute bottom-3 left-3 text-fg">
          {active !== null ? projects[active].name : ""}
        </span>
      </div>
    </section>
  );
}