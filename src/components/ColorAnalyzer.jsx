import React, { useRef, useEffect, useState } from 'react';
import { getColorInfo } from '../utils/colorName';

// SVG Icons
const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);

export default function ColorAnalyzer({ imageSrc, onReset }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [tapPosition, setTapPosition] = useState(null); // { x, y } in client terms

  useEffect(() => {
    if (!imageSrc || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Find optimal width to fit container
      const containerWidth = containerRef.current.clientWidth;
      const scale = containerWidth / img.width;
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;

      canvas.width = scaledWidth;
      canvas.height = scaledHeight;
      
      ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
    };

    img.src = imageSrc;
  }, [imageSrc]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    
    // Safety check for boundary
    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return;

    const pixelData = ctx.getImageData(x, y, 1, 1).data;
    
    // Check alpha
    if (pixelData[3] === 0) return; 

    const r = pixelData[0];
    const g = pixelData[1];
    const b = pixelData[2];

    const match = getColorInfo(r, g, b);
    
    setSelectedColor({
      r, g, b,
      name: match.name,
      hex: match.value,
      isDark: match.isDark,
      sourceHex: "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase()
    });

    // Update floating indicator position (relative to canvas wrapper)
    setTapPosition({
      x: (x / canvas.width) * 100,
      y: (y / canvas.height) * 100
    });
  };

  return (
    <div className="analyzer-container animate-fade">
      <div className="analyzer-header">
        <button className="btn-secondary back-btn-floating" onClick={onReset} aria-label="Go back">
          <ArrowLeftIcon /> Back
        </button>
        <span className="analyzer-mode-title">Photo Analyzer</span>
      </div>

      <div className="canvas-container-outer">
        <p className="instruction">Tap anywhere on the image to inspect the color.</p>
        
        <div className="canvas-wrapper" ref={containerRef}>
          <canvas 
            ref={canvasRef} 
            className="analyzer-canvas"
            onClick={handleCanvasClick}
          />
          {tapPosition && (
            <div 
              className="tap-marker"
              style={{ 
                left: `${tapPosition.x}%`, 
                top: `${tapPosition.y}%`,
                borderColor: selectedColor?.isDark ? '#FFF' : '#000'
              }}
            />
          )}
        </div>
      </div>

      {selectedColor && (
        <div className="result-card glass animate-fade">
          <div className="swatch-wrapper">
            <div 
              className="color-swatch" 
              style={{ backgroundColor: selectedColor.sourceHex }}
            />
            <span className="color-label-pill" style={{ 
              background: selectedColor.sourceHex,
              color: selectedColor.isDark ? '#FFF' : '#000',
              border: `1px solid var(--glass-border)`
            }}>
              Sample
            </span>
          </div>
          <div className="color-details">
            <span className="details-category">IDENTIFIED COLOR</span>
            <h2 className="color-name">{selectedColor.name}</h2>
            <div className="color-values">
              <span className="value-chip">HEX: {selectedColor.sourceHex}</span>
              <span className="value-chip">RGB: {selectedColor.r}, {selectedColor.g}, {selectedColor.b}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
