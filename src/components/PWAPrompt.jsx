import React, { useState, useEffect } from 'react';

// Custom Close Icon
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
);

export default function PWAPrompt() {
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone mode (installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || window.navigator.standalone;

    if (isStandalone) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(ios);

    // If iOS and not standalone, show prompt after a short delay
    if (ios && !isStandalone) {
      const dismissed = sessionStorage.getItem('pwa-prompt-dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => setShowPrompt(true), 3000);
        return () => clearTimeout(timer);
      }
    }

    // Capture the beforeinstallprompt event for Android/Chrome
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPromptEvent(e);
      
      const dismissed = sessionStorage.getItem('pwa-prompt-dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPromptEvent) return;

    installPromptEvent.prompt();
    const { outcome } = await installPromptEvent.userChoice;
    console.log(`User response to install prompt: ${outcome}`);

    setInstallPromptEvent(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="pwa-prompt-banner glass animate-fade">
      <div className="pwa-prompt-content">
        <div className="pwa-icon-swatch">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.03442 19.1758 5.16142 19.3957 5.23126 19.6384C5.35122 20.0553 5.30403 20.5056 5.10188 20.8872L5.03362 21.0022C4.54228 21.7588 4.85764 22 5.50005 22H12Z"/><circle cx="7.5" cy="10.5" r="1.5" fill="currentColor"/><circle cx="11.5" cy="7.5" r="1.5" fill="currentColor"/><circle cx="16.5" cy="9.5" r="1.5" fill="currentColor"/><circle cx="15.5" cy="14.5" r="1.5" fill="currentColor"/></svg>
        </div>
        <div className="pwa-text-group">
          <h4>Install ChromaLens</h4>
          <p>Identify colors offline. Add to your home screen.</p>
        </div>
        <button className="pwa-close-btn" onClick={handleDismiss} aria-label="Dismiss">
          <CloseIcon />
        </button>
      </div>

      <div className="pwa-prompt-actions">
        {isIOS ? (
          <div className="ios-install-instructions">
            Tap the share icon <span className="ios-icon-share">📤</span> below and select <strong>"Add to Home Screen"</strong> <span className="ios-icon-add">＋</span>
          </div>
        ) : (
          <>
            <button className="btn-secondary btn-sm" onClick={handleDismiss}>Later</button>
            <button className="btn-primary btn-sm" onClick={handleInstallClick}>Install Now</button>
          </>
        )}
      </div>
    </div>
  );
}
