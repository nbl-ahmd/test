export type ShapeAttributes = {
  positions: [
    Float32Array,
    Float32Array,
    Float32Array,
    Float32Array,
    Float32Array,
  ];
  rand: Float32Array;
  scale: Float32Array;
  /** 1 where a point belongs to a cube edge (shape 2), 0 for face grid. */
  edge: Float32Array;
};

/** Fraction of cube points that trace edges; the rest fill the face grids. */
const CUBE_EDGE_RATIO = 0.72;

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 0 — a loosely woven volume: jittered warp (vertical) and weft (horizontal)
 * strands drifting in depth, so the very first screen already reads as weave
 * rather than uniform dust.
 */
function cloud(count: number, rnd: () => number): Float32Array {
  const out = new Float32Array(count * 3);
  const width = 6.6;
  const height = 4.2;
  const depth = 1.5;
  const amp = 0.24;

  const warpCount = Math.floor(count / 2);
  const warpThreads = 92;
  const warpPer = Math.max(1, Math.ceil(warpCount / warpThreads));

  for (let i = 0; i < warpCount; i += 1) {
    const k = i % warpThreads;
    const j = Math.floor(i / warpThreads);
    const t = j / Math.max(1, warpPer - 1);
    const threadZ = (k / (warpThreads - 1) - 0.5) * depth;
    const over = ((k + j) % 2 === 0 ? 1 : -1) * amp;
    out[i * 3] =
      (k / (warpThreads - 1) - 0.5) * width +
      Math.sin(t * Math.PI * 2 + k * 0.7) * 0.18 +
      (rnd() - 0.5) * 0.06;
    out[i * 3 + 1] = (t - 0.5) * height + (rnd() - 0.5) * 0.05;
    out[i * 3 + 2] =
      threadZ + over + Math.sin(t * Math.PI * 7 + k * 0.35) * 0.12;
  }

  const weftCount = count - warpCount;
  const weftThreads = 68;
  const weftPer = Math.max(1, Math.ceil(weftCount / weftThreads));

  for (let i = warpCount; i < count; i += 1) {
    const local = i - warpCount;
    const k = local % weftThreads;
    const j = Math.floor(local / weftThreads);
    const t = j / Math.max(1, weftPer - 1);
    const threadZ = (k / (weftThreads - 1) - 0.5) * depth;
    const over = ((k + j) % 2 === 0 ? -1 : 1) * amp;
    out[i * 3] = (t - 0.5) * width + (rnd() - 0.5) * 0.05;
    out[i * 3 + 1] =
      (k / (weftThreads - 1) - 0.5) * height +
      Math.sin(t * Math.PI * 2 + k * 0.6) * 0.16 +
      (rnd() - 0.5) * 0.06;
    out[i * 3 + 2] =
      threadZ + over + Math.sin(t * Math.PI * 6 + k * 0.3) * 0.12;
  }

  return out;
}

/** 1 — flat woven fabric with over/under threads */
function weave(count: number, rnd: () => number): Float32Array {
  const out = new Float32Array(count * 3);
  const width = 5.6;
  const height = 3.4;
  const amp = 0.16;

  const warpCount = Math.floor(count / 2);
  const warpThreads = 96;
  const warpPer = Math.max(1, Math.ceil(warpCount / warpThreads));

  for (let i = 0; i < warpCount; i += 1) {
    const k = i % warpThreads;
    const j = Math.floor(i / warpThreads);
    const t = j / Math.max(1, warpPer - 1);
    const x = (k / (warpThreads - 1) - 0.5) * width;
    const y = (t - 0.5) * height;
    const over = ((k + j) % 2 === 0 ? 1 : -1) * amp;
    out[i * 3] = x + (rnd() - 0.5) * 0.012;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = over + Math.sin(t * Math.PI * 26) * 0.03;
  }

  const weftThreads = 64;
  const weftCount = count - warpCount;
  const weftPer = Math.max(1, Math.ceil(weftCount / weftThreads));

  for (let i = warpCount; i < count; i += 1) {
    const local = i - warpCount;
    const k = local % weftThreads;
    const j = Math.floor(local / weftThreads);
    const t = j / Math.max(1, weftPer - 1);
    const x = (t - 0.5) * width;
    const y = (k / (weftThreads - 1) - 0.5) * height;
    const over = ((k + j) % 2 === 0 ? -1 : 1) * amp;
    out[i * 3] = x;
    out[i * 3 + 1] = y + (rnd() - 0.5) * 0.012;
    out[i * 3 + 2] = over + Math.sin(t * Math.PI * 34) * 0.03;
  }

  return out;
}

