import UploadDropzone from "./components/UploadDropZone";
import EditorCanvas from "./components/EditorCanvas";
import Toolbar from "./components/Toolbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-6xl mx-auto space-y-4">
        <h1 className="text-2xl font-semibold text-zinc-900">Photo Editor (MVP)</h1>

        <UploadDropzone />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <EditorCanvas />
              </div>

              <div className="lg:col-span-1">
                 <Toolbar />
              </div>
        </div>
      </div>
    </main>
  );
}