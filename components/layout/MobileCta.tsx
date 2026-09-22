"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { site } from "@/content/site";
import { scrollToId } from "@/lib/scroll";
import Container from "@/components/layout/Container";

/**
 * Phone-only sticky action bar. Appears once the hero has scrolled past and
 * hides again while the contact section or the menu overlay is open (the
 * latter via `html[data-menu="true"]` in globals.css).
 */
export default function MobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const contact = document.getElementById("contact");
    let heroPassed = false;
    let contactActive = false;
    const update = () => setVisible(heroPassed && !contactActive);

    const heroObs = new IntersectionObserver(
      ([entry]) => {
        heroPassed = !entry.isIntersecting;
        update();
      },
      { rootMargin: "-45% 0px 0px 0px" },
    );
    const contactObs = new IntersectionObserver(
      ([entry]) => {
        contactActive = entry.isIntersecting;
        update();
      },
      { rootMargin: "0px 0px -25% 0px" },
    );

    if (hero) heroObs.observe(hero);
    if (contact) contactObs.observe(contact);
    return () => {
      heroObs.disconnect();
      contactObs.disconnect();
    };
  }, []);

  const handleNav = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToId("contact");
  };

  return (
    <div
      data-visible={visible ? "true" : "false"}
      className="mobile-cta fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/90 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <Container className="py-3">
        <a
          href={site.cta.href}
          data-cursor="open"
          onClick={handleNav}
          className="label inline-flex min-h-11 w-full items-center justify-center rounded-full bg-accent px-6 text-bg transition-colors hover:bg-fg"
        >
          {site.cta.label}
        </a>
      </Container>
    </div>
  );
}
