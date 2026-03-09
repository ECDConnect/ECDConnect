// Function to convert hex to HSL
export const hexToHsl = (hex) => {
  if (!/^#([0-9A-Fa-f]{6})$/.test(hex)) {
    throw new Error('Invalid HEX color: must be #RRGGBB');
  }

  // Convert hex to RGB
  let r = parseInt(hex.substring(1, 3), 16) / 255;
  let g = parseInt(hex.substring(3, 5), 16) / 255;
  let b = parseInt(hex.substring(5, 7), 16) / 255;

  // Find min and max values of RGB
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // Achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
};

// Function to convert HSL to hex
export const hslToHex = (h, s, l) => {
  // Clamp inputs
  h = ((h % 360) + 360) % 360; // Ensure hue is in [0, 360]
  s = Math.max(0, Math.min(100, s)); // Clamp saturation to [0, 100]
  l = Math.max(0, Math.min(100, l)); // Clamp lightness to [0, 100]

  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  let m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  // Convert each component to a two-digit HEX string
  const rHex = Math.max(0, Math.min(255, r)).toString(16).padStart(2, '0');
  const gHex = Math.max(0, Math.min(255, g)).toString(16).padStart(2, '0');
  const bHex = Math.max(0, Math.min(255, b)).toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
};

// Function to generate secondary and tertiary colors
export const lightenColor = (hex, percentage) => {
  hex = hex.trim();
  if (typeof percentage !== 'number' || percentage < 0 || percentage > 100) {
    throw new Error('Percentage must be a number between 0 and 100');
  }
  let [h, s, l] = hexToHsl(hex);
  l = Math.min(100, l + (100 - l) * (percentage / 100));
  return hslToHex(h, s, l);
};
