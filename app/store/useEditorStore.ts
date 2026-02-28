import { create } from "zustand";

type Filters = {
  brightness: number; // 0.5 - 2
  contrast: number; // 0.5 - 2
  saturation: number; // 0 - 2
  grayscale: number; // 0 - 1
  sepia: number; // 0 - 1
};

type CropPoint = { x: number; y: number };
type CroppedArea = { x: number; y: number; width: number; height: number };

type EditableSnapshot = {
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  filters: Filters;
  zoom: number;
  crop: CropPoint;
  zoomCrop: number;
  aspect: number;
  croppedAreaPixels: CroppedArea | null;
};

type CropSessionSnapshot = {
  crop: CropPoint;
  zoomCrop: number;
  aspect: number;
  croppedAreaPixels: CroppedArea | null;
};

type EditorState = {
  imageBitmap: ImageBitmap | null;
  rotation: number; // 0, 90, 180, 270
  flipX: boolean;
  flipY: boolean;
  filters: Filters;
  zoom: number; // 0.5 - 3
  imageName: string;
  // Crop related states
  isCropOpen: boolean;
  crop: CropPoint;
  zoomCrop: number;
  aspect: number; // 0 = Free
  croppedAreaPixels: CroppedArea | null;

  historyPast: EditableSnapshot[];
  historyFuture: EditableSnapshot[];
  cropSessionStart: CropSessionSnapshot | null;

  setImageName: (name: string) => void;
  setImageBitmap: (bitmap: ImageBitmap | null) => void;
  setRotation: (deg: number) => void;
  toggleFlipX: () => void;
  toggleFlipY: () => void;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  setZoom: (z: number) => void;

  // Crop related actions
  openCrop: () => void;
  closeCrop: () => void;
  toggleCrop: () => void;
  applyCropSession: () => void;
  cancelCropSession: () => void;

  setCrop: (c: CropPoint) => void;
  setZoomCrop: (z: number) => void;
  setAspect: (a: number) => void;
  setCroppedAreaPixels: (area: CroppedArea | null) => void;

  undo: () => void;
  redo: () => void;
  reset: () => void;
};

const HISTORY_LIMIT = 100;

const defaultFilters: Filters = {
  brightness: 1,
  contrast: 1,
  saturation: 1,
  grayscale: 0,
  sepia: 0,
};

function cloneFilters(filters: Filters): Filters {
  return { ...filters };
}

function cloneCrop(crop: CropPoint): CropPoint {
  return { ...crop };
}

function cloneArea(area: CroppedArea | null): CroppedArea | null {
  return area ? { ...area } : null;
}

function editableSnapshotFromState(state: EditorState): EditableSnapshot {
  return {
    rotation: state.rotation,
    flipX: state.flipX,
    flipY: state.flipY,
    filters: cloneFilters(state.filters),
    zoom: state.zoom,
    crop: cloneCrop(state.crop),
    zoomCrop: state.zoomCrop,
    aspect: state.aspect,
    croppedAreaPixels: cloneArea(state.croppedAreaPixels),
  };
}

function cropSessionSnapshotFromState(state: EditorState): CropSessionSnapshot {
  return {
    crop: cloneCrop(state.crop),
    zoomCrop: state.zoomCrop,
    aspect: state.aspect,
    croppedAreaPixels: cloneArea(state.croppedAreaPixels),
  };
}

function cropSessionEqual(a: CropSessionSnapshot, b: CropSessionSnapshot): boolean {
  const areaEqual =
    (!a.croppedAreaPixels && !b.croppedAreaPixels) ||
    (!!a.croppedAreaPixels &&
      !!b.croppedAreaPixels &&
      a.croppedAreaPixels.x === b.croppedAreaPixels.x &&
      a.croppedAreaPixels.y === b.croppedAreaPixels.y &&
      a.croppedAreaPixels.width === b.croppedAreaPixels.width &&
      a.croppedAreaPixels.height === b.croppedAreaPixels.height);

  return (
    a.crop.x === b.crop.x &&
    a.crop.y === b.crop.y &&
    a.zoomCrop === b.zoomCrop &&
    a.aspect === b.aspect &&
    areaEqual
  );
}

