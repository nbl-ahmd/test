"use client";

import { useId, useState } from "react";
import type { FaqItem } from "@/content/site";

export default function Accordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="border-t border-line">
      {items.map((item, index) => {
        const isOpen = open === index;
        const buttonId = `${baseId}-button-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <div key={item.question} className="border-b border-line">
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex w-full items-start justify-between gap-6 py-7 text-left transition-colors hover:text-accent md:py-8"
              >
                <span className="flex items-baseline gap-4 md:gap-8">
                  <span className="label text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[clamp(1.35rem,3vw,2.4rem)] leading-[1.15] font-medium tracking-[-0.02em] text-balance">
                    {item.question}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="relative mt-2 size-5 shrink-0"
                >
                  <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
                  <span
                    className={`absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current transition-transform duration-300 ${
                      isOpen ? "scale-y-0" : "scale-y-100"
                    }`}
                  />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              className="grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="max-w-[60ch] pb-8 text-[17px] leading-[1.6] text-muted md:text-[18px]">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
