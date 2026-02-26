"use client";

import AboutPanel from "./AboutPanel";
import UploadPanel from "./UploadDropZone";

export default function HeroUploadSection() {
  return (
    <section className="hero-upload" id = "about">
      <div className="hero-grid">
        <AboutPanel />
        <UploadPanel />
      </div>
    </section>
  );
}