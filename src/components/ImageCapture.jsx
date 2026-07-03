import React, { useRef } from 'react';

// Custom clean icons
const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
);

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
);

export default function ImageCapture({ onImageCaptured }) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageCaptured(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="capture-actions-stack">
      <button 
        className="btn-primary" 
        onClick={() => cameraInputRef.current.click()}
        style={{ width: '100%', justifyContent: 'center' }}
      >
        <CameraIcon /> Take Photo
      </button>
      
      <button 
        className="btn-secondary" 
        onClick={() => fileInputRef.current.click()}
        style={{ width: '100%', justifyContent: 'center' }}
      >
        <ImageIcon /> Choose Gallery
      </button>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="file-input-hidden"
        ref={cameraInputRef}
        onChange={handleFileChange}
      />
      <input
        type="file"
        accept="image/*"
        className="file-input-hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
}
