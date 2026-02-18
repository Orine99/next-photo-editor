import {create} from "zustand";

type Filters ={
    brightness: number; // 0.5 - 2
    contrast: number;// 0.5 - 2
    saturation: number;//0- 2
    grayscale: number;// 0-1
    sepia: number;// 0-1
}


type EditorState = {
    imageBitmap: ImageBitmap | null;
    rotation: number; // 0, 90, 180, 270
    flipX: boolean;
    flipY: boolean;
    filters: Filters;

    setImageBitmap: (bitmap: ImageBitmap | null) => void;
    setRotation: (deg: number) => void;
    toggleFlipX: ()=> void;
    toggleFlipY: ()=> void;
    setFilter: <K extends keyof Filters>(Key: K, value: Filters[K]) => void;
    reset: () => void;
}

const defaultFilters: Filters = {
    brightness: 1,
    contrast: 1,
    saturation: 1,
    grayscale: 0,
    sepia: 0,
}

export const useEditorStore = create<EditorState>((set) => ({
    imageBitmap: null,
    rotation: 0,
    flipX: false,
    flipY: false,
    filters: defaultFilters,

    setImageBitmap: (bitmap) => set({imageBitmap: bitmap}),
    setRotation: (deg) => set((s) => ({rotation: deg})),
    toggleFlipX: () => set((s)=>({flipX: !s.flipX})),
    toggleFlipY: () => set((s)=>({flipY: !s.flipY})),
    setFilter: (key, value) => set((s) => ({filters: {...s.filters, [key]: value}})),
    reset: () => set({
          rotation: 0,
          flipX: false,
          flipY: false,
          filters: defaultFilters,
        }),


}));

