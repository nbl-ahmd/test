import { setSceneTarget, type SceneTarget } from "@/lib/scene-store";

export type SectionKeyframe = SceneTarget;

/**
 * Scroll keyframes per section id. Sections that do not exist yet are simply
 * skipped by the runner, so this stays in sync with the final page order.
 */
export const SECTION_KEYFRAMES: Record<string, SectionKeyframe> = {
  hero: { shape: 0, dim: 1, x: 0, camZ: 6.5, rotY: 0, turbulence: 0.35 },
  manifesto: { shape: 1, dim: 0.55, x: 1.6, camZ: 7.2, rotY: 0, turbulence: 0.16 },
  services: { shape: 2, dim: 0.5, x: 2.2, camZ: 7, rotY: 0, turbulence: 0.1 },
  process: { shape: 3, dim: 0.45, x: 0, camZ: 6.5, rotY: 0, turbulence: 0.12 },
  work: { shape: 1, dim: 0.2, x: 0, camZ: 7.4, rotY: 0.4, turbulence: 0.14 },
  why: { shape: 1, dim: 0.2, x: 0, camZ: 7.4, rotY: 0.7, turbulence: 0.14 },
  commitments: { shape: 1, dim: 0.2, x: 0, camZ: 7.4, rotY: 1, turbulence: 0.14 },
  stack: { shape: 1, dim: 0.18, x: 0, camZ: 7.4, rotY: 1.3, turbulence: 0.14 },
  testimonials: { shape: 1, dim: 0.2, x: 0, camZ: 7.4, rotY: 1.6, turbulence: 0.14 },
  faq: { shape: 1, dim: 0.2, x: 0, camZ: 7.4, rotY: 1.9, turbulence: 0.14 },
  contact: { shape: 4, dim: 0.7, x: 2.4, camZ: 5.2, rotY: 0, turbulence: 0.2 },
};

export const SECTION_ORDER = Object.keys(SECTION_KEYFRAMES);

export const SERVICE_STEP_ROTATION = [0, 0.9, 1.8, 2.7];

/** Camera dolly range for the process section (travels along the helix). */
export const PROCESS_CAM = { from: 12.5, to: -9 };
/** Camera push-in range for the contact section. */
export const CONTACT_CAM = { from: 6.5, to: 4.6 };

export const MOBILE_MAX_DIM = 0.35;
export const MOBILE_BREAKPOINT = 768;

export function isCompactViewport(): boolean {
  return typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT;
}

export function resolveKeyframe(id: string): SectionKeyframe | null {
  const keyframe = SECTION_KEYFRAMES[id];
  if (!keyframe) return null;

  const compact = isCompactViewport();
  return {
    ...keyframe,
    dim: compact ? Math.min(keyframe.dim, MOBILE_MAX_DIM) : keyframe.dim,
    x: compact ? 0 : keyframe.x,
  };
}

export function applySectionKeyframe(id: string): void {
  const keyframe = resolveKeyframe(id);
  if (!keyframe) return;
  setSceneTarget(keyframe);
}

/** Deepest section whose top has crossed the 55% activation line. */
export function findActiveSectionId(): string | null {
  if (typeof window === "undefined") return null;

  const line = window.innerHeight * 0.55;
  let active: string | null = null;

  for (const id of SECTION_ORDER) {
    const element = document.getElementById(id);
    if (!element) continue;
    if (element.getBoundingClientRect().top <= line) active = id;
  }

  return active;
}