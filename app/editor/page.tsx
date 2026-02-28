import EditorCanvas from "../components/EditorCanvas";
import Toolbar from "../components/tools/Toolbar";
import Navbar from "../components/Navbar";
import HeroUploadSection from "../components/HeroUploadSection";
import EditableImageName from "../components/EditableImageName";


export default function EditorPage() {
  return (
    <main className="nature-theme min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-4">
        <Navbar />
        <HeroUploadSection />
        <EditableImageName />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Toolbar />
          </div>
          <div className="lg:col-span-2 order-1 lg:order-2">
            <EditorCanvas />
          </div>
        </div>
      </div>
    </main>
  );
}
