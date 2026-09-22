"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import WeavePoints from "./WeavePoints";
import { scene, setPointerTarget } from "@/lib/scene-store";
import { silenceKnownThreeWarnings } from "@/lib/three-console";
import type { SceneQuality } from "@/lib/scene-quality";

silenceKnownThreeWarnings();

type Frameloop = "always" | "never";

/** Pause on context loss and resume when the GPU restores the context. */
function ContextRecovery({
  onLost,
  onRestored,
}: {
  onLost: () => void;
  onRestored: () => void;
}) {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const canvas = gl.domElement;
    const handleLost = (event: Event) => {
      event.preventDefault();
      onLost();
    };
    canvas.addEventListener("webglcontextlost", handleLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
    return () => {
      canvas.removeEventListener("webglcontextlost", handleLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
    };
  }, [gl, onLost, onRestored]);

  return null;
}

export default function WeaveScene({ quality }: { quality: SceneQuality }) {
  const [frameloop, setFrameloop] = useState<Frameloop>("always");
  const [dpr, setDpr] = useState(quality.dpr[1]);
  const [drawFraction, setDrawFraction] = useState(1);

  const dprRef = useRef(quality.dpr[1]);
  const fractionRef = useRef(1);

  // Step down DPR first, then point count (draw range), never below the low
  // tier. Step back up in reverse when frames recover.
  const onDecline = useCallback(() => {
    if (dprRef.current > quality.dpr[0] + 0.01) {
      dprRef.current = Math.max(quality.dpr[0], dprRef.current - 0.25);
      setDpr(dprRef.current);
    } else if (fractionRef.current > 0.5) {
      fractionRef.current = Math.max(0.5, fractionRef.current - 0.25);
      setDrawFraction(fractionRef.current);
    }
  }, [quality.dpr]);

  const onIncline = useCallback(() => {
    if (fractionRef.current < 1) {
      fractionRef.current = Math.min(1, fractionRef.current + 0.25);
      setDrawFraction(fractionRef.current);
    } else if (dprRef.current < quality.dpr[1]) {
      dprRef.current = Math.min(quality.dpr[1], dprRef.current + 0.25);
      setDpr(dprRef.current);
    }
  }, [quality.dpr]);

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

  const handleLost = useCallback(() => setFrameloop("never"), []);
  const handleRestored = useCallback(() => setFrameloop("always"), []);

  return (
    <Canvas
      dpr={dpr}
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
      <PerformanceMonitor
        onDecline={onDecline}
        onIncline={onIncline}
        flipflops={4}
        onFallback={onDecline}
      />
      <ContextRecovery onLost={handleLost} onRestored={handleRestored} />
      <WeavePoints count={quality.count} drawFraction={drawFraction} />
    </Canvas>
  );
}
