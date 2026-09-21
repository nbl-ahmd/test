"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { hasWebGL } from "@/lib/scene-quality";
import { prefersReducedMotion } from "@/lib/motion";

const WeaveScene = dynamic(() => import("./WeaveScene"), { ssr: false });

const emptySubscribe = () => () => {};

export default function SceneCanvas() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleId = 0;
    let timeoutId = 0;

    const enable = () => setReady(true);

    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(enable, { timeout: 1500 });
      } else {
        timeoutId = window.setTimeout(enable, 400);
      }
    };

    if (document.readyState === "complete") {
      schedule();
    } else {
      window.addEventListener("load", schedule, { once: true });
    }

    return () => {
      window.removeEventListener("load", schedule);
      if (idleId) window.cancelIdleCallback(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  const enabled = useMemo(
    () => mounted && ready && !prefersReducedMotion() && hasWebGL(),
    [mounted, ready],
  );

  return (
    <>
      <div aria-hidden="true" className="scene-fallback fixed inset-0 z-0" />
      {enabled ? (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
          <WeaveScene />
        </div>
      ) : null}
    </>
  );
}