export function drawToCanvas(opts: {
  canvas: HTMLCanvasElement;
  image: ImageBitmap;
  rotationDeg: number;
  flipX: boolean;
  flipY: boolean;
  zoom: number;
  croppedAreaPixels?: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  filters: {
    brightness: number;
    contrast: number;
    saturation: number;
    grayscale: number;
    sepia: number;
  };
}) {
  const { canvas, image, rotationDeg, flipX, flipY, filters, zoom, croppedAreaPixels } = opts;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const rect = canvas.getBoundingClientRect();
  const cssWidth = Math.max(1, Math.floor(rect.width));
  const cssHeight = Math.max(1, Math.floor(rect.height));

  // If layout hasn't happened yet, skip this draw
  if (cssWidth <= 1 || cssHeight <= 1) return;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(cssWidth * dpr);
  canvas.height = Math.floor(cssHeight * dpr);

  // Work in CSS pixels
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssWidth, cssHeight);

  ctx.filter =
    `brightness(${filters.brightness}) ` +
    `contrast(${filters.contrast}) ` +
    `saturate(${filters.saturation}) ` +
    `grayscale(${filters.grayscale}) ` +
    `sepia(${filters.sepia})`;

  const cropX = Math.max(0, Math.min(image.width - 1, croppedAreaPixels?.x ?? 0));
  const cropY = Math.max(0, Math.min(image.height - 1, croppedAreaPixels?.y ?? 0));
  const cropW = Math.max(1, Math.min(image.width - cropX, croppedAreaPixels?.width ?? image.width));
  const cropH = Math.max(1, Math.min(image.height - cropY, croppedAreaPixels?.height ?? image.height));

  // Fit
  const baseScale = Math.min(cssWidth / cropW, cssHeight / cropH);
  const scale = baseScale * Math.max(0.1, zoom); 
  const drawW = cropW * scale;
  const drawH = cropH * scale;

  const cx = cssWidth / 2;
  const cy = cssHeight / 2;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((rotationDeg * Math.PI) / 180);
  ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);

  ctx.drawImage(image, cropX, cropY, cropW, cropH, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();

  ctx.filter = "none";
}
