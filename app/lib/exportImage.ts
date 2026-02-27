type Filters = {
  brightness: number;
  contrast: number;
  saturation: number;
  grayscale: number;
  sepia: number;
};

type CropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getSafeCrop(image: ImageBitmap, crop: CropArea | null | undefined) {
  const x = Math.floor(clamp(crop?.x ?? 0, 0, image.width - 1));
  const y = Math.floor(clamp(crop?.y ?? 0, 0, image.height - 1));
  const width = Math.max(1, Math.floor(clamp(crop?.width ?? image.width, 1, image.width - x)));
  const height = Math.max(1, Math.floor(clamp(crop?.height ?? image.height, 1, image.height - y)));
  return { x, y, width, height };
}

function getRotatedBounds(width: number, height: number, rotationDeg: number) {
  const radians = (rotationDeg * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  return {
    width: Math.max(1, Math.round(width * cos + height * sin)),
    height: Math.max(1, Math.round(width * sin + height * cos)),
    radians,
  };
}

async function downloadCanvasAsImage(opts: {
  canvas: HTMLCanvasElement;
  type: "image/png" | "image/jpeg";
  quality?: number;
  fileName: string;
}) {
  const { canvas, type, quality = 0.92, fileName } = opts;

  const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, type, quality));
  if (!blob) return;

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportEditedImage(opts: {
  image: ImageBitmap;
  type: "image/png" | "image/jpeg";
  fileName: string;
  rotationDeg: number;
  flipX: boolean;
  flipY: boolean;
  filters: Filters;
  croppedAreaPixels?: CropArea | null;
  quality?: number;
}) {
  const {
    image,
    type,
    fileName,
    rotationDeg,
    flipX,
    flipY,
    filters,
    croppedAreaPixels,
    quality = 0.92,
  } = opts;

  const crop = getSafeCrop(image, croppedAreaPixels);
  const bounds = getRotatedBounds(crop.width, crop.height, rotationDeg);

  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = bounds.width;
  exportCanvas.height = bounds.height;

  const ctx = exportCanvas.getContext("2d");
  if (!ctx) return;

  ctx.filter =
    `brightness(${filters.brightness}) ` +
    `contrast(${filters.contrast}) ` +
    `saturate(${filters.saturation}) ` +
    `grayscale(${filters.grayscale}) ` +
    `sepia(${filters.sepia})`;

  ctx.translate(bounds.width / 2, bounds.height / 2);
  ctx.rotate(bounds.radians);
  ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    -crop.width / 2,
    -crop.height / 2,
    crop.width,
    crop.height
  );

  await downloadCanvasAsImage({
    canvas: exportCanvas,
    type,
    quality,
    fileName,
  });
}

export async function exportCanvasImage(opts: {
  canvas: HTMLCanvasElement;
  type: "image/png" | "image/jpeg";
  quality?: number;
  fileName: string;
}) {
  await downloadCanvasAsImage(opts);
}
