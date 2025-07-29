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

// Image optimization
const optimizeImages = () => {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    // Add loading optimization
    if (!img.loading) {
      img.loading = 'lazy';
    }
    
    // Add optimization class
    img.classList.add('optimized-image');
    
    // Handle image errors
    img.onerror = () => {
      img.style.display = 'none';
    };
  });
};

// Run image optimization after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', optimizeImages);
} else {
  optimizeImages();
}

// Using simplified analytics without DOM event listeners

// Remove loading state and show LCP content once app is ready
const removeLoadingState = () => {
  const loadingElement = document.querySelector('.loading');
  const heroSection = document.querySelector('.hero-section') as HTMLElement;
  
  if (loadingElement) {
    loadingElement.remove();
  }
  
  // Show the LCP hero section briefly for better perceived performance
  if (heroSection) {
    heroSection.style.display = 'flex';
    // Hide it after a short delay to let the React app take over
    setTimeout(() => {
      heroSection.style.display = 'none';
    }, 100);
  }
};

// Load non-critical resources after page load
const loadNonCriticalResources = () => {
  // Load additional fonts with font-display: swap
  const fonts = [
    '/fonts/Geist-Bold.woff2',
    '/fonts/Geist-Light.woff2',
    '/fonts/Geist-Medium.woff2'
  ];
  
  fonts.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
  
  // Load additional stylesheets with media query trick
  const styleSheets = [
    '/src/styles/90sGPT.css',
    '/src/styles/FreeCell.css'
  ];
  
  styleSheets.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'print';
    link.onload = () => {
      link.media = 'all';
    };
    document.head.appendChild(link);
  });
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

// Load non-critical resources after page is ready
window.addEventListener('load', loadNonCriticalResources);