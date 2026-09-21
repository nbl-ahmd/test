import { setSceneTarget, type SceneTarget } from "@/lib/scene-store";
import { prefersMoreContrast } from "@/lib/motion";

export type SectionKeyframe = SceneTarget;

/**
 * Scroll keyframes per section id. Sections that do not exist yet are simply
 * skipped by the runner, so this stays in sync with the final page order.
 */
// Ordered as they appear on the page. Only the hero cloud is turbulent;
// every woven structure reads as crisp geometry (turbulence 0).
export const SECTION_KEYFRAMES: Record<string, SectionKeyframe> = {
  hero: { shape: 0, dim: 1, stage: "hero", x: 0, camZ: 6.5, rotY: 0, turbulence: 0.32 },
  manifesto: { shape: 1, dim: 0.5, stage: "right", x: 0, camZ: 7.2, rotY: 0, turbulence: 0 },
  principles: { shape: 1, dim: 0.45, stage: "right", x: 0, camZ: 7.3, rotY: 0.15, turbulence: 0 },
  services: { shape: 2, dim: 0.5, stage: "right", x: 0, camZ: 7, rotY: 0, turbulence: 0 },
  clients: { shape: 2, dim: 0.35, stage: "right", x: 0, camZ: 7.2, rotY: 0.45, turbulence: 0 },
  process: { shape: 3, dim: 0.3, stage: "hero", x: 0, camZ: 6.5, rotY: 0, turbulence: 0 },
  work: { shape: 1, dim: 0, stage: "hidden", x: 0, camZ: 7.4, rotY: 0.4, turbulence: 0 },
  why: { shape: 1, dim: 0, stage: "hidden", x: 0, camZ: 7.4, rotY: 0.7, turbulence: 0 },
  commitments: { shape: 1, dim: 0.2, stage: "right", x: 0, camZ: 7.4, rotY: 1, turbulence: 0 },
  stack: { shape: 1, dim: 0.15, stage: "right", x: 0, camZ: 7.4, rotY: 1.3, turbulence: 0 },
  testimonials: { shape: 1, dim: 0, stage: "hidden", x: 0, camZ: 7.4, rotY: 1.6, turbulence: 0 },
  faq: { shape: 1, dim: 0.18, stage: "right", x: 0, camZ: 7.4, rotY: 1.9, turbulence: 0 },
  contact: { shape: 4, dim: 0.7, stage: "right", x: 0, camZ: 5.2, rotY: 0, turbulence: 0 },
};

export const SECTION_ORDER = Object.keys(SECTION_KEYFRAMES);

export const SERVICE_STEP_ROTATION = [0, 0.9, 1.8, 2.7];

/** Camera dolly range for the process section (travels along the helix). */
export const PROCESS_CAM = { from: 12.5, to: -9 };
/** Camera push-in range for the contact section. */
export const CONTACT_CAM = { from: 6.5, to: 4.6 };

export const MOBILE_MAX_DIM = 0.2;
export const CONTRAST_MAX_DIM = 0.15;
export const MOBILE_BREAKPOINT = 768;

/** Desktop "right" stage geometry, expressed as fractions of the viewport. */
export const RIGHT_STAGE_CENTER = 0.72;
export const RIGHT_STAGE_WIDTH = 0.3;
/** On phones the scene sits centred behind the text, small and dim. */
export const MOBILE_SCENE_SCALE = 0.7;

export function isCompactViewport(): boolean {
  return typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT;
}

export function resolveKeyframe(id: string): SectionKeyframe | null {
  const keyframe = SECTION_KEYFRAMES[id];
  if (!keyframe) return null;

  const compact = isCompactViewport();
  const moreContrast = prefersMoreContrast();

  let dim = keyframe.dim;
  if (compact) dim = Math.min(dim, MOBILE_MAX_DIM);
  if (moreContrast) dim = Math.min(dim, CONTRAST_MAX_DIM);

  return {
    ...keyframe,
    dim,
    // Phones always centre the scene behind the copy; the horizontal stage is
    // a desktop-only composition.
    stage: compact ? "hero" : keyframe.stage,
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