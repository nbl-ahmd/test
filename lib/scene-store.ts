/**
 * Where the scene lives relative to the text:
 * - `hero`   centred stage (used by the hero and full-bleed pinned sections)
 * - `right`  shape group centred at 72vw, ~30vw wide, text in columns 1–7
 * - `hidden` dimmed to nothing behind light "paper" sections
 */
export type SceneStage = "hero" | "right" | "hidden";

export type SceneTarget = {
  shape: number;
  dim: number;
  stage: SceneStage;
  /** Manual world-space offset added on top of the stage-derived position. */
  x: number;
  camZ: number;
  rotY: number;
  turbulence: number;
};

export const SCENE_SHAPE_COUNT = 5;

export type PointerState = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
};

export type SceneStore = {
  target: SceneTarget;
  current: SceneTarget;
  pointer: PointerState;
  velocity: number;
  progress: number;
};

const DEFAULTS: SceneTarget = {
  shape: 0,
  dim: 1,
  stage: "hero",
  x: 0,
  camZ: 6.5,
  rotY: 0,
  turbulence: 0.35,
};

function createStore(): SceneStore {
  return {
    target: { ...DEFAULTS },
    current: { ...DEFAULTS },
    pointer: { x: 0, y: 0, targetX: 0, targetY: 0 },
    velocity: 0,
    progress: 0,
  };
}

// Kept on globalThis so hot-reload cannot leave sections writing to one store
// while the mounted render tree reads another.
const KEY = "__domweaveSceneStore";
const globalObject = globalThis as unknown as Record<string, SceneStore | undefined>;

export const scene: SceneStore =
  globalObject[KEY] ?? (globalObject[KEY] = createStore());

export function setSceneTarget(patch: Partial<SceneTarget>): void {
  Object.assign(scene.target, patch);
}

export function setPointerTarget(x: number, y: number): void {
  scene.pointer.targetX = x;
  scene.pointer.targetY = y;
}

export function setVelocity(velocity: number): void {
  scene.velocity = velocity;
}

export function setProgress(progress: number): void {
  scene.progress = progress;
}