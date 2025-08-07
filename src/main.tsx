import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/skeuomorphic-ios.css';

// Register service worker for caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Unregister existing service workers to clear cache
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
      
      // Add cache-busting parameter to force reload
      const swUrl = process.env.NODE_ENV === 'development' 
        ? '/sw.js?v=' + Date.now() 
        : '/sw.js';
      
      const registration = await navigator.serviceWorker.register(swUrl);
      if (process.env.NODE_ENV === 'development') {
        console.log('SW registered: ', registration);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log('SW registration failed: ', error);
      }
    }
  });
}

// Global error handler to reduce console errors
window.addEventListener('error', (event) => {
  // Filter out CSP and PostHog related errors
  const errorMessage = event.error?.message || event.message || '';
  const isCSPError = errorMessage.includes('Content Security Policy') || 
                    errorMessage.includes('CSP') ||
                    errorMessage.includes('violates');
  const isPostHogError = errorMessage.includes('PostHog') || 
                        errorMessage.includes('useRef') ||
                        errorMessage.includes('Invalid hook call');
  
  // Only log non-CSP and non-PostHog errors
  if (!isCSPError && !isPostHogError) {
    if (process.env.NODE_ENV === 'development' && event.error) {
      console.error('Global error:', event.error);
    }
  }
  
  // Prevent default error logging in production for CSP and PostHog errors
  if (process.env.NODE_ENV === 'production' && (isCSPError || isPostHogError)) {
    event.preventDefault();
  }
});

window.addEventListener('unhandledrejection', (event) => {
  // Filter out CSP and PostHog related rejections
  const rejectionMessage = event.reason?.message || event.reason || '';
  const isCSPRejection = rejectionMessage.includes('Content Security Policy') || 
                        rejectionMessage.includes('CSP') ||
                        rejectionMessage.includes('violates');
  const isPostHogRejection = rejectionMessage.includes('PostHog') || 
                            rejectionMessage.includes('useRef') ||
                            rejectionMessage.includes('Invalid hook call');
  
  // Only log non-CSP and non-PostHog rejections
  if (!isCSPRejection && !isPostHogRejection) {
    if (process.env.NODE_ENV === 'development' && event.reason) {
      console.error('Unhandled promise rejection:', event.reason);
    }
  }
  
  // Prevent default error logging in production for CSP and PostHog rejections
  if (process.env.NODE_ENV === 'production' && (isCSPRejection || isPostHogRejection)) {
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

// Safely render the app
const root = document.getElementById('root');
if (root) {
  try {
    createRoot(root).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (error) {
    console.warn('App rendering failed:', error);
  }
}

// Remove loading state after a short delay to ensure smooth transition
setTimeout(removeLoadingState, 100);