"use client";

import { useEffect, useState } from "react";
import { findActiveSectionId } from "@/lib/scene-keyframes";

const META: Record<string, { index?: string; label: string }> = {
  hero: { label: "Home" },
  manifesto: { label: "Manifesto" },
  services: { index: "01", label: "Services" },
  clients: { label: "Clients" },
  process: { index: "02", label: "Process" },
  work: { index: "03", label: "Work" },
  why: { label: "Why Domweave" },
  commitments: { label: "Commitments" },
  founder: { label: "Founder" },
  stack: { label: "Stack" },
  faq: { index: "04", label: "FAQ" },
  contact: { index: "05", label: "Contact" },
};

export default function SectionIndicator() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const id = findActiveSectionId();
      if (id) setActive(id);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const meta = META[active];
  if (!meta) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-5 left-[var(--gutter)] z-40 hidden md:block"
    >
      <span className="section-indicator label text-muted tabular-nums">
        ( {meta.index ? `${meta.index} / ` : ""}
        {meta.label} )
      </span>
    </div>
  );
}
