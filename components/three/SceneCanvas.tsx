"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { getSceneQuality, hasWebGL } from "@/lib/scene-quality";

const WeaveScene = dynamic(() => import("./WeaveScene"), { ssr: false });

const emptySubscribe = () => () => {};

export default function SceneCanvas() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const [ready, setReady] = useState(false);

  // Tier is resolved on the client only, after first paint, so the canvas
  // never blocks LCP and SSR output stays identical.
  const quality = useMemo(
    () => (mounted ? getSceneQuality() : null),
    [mounted],
  );
  const webgl = useMemo(
    () => (mounted && ready ? hasWebGL() : false),
    [mounted, ready],
  );

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

  const enabled =
    mounted && ready && quality !== null && quality.tier !== "static" && webgl;

  return (
    <>
      <div aria-hidden="true" className="scene-fallback fixed inset-0 z-0" />
      {enabled && quality ? (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
          <WeaveScene quality={quality} />
        </div>
      ) : null}
    </>
  );
}
