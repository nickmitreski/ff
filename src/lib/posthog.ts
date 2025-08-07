import posthog from 'posthog-js';

// Initialize PostHog with environment variables
const getPostHogConfig = (): { key: string; host: string } => {
  try {
    return {
      key: import.meta.env.VITE_PUBLIC_POSTHOG_KEY || '',
      host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'
    };
  } catch {
    return {
      key: '',
      host: 'https://us.i.posthog.com'
    };
  }
};

let posthogInstance = posthog;

// Only initialize if we have a valid PostHog key (not placeholder)
const posthogConfig = getPostHogConfig();
const isValidPostHogKey = posthogConfig.key && 
  posthogConfig.key !== 'your-posthog-key-here' && 
  posthogConfig.key !== 'disabled' && 
  posthogConfig.key.length > 10;

if (isValidPostHogKey) {
  posthog.init(posthogConfig.key, {
    api_host: posthogConfig.host,
    capture_pageview: true, // Automatically capture pageviews
    capture_pageleave: true, // Capture when users leave the page
    autocapture: true, // Automatically capture clicks, form submissions etc.
    persistence: 'localStorage',
    disable_session_recording: false,
    loaded: (posthog) => {
      // Add any additional configuration after PostHog is loaded
      if (import.meta.env.DEV) {
        // Enable debug mode in development
        posthog.debug();
      }
    },
  });
  console.log('PostHog initialized successfully');
} else {
  // Create a mock implementation for when PostHog is not available
  const mockPosthog = {
    capture: (eventName: string, properties?: Record<string, unknown>) => {
      console.log(`[PostHog Mock] Event: ${eventName}`, properties);
    },
    identify: (id: string, properties?: Record<string, unknown>) => {
      console.log(`[PostHog Mock] Identify: ${id}`, properties);
    },
    reset: () => {
      console.log(`[PostHog Mock] Reset user`);
    },
    opt_in_capturing: () => {
      console.log(`[PostHog Mock] Opt in capturing`);
    },
    opt_out_capturing: () => {
      console.log(`[PostHog Mock] Opt out capturing`);
    },
    debug: () => {
      console.log(`[PostHog Mock] Debug mode enabled`);
    },
  };
  posthogInstance = mockPosthog as typeof posthog;
  console.warn('PostHog not initialized: Missing or invalid configuration');
}

// Utility functions for manual tracking
export const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
  posthogInstance.capture(eventName, properties);
};

export const identifyUser = (id: string, properties?: Record<string, unknown>) => {
  posthogInstance.identify(id, properties);
};

export const resetUser = () => {
  posthogInstance.reset();
};

// Export the posthog instance for direct use
export { posthogInstance as posthog };