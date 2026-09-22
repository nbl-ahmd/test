/**
 * Single source of truth for motion. GSAP easings are strings; durations are in
 * seconds. The matching CSS custom properties live in app/globals.css.
 */
export const EASE = {
  out: "power3.out",
  inOut: "expo.inOut",
  in: "power3.in",
  expoOut: "expo.out",
} as const;

export const DUR = {
  fast: 0.4,
  base: 0.8,
  slow: 1.2,
} as const;

export type EaseToken = (typeof EASE)[keyof typeof EASE];
