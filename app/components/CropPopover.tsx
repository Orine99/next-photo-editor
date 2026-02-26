"use client";

import Cropper from "react-easy-crop";
import { useMemo } from "react";
import { useEditorStore } from "../store/useEditorStore";

function imageBitmapToDataURL(bmp: ImageBitmap) {
  const c = document.createElement("canvas");
  c.width = bmp.width;
  c.height = bmp.height;
  const ctx = c.getContext("2d");
  ctx?.drawImage(bmp, 0, 0);
  return c.toDataURL("image/png");
}

export default function CropPopover() {
  const imageBitmap = useEditorStore((s) => s.imageBitmap);
  const isCropOpen = useEditorStore((s) => s.isCropOpen);
  const closeCrop = useEditorStore((s) => s.closeCrop);

  const crop = useEditorStore((s) => s.crop);
  const zoomCrop = useEditorStore((s) => s.zoomCrop);
  const aspect = useEditorStore((s) => s.aspect);

  const setCrop = useEditorStore((s) => s.setCrop);
  const setZoomCrop = useEditorStore((s) => s.setZoomCrop);
  const setAspect = useEditorStore((s) => s.setAspect);
  const setCroppedAreaPixels = useEditorStore((s) => s.setCroppedAreaPixels);

  const imageUrl = useMemo(() => {
    if (!imageBitmap) return null;
    return imageBitmapToDataURL(imageBitmap);
  }, [imageBitmap]);

  if (!isCropOpen || !imageBitmap || !imageUrl) return null;

  const currentAspect = aspect === 0 ? undefined : aspect;

  return (
    <div className="crop-popover" role="dialog" aria-label="Crop tool">
      <div className="crop-popover-header">
        <div className="crop-title">Crop</div>

        <button className="crop-close" onClick={closeCrop} aria-label="Close crop">
          ✕
        </button>
      </div>

      <div className="crop-ratios">
        <button
          className={`ratio-btn ${aspect === 0 ? "active" : ""}`}
          onClick={() => setAspect(0)}
          type="button"
        >
          Free
        </button>
        <button
          className={`ratio-btn ${aspect === 1 ? "active" : ""}`}
          onClick={() => setAspect(1)}
          type="button"
        >
          1:1
        </button>
        <button
          className={`ratio-btn ${aspect === 4 / 5 ? "active" : ""}`}
          onClick={() => setAspect(4 / 5)}
          type="button"
        >
          4:5
        </button>
        <button
          className={`ratio-btn ${aspect === 16 / 9 ? "active" : ""}`}
          onClick={() => setAspect(16 / 9)}
          type="button"
        >
          16:9
        </button>
      </div>

      <div className="cropper-stage">
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoomCrop}
          aspect={currentAspect}
          onCropChange={setCrop}
          onZoomChange={setZoomCrop}
          onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
        />
      </div>

      <div className="crop-controls">
        <div className="crop-zoom-row">
          <span>Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoomCrop}
            onChange={(e) => setZoomCrop(Number(e.target.value))}
          />
          <span>{Math.round(zoomCrop * 100)}%</span>
        </div>

        <button className="crop-done" onClick={closeCrop} type="button">
          Done
        </button>
      </div>
    </div>
  );
}