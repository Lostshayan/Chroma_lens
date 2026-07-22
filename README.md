# ChromaLens PWA

**ChromaLens** is a progressive web application designed to help color-blind users identify and analyze colors in real-time or from snapshots. Built with an accessible, high-contrast, and premium editorial design, it translates colors instantly using a visual matching algorithm.

---

## 🎨 Design System

ChromaLens features a modern user interface inspired by **Lumina**, optimized specifically for mobile viewports:
* **Dual Theme:** Clean parchment light mode and dark espresso mode.
* **Ambient Motion:** Floating, blurred background blobs that drift dynamically.
* **Visual Tactility:** Glassmorphism cards with subtle hover lifts, active scaling transitions, and clear boundaries.
* **Contrast Compliance:** Swatches automatically compute relative luminance to dynamically adapt text color (e.g. white text on dark colors, dark text on light colors) guaranteeing high contrast.

---

## ⚡ Features

### 1. Live Camera Color Scanner
Point your device's camera at any object to identify its color instantly:
* **Circular HUD Tracker:** A circular, dashed HUD crosshair target that rotates continuously.
* **Freeze Frame:** Tap **Freeze Scanner** to pause the camera stream, inspect the color, copy the Hex code, and tap **Resume Scanner** to continue. Great for keeping a steady view!
* **Optimized mobile viewport:** A 1:1 square camera layout cropped dynamically with `object-fit: cover` to prevent vertical scrolling.

### 2. Snap-to-Target Photo Inspector
Select a photo from your gallery or capture one using the native camera:
* **Precision Targeting:** Tap anywhere on the image. A visual target ring snaps onto your tapped location, pulsing gently to confirm the selected pixel.
* **Color Details:** Displays the closest matched color name, precise Hex code, and RGB values.

### 3. PWA Install Prompt Banner
An overlay banner prompts users to install the application:
* **Android/Chrome:** Detects installability and prompts the native installation dialog in one click.
* **iOS Safari:** Since iOS doesn't support the native event, it shows detailed, step-by-step instructions on how to tap the Share icon 📤 and select "Add to Home Screen" ＋.

---

## 🔬 How Color Detection Works

The app operates on a client-side color extraction and translation pipeline:
1. **Pixel Extraction (Canvas API):** The app captures the camera frame or image onto a hidden `<canvas>` context and extracts the RGB coordinates:
   ```js
   const pixelData = ctx.getImageData(x, y, 1, 1).data;
   ```
2. **Euclidean Color Matching:** It converts the RGB to a Hex value and computes the closest match against a dictionary of **95+ curated color names** by calculating the shortest Euclidean distance in the 3D RGB color space:
   $$d = \sqrt{(R_{\text{sample}} - R_{\text{match}})^2 + (G_{\text{sample}} - G_{\text{match}})^2 + (B_{\text{sample}} - B_{\text{match}})^2}$$
3. **Contrast Assessment (Relative Luminance):** Evaluates compliance using the WCAG formula to determine dark/light theme overrides for overlay text:
   $$\text{Luminance} = \frac{0.2126 \times R + 0.7152 \times G + 0.0722 \times B}{255}$$

---

## 🛠️ Local Development

### 1. Installation
Clone the repository and install the dependencies:
```bash
git clone https://github.com/Lostshayan/Chroma_lens.git
cd Chroma_lens
npm install
```

### 2. Running Locally
Run the development server. (Note: Because Vite's PWA Workbox builder uses cryptographic APIs, it is run with `--experimental-global-webcrypto` for Node 18 compatibility):
```bash
npm run dev
```

### 3. Production Build
Compile and bundle the production PWA with registered service workers:
```bash
npm run build
```

---

## 🌐 Deploying to Vercel
The project is configured for continuous integration with Vercel. Pushing to the `main` branch automatically triggers Vercel's edge network to build and deploy:
```bash
git add .
git commit -m "update: improvements"
git push
```
