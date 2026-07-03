import { useState, useEffect } from 'react'
import ImageCapture from './components/ImageCapture'
import ColorAnalyzer from './components/ColorAnalyzer'
import LiveCamera from './components/LiveCamera'

// Custom Modern SVG Icons
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
);

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
);

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
);

const PaletteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.03442 19.1758 5.16142 19.3957 5.23126 19.6384C5.35122 20.0553 5.30403 20.5056 5.10188 20.8872L5.03362 21.0022C4.54228 21.7588 4.85764 22 5.50005 22H12Z"/><circle cx="7.5" cy="10.5" r="1.5" fill="currentColor"/><circle cx="11.5" cy="7.5" r="1.5" fill="currentColor"/><circle cx="16.5" cy="9.5" r="1.5" fill="currentColor"/><circle cx="15.5" cy="14.5" r="1.5" fill="currentColor"/></svg>
);

function App() {
  const [appMode, setAppMode] = useState('home') // 'home', 'image', 'live'
  const [imageSrc, setImageSrc] = useState(null)
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <>
      <div className="bg-container">
        <div className="glow-blob blob-1"></div>
        <div className="glow-blob blob-2"></div>
        <div className="glow-blob blob-3"></div>
      </div>
      
      <div className="app-container">
        <header className="header">
          <div className="logo-group">
            <span className="logo-icon"><PaletteIcon /></span>
            <h1>ChromaLens</h1>
          </div>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
        </header>

        <main style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          {appMode === 'home' && (
            <div className="dashboard-container animate-fade">
              <section className="hero-section">
                <h2>Understand the world in color.</h2>
                <p>An elegant, high-contrast utility designed to help color-blind individuals identify and analyze colors in real-time or from snapshots.</p>
              </section>

              <div className="modes-grid">
                {/* Live Scanner Card */}
                <div className="mode-card glass">
                  <div className="card-badge">RECOMMENDED</div>
                  <div className="card-icon"><CameraIcon /></div>
                  <h3>Live Scanner</h3>
                  <p>Point your camera at any object to identify its color instantly with continuous tracking.</p>
                  <button 
                    className="btn-primary" 
                    onClick={() => setAppMode('live')}
                  >
                    Launch Live Camera
                  </button>
                </div>

                {/* Photo Analyzer Card */}
                <div className="mode-card glass">
                  <div className="card-badge" style={{ background: 'var(--text-secondary)', color: 'var(--bg-primary)' }}>SNAPSHOT</div>
                  <div className="card-icon"><ImageIcon /></div>
                  <h3>Photo Analyzer</h3>
                  <p>Upload a photo or snap a picture to inspect individual pixels with precision targeting.</p>
                  <ImageCapture onImageCaptured={(src) => {
                    setImageSrc(src)
                    setAppMode('image')
                  }} />
                </div>
              </div>
            </div>
          )}
          
          {appMode === 'image' && imageSrc && (
            <ColorAnalyzer 
              imageSrc={imageSrc} 
              onReset={() => {
                setImageSrc(null)
                setAppMode('home')
              }} 
            />
          )}

          {appMode === 'live' && (
            <LiveCamera onReset={() => setAppMode('home')} />
          )}
        </main>
      </div>
    </>
  )
}

export default App
