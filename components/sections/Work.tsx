"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { site } from "@/content/site";
import { isFinePointer, prefersReducedMotion } from "@/lib/motion";
import { scrollToId } from "@/lib/scroll";
import Container from "@/components/layout/Container";
import ProjectMock from "@/components/sections/ProjectMock";
import LineReveal from "@/components/ui/LineReveal";
import { DUR, EASE } from "@/lib/motion-tokens";

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

      gsap.set(preview, { yPercent: -50 });
      const yTo = gsap.quickTo(preview, "y", {
        duration: DUR.base,
        ease: EASE.out,
      });

      const onPointerMove = (event: PointerEvent) => {
        yTo(
          gsap.utils.clamp(
            150,
            window.innerHeight - 150,
            event.clientY,
          ),
        );
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
      className="relative z-10 border-t border-line py-24 md:py-32"
    >
      <Container>
        <p className="label text-muted">{site.work.label}</p>
        <LineReveal
          as="h2"
          id="work-title"
          className="mt-6 text-[clamp(2.4rem,5vw,4rem)] leading-[1.05] font-medium tracking-[-0.03em]"
          stagger={0.12}
          yPercent={100}
          start="top 82%"
        >
          {site.work.heading}{" "}
          <em className="accent-italic">{site.work.headingEmphasis}</em>
        </LineReveal>

        <div className="grid-12 mt-14">
          <div className="col-span-12 lg:col-span-7">
            <ul className="border-t border-line">
              {projects.map((project, index) => {
                const isActive = active === index;
                return (
                  <li
                    key={project.name}
                    className="border-b border-line"
                    onPointerEnter={() => {
                      if (canPreviewRef.current) setActive(index);
                    }}
                    onPointerLeave={() => setActive(null)}
                  >
                    <button
                      type="button"
                      aria-expanded={isActive}
                      data-cursor="view"
                      onClick={() => setActive(isActive ? null : index)}
                      onFocus={() => setActive(index)}
                      onBlur={() => setActive(null)}
                      className="block w-full py-6 text-left md:py-8"
                    >
                      <span className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-x-4 md:gap-x-8">
                        <span className="label text-muted">
                          {project.index}
                        </span>
                        <span className="flex flex-wrap items-center gap-3">
                          <span className="text-[clamp(1.6rem,3.6vw,2.8rem)] leading-[1.05] font-medium tracking-[-0.03em]">
                            {project.name}
                          </span>
                          <span className="label rounded-full border border-line px-2 py-1 text-muted">
                            {site.work.sampleTag}
                          </span>
                        </span>
                        <span className="label text-muted md:text-right">
                          {project.type} · {project.year}
                        </span>
                      </span>

                      <span
                        className="grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none"
                        style={{
                          gridTemplateRows: isActive ? "1fr" : "0fr",
                        }}
                      >
                        <span className="overflow-hidden">
                          <span className="block pt-4 md:pt-5">
                            <span className="block max-w-[52ch] text-[17px] leading-[1.6] text-fg/90">
                              {project.blurb}
                            </span>
                            <span className="label mt-3 block text-muted [overflow-wrap:anywhere]">
                              {project.highlights.join(" / ")} —{" "}
                              {project.stack.join(" / ")}
                            </span>
                            {/* Touch/small screens: the browser mock renders
                                inside the expanded row instead of following a
                                cursor. */}
                            <span className="mt-5 hidden touch:block motion-reduce:block">
                              <span className="relative block aspect-[16/10] w-full overflow-hidden rounded-lg border border-line">
                                <ProjectMock project={project} />
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-12">
              <a
                href="#contact"
                data-cursor="open"
                onClick={(event) => handleClosing(event, "contact")}
                className="inline-flex min-h-11 items-center text-xl font-medium tracking-[-0.02em] transition-colors hover:text-accent md:text-2xl"
              >
                {site.work.closing} →
              </a>
            </div>
          </div>
        </div>
      </Container>

      <div
        ref={previewRef}
        aria-hidden="true"
        className="preview-only-fine pointer-events-none fixed top-0 left-[62vw] z-[75] h-56 w-[30vw] overflow-hidden rounded-lg border border-line"
        style={{
          opacity: active !== null ? 1 : 0,
          clipPath:
            active !== null ? "inset(0% 0 0 0)" : "inset(0 0 100% 0)",
          transition:
            "clip-path 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease",
        }}
      >
        {active !== null ? <ProjectMock project={projects[active]} /> : null}
      </div>
    </section>
  );
}
