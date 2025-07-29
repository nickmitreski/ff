import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/skeuomorphic-ios.css';
import { PostHogProvider } from 'posthog-js/react';
import { posthog } from './lib/posthog';
import { analytics } from './lib/analytics-new';

// Register service worker for caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('SW registered: ', registration);
        }
      })
      .catch((registrationError) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('SW registration failed: ', registrationError);
        }
      });
  });
}

// Global error handler to reduce console errors
window.addEventListener('error', (event) => {
  // Only log critical errors in development
  if (process.env.NODE_ENV === 'development' && event.error) {
    console.error('Global error:', event.error);
  }
  // Prevent default error logging in production
  if (process.env.NODE_ENV === 'production') {
    event.preventDefault();
  }
});

window.addEventListener('unhandledrejection', (event) => {
  // Only log critical rejections in development
  if (process.env.NODE_ENV === 'development' && event.reason) {
    console.error('Unhandled promise rejection:', event.reason);
  }
  // Prevent default error logging in production
  if (process.env.NODE_ENV === 'production') {
    event.preventDefault();
  }
});

// Suppress non-critical console messages in production
if (process.env.NODE_ENV === 'production') {
  const originalConsoleLog = console.log;
  const originalConsoleInfo = console.info;
  const originalConsoleDebug = console.debug;
  
  console.log = () => {};
  console.info = () => {};
  console.debug = () => {};
  
  // Keep error and warn for critical issues
  console.error = originalConsoleLog;
  console.warn = originalConsoleLog;
}

// Using simplified analytics without DOM event listeners

// Remove loading state once app is ready
const removeLoadingState = () => {
  const loadingElement = document.querySelector('.loading');
  if (loadingElement) {
    loadingElement.remove();
  }
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider client={posthog}>
      <App />
    </PostHogProvider>
  </StrictMode>
);

// Remove loading state after a short delay to ensure smooth transition
setTimeout(removeLoadingState, 100);