"use client";

import { useEditorStore } from "../../store/useEditorStore";
import { exportEditedImage } from "../../lib/exportImage";
import Slider from "./Slider";

const cropOptions = [
  { label: "Free", aspect: 0, boxClass: "ratio-box-free" },
  { label: "1:1", aspect: 1, boxClass: "ratio-box-1-1" },
  { label: "4:5", aspect: 4 / 5, boxClass: "ratio-box-4-5" },
  { label: "16:9", aspect: 16 / 9, boxClass: "ratio-box-16-9" },
];

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
  const imageName = useEditorStore((s) => s.imageName);
  const isCropOpen = useEditorStore((s) => s.isCropOpen);
  const openCrop = useEditorStore((s) => s.openCrop);
  const closeCrop = useEditorStore((s) => s.closeCrop);
  const aspect = useEditorStore((s) => s.aspect);
  const setAspect = useEditorStore((s) => s.setAspect);
  const croppedAreaPixels = useEditorStore((s) => s.croppedAreaPixels);

  const sanitizeFileName = (name: string) =>
    name
      .trim()
      .replace(/[\/\\?%*:|"<>]/g, "-")
      .replace(/\s+/g, " ");

  const handleExport = async (type: "image/png" | "image/jpeg") => {
    if (!imageBitmap) return;

    const safe = sanitizeFileName(imageName || "EditableImage") || "EditableImage";
    const ext = type === "image/png" ? "png" : "jpg";

    await exportEditedImage({
      image: imageBitmap,
      type,
      rotationDeg: rotation,
      flipX,
      flipY,
      filters,
      croppedAreaPixels,
      quality: type === "image/jpeg" ? 0.92 : 1,
      fileName: `${safe}.${ext}`,
    });
  };

  const handleCropToggle = () => {
    if (!imageBitmap) return;
    if (isCropOpen) closeCrop();
    if (!isCropOpen) openCrop();
  };

  const handleCropAspectChange = (nextAspect: number) => {
    setAspect(nextAspect);
    if (!isCropOpen) openCrop();
  };

  const disabled = !imageBitmap;

  return (
    <div className="nature-toolbar rounded-xl border p-4 space-y-4">
      <div className="nature-tools-title text-sm font-medium">Tools</div>

      <div className="flex flex-wrap gap-2">
        <button
          className="nature-action-btn px-3 py-2 rounded-lg border disabled:opacity-50"
          onClick={() => setRotation(rotation - 90)}
          disabled={disabled}
        >
          Rotate -90 deg
        </button>
        <button
          className="nature-action-btn px-3 py-2 rounded-lg border disabled:opacity-50"
          onClick={() => setRotation(rotation + 90)}
          disabled={disabled}
        >
          Rotate +90 deg
        </button>
        <button
          className="nature-action-btn px-3 py-2 rounded-lg border disabled:opacity-50"
          onClick={toggleFlipX}
          disabled={disabled}
        >
          Flip X {flipX ? "On" : ""}
        </button>
        <button
          className="nature-action-btn px-3 py-2 rounded-lg border disabled:opacity-50"
          onClick={toggleFlipY}
          disabled={disabled}
        >
          Flip Y {flipY ? "On" : ""}
        </button>
        <button
          className="nature-action-btn px-3 py-2 rounded-lg border disabled:opacity-50"
          onClick={reset}
          disabled={disabled}
        >
          Reset
        </button>
      </div>

      <div className="crop-selector">
        <button
          className={`crop-trigger nature-action-btn disabled:opacity-50 ${isCropOpen ? "open" : ""}`}
          onClick={handleCropToggle}
          disabled={disabled}
          type="button"
        >
          <span>Crop</span>
          <span
            className={`crop-arrow-icon ${isCropOpen ? "open" : ""}`}
            aria-hidden="true"
          />
        </button>

        {isCropOpen && (
          <div className="crop-menu" role="menu" aria-label="Crop sizes">
            {cropOptions.map((option) => (
              <button
                key={option.label}
                className={`crop-menu-item ${aspect === option.aspect ? "active" : ""}`}
                onClick={() => handleCropAspectChange(option.aspect)}
                type="button"
              >
                <span className={`ratio-box ${option.boxClass}`} aria-hidden="true" />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        )}
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
          className="nature-action-btn px-3 py-2 rounded-lg border disabled:opacity-50"
          onClick={() => handleExport("image/png")}
          disabled={disabled}
        >
          Export PNG
        </button>
        <button
          className="nature-action-btn px-3 py-2 rounded-lg border disabled:opacity-50"
          onClick={() => handleExport("image/jpeg")}
          disabled={disabled}
        >
          Export JPG
        </button>
      </div>
    </div>
  );
}
