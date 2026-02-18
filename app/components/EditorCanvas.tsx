
"use client";

import { useEffect, useRef } from "react";
import { useEditorStore } from "../store/useEditorStore";
import { drawToCanvas } from "../lib/draw";

export default function EditorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const imageBitmap = useEditorStore((s) => s.imageBitmap);
  const rotation = useEditorStore((s) => s.rotation);
  const flipX = useEditorStore((s) => s.flipX);
  const flipY = useEditorStore((s) => s.flipY);
  const filters = useEditorStore((s) => s.filters);

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageBitmap) return;
    drawToCanvas({ canvas, image: imageBitmap, rotationDeg: rotation, flipX, flipY, filters });
  };

  useEffect(() => {
    const id = requestAnimationFrame(redraw);
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageBitmap, rotation, flipX, flipY, filters]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(redraw);
    });
    ro.observe(canvas);

    window.addEventListener("resize", redraw);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", redraw);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageBitmap, rotation, flipX, flipY, filters]);

  return (
    <div className="rounded-xl border bg-white overflow-hidden">
      <div className="px-4 py-2 border-b text-sm text-zinc-700">Canvas Preview</div>
      <div className="p-3">
        <canvas ref={canvasRef} className="w-full h-[520px] bg-zinc-100 rounded-lg" />
      </div>
    </div>
  );
}