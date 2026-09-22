"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { site } from "@/content/site";
import { scrollToId, scrollToTop } from "@/lib/scroll";
import Magnetic from "@/components/ui/Magnetic";
import MenuOverlay from "@/components/layout/MenuOverlay";
import Container from "@/components/layout/Container";
import Logomark from "@/components/ui/Logomark";
import { DUR, EASE } from "@/lib/motion-tokens";

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
        duration: DUR.fast,
        ease: EASE.out,
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

  // Expose menu state to CSS (e.g. hide the mobile CTA bar while open).
  useEffect(() => {
    if (open) {
      document.documentElement.dataset.menu = "true";
    } else {
      delete document.documentElement.dataset.menu;
    }
    return () => {
      delete document.documentElement.dataset.menu;
    };
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
        className="site-header fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] will-change-transform"
      >
        <Container className="flex items-center justify-between py-4 md:py-5">
          <a
            href="#hero"
            onClick={handleTop}
            className="flex min-h-11 items-center gap-2 text-[1.05rem] font-medium tracking-tight"
          >
            <Logomark className="size-5 shrink-0" />
            <span>
              {site.wordmark}
              <span className="align-super text-[0.75em]">{site.mark}</span>
            </span>
          </a>

          <div className="flex items-center gap-2 md:gap-6">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls="site-menu"
              className="label inline-flex min-h-11 min-w-11 items-center justify-center px-2 text-muted transition-colors hover:text-fg"
            >
              Menu
            </button>

            <span className="hidden md:inline-block">
              <Magnetic>
                <a
                  href={site.cta.href}
                  data-cursor="open"
                  data-header-cta
                  onClick={(event) => handleNav(event, "contact")}
                  className="label inline-flex min-h-11 items-center rounded-full border border-line px-4 py-2.5 whitespace-nowrap transition-colors hover:border-fg hover:bg-fg hover:text-bg md:px-5"
                >
                  {site.cta.label}
                </a>
              </Magnetic>
            </span>
          </div>
        </Container>
      </header>

      <MenuOverlay open={open} onClose={closeMenu} />
    </>
  );
}
