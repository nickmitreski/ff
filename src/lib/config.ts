// Global configuration object
// This loads environment variables at runtime to avoid build-time issues

interface Config {
  // Supabase
  supabase: {
    url: string;
    anonKey: string;
  };
  
  // OpenAI
  openai: {
    apiKey: string;
    apiKeyAlt: string;
  };
  
  // Mistral
  mistral: {
    apiKey: string;
  };
  
  // Google APIs
  google: {
    mapsApiKey: string;
    youtubeApiKey: string;
  };
  
  // PostHog
  posthog: {
    key: string;
    host: string;
    keyAlt: string;
  };
  
  // Environment
  env: {
    isDev: boolean;
    isProd: boolean;
    debugApis: boolean;
  };
}

// Create the config object
const createConfig = (): Config => {
  // Helper function to safely get environment variables
  const getEnv = (key: string): string => {
    try {
      return (import.meta.env as any)[key] || '';
    } catch {
      return '';
    }
  };

  const getEnvBool = (key: string): boolean => {
    try {
      return Boolean((import.meta.env as any)[key]);
    } catch {
      return false;
    }
  };

  return {
    supabase: {
      url: getEnv('VITE_SUPABASE_URL'),
      anonKey: getEnv('VITE_SUPABASE_ANON_KEY'),
    },
    openai: {
      apiKey: getEnv('VITE_OPENAI_API_KEY'),
      apiKeyAlt: getEnv('OPENAI_API_KEY'),
    },
    mistral: {
      apiKey: getEnv('VITE_MISTRAL_API_KEY'),
    },
    google: {
      mapsApiKey: getEnv('VITE_GOOGLE_MAPS_API_KEY'),
      youtubeApiKey: getEnv('VITE_YOUTUBE_API_KEY'),
    },
    posthog: {
      key: getEnv('VITE_PUBLIC_POSTHOG_KEY'),
      host: getEnv('VITE_PUBLIC_POSTHOG_HOST') || 'https://us.i.posthog.com',
      keyAlt: getEnv('VITE_POSTHOG_KEY'),
    },
    env: {
      isDev: getEnvBool('DEV'),
      isProd: getEnvBool('PROD'),
      debugApis: getEnv('VITE_DEBUG_APIS') === 'true',
    },
  };
};

// Export the config instance
export const config = createConfig();

// Export helper functions
export const getEnvironment = (): 'development' | 'production' => {
  return config.env.isDev ? 'development' : 'production';
};

export const hasValidKey = (key: string): boolean => {
  const value = (config as any)[key];
  return value && value.length > 0 && !value.includes('your-') && !value.includes('placeholder');
}; 