"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { site } from "@/content/site";
import { scrollToId, scrollToTop } from "@/lib/scroll";
import Magnetic from "@/components/ui/Magnetic";
import MenuOverlay from "@/components/layout/MenuOverlay";

export default function Header() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const yToRef = useRef<((value: number) => void) | null>(null);
  const openRef = useRef(false);

  useGSAP(
    () => {
      const el = headerRef.current;
      if (!el) return;

      const yTo = gsap.quickTo(el, "yPercent", {
        duration: 0.45,
        ease: "power2.out",
      });
      yToRef.current = yTo;

      const trigger = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          if (openRef.current) return;
          const hidden = self.direction === 1 && self.scroll() > 120;
          yTo(hidden ? -100 : 0);
        },
      });

      return () => {
        trigger.kill();
        yToRef.current = null;
      };
    },
    { scope: headerRef },
  );

  useEffect(() => {
    openRef.current = open;
    if (open) yToRef.current?.(0);
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    menuButtonRef.current?.focus();
  };

  const handleNav = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    scrollToId(id);
  };

  const handleTop = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToTop();
  };

  return (
    <>
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50 will-change-transform"
      >
        <div className="flex items-center justify-between px-5 py-4 md:px-8 md:py-5">
          <a
            href="#hero"
            onClick={handleTop}
            className="text-[1.05rem] font-medium tracking-tight"
          >
            {site.wordmark}
            <span className="align-super text-[0.55em]">{site.mark}</span>
          </a>

          <div className="flex items-center gap-3 md:gap-6">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls="site-menu"
              className="label text-muted transition-colors hover:text-fg"
            >
              Menu
            </button>

            <Magnetic>
              <a
                href={site.cta.href}
                data-cursor="open"
                onClick={(event) => handleNav(event, "contact")}
                className="label inline-flex items-center rounded-full border border-line px-4 py-2.5 transition-colors hover:border-fg hover:bg-fg hover:text-bg md:px-5"
              >
                {site.cta.label}
              </a>
            </Magnetic>
          </div>
        </div>
      </header>

      <MenuOverlay open={open} onClose={closeMenu} />
    </>
  );
}
