"use client";

type AboutPanelProps = {
  title?: string;
  tagline?: string;
  description?: string;
};

export default function AboutPanel({
  title = "Gleeful",
  tagline = "Edit faster. Export cleaner.",
  description = "Upload a photo, apply filters, rotate/flip, and export in seconds — all in your browser.",
}: AboutPanelProps) {
  return (
    <div className="about-panel" id ="about">
      <h2 className="about-title">{title}</h2>
      <p className="about-tagline">{tagline}</p>

      <p className="about-description">{description}</p>

    </div>
  );
}