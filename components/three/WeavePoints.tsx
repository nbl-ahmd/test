"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createShapeAttributes } from "./shapes";
import { weaveFragmentShader, weaveVertexShader } from "./shaders";
import { scene } from "@/lib/scene-store";

const COLOR_FG = new THREE.Color("#ecebe6");
const COLOR_ACCENT = new THREE.Color("#c8ff2e");

export default function WeavePoints({ count }: { count: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const attrs = useMemo(() => createShapeAttributes(count), [count]);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const [p0, p1, p2, p3, p4] = attrs.positions;

    g.setAttribute("position", new THREE.BufferAttribute(p0, 3));
    g.setAttribute("aPos0", new THREE.BufferAttribute(p0, 3));
    g.setAttribute("aPos1", new THREE.BufferAttribute(p1, 3));
    g.setAttribute("aPos2", new THREE.BufferAttribute(p2, 3));
    g.setAttribute("aPos3", new THREE.BufferAttribute(p3, 3));
    g.setAttribute("aPos4", new THREE.BufferAttribute(p4, 3));
    g.setAttribute("aRand", new THREE.BufferAttribute(attrs.rand, 1));
    g.setAttribute("aScale", new THREE.BufferAttribute(attrs.scale, 1));

    return g;
  }, [attrs]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uShape: { value: scene.current.shape },
      uDim: { value: scene.current.dim },
      uTurbulence: { value: scene.current.turbulence },
      uSize: { value: 20 },
      uPixelRatio: { value: 1 },
      uAccent: { value: 0.08 },
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

    group.rotation.y = current.rotY;

    const camera = state.camera;
    camera.position.z = current.camZ;
    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      pointer.x * 0.4,
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
    material.uniforms.uPixelRatio.value = state.viewport.dpr;
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