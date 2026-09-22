"use client";

import { useEffect, useRef, type MouseEvent, type TouchEvent } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { site } from "@/content/site";
import { scrollToId, startScroll, stopScroll } from "@/lib/scroll";
import { prefersReducedMotion } from "@/lib/motion";
import Container from "@/components/layout/Container";
import Logomark from "@/components/ui/Logomark";
import { DUR, EASE } from "@/lib/motion-tokens";

type MenuOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export default function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const panel = panelRef.current;
      if (!root || !panel) return;

      if (prefersReducedMotion()) {
        gsap.set(root, {
          autoAlpha: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        });
        gsap.set(panel, { clipPath: "inset(0% 0% 0% 0%)" });
        return;
      }

      if (!open) {
        const tl = gsap.timeline({
          onComplete: () => gsap.set(root, { autoAlpha: 0, pointerEvents: "none" }),
        });
        tl.to(panel, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: DUR.fast,
          ease: EASE.inOut,
        });
        return;
      }

      stopScroll();
      document.body.style.overflow = "hidden";

      const links = Array.from(
        panel.querySelectorAll<HTMLElement>("[data-menu-link]"),
      );
      const splits = links.map((el) =>
        SplitText.create(el, { type: "chars", mask: "chars", aria: "hidden" }),
      );

      const tl = gsap.timeline();
      tl.set(root, { autoAlpha: 1, pointerEvents: "auto" })
        .fromTo(
          panel,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: DUR.base, ease: EASE.inOut },
          0,
        )
        .from(
          splits.flatMap((split) => split.chars),
          { yPercent: 120, duration: DUR.base, ease: EASE.out, stagger: 0.018 },
          0.2,
        )
        .from(
          "[data-menu-item]",
          { autoAlpha: 0, y: 24, duration: DUR.base, ease: EASE.out, stagger: 0.07 },
          0.35,
        );

      closeRef.current?.focus();

      return () => {
        splits.forEach((split) => split.revert());
      };
    },
    { dependencies: [open], scope: rootRef },
  );

  useEffect(() => {
    const main = document.getElementById("main");

    if (!open) {
      main?.removeAttribute("inert");
      document.body.style.overflow = "";
      startScroll();
      return;
    }

    main?.setAttribute("inert", "");

    const root = rootRef.current;
    if (!root) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusables = Array.from(
        root.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && (active === first || !root.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      main?.removeAttribute("inert");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const handleNav = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    onClose();
    requestAnimationFrame(() => scrollToId(id));
  };

  // Swipe down or right to dismiss the overlay on touch devices.
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };
  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (dx > 80 || dy > 80) onClose();
  };

  return (
    <div
      id="site-menu"
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="invisible fixed inset-0 z-[60]"
    >
      <div
        ref={panelRef}
        className="absolute inset-0 flex h-[100dvh] flex-col bg-bg"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Container className="flex items-center justify-between pt-[calc(env(safe-area-inset-top)+1rem)] pb-4 md:pb-5">
          <span className="flex items-center gap-2 font-medium tracking-tight">
            <Logomark className="size-5 shrink-0" />
            <span>
              {site.wordmark}
              <span className="align-super text-[0.75em]">{site.mark}</span>
            </span>
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="label inline-flex min-h-11 min-w-11 items-center justify-center px-2"
          >
            Close
          </button>
        </Container>

        <Container as="nav" className="flex flex-1 flex-col justify-center gap-1">
          {site.nav.map((item) => (
            <a
              key={item.id}
              href={item.href}
              data-cursor="view"
              onClick={(event) => handleNav(event, item.id)}
              className="group flex min-h-14 items-baseline gap-4 border-b border-line py-3 md:gap-8 md:py-4"
            >
              <span data-menu-item className="label text-muted">
                {item.index}
              </span>
              <span
                data-menu-link
                className="display text-[clamp(2.5rem,8vw,6rem)] transition-colors duration-300 group-hover:text-accent"
              >
                {item.label}
              </span>
            </a>
          ))}

          <a
            href={site.cta.href}
            data-menu-item
            data-cursor="open"
            onClick={(event) => handleNav(event, "contact")}
            className="label mt-8 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-accent px-6 text-bg transition-colors hover:bg-fg"
          >
            {site.cta.label}
          </a>
        </Container>

        <Container className="flex flex-wrap items-center justify-between gap-4 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
          <a
            data-menu-item
            href={`mailto:${site.email}`}
            className="label inline-flex min-h-11 items-center text-muted hover:text-fg"
          >
            {site.email}
          </a>
          <ul data-menu-item className="flex gap-5">
            {site.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="open"
                  className="label inline-flex min-h-11 items-center text-muted hover:text-fg"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </div>
  );
}
