import { prefersReducedMotion } from "@/lib/motion";

export type SceneTier = "high" | "mid" | "low" | "static";

export type SceneQuality = {
  tier: SceneTier;
  count: number;
  dpr: [number, number];
};

const COUNTS: Record<Exclude<SceneTier, "static">, number> = {
  high: 18000,
  mid: 10000,
  low: 4000,
};

const DPR: Record<Exclude<SceneTier, "static">, [number, number]> = {
  high: [1, 1.75],
  mid: [1, 1.5],
  low: [1, 1],
};

function tierQuality(tier: Exclude<SceneTier, "static">): SceneQuality {
  return { tier, count: COUNTS[tier], dpr: DPR[tier] };
}

/**
 * Computed once on the client. `static` means: reduced motion, so the scene is
 * replaced by the CSS gradient fallback.
 */
export function getSceneQuality(): SceneQuality {
  if (typeof window === "undefined") return tierQuality("high");
  if (prefersReducedMotion()) return { tier: "static", count: 0, dpr: [1, 1] };

  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const lowEnd =
    window.innerWidth < 768 || memory <= 4 || cores <= 4;
  if (lowEnd) return tierQuality("low");

  if (fine && cores >= 8) return tierQuality("high");
  return tierQuality("mid");
}

export function hasWebGL(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ?? canvas.getContext("webgl"),
    );
  } catch {
    return false;
  }
}
