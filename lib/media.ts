/**
 * Capability-first media conditions shared by `gsap.matchMedia()` and runtime
 * checks. Width alone is not enough: an iPad in landscape is lg-wide but still
 * touch, so interaction behaviour keys off `hover`/`pointer`.
 */
export const DESKTOP = "(min-width: 1024px) and (hover: hover)";

/** Width-only large breakpoint, used where a layout mirrors the `lg:` classes. */
export const LARGE = "(min-width: 1024px)";

export const TOUCH_OR_SMALL = "(max-width: 1023px), (hover: none)";

export const REDUCE = "(prefers-reduced-motion: reduce)";
