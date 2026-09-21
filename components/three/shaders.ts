const NOISE_3D = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

export const weaveVertexShader = /* glsl */ `
${NOISE_3D}

uniform float uTime;
uniform float uShape;
uniform float uDim;
uniform float uTurbulence;
uniform float uSize;
uniform float uPixelRatio;
uniform float uAccent;
uniform float uVelocity;
uniform vec2 uMouse;
uniform vec3 uColorA;
uniform vec3 uColorB;

attribute vec3 aPos0;
attribute vec3 aPos1;
attribute vec3 aPos2;
attribute vec3 aPos3;
attribute vec3 aPos4;
attribute float aRand;
attribute float aScale;

varying vec3 vColor;
varying float vAlpha;

vec3 shapePosition() {
  float s = clamp(uShape, 0.0, 4.0);
  float idx = floor(s);
  float f = fract(s);

  vec3 a;
  vec3 b;
  if (idx < 0.5) {
    a = aPos0; b = aPos1;
  } else if (idx < 1.5) {
    a = aPos1; b = aPos2;
  } else if (idx < 2.5) {
    a = aPos2; b = aPos3;
  } else if (idx < 3.5) {
    a = aPos3; b = aPos4;
  } else {
    a = aPos4; b = aPos4;
  }

  return mix(a, b, smoothstep(0.0, 1.0, f));
}

void main() {
  vec3 pos = shapePosition();

  // Clouds drift; woven structures stay tight. Scroll velocity adds energy.
  float speed = clamp(abs(uVelocity), 0.0, 1.5);
  float turbScale = uTurbulence * mix(1.0, 0.28, smoothstep(0.0, 1.0, uShape)) + speed * 0.22;
  float n1 = snoise(pos * 0.42 + vec3(0.0, 0.0, uTime * 0.12));
  float n2 = snoise(pos * 0.42 + vec3(31.7, 7.3, uTime * 0.12));
  float n3 = snoise(pos * 0.42 + vec3(11.1, 53.9, uTime * 0.12));
  pos += vec3(n1, n2, n3) * turbScale * (0.55 + aRand * 0.85);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  vec4 clip = projectionMatrix * mvPosition;
  vec2 ndc = clip.xy / max(clip.w, 0.0001);
  vec2 delta = ndc - uMouse;
  float force = 1.0 - smoothstep(0.0, 0.42, length(delta));
  mvPosition.xy += normalize(delta + 0.0001) * force * 0.35;

  // Scroll velocity smears points along the scroll direction, then settles.
  mvPosition.y += uVelocity * 0.18 * (0.35 + aRand);

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = uSize * aScale * uPixelRatio * (1.0 + speed * 0.3) * (1.0 / max(-mvPosition.z, 0.1));

  float accent = smoothstep(1.0 - uAccent, 1.0, aRand);
  vColor = mix(uColorA, uColorB, accent);

  float twinkle = 0.72 + 0.28 * sin(uTime * 1.6 + aRand * 42.0);
  vAlpha = uDim * twinkle * (0.26 + 0.38 * aScale);
}
`;

export const weaveFragmentShader = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float d = length(uv);
  float alpha = 1.0 - smoothstep(0.06, 0.5, d);
  if (alpha < 0.01) discard;
  gl_FragColor = vec4(vColor, alpha * vAlpha);
}
`;