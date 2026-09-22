import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(next: Lenis | null): void {
  instance = next;
}

export function getLenis(): Lenis | null {
  return instance;
}

export function stopScroll(): void {
  instance?.stop();
}

export function startScroll(): void {
  instance?.start();
}

/** Space left above an anchor target: header height + 4rem. */
export function anchorOffset(): number {
  if (typeof document === "undefined") return 0;
  const header = document.querySelector<HTMLElement>(".site-header");
  return (header?.getBoundingClientRect().height ?? 0) + 64;
}

export function scrollToId(id: string): void {
  const target = document.getElementById(id);
  if (!target) return;

  if (instance) {
    instance.scrollTo(target, {
      duration: 1.2,
      force: true,
      offset: -anchorOffset(),
    });
    return;
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function scrollToTop(): void {
  if (instance) {
    instance.scrollTo(0, { duration: 1.2 });
    return;
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}
