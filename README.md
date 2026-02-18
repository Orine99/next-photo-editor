🖼️ Next.js Photo Editor (MVP)

A client-side photo editing application built with Next.js (App Router), React, Zustand, and the HTML5 Canvas API.

This project demonstrates a reactive image editing workflow where user actions update global state, automatically triggering canvas re-rendering.

🚀 Features (Current MVP)

✅ Upload image (Drag & Drop or Click)

✅ Canvas-based preview

✅ Brightness adjustment

✅ Contrast adjustment

✅ Saturation adjustment

✅ Grayscale filter

✅ Sepia filter

✅ Rotate ±90°

✅ Flip Horizontal / Vertical

✅ Reset edits

✅ Export as PNG or JPG

🧠 Project Architecture & Workflow

This application follows a reactive state-driven rendering model.

Instead of manually updating the canvas everywhere, all edits update centralized state. The canvas reacts automatically.

🔄 High-Level Workflow
User Action
   ↓
Zustand Store Updates
   ↓
EditorCanvas Detects State Change
   ↓
drawToCanvas() Re-renders Image
   ↓
Canvas Updates in Real-Time

📂 Project Structure
src/
  app/
    page.tsx              → Main layout
  components/
    UploadDropzone.tsx    → Image upload
    EditorCanvas.tsx      → Canvas rendering
    Toolbar.tsx           → Editing controls
  store/
    useEditorStore.ts     → Global state (Zustand)
  lib/
    draw.ts               → Canvas rendering logic
    exportImage.ts        → Image export logic

🔍 Detailed Workflow Explanation
1️⃣ Page Load

page.tsx renders:

UploadDropzone

EditorCanvas

Toolbar

These are client components because they rely on browser APIs (canvas, window, file input).

2️⃣ Global State (Zustand)

All editor state is centralized in:

useEditorStore.ts


State includes:

imageBitmap

rotation

flipX, flipY

filters (brightness, contrast, etc.)

Any component can:

Read state

Update state

React to state changes

3️⃣ Image Upload Flow

Inside UploadDropzone.tsx:

User selects or drops image

createImageBitmap(file) decodes the image

setImageBitmap(bmp) stores it in Zustand

This triggers a re-render in the canvas component.

4️⃣ Canvas Rendering System

Inside EditorCanvas.tsx:

Subscribes to:

imageBitmap

rotation

flipX, flipY

filters

Whenever any of these change:

useEffect → drawToCanvas()

5️⃣ drawToCanvas()

Located in lib/draw.ts

This function:

Measures canvas size

Adjusts for devicePixelRatio

Clears the canvas

Applies filters:

ctx.filter = brightness(...) contrast(...) saturate(...) grayscale(...) sepia(...)


Applies transformations:

translate to center

rotate

flip

Draws the image scaled to fit

The preview is always a fresh render of the current state.

6️⃣ Editing Controls

Inside Toolbar.tsx:

Buttons and sliders update Zustand:

setFilter("brightness", value)
setRotation(rotation + 90)
toggleFlipX()


Toolbar does not draw directly.

State changes → Canvas reacts automatically.

7️⃣ Export Process

When Export is clicked:

Canvas is selected

canvas.toBlob() is called

A temporary download link is generated

File downloads (PNG or JPG)

Currently, export downloads exactly what is shown in the preview canvas.

🛠️ Tech Stack

Next.js (App Router)

React

TypeScript

Zustand (State Management)

HTML5 Canvas API

TailwindCSS

react-dropzone

💡 Design Philosophy

This project follows:

Centralized state management

Reactive rendering

Clear separation of concerns

Canvas abstraction inside a single draw function

No component directly manipulates the canvas except EditorCanvas.

🧪 How to Run
npm install
npm run dev


Open:

http://localhost:3000

📈 Planned Upgrades

Crop tool

Undo / Redo history stack

Text tool

Stickers

Save projects (database)

AI features (background removal, enhancement)

High-resolution export from original image dimensions

🏗️ Future Architectural Improvements

Use a dedicated export canvas

Add history state snapshots

Layer system

Modular tool system

📄 License

This project is for educational and portfolio purposes.