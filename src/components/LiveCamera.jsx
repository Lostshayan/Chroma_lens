import React, { useRef, useEffect, useState } from 'react';
import { getColorInfo } from '../utils/colorName';

// SVG Icons
const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);

const FreezeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
);

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>
);

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
);

export default function LiveCamera({ onReset }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [error, setError] = useState(null);
  const [isFrozen, setIsFrozen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let stream = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access camera. Please check permissions.");
      }
    };

    if (!isFrozen) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isFrozen]);

  const analyzeFrame = () => {
    if (isFrozen) return;

    if (!videoRef.current || !canvasRef.current || videoRef.current.readyState < 2) {
      requestRef.current = requestAnimationFrame(analyzeFrame);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Draw frame to 1x1 canvas for extraction
    canvas.width = 1;
    canvas.height = 1;

    const centerX = video.videoWidth / 2;
    const centerY = video.videoHeight / 2;

    ctx.drawImage(video, centerX, centerY, 1, 1, 0, 0, 1, 1);

    const pixelData = ctx.getImageData(0, 0, 1, 1).data;
    
    if (pixelData[3] > 0) {
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
    }

    requestRef.current = requestAnimationFrame(analyzeFrame);
  };

  const handleVideoPlay = () => {
    requestRef.current = requestAnimationFrame(analyzeFrame);
  };

  const toggleFreeze = () => {
    if (isFrozen) {
      // Resume
      setIsFrozen(false);
      if (videoRef.current) {
        videoRef.current.play();
      }
    } else {
      // Freeze
      setIsFrozen(true);
      if (videoRef.current) {
        videoRef.current.pause();
      }
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    }
  };

  const copyToClipboard = () => {
    if (!selectedColor) return;
    navigator.clipboard.writeText(selectedColor.sourceHex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="analyzer-container live-analyzer animate-fade">
      <div className="analyzer-header">
        <button className="btn-secondary back-btn-floating" onClick={onReset} aria-label="Go back">
          <ArrowLeftIcon /> Back
        </button>
        <span className="analyzer-mode-title">Live Scanner</span>
      </div>

      <div className="live-camera-wrapper-outer">
        {error ? (
          <div className="glass-card error-card">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
          </div>
        ) : (
          <div className={`video-wrapper ${isFrozen ? 'video-frozen' : ''}`}>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              onPlay={handleVideoPlay}
              className="live-video"
            />
            
            {/* Immersive HUD HUD crosshair */}
            <div className="crosshair-hud">
              <div className="hud-circle"></div>
              <div className="hud-dot"></div>
              <div className="hud-line line-t"></div>
              <div className="hud-line line-b"></div>
              <div className="hud-line line-l"></div>
              <div className="hud-line line-r"></div>
            </div>

            {/* Freeze state banner */}
            {isFrozen && (
              <div className="frozen-banner animate-fade">
                <span>PAUSED</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden canvas used for color extraction */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {!error && (
        <div className="live-controls">
          <button 
            className={`btn-primary control-freeze-btn ${isFrozen ? 'frozen-active' : ''}`}
            onClick={toggleFreeze}
          >
            {isFrozen ? <PlayIcon /> : <FreezeIcon />}
            {isFrozen ? 'Resume Scanner' : 'Freeze Scanner'}
          </button>
        </div>
      )}

      {selectedColor && !error && (
        <div className="result-card glass animate-fade live-result-card">
          <div className="swatch-wrapper">
            <div 
              className="color-swatch" 
              style={{ backgroundColor: selectedColor.sourceHex, transition: 'none' }}
            />
            <button 
              className={`copy-btn ${copied ? 'copied' : ''}`} 
              onClick={copyToClipboard}
              aria-label="Copy Hex color code"
              style={{
                background: selectedColor.sourceHex,
                color: selectedColor.isDark ? '#FFF' : '#000',
              }}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
          <div className="color-details">
            <span className="details-category">{isFrozen ? 'FROZEN COLOR' : 'CURRENT COLOR'}</span>
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
