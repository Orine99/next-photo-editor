"use client";

import Cropper from "react-easy-crop";
import { useMemo } from "react";
import { useEditorStore } from "../../store/useEditorStore";

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
  const setCroppedAreaPixels = useEditorStore((s) => s.setCroppedAreaPixels);

  const imageUrl = useMemo(() => {
    if (!imageBitmap) return null;
    return imageBitmapToDataURL(imageBitmap);
  }, [imageBitmap]);

  if (!isCropOpen || !imageBitmap || !imageUrl) return null;

  const currentAspect = aspect === 0 ? undefined : aspect;

  return (
    <div className="canvas-crop-overlay" role="dialog" aria-label="Crop image on canvas">
      <Cropper
        image={imageUrl}
        crop={crop}
        zoom={zoomCrop}
        aspect={currentAspect}
        onCropChange={setCrop}
        onZoomChange={setZoomCrop}
        onCropAreaChange={(_, pixels) => setCroppedAreaPixels(pixels)}
        onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
      />

      <button className="canvas-crop-done" onClick={closeCrop} type="button">
        Done
      </button>
    </div>
  );
}
