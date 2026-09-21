"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { scene } from "@/lib/scene-store";

let debugEnabled = false;
let urlChecked = false;
const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): boolean {
  if (!urlChecked && typeof window !== "undefined") {
    urlChecked = true;
    if (new URLSearchParams(window.location.search).has("debug")) {
      debugEnabled = true;
    }
  }
  return debugEnabled;
}

function getServerSnapshot(): boolean {
  return false;
}

export default function SceneDebug() {
  const enabled = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [expanded, setExpanded] = useState(false);
  const shapeRef = useRef<HTMLSpanElement>(null);
  const dimRef = useRef<HTMLSpanElement>(null);
  const xRef = useRef<HTMLSpanElement>(null);
  const camZRef = useRef<HTMLSpanElement>(null);
  const rotYRef = useRef<HTMLSpanElement>(null);
  const turbulenceRef = useRef<HTMLSpanElement>(null);
  const velocityRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "d" && event.key !== "D") return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      debugEnabled = !debugEnabled;
      notify();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let frame = 0;
    const tick = () => {
      const { current, velocity, progress } = scene;
      if (shapeRef.current) shapeRef.current.textContent = current.shape.toFixed(2);
      if (dimRef.current) dimRef.current.textContent = current.dim.toFixed(2);
      if (xRef.current) xRef.current.textContent = current.x.toFixed(2);
      if (camZRef.current) camZRef.current.textContent = current.camZ.toFixed(2);
      if (rotYRef.current) rotYRef.current.textContent = current.rotY.toFixed(2);
      if (turbulenceRef.current) {
        turbulenceRef.current.textContent = current.turbulence.toFixed(2);
      }
      if (velocityRef.current) {
        velocityRef.current.textContent = velocity.toFixed(2);
      }
      if (progressRef.current) {
        progressRef.current.textContent = progress.toFixed(3);
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="fixed right-4 bottom-4 z-[80] font-mono text-[11px] leading-tight">
      <div className="overflow-hidden rounded-md border border-line bg-bg/90 backdrop-blur">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          aria-label="Toggle live scene values"
          className="flex w-full items-center gap-2 px-3 py-2 text-muted transition-colors hover:text-fg"
        >
          <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
          <span className="uppercase tracking-[0.08em]">scene</span>
          <span ref={shapeRef} className="tabular-nums text-fg">
            0.00
          </span>
        </button>

        {expanded ? (
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 border-t border-line px-3 py-2 text-muted">
            <dt>dim</dt>
            <dd ref={dimRef} className="text-right tabular-nums text-fg" />
            <dt>x</dt>
            <dd ref={xRef} className="text-right tabular-nums text-fg" />
            <dt>camZ</dt>
            <dd ref={camZRef} className="text-right tabular-nums text-fg" />
            <dt>rotY</dt>
            <dd ref={rotYRef} className="text-right tabular-nums text-fg" />
            <dt>turb</dt>
            <dd ref={turbulenceRef} className="text-right tabular-nums text-fg" />
            <dt>vel</dt>
            <dd ref={velocityRef} className="text-right tabular-nums text-fg" />
            <dt>prog</dt>
            <dd ref={progressRef} className="text-right tabular-nums text-fg" />
          </dl>
        ) : null}
      </div>
    </div>
  );
}