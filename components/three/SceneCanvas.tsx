"use client";

import dynamic from "next/dynamic";
import { useMemo, useSyncExternalStore } from "react";
import { hasWebGL } from "@/lib/scene-quality";
import { prefersReducedMotion } from "@/lib/motion";
import { silenceKnownThreeWarnings } from "@/lib/three-console";

silenceKnownThreeWarnings();

const WeaveScene = dynamic(() => import("./WeaveScene"), { ssr: false });

const emptySubscribe = () => () => {};

export default function SceneCanvas() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const enabled = useMemo(
    () => mounted && !prefersReducedMotion() && hasWebGL(),
    [mounted],
  );

  return (
    <>
      <div aria-hidden="true" className="scene-fallback fixed inset-0 z-0" />
      {enabled ? (
        <div className="pointer-events-none fixed inset-0 z-0">
          <WeaveScene />
        </div>
      ) : null}
    </>
  );
}