"use client";

import { useEditorStore } from "../store/useEditorStore";

export default function EditableImageName() {
  const imageBitmap = useEditorStore((s) => s.imageBitmap);
  const imageName = useEditorStore((s) => s.imageName);
  const setImageName = useEditorStore((s) => s.setImageName);

  // Hide until an image is uploaded
  if (!imageBitmap) return null;

  return (
    <section className="image-name-bar">
      <div className="image-name-inner">
        <label className="image-name-label" htmlFor="imageName">
          Image name
        </label>

        <input
          id="imageName"
          className="image-name-input"
          value={imageName}
          onChange={(e) => setImageName(e.target.value)}
          placeholder="Enter a file name..."
        />

        <span className="image-name-ext">.png / .jpg</span>
      </div>
    </section>
  );
};