function editableSnapshotToState(snapshot: EditableSnapshot): Partial<EditorState> {
  return {
    rotation: snapshot.rotation,
    flipX: snapshot.flipX,
    flipY: snapshot.flipY,
    filters: cloneFilters(snapshot.filters),
    zoom: snapshot.zoom,
    crop: cloneCrop(snapshot.crop),
    zoomCrop: snapshot.zoomCrop,
    aspect: snapshot.aspect,
    croppedAreaPixels: cloneArea(snapshot.croppedAreaPixels),
  };
}

function appendHistory(past: EditableSnapshot[], snapshot: EditableSnapshot): EditableSnapshot[] {
  if (past.length >= HISTORY_LIMIT) {
    return [...past.slice(1), snapshot];
  }
  return [...past, snapshot];
}

export const useEditorStore = create<EditorState>((set) => ({
  imageBitmap: null,
  rotation: 0,
  flipX: false,
  flipY: false,
  filters: defaultFilters,
  zoom: 1,
  imageName: "EditableImage",
  // Crop related states
  isCropOpen: false,
  crop: { x: 0, y: 0 },
  zoomCrop: 1,
  aspect: 0, // Free by default
  croppedAreaPixels: null,

  historyPast: [],
  historyFuture: [],
  cropSessionStart: null,

  setImageName: (name) => set({ imageName: name }),
  setImageBitmap: (bitmap) =>
    set({
      imageBitmap: bitmap,
      historyPast: [],
      historyFuture: [],
      cropSessionStart: null,
      isCropOpen: false,
    }),

  setRotation: (deg) =>
    set((s) => {
      if (s.rotation === deg) return {};
      return {
        rotation: deg,
        historyPast: appendHistory(s.historyPast, editableSnapshotFromState(s)),
        historyFuture: [],
      };
    }),

  toggleFlipX: () =>
    set((s) => ({
      flipX: !s.flipX,
      historyPast: appendHistory(s.historyPast, editableSnapshotFromState(s)),
      historyFuture: [],
    })),

  toggleFlipY: () =>
    set((s) => ({
      flipY: !s.flipY,
      historyPast: appendHistory(s.historyPast, editableSnapshotFromState(s)),
      historyFuture: [],
    })),

  setFilter: (key, value) =>
    set((s) => {
      if (s.filters[key] === value) return {};
      return {
        filters: { ...s.filters, [key]: value },
        historyPast: appendHistory(s.historyPast, editableSnapshotFromState(s)),
        historyFuture: [],
      };
    }),

  setZoom: (z) =>
    set((s) => {
      if (s.zoom === z) return {};
      return {
        zoom: z,
        historyPast: appendHistory(s.historyPast, editableSnapshotFromState(s)),
        historyFuture: [],
      };
    }),

  // Crop related actions
  openCrop: () =>
    set((s) => {
      if (s.isCropOpen) return {};
      return {
        isCropOpen: true,
        cropSessionStart: cropSessionSnapshotFromState(s),
      };
    }),

  closeCrop: () =>
    set({
      isCropOpen: false,
      cropSessionStart: null,
    }),

  toggleCrop: () =>
    set((s) => {
      if (s.isCropOpen) {
        return {
          isCropOpen: false,
          cropSessionStart: null,
        };
      }
      return {
        isCropOpen: true,
        cropSessionStart: cropSessionSnapshotFromState(s),
      };
    }),

  applyCropSession: () =>
    set((s) => {
      if (!s.isCropOpen) return {};

      const start = s.cropSessionStart;
      if (!start) {
        return {
          isCropOpen: false,
          cropSessionStart: null,
        };
      }

      const currentCrop = cropSessionSnapshotFromState(s);
      if (cropSessionEqual(start, currentCrop)) {
        return {
          isCropOpen: false,
          cropSessionStart: null,
        };
      }

      const currentEditable = editableSnapshotFromState(s);
      const previousEditable: EditableSnapshot = {
        ...currentEditable,
        crop: cloneCrop(start.crop),
        zoomCrop: start.zoomCrop,
        aspect: start.aspect,
        croppedAreaPixels: cloneArea(start.croppedAreaPixels),
      };

      return {
        isCropOpen: false,
        cropSessionStart: null,
        historyPast: appendHistory(s.historyPast, previousEditable),
        historyFuture: [],
      };
    }),

  cancelCropSession: () =>
    set((s) => {
      if (!s.isCropOpen) return {};
      const start = s.cropSessionStart;
      if (!start) {
        return {
          isCropOpen: false,
          cropSessionStart: null,
        };
      }

      return {
        isCropOpen: false,
        cropSessionStart: null,
        crop: cloneCrop(start.crop),
        zoomCrop: start.zoomCrop,
        aspect: start.aspect,
        croppedAreaPixels: cloneArea(start.croppedAreaPixels),
      };
    }),

  setCrop: (c) =>
    set((s) => {
      if (s.crop.x === c.x && s.crop.y === c.y) return {};
      return { crop: c };
    }),

  setZoomCrop: (z) =>
    set((s) => {
      if (s.zoomCrop === z) return {};
      return { zoomCrop: z };
    }),

  setAspect: (a) =>
    set((s) => {
      if (s.aspect === a) return {};
      return { aspect: a };
    }),

  setCroppedAreaPixels: (area) =>
    set((s) => {
      const current = s.croppedAreaPixels;
      const equal =
        (!current && !area) ||
        (!!current &&
          !!area &&
          current.x === area.x &&
          current.y === area.y &&
          current.width === area.width &&
          current.height === area.height);

      if (equal) return {};
      return { croppedAreaPixels: cloneArea(area) };
    }),

  undo: () =>
    set((s) => {
      if (s.historyPast.length === 0) return {};

      const previous = s.historyPast[s.historyPast.length - 1];
      const current = editableSnapshotFromState(s);
      const nextPast = s.historyPast.slice(0, -1);
      const nextFuture = [current, ...s.historyFuture].slice(0, HISTORY_LIMIT);

      return {
        ...editableSnapshotToState(previous),
        historyPast: nextPast,
        historyFuture: nextFuture,
        isCropOpen: false,
        cropSessionStart: null,
      };
    }),

  redo: () =>
    set((s) => {
      if (s.historyFuture.length === 0) return {};

      const next = s.historyFuture[0];
      const current = editableSnapshotFromState(s);
      const nextFuture = s.historyFuture.slice(1);
      const nextPast = appendHistory(s.historyPast, current);

      return {
        ...editableSnapshotToState(next),
        historyPast: nextPast,
        historyFuture: nextFuture,
        isCropOpen: false,
        cropSessionStart: null,
      };
    }),

  reset: () =>
    set((s) => {
      const current = editableSnapshotFromState(s);
      const nextFilters = cloneFilters(defaultFilters);

      const alreadyDefault =
        s.rotation === 0 &&
        !s.flipX &&
        !s.flipY &&
        s.zoom === 1 &&
        s.crop.x === 0 &&
        s.crop.y === 0 &&
        s.zoomCrop === 1 &&
        s.aspect === 0 &&
        !s.croppedAreaPixels &&
        s.filters.brightness === nextFilters.brightness &&
        s.filters.contrast === nextFilters.contrast &&
        s.filters.saturation === nextFilters.saturation &&
        s.filters.grayscale === nextFilters.grayscale &&
        s.filters.sepia === nextFilters.sepia;

      if (alreadyDefault && !s.isCropOpen && !s.cropSessionStart) return {};

      return {
        rotation: 0,
        flipX: false,
        flipY: false,
        filters: nextFilters,
        zoom: 1,
        isCropOpen: false,
        crop: { x: 0, y: 0 },
        zoomCrop: 1,
        aspect: 0,
        croppedAreaPixels: null,
        cropSessionStart: null,
        historyPast: appendHistory(s.historyPast, current),
        historyFuture: [],
      };
    }),
}));
