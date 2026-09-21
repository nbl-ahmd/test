"use client";

import { site } from "@/content/site";
import { scrollToTop } from "@/lib/scroll";
import Magnetic from "@/components/ui/Magnetic";

export default function BackToTop() {
  return (
    <Magnetic>
      <button
        type="button"
        onClick={scrollToTop}
        data-cursor="open"
        className="label inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 transition-colors hover:border-fg hover:bg-fg hover:text-bg"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="size-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 13V3M4 7l4-4 4 4" />
        </svg>
        {site.footer.backToTop}
      </button>
    </Magnetic>
  );
}