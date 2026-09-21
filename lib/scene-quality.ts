export type SceneQuality = {
  count: number;
  dpr: [number, number];
  lowEnd: boolean;
};

const DESKTOP_COUNT = 22000;
const MOBILE_COUNT = 8000;

export function getSceneQuality(): SceneQuality {
  if (typeof window === "undefined") {
    return { count: DESKTOP_COUNT, dpr: [1, 1.75], lowEnd: false };
  }

  const cores = navigator.hardwareConcurrency ?? 8;
  const lowEnd = window.innerWidth < 768 || cores <= 4;

  return {
    count: lowEnd ? MOBILE_COUNT : DESKTOP_COUNT,
    dpr: lowEnd ? [1, 1] : [1, 1.75],
    lowEnd,
  };
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