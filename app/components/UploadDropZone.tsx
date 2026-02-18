"use client";
import {useCallback} from "react";
import {useDropzone} from "react-dropzone";
import {useEditorStore} from "../store/useEditorStore";

const UploadDropZone = () => {
    const setImageBitmap = useEditorStore((s) => s.setImageBitmap);
    const reset = useEditorStore((s) => s.reset);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        reset();

        const bmp = await createImageBitmap(file);
        console.log("bitmap size:", bmp.width, bmp.height);
        setImageBitmap(bmp);
    }, [reset, setImageBitmap]);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: {"image/*": []},
        multiple: false,
    });

    return (
        <div
            {...getRootProps()}
            className ={[
                "border-2 border-dashed rounded-x1 p-6 cursor-pointer",
                "transition select-none",
                isDragActive ? "border-blue-500 bg-blue-50" : "border-zinc-300 bg-white",
            ].join(" ")}
            >
            <input {...getInputProps()} />
                     <p className ="text-sm text-zinc-700">
                        {isDragActive ? "Drop the image here..." : "Drag and drop an image, or click to upload."}
                     </p>
                     <p className="text-xs text-zinc-500 mt-1">
                        Supported formats: JPEG, PNG, GIF, etc.
                     </p>

            </div>
    )
}

export default UploadDropZone;

