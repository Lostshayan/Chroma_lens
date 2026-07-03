import nearestColor from 'nearest-color';

const colors = {
  // Reds & Pinks
  "Crimson Red": "#DC143C",
  "Ruby Red": "#9B111E",
  "Burgundy": "#800020",
  "Scarlet Red": "#FF2400",
  "Tomato Red": "#FF6347",
  "Maroon": "#800000",
  "Fire Engine Red": "#CE2029",
  "Dark Red": "#8B0000",
  "Rose Pink": "#FF007F",
  "Hot Pink": "#FF69B4",
  "Soft Pink": "#FFB6C1",
  "Fuchsia": "#FF00FF",
  "Magenta": "#CA1F7B",
  "Coral Pink": "#F88379",
  "Salmon Pink": "#FF8C69",
  "Lavender Pink": "#FBAED2",

  // Oranges & Yellows
  "Orange": "#FFA500",
  "Dark Orange": "#FF8C00",
  "Coral Orange": "#FF7F50",
  "Peach": "#FFE5B4",
  "Tangerine": "#F28500",
  "Bronze": "#CD7F32",
  "Amber": "#FFBF00",
  "Gold": "#FFD700",
  "Bright Yellow": "#FFFF00",
  "Lemon Yellow": "#FFF700",
  "Canary Yellow": "#FFEF00",
  "Mustard Yellow": "#FFDB58",
  "Beige": "#F5F5DC",
  "Cream": "#FFFDD0",

  // Greens
  "Emerald Green": "#50C878",
  "Forest Green": "#228B22",
  "Lime Green": "#32CD32",
  "Mint Green": "#98FF98",
  "Olive Green": "#808000",
  "Army Green": "#4B5320",
  "Sage Green": "#8F9779",
  "Teal Green": "#008080",
  "Jade Green": "#00A86B",
  "Kelly Green": "#4CBB17",
  "Sea Green": "#2E8B57",
  "Lime": "#00FF00",
  "Dark Green": "#006400",
  "Chartreuse": "#7FFF00",

  // Blues
  "Navy Blue": "#000080",
  "Royal Blue": "#4169E1",
  "Sky Blue": "#87CEEB",
  "Electric Blue": "#7DF9FF",
  "Cobalt Blue": "#0047AB",
  "Midnight Blue": "#191970",
  "Cyan / Aqua": "#00FFFF",
  "Baby Blue": "#89CFF0",
  "Steel Blue": "#4682B4",
  "Slate Blue": "#6A5ACD",
  "Indigo": "#4B0082",
  "Turquoise": "#40E0D0",
  "Cerulean": "#007BA7",

  // Purples
  "Purple": "#800080",
  "Violet": "#8F00FF",
  "Plum": "#8E4585",
  "Lavender": "#E6E6FA",
  "Amethyst": "#9966CC",
  "Mauve": "#E0B0FF",
  "Lilac": "#C8A2C8",
  "Dark Magenta": "#8B008B",

  // Browns & Earth Tones
  "Brown": "#A52A2A",
  "Saddle Brown": "#8B4513",
  "Chocolate Brown": "#7B3F00",
  "Tan": "#D2B48C",
  "Khaki": "#C3B091",
  "Coffee": "#6F4E37",
  "Terracotta": "#E2725B",
  "Sand": "#C2B280",

  // Grayscale
  "White": "#FFFFFF",
  "Off-White": "#FAF9F6",
  "Ivory": "#FFFFF0",
  "Light Gray": "#D3D3D3",
  "Silver": "#C0C0C0",
  "Medium Gray": "#808080",
  "Charcoal": "#36454F",
  "Dark Gray": "#A9A9A9",
  "Black": "#000000"
};

export const nearestColorMatch = nearestColor.from(colors);

export function rgbToHex(r, g, b) {
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
}

export function getColorInfo(r, g, b) {
  const hex = rgbToHex(r, g, b);
  const match = nearestColorMatch(hex);
  
  // Calculate relative luminance for contrast detection (WCAG formula)
  // L = 0.2126 * R + 0.7152 * G + 0.0722 * B
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const isDark = luminance < 0.5;

  return {
    name: match.name,
    value: match.value,
    isDark,
    rgb: { r, g, b }
  };
}
