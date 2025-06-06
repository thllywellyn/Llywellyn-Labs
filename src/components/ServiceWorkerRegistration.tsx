'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      // Use dynamic import for the workbox-window package
      import('workbox-window').then(({ Workbox }) => {
        const wb = new Workbox('/sw.js');

        wb.addEventListener('installed', (event) => {
          if (event.isUpdate) {
            console.log('Service worker update available');
            // Optionally show update notification to user
            if (confirm('New version available! Click OK to update.')) {
              window.location.reload();
            }
          } else {
            console.log('Service Worker installed for the first time');
          }
        });

        wb.addEventListener('activated', (event) => {
          if (event.isUpdate) {
            console.log('Service worker updated');
          }
        });

        wb.addEventListener('controlling', () => {
          console.log('Service worker now controlling the page');
        });

        // Register the service worker after adding event listeners
        wb.register().catch((err) => {
          console.error('Service worker registration failed:', err);
        });
      });
    }
  }, []);

  return null;
}
