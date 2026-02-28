"use client";

import Cropper from "react-easy-crop";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useEditorStore } from "../../store/useEditorStore";

function imageBitmapToDataURL(bmp: ImageBitmap) {
  const c = document.createElement("canvas");
  c.width = bmp.width;
  c.height = bmp.height;
  const ctx = c.getContext("2d");
  ctx?.drawImage(bmp, 0, 0);
  return c.toDataURL("image/png");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

type ResizeHandle = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";
type ResizeDragState = {
  handle: ResizeHandle;
  startX: number;
  startY: number;
  startWidthPct: number;
  startHeightPct: number;
  maxWidthPx: number;
  maxHeightPx: number;
};

export default function CropPopover() {
  const MIN_FREE_PCT = 35;
  const MAX_FREE_PCT = 100;

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const resizeStateRef = useRef<ResizeDragState | null>(null);

  const [overlaySize, setOverlaySize] = useState({ width: 0, height: 0 });
  const [freeWidthPct, setFreeWidthPct] = useState(82);
  const [freeHeightPct, setFreeHeightPct] = useState(82);

  const imageBitmap = useEditorStore((s) => s.imageBitmap);
  const isCropOpen = useEditorStore((s) => s.isCropOpen);
  const applyCropSession = useEditorStore((s) => s.applyCropSession);
  const cancelCropSession = useEditorStore((s) => s.cancelCropSession);

  const crop = useEditorStore((s) => s.crop);
  const zoomCrop = useEditorStore((s) => s.zoomCrop);
  const aspect = useEditorStore((s) => s.aspect);

  const setCrop = useEditorStore((s) => s.setCrop);
  const setZoomCrop = useEditorStore((s) => s.setZoomCrop);
  const setCroppedAreaPixels = useEditorStore((s) => s.setCroppedAreaPixels);

  const imageUrl = useMemo(() => {
    if (!imageBitmap) return null;
    return imageBitmapToDataURL(imageBitmap);
  }, [imageBitmap]);

  useEffect(() => {
    if (!isCropOpen) return;
    const node = overlayRef.current;
    if (!node) return;

    const updateOverlaySize = () => {
      const rect = node.getBoundingClientRect();
      setOverlaySize({
        width: Math.max(1, Math.floor(rect.width)),
        height: Math.max(1, Math.floor(rect.height)),
      });
    };

    updateOverlaySize();
    const ro = new ResizeObserver(updateOverlaySize);
    ro.observe(node);

    return () => ro.disconnect();
  }, [isCropOpen]);

  const isFreeAspect = aspect === 0;

  const maxFreeWidth = useMemo(() => Math.max(1, overlaySize.width - 24), [overlaySize.width]);
  const maxFreeHeight = useMemo(() => Math.max(1, overlaySize.height - 24), [overlaySize.height]);

  const freeCropSize = useMemo(() => {
    if (!isFreeAspect) return undefined;

    // Keep a small margin so the crop frame remains comfortably draggable.
    if (maxFreeWidth <= 1 || maxFreeHeight <= 1) {
      return { width: 280, height: 220 };
    }

    const width = Math.min(maxFreeWidth, Math.max(96, Math.floor((maxFreeWidth * freeWidthPct) / 100)));
    const height = Math.min(maxFreeHeight, Math.max(96, Math.floor((maxFreeHeight * freeHeightPct) / 100)));

    return { width, height };
  }, [isFreeAspect, maxFreeWidth, maxFreeHeight, freeWidthPct, freeHeightPct]);

  const freeFrameStyle = useMemo<CSSProperties | undefined>(() => {
    if (!freeCropSize) return undefined;
    return {
      width: `${freeCropSize.width}px`,
      height: `${freeCropSize.height}px`,
      left: `${(overlaySize.width - freeCropSize.width) / 2}px`,
      top: `${(overlaySize.height - freeCropSize.height) / 2}px`,
    };
  }, [freeCropSize, overlaySize.width, overlaySize.height]);

  const beginResize = useCallback(
    (handle: ResizeHandle) => (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isFreeAspect) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;

      e.preventDefault();
      e.stopPropagation();

      resizeStateRef.current = {
        handle,
        startX: e.clientX,
        startY: e.clientY,
        startWidthPct: freeWidthPct,
        startHeightPct: freeHeightPct,
        maxWidthPx: maxFreeWidth,
        maxHeightPx: maxFreeHeight,
      };
    },
    [isFreeAspect, freeWidthPct, freeHeightPct, maxFreeWidth, maxFreeHeight]
  );

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const drag = resizeStateRef.current;
      if (!drag) return;

      const deltaX = event.clientX - drag.startX;
      const deltaY = event.clientY - drag.startY;

      let nextWidthPct = drag.startWidthPct;
      let nextHeightPct = drag.startHeightPct;

      if (drag.handle.includes("e")) {
        nextWidthPct += (deltaX / drag.maxWidthPx) * 100;
      }
      if (drag.handle.includes("w")) {
        nextWidthPct -= (deltaX / drag.maxWidthPx) * 100;
      }
      if (drag.handle.includes("s")) {
        nextHeightPct += (deltaY / drag.maxHeightPx) * 100;
      }
      if (drag.handle.includes("n")) {
        nextHeightPct -= (deltaY / drag.maxHeightPx) * 100;
      }

      setFreeWidthPct(clamp(nextWidthPct, MIN_FREE_PCT, MAX_FREE_PCT));
      setFreeHeightPct(clamp(nextHeightPct, MIN_FREE_PCT, MAX_FREE_PCT));
    };

    const stopResize = () => {
      resizeStateRef.current = null;
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stopResize);
    window.addEventListener("pointercancel", stopResize);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stopResize);
      window.removeEventListener("pointercancel", stopResize);
    };
  }, []);

  const handleApplyCrop = () => {
    applyCropSession();
  };

  const handleCancelCrop = () => {
    cancelCropSession();
  };

  if (!isCropOpen || !imageBitmap || !imageUrl) return null;

  return (
    <div
      ref={overlayRef}
      className="canvas-crop-overlay"
      role="dialog"
      aria-label="Crop image on canvas"
    >
      <Cropper
        image={imageUrl}
        crop={crop}
        zoom={zoomCrop}
        aspect={isFreeAspect ? 1 : aspect}
        cropSize={isFreeAspect ? freeCropSize : undefined}
        onCropChange={setCrop}
        onZoomChange={setZoomCrop}
        onCropAreaChange={(_, pixels) => setCroppedAreaPixels(pixels)}
        onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
      />

      {isFreeAspect && (
        <div className="canvas-crop-free-frame" style={freeFrameStyle} aria-hidden="true">
          <div className="canvas-crop-handle edge edge-n" onPointerDown={beginResize("n")} />
          <div className="canvas-crop-handle edge edge-s" onPointerDown={beginResize("s")} />
          <div className="canvas-crop-handle edge edge-e" onPointerDown={beginResize("e")} />
          <div className="canvas-crop-handle edge edge-w" onPointerDown={beginResize("w")} />

          <div className="canvas-crop-handle corner corner-ne" onPointerDown={beginResize("ne")} />
          <div className="canvas-crop-handle corner corner-nw" onPointerDown={beginResize("nw")} />
          <div className="canvas-crop-handle corner corner-se" onPointerDown={beginResize("se")} />
          <div className="canvas-crop-handle corner corner-sw" onPointerDown={beginResize("sw")} />
        </div>
      )}

      <div className="canvas-crop-actions">
        <button className="canvas-crop-btn cancel" onClick={handleCancelCrop} type="button">
          Cancel
        </button>
        <button className="canvas-crop-btn apply" onClick={handleApplyCrop} type="button">
          Apply
        </button>
      </div>
    </div>
  );
}
