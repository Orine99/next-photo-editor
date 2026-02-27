"use client";

import { useEditorStore } from "../../store/useEditorStore";

export default function ZoomControl() {
  const imageBitmap = useEditorStore((s) => s.imageBitmap);
  const zoom = useEditorStore((s) => s.zoom);
  const setZoom = useEditorStore((s) => s.setZoom);

  if (!imageBitmap) return null;

  return (
    <div className="zoom-bar">
      <input
        className="zoom-slider"
        type="range"
        min={0.5}
        max={3}
        step={0.01}
        value={zoom}
        onChange={(e) => setZoom(Number(e.target.value))}
      />

      <span className="zoom-value">{Math.round(zoom * 100)}%</span>

      {/* <button className="zoom-btn" type="button" onClick={() => setZoom(1)}>
        Reset
      </button> */}
    </div>
  );
}