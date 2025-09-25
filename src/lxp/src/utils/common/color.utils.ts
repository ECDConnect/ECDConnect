// utils/color.ts
export function lightenColor(hex: string, percent: number): string {
  // Remove the # if present
  hex = hex.replace(/^#/, '');

  // Parse r, g, b values
  const num = parseInt(hex, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;

  // Increase each channel by the percentage
  r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
  g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
  b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));

  // Return as hex string
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
