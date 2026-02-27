"use client";

import { useEffect, useRef } from "react";
import { useEditorStore } from "../store/useEditorStore";
import { drawToCanvas } from "../lib/draw";
import ZoomControl from "./tools/ZoomControl";
import CropPopover from "./tools/CropPopover";

export default function EditorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastTapRef = useRef<number>(0);

  const imageBitmap = useEditorStore((s) => s.imageBitmap);
  const rotation = useEditorStore((s) => s.rotation);
  const flipX = useEditorStore((s) => s.flipX);
  const flipY = useEditorStore((s) => s.flipY);
  const filters = useEditorStore((s) => s.filters);
  const zoom = useEditorStore((s) => s.zoom);
  const croppedAreaPixels = useEditorStore((s) => s.croppedAreaPixels);
  const toggleCrop = useEditorStore((s) => s.toggleCrop);

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
    drawToCanvas({
      canvas,
      image: imageBitmap,
      rotationDeg: rotation,
      flipX,
      flipY,
      filters,
      zoom,
      croppedAreaPixels,
    });
  };

  useEffect(() => {
    const id = requestAnimationFrame(redraw);
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageBitmap, rotation, flipX, flipY, filters, zoom, croppedAreaPixels]);

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
  }, [imageBitmap, rotation, flipX, flipY, filters, zoom, croppedAreaPixels]);

  return (
    <div className="nature-canvas-card rounded-xl border overflow-hidden">
      <div className="nature-canvas-header px-4 py-2 border-b text-sm">Canvas Preview</div>
      <div
        className="canvas-preview-wrap p-3"
        onDoubleClick={() => toggleCrop()}
        onPointerDown={onPointerDown}
      >
        <canvas ref={canvasRef} className="editor-canvas w-full h-[520px] rounded-lg" />
        <CropPopover />
        <ZoomControl />
      </div>
    </div>
  );
}
