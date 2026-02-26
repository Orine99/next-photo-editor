
"use client";

import { useEffect, useRef } from "react";
import { useEditorStore } from "../store/useEditorStore";
import { drawToCanvas } from "../lib/draw";
import ZoomControl from "./ZoomControl";

export default function EditorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const imageBitmap = useEditorStore((s) => s.imageBitmap);
  const rotation = useEditorStore((s) => s.rotation);
  const flipX = useEditorStore((s) => s.flipX);
  const flipY = useEditorStore((s) => s.flipY);
  const filters = useEditorStore((s) => s.filters);
  const zoom = useEditorStore((s) => s.zoom);
  const toggleCrop = useEditorStore((s) => s.toggleCrop);

    // double-tap support (mobile)
    const lastTapRef = useRef<number>(0);

    const onPointerDown = () => {
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        toggleCrop();
        lastTapRef.current = 0;
      } else {
        lastTapRef.current = now;
      }
    };

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageBitmap) return;
    drawToCanvas({ canvas, image: imageBitmap, rotationDeg: rotation, flipX, flipY, filters,zoom });
  };

  useEffect(() => {
    const id = requestAnimationFrame(redraw);
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageBitmap, rotation, flipX, flipY, filters,zoom]);

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
  }, [imageBitmap, rotation, flipX, flipY, filters, zoom]);

  return (
    <div className="rounded-xl border bg-white overflow-hidden">
      <div className="px-4 py-2 border-b text-sm text-zinc-700">Canvas Preview</div>
      <div className="p-3"
      onDoubleClick={() => toggleCrop()}
      onPointerDown={onPointerDown}
      >
        <canvas ref={canvasRef} className="w-full h-[520px] bg-zinc-100 rounded-lg" />
        <ZoomControl />
      </div>
    </div>
  );
};