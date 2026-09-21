"use client";

import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import WeavePoints from "./WeavePoints";
import { getSceneQuality } from "@/lib/scene-quality";
import { scene, setPointerTarget } from "@/lib/scene-store";

type Frameloop = "always" | "never";

export default function WeaveScene() {
  const quality = useMemo(() => getSceneQuality(), []);
  const [frameloop, setFrameloop] = useState<Frameloop>("always");

  useEffect(() => {
    const onVisibility = () => {
      setFrameloop(document.hidden ? "never" : "always");
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      setPointerTarget(
        (event.clientX / window.innerWidth) * 2 - 1,
        (event.clientY / window.innerHeight) * 2 - 1,
      );
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  return (
    <Canvas
      dpr={quality.dpr}
      frameloop={frameloop}
      flat
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      }}
      camera={{
        position: [0, 0, scene.current.camZ],
        fov: 42,
        near: 0.1,
        far: 100,
      }}
      style={{ pointerEvents: "none" }}
    >
      <WeavePoints count={quality.count} />
    </Canvas>
  );
}