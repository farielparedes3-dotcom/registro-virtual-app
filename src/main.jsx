import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ErrorBoundary } from './ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

// Register PWA Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('⚡ Service Worker registered:', registration);
        registration.update();
        
        // Listen for new service worker installation
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('✨ New version found! Reloading for fresh update.');
                  window.dispatchEvent(new CustomEvent('sw-update-available', { detail: registration }));
                }
              }
            };
          }
        };
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });
}
