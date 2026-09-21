"use client";

import { useState } from "react";
import { scene, setSceneTarget } from "@/lib/scene-store";

// TODO: remove this temporary verification panel before launch (Phase 7).
const SHAPES = ["cloud", "weave", "cube", "helix", "knot"];

export default function SceneDebug() {
  const [shape, setShape] = useState(scene.target.shape);
  const [dim, setDim] = useState(scene.target.dim);
  const [camZ, setCamZ] = useState(scene.target.camZ);
  const [turbulence, setTurbulence] = useState(scene.target.turbulence);

  const pickShape = (index: number) => {
    setShape(index);
    setSceneTarget({ shape: index });
  };

  return (
    <div className="fixed bottom-4 left-4 z-[80] w-64 rounded-md border border-line bg-bg/85 p-3 backdrop-blur">
      <p className="label text-muted">( scene debug )</p>

      <div className="mt-2 flex flex-wrap gap-1">
        {SHAPES.map((name, index) => (
          <button
            key={name}
            type="button"
            onClick={() => pickShape(index)}
            className="label rounded border border-line px-2 py-1 text-muted hover:border-fg hover:text-fg"
          >
            {name}
          </button>
        ))}
      </div>

      <label className="label mt-3 block text-muted">
        shape {shape.toFixed(2)}
      </label>
      <input
        type="range"
        min={0}
        max={4}
        step={0.01}
        value={shape}
        onChange={(event) => pickShape(Number(event.target.value))}
        className="w-full accent-accent"
      />

      <label className="label mt-2 block text-muted">
        dim {dim.toFixed(2)}
      </label>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={dim}
        onChange={(event) => {
          const value = Number(event.target.value);
          setDim(value);
          setSceneTarget({ dim: value });
        }}
        className="w-full accent-accent"
      />

      <label className="label mt-2 block text-muted">
        camZ {camZ.toFixed(1)}
      </label>
      <input
        type="range"
        min={2}
        max={16}
        step={0.1}
        value={camZ}
        onChange={(event) => {
          const value = Number(event.target.value);
          setCamZ(value);
          setSceneTarget({ camZ: value });
        }}
        className="w-full accent-accent"
      />

      <label className="label mt-2 block text-muted">
        turbulence {turbulence.toFixed(2)}
      </label>
      <input
        type="range"
        min={0}
        max={1.5}
        step={0.01}
        value={turbulence}
        onChange={(event) => {
          const value = Number(event.target.value);
          setTurbulence(value);
          setSceneTarget({ turbulence: value });
        }}
        className="w-full accent-accent"
      />
    </div>
  );
}