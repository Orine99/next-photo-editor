"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useEditorStore } from "../store/useEditorStore";

export default function UploadPanel() {
  const setImageBitmap = useEditorStore((s) => s.setImageBitmap);
  const reset = useEditorStore((s) => s.reset);
  const setImageName = useEditorStore((s) => s.setImageName);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      reset();
      
      // Set default name from the uploaded file
    const baseName = file.name.replace(/\.[^/.]+$/, ""); // removes extension
    setImageName(baseName || "EditableImage");

      const bmp = await createImageBitmap(file);
      setImageBitmap(bmp);
    },
    [reset, setImageBitmap]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    noClick: true, // IMPORTANT: we’ll trigger click via the button
    noKeyboard: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`upload-panel ${isDragActive ? "is-active" : ""}`}
    >
      <input {...getInputProps()} />

      <div className="upload-inner">
        <div className="upload-icon">⬆️</div>

        <h3 className="upload-title">
          {isDragActive ? "Drop it here" : "Upload a photo"}
        </h3>

        <p className="upload-subtitle">
          Drag & drop anywhere in this card, or use the button below.
        </p>

        <button type="button" className="upload-btn" onClick={open}>
          Choose Image
        </button>

        <p className="upload-hint">PNG, JPG, WEBP supported</p>
      </div>
    </div>
  );
};

