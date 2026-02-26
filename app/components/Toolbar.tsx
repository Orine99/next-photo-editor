"use client";

import { useRef, useState } from "react";
import { useEditorStore } from "../store/useEditorStore";
import { exportCanvasImage } from "../lib/exportImage";
import Slider from "./Slider";

export default function Toolbar() {
  const imageBitmap = useEditorStore((s) => s.imageBitmap);
  const rotation = useEditorStore((s) => s.rotation);
  const setRotation = useEditorStore((s) => s.setRotation);
  const flipX = useEditorStore((s) => s.flipX);
  const flipY = useEditorStore((s) => s.flipY);
  const toggleFlipX = useEditorStore((s) => s.toggleFlipX);
  const toggleFlipY = useEditorStore((s) => s.toggleFlipY);
  const filters = useEditorStore((s) => s.filters);
  const setFilter = useEditorStore((s) => s.setFilter);
  const reset = useEditorStore((s) => s.reset);
  const [showCrop, setShowCrop] = useState(false);
  const imageName = useEditorStore((s) => s.imageName);
  const openCrop = useEditorStore((s) => s.openCrop);

  
  // We’ll find the canvas by query selector (simple for MVP)
  const sanitizeFileName = (name: string) =>
  name
    .trim()
    .replace(/[\/\\?%*:|"<>]/g, "-") // replace illegal filename chars
    .replace(/\s+/g, " "); // collapse spaces

  const handleExport = async (type: "image/png" | "image/jpeg") => {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement | null;
    if (!canvas) return;

    const safe = sanitizeFileName(imageName || "EditableImage") || "EditableImage";
    const ext = type === "image/png" ? "png" : "jpg";

    await exportCanvasImage({
      canvas,
      type,
      quality: type === "image/jpeg" ? 0.92 : 1,
      fileName: `${safe}.${ext}`,
    });
  };

  const disabled = !imageBitmap;

  return (
    <div className="rounded-xl border bg-white p-4 space-y-4">
      <div className="text-sm font-medium text-zinc-800">Tools</div>

      <div className="flex flex-wrap gap-2">
        <button
          className="px-3 py-2 rounded-lg border disabled:opacity-50"
          onClick={() => setRotation(rotation - 90)}
          disabled={disabled}
        >
          Rotate -90°
        </button>
        <button
          className="px-3 py-2 rounded-lg border disabled:opacity-50"
          onClick={() => setRotation(rotation + 90)}
          disabled={disabled}
        >
          Rotate +90°
        </button>
        <button
          className="px-3 py-2 rounded-lg border disabled:opacity-50"
          onClick={toggleFlipX}
          disabled={disabled}
        >
          Flip X {flipX ? "✓" : ""}
        </button>
        <button
          className="px-3 py-2 rounded-lg border disabled:opacity-50"
          onClick={toggleFlipY}
          disabled={disabled}
        >
          Flip Y {flipY ? "✓" : ""}
        </button>
        <button
          className="px-3 py-2 rounded-lg border disabled:opacity-50"
          onClick={openCrop}
          disabled={!imageBitmap}
          >
          Crop
        </button>

        <button
          className="px-3 py-2 rounded-lg border disabled:opacity-50"
          onClick={reset}
          disabled={disabled}
        >
          Reset
        </button>
        
      </div>

      <div className="space-y-3">
        <Slider
          label="Brightness"
          min={0.5}
          max={2}
          step={0.01}
          value={filters.brightness}
          onChange={(v) => setFilter("brightness", v)}
          disabled={disabled}
        />
        <Slider
          label="Contrast"
          min={0.5}
          max={2}
          step={0.01}
          value={filters.contrast}
          onChange={(v) => setFilter("contrast", v)}
          disabled={disabled}
        />
        <Slider
          label="Saturation"
          min={0}
          max={2}
          step={0.01}
          value={filters.saturation}
          onChange={(v) => setFilter("saturation", v)}
          disabled={disabled}
        />
        <Slider
          label="Grayscale"
          min={0}
          max={1}
          step={0.01}
          value={filters.grayscale}
          onChange={(v) => setFilter("grayscale", v)}
          disabled={disabled}
        />
        <Slider
          label="Sepia"
          min={0}
          max={1}
          step={0.01}
          value={filters.sepia}
          onChange={(v) => setFilter("sepia", v)}
          disabled={disabled}
        />
      </div>

      <div className="pt-2 border-t flex gap-2">
        <button
          className="px-3 py-2 rounded-lg border disabled:opacity-50"
          onClick={() => handleExport("image/png")}
          disabled={disabled}
        >
          Export PNG
        </button>
        <button
          className="px-3 py-2 rounded-lg border disabled:opacity-50"
          onClick={() => handleExport("image/jpeg")}
          disabled={disabled}
        >
          Export JPG
        </button>
      </div>
    </div>
  );
};
