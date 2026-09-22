"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createShapeAttributes } from "./shapes";
import { weaveFragmentShader, weaveVertexShader } from "./shaders";
import { scene } from "@/lib/scene-store";
import {
  MOBILE_BREAKPOINT,
  MOBILE_SCENE_SCALE,
  RIGHT_STAGE_CENTER,
  RIGHT_STAGE_WIDTH,
  TABLET_BREAKPOINT,
  TABLET_SCENE_SCALE,
} from "@/lib/scene-keyframes";

const COLOR_FG = new THREE.Color("#ecebe6");
const COLOR_ACCENT = new THREE.Color("#c8ff2e");

/** Approximate world-space bounding width of each morph shape. */
const SHAPE_WIDTHS = [6.6, 5.6, 3.7, 4.0, 3.0];

/** Max content width shared with <Container>. */
const CONTENT_MAX = 1600;

export default function WeavePoints({
  count,
  drawFraction = 1,
}: {
  count: number;
  drawFraction?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const attrs = useMemo(() => createShapeAttributes(count), [count]);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const [p0, p1, p2, p3, p4] = attrs.positions;

    // `position` doubles as aPos0 to keep the attribute count within the
    // WebGL1 minimum (8 vertex attributes).
    g.setAttribute("position", new THREE.BufferAttribute(p0, 3));
    g.setAttribute("aPos1", new THREE.BufferAttribute(p1, 3));
    g.setAttribute("aPos2", new THREE.BufferAttribute(p2, 3));
    g.setAttribute("aPos3", new THREE.BufferAttribute(p3, 3));
    g.setAttribute("aPos4", new THREE.BufferAttribute(p4, 3));
    g.setAttribute("aRand", new THREE.BufferAttribute(attrs.rand, 1));
    g.setAttribute("aScale", new THREE.BufferAttribute(attrs.scale, 1));
    g.setAttribute("aEdge", new THREE.BufferAttribute(attrs.edge, 1));

    return g;
  }, [attrs]);

  // Adaptive quality lowers the drawn point count without rebuilding geometry.
  useEffect(() => {
    geometry.setDrawRange(0, Math.max(1, Math.floor(count * drawFraction)));
  }, [geometry, count, drawFraction]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uShape: { value: scene.current.shape },
      uDim: { value: scene.current.dim },
      uTurbulence: { value: scene.current.turbulence },
      uSize: { value: 15 },
      uMaxSize: { value: 3.4 },
      uPixelRatio: { value: 1 },
      uViewportH: { value: 900 },
      uAccent: { value: 0.08 },
      uVelocity: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: COLOR_FG.clone() },
      uColorB: { value: COLOR_ACCENT.clone() },
    }),
    [],
  );

  useFrame((state, delta) => {
    const group = groupRef.current;
    const material = materialRef.current;
    if (!group || !material) return;

    const d = Math.min(delta, 0.05);
    const { target, current, pointer } = scene;

    current.shape = THREE.MathUtils.damp(current.shape, target.shape, 3, d);
    current.dim = THREE.MathUtils.damp(current.dim, target.dim, 4, d);
    current.x = THREE.MathUtils.damp(current.x, target.x, 3, d);
    current.camZ = THREE.MathUtils.damp(current.camZ, target.camZ, 3, d);
    current.rotY = THREE.MathUtils.damp(current.rotY, target.rotY, 3, d);
    current.turbulence = THREE.MathUtils.damp(
      current.turbulence,
      target.turbulence,
      3,
      d,
    );

    pointer.x = THREE.MathUtils.damp(pointer.x, pointer.targetX, 3, d);
    pointer.y = THREE.MathUtils.damp(pointer.y, pointer.targetY, 3, d);

    // Per-device stage. The desktop `right` stage is measured against the
    // 1600px content container (not the raw viewport) so it also lands
    // correctly on ultrawide screens. Tablet portrait gets a smaller,
    // upper-right placement; phones centre a small, dim scene behind the copy.
    const width = state.size.width;
    const isPhone = width < MOBILE_BREAKPOINT;
    const isTablet = width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT;
    const gutterPx = Math.min(64, Math.max(16, width * 0.04));
    const worldPerPx = state.viewport.width / width;

    const stage = target.stage;
    let stageX = 0;
    let stageY = isPhone ? 0 : isTablet ? 0.3 : 0.45;
    let stageScale = isPhone ? MOBILE_SCENE_SCALE : isTablet ? 0.65 : 0.8;

    if (stage === "right" && !isPhone) {
      const contentW = Math.min(width, CONTENT_MAX);
      const containerW = contentW - 2 * gutterPx;
      const containerLeft = (width - contentW) / 2 + gutterPx;
      const centerPx = containerLeft + RIGHT_STAGE_CENTER * containerW;
      const shapeIndex = Math.min(
        SHAPE_WIDTHS.length - 1,
        Math.max(0, Math.round(current.shape)),
      );

      stageX = (centerPx - width / 2) * worldPerPx;
      const baseScale =
        (RIGHT_STAGE_WIDTH * containerW * worldPerPx) / SHAPE_WIDTHS[shapeIndex];
      stageScale = isTablet ? baseScale * TABLET_SCENE_SCALE : baseScale;
      stageY = isTablet ? 0.5 : 0;
    } else if (stage === "hidden") {
      stageY = 0;
    }

    group.position.x = THREE.MathUtils.damp(
      group.position.x,
      stageX + current.x,
      3,
      d,
    );
    group.position.y = THREE.MathUtils.damp(group.position.y, stageY, 3, d);
    group.scale.setScalar(
      THREE.MathUtils.damp(group.scale.x, stageScale, 3, d),
    );
    group.rotation.y = current.rotY + scene.progress * 0.9;

    const camera = state.camera;
    camera.position.z = current.camZ;
    const parallax = stage === "hero" && !isPhone ? 0.4 : 0;
    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      pointer.x * parallax,
      2,
      d,
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      -pointer.y * 0.4,
      2,
      d,
    );
    camera.lookAt(0, 0, 0);

    const knotFactor = THREE.MathUtils.smoothstep(current.shape, 3.2, 4);
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uShape.value = current.shape;
    material.uniforms.uDim.value = current.dim;
    material.uniforms.uTurbulence.value = current.turbulence;
    material.uniforms.uVelocity.value = scene.velocity;
    material.uniforms.uPixelRatio.value = state.viewport.dpr;
    material.uniforms.uViewportH.value = state.size.height;
    material.uniforms.uAccent.value = THREE.MathUtils.lerp(
      0.08,
      0.72,
      knotFactor,
    );
    material.uniforms.uMouse.value.set(pointer.x, -pointer.y);
  });

  return (
    <group ref={groupRef}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={weaveVertexShader}
          fragmentShader={weaveFragmentShader}
          transparent
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
