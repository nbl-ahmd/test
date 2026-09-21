export type SceneTarget = {
  shape: number;
  dim: number;
  camZ: number;
  rotY: number;
  turbulence: number;
};

export const SCENE_SHAPE_COUNT = 5;

export const scene = {
  target: {
    shape: 0,
    dim: 1,
    camZ: 6.5,
    rotY: 0,
    turbulence: 0.35,
  } satisfies SceneTarget,
  current: {
    shape: 0,
    dim: 1,
    camZ: 6.5,
    rotY: 0,
    turbulence: 0.35,
  } satisfies SceneTarget,
  pointer: { x: 0, y: 0, targetX: 0, targetY: 0 },
};

export function setSceneTarget(patch: Partial<SceneTarget>): void {
  Object.assign(scene.target, patch);
}

export function setPointerTarget(x: number, y: number): void {
  scene.pointer.targetX = x;
  scene.pointer.targetY = y;
}