export function drawToCanvas(opts: {
  canvas: HTMLCanvasElement;
  image: ImageBitmap;
  rotationDeg: number;
  flipX: boolean;
  flipY: boolean;
  filters: {
    brightness: number;
    contrast: number;
    saturation: number;
    grayscale: number;
    sepia: number;
  };
}) {
  const { canvas, image, rotationDeg, flipX, flipY, filters } = opts;
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

  // Fit
  const scale = Math.min(cssWidth / image.width, cssHeight / image.height);
  const drawW = image.width * scale;
  const drawH = image.height * scale;

  const cx = cssWidth / 2;
  const cy = cssHeight / 2;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((rotationDeg * Math.PI) / 180);
  ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);

  ctx.drawImage(image, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();

  ctx.filter = "none";
}
