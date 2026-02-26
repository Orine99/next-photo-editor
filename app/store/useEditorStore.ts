import {create} from "zustand";

type Filters ={
    brightness: number; // 0.5 - 2
    contrast: number;// 0.5 - 2
    saturation: number;//0- 2
    grayscale: number;// 0-1
    sepia: number;// 0-1
}

type CropPoint = { x: number; y: number };
type CroppedArea = { x: number; y: number; width: number; height: number };


type EditorState = {
    imageBitmap: ImageBitmap | null;
    rotation: number; // 0, 90, 180, 270
    flipX: boolean;
    flipY: boolean;
    filters: Filters;
    zoom: number;// 0.5 - 3
    imageName: string;
    //Crop related states
    isCropOpen: boolean;
    crop: CropPoint;
    zoomCrop: number;
    aspect: number; // 0 = Free
    croppedAreaPixels: CroppedArea | null;
    
    setImageName: (name: string) => void;
    setImageBitmap: (bitmap: ImageBitmap | null) => void;
    setRotation: (deg: number) => void;
    toggleFlipX: ()=> void;
    toggleFlipY: ()=> void;
    setFilter: <K extends keyof Filters>(Key: K, value: Filters[K]) => void;
    setZoom: (z: number) => void;

    //Crop related actions
    openCrop: () => void;
    closeCrop: () => void;
    toggleCrop: () => void;

    setCrop: (c: CropPoint) => void;
    setZoomCrop: (z: number) => void;
    setAspect: (a: number) => void;
    setCroppedAreaPixels: (area: CroppedArea) => void;
   

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
    zoom: 1,
    imageName: "EditableImage",
    //Crop related states
    isCropOpen: false,
    crop: { x: 0, y: 0 },
    zoomCrop: 1,
    aspect: 0, // Free by default
    croppedAreaPixels: null,

    setImageName: (name) => set({ imageName: name }),
    setImageBitmap: (bitmap) => set({imageBitmap: bitmap}),
    setRotation: (deg) => set((s) => ({rotation: deg})),
    toggleFlipX: () => set((s)=>({flipX: !s.flipX})),
    toggleFlipY: () => set((s)=>({flipY: !s.flipY})),
    setFilter: (key, value) => set((s) => ({filters: {...s.filters, [key]: value}})),
    setZoom: (z) => set({ zoom: z }),
    //Crop related actions
    openCrop: () => set({ isCropOpen: true }),
    closeCrop: () => set({ isCropOpen: false }),
    toggleCrop: () => set((s) => ({ isCropOpen: !s.isCropOpen })),

    setCrop: (c) => set({ crop: c }),
    setZoomCrop: (z) => set({ zoomCrop: z }),
    setAspect: (a) => set({ aspect: a }),
    setCroppedAreaPixels: (area) => set({ croppedAreaPixels: area }),

    reset: () => set({
          rotation: 0,
          flipX: false,
          flipY: false,
          filters: defaultFilters,
          zoom: 1,
          isCropOpen: false,
            crop: { x: 0, y: 0 },
            zoomCrop: 1,
            aspect: 0,
            croppedAreaPixels: null,
                    
        }),


}));




