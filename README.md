# Gleeful Photo Editor

A browser-based photo editor built with Next.js App Router, React, Zustand, and the HTML5 Canvas API.

Fast workflow, no server upload requirement, and clean PNG/JPG export.

## Current Workflow (Implemented)

1. Open the app and upload one image via drag-and-drop or the `Choose Image` button.
2. On upload, editor state resets and the default export name is set from the file name.
3. The canvas preview renders from centralized Zustand state.
4. Use tools to adjust:
   - rotation (`-90`, `+90`)
   - flip (`X`, `Y`)
   - filters (brightness, contrast, saturation, grayscale, sepia)
   - zoom (preview scale)
5. Open crop mode from the toolbar (or double-click/tap the canvas area), choose an aspect ratio, and set crop bounds.
6. Rename the export file in the image-name field.
7. Export as PNG or JPG.

## What Is Live Right Now

- Single-image upload (`image/*`)
- Reactive canvas rendering from global store
- Filter controls with real-time preview
- Rotation and flipping
- Zoom control for preview
- Crop overlay with ratio presets: `Free`, `1:1`, `4:5`, `16:9`
- Editable export filename
- PNG/JPG export with applied crop, filters, rotation, and flip
- Reset to editor defaults

## Architecture Snapshot

The app follows a state-driven render model:

`UI action -> Zustand state update -> canvas redraw -> export from current state`

- `useEditorStore.ts` is the single source of truth for edit state.
- `EditorCanvas.tsx` subscribes to state and redraws on change.
- `draw.ts` handles preview drawing logic (fit, zoom, transform, filter, crop region).
- `exportImage.ts` renders an off-screen export canvas and downloads PNG/JPG.

## Project Structure

```text
app/
  page.tsx
  components/
    AboutPanel.tsx
    EditableImageName.tsx
    EditorCanvas.tsx
    HeroUploadSection.tsx
    Navbar.tsx
    UploadDropZone.tsx
    tools/
      CropPopover.tsx
      Slider.tsx
      Toolbar.tsx
      ZoomControl.tsx
  lib/
    draw.ts
    exportImage.ts
  store/
    useEditorStore.ts
```

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Zustand
- react-dropzone
- react-easy-crop
- HTML5 Canvas API

## Run Locally

```bash
npm install
npm run dev
```

Open `https://next-photo-editor-nine.vercel.app/`.

Optional checks:

```bash
npm run lint
npm run build
```

## Notes

- Editing is fully client-side.
- Zoom affects preview scale, not output pixel dimensions.
- Export uses current crop + transform + filter state.

## License

Educational and portfolio use.