/** 2 — wireframe box / browser window */
function cube(count: number, rnd: () => number): Float32Array {
  const out = new Float32Array(count * 3);
  const w = 3.7;
  const h = 2.6;
  const d = 1.7;
  const hw = w / 2;
  const hh = h / 2;
  const hd = d / 2;

  const vertices: Array<[number, number, number]> = [
    [-hw, -hh, -hd],
    [hw, -hh, -hd],
    [hw, hh, -hd],
    [-hw, hh, -hd],
    [-hw, -hh, hd],
    [hw, -hh, hd],
    [hw, hh, hd],
    [-hw, hh, hd],
  ];
  const edges: Array<[number, number]> = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
  ];

  const edgeCount = Math.floor(count * CUBE_EDGE_RATIO);
  for (let i = 0; i < edgeCount; i += 1) {
    const edge = edges[Math.floor(rnd() * edges.length)];
    const a = vertices[edge[0]];
    const b = vertices[edge[1]];
    const t = rnd();
    out[i * 3] = a[0] + (b[0] - a[0]) * t;
    out[i * 3 + 1] = a[1] + (b[1] - a[1]) * t;
    out[i * 3 + 2] = a[2] + (b[2] - a[2]) * t;
  }

  const grid = 40;
  for (let i = edgeCount; i < count; i += 1) {
    const gx = Math.floor(rnd() * grid);
    const gy = Math.floor(rnd() * grid);
    out[i * 3] = (gx / (grid - 1) - 0.5) * w;
    out[i * 3 + 1] = (gy / (grid - 1) - 0.5) * h;
    out[i * 3 + 2] = (rnd() < 0.5 ? -1 : 1) * hd;
  }

  return out;
}

/** 3 — one long thread spiral the camera travels along */
function helix(count: number, rnd: () => number): Float32Array {
  const out = new Float32Array(count * 3);
  const turns = 6.5;
  const radius = 1.9;
  const length = 17;

  for (let i = 0; i < count; i += 1) {
    const t = i / Math.max(1, count - 1);
    const angle = t * turns * Math.PI * 2;
    const r = radius + (rnd() - 0.5) * 0.14;
    out[i * 3] = Math.cos(angle) * r;
    out[i * 3 + 1] = Math.sin(angle) * r;
    out[i * 3 + 2] = (t - 0.5) * length + (rnd() - 0.5) * 0.08;
  }

  return out;
}

/** 4 — tight glowing torus knot */
function knot(count: number, rnd: () => number): Float32Array {
  const out = new Float32Array(count * 3);
  const scale = 0.62;
  const p = 2;
  const q = 3;

  for (let i = 0; i < count; i += 1) {
    const t = (i / Math.max(1, count - 1)) * Math.PI * 2;
    const ring = 2 + Math.cos(q * t);
    const x = ring * Math.cos(p * t) + (rnd() - 0.5) * 0.16;
    const y = ring * Math.sin(p * t) + (rnd() - 0.5) * 0.16;
    const z = Math.sin(q * t) + (rnd() - 0.5) * 0.16;
    out[i * 3] = x * scale;
    out[i * 3 + 1] = y * scale;
    out[i * 3 + 2] = z * scale;
  }

  return out;
}

export function createShapeAttributes(count: number): ShapeAttributes {
  const rnd = mulberry32(0x5eed1a7);
  const positions: ShapeAttributes["positions"] = [
    cloud(count, rnd),
    weave(count, rnd),
    cube(count, rnd),
    helix(count, rnd),
    knot(count, rnd),
  ];

  const rand = new Float32Array(count);
  const scale = new Float32Array(count);
  const edge = new Float32Array(count);
  const cubeEdgeCount = Math.floor(count * CUBE_EDGE_RATIO);
  for (let i = 0; i < count; i += 1) {
    rand[i] = rnd();
    scale[i] = 0.5 + rnd() * 0.85;
    edge[i] = i < cubeEdgeCount ? 1 : 0;
  }

  return { positions, rand, scale, edge };
}