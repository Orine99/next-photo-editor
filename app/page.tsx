import UploadDropzone from "./components/UploadDropZone";
import EditorCanvas from "./components/EditorCanvas";
import Toolbar from "./components/Toolbar";
import Navbar from "./components/Navbar";
import HeroUploadSection from "./components/HeroUploadSection";
import EditableImageName from "./components/EditableImageName";
import CropPopover from "./components/CropPopover";


export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-6xl mx-auto space-y-4">
        <Navbar />
        <HeroUploadSection />
        <EditableImageName />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <EditorCanvas />
              </div>

              <div className="lg:col-span-1">
                 <Toolbar />
              </div>
              {/* overlays over the toolbar (right side) */}
              <CropPopover />
        </div>
      </div>
    </main>
  );
}

