
export async function exportCanvasImage(opts:
    {canvas: HTMLCanvasElement;
        type: "image/png" | "image/jpeg";
        quality?: number; // 0-1, only for jpeg
        fileName: string;
    }){
        const {canvas, type, quality = 0.92, fileName} = opts;

        const blob: Blob | null = await new Promise((resolve) => 
            canvas.toBlob(resolve, type, quality)
        );

        if (!blob) return;
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    }

