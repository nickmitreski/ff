// Simple environment variable wrapper
// This ensures environment variables are only accessed when functions are called

export const getEnvVar = (key: string): string => {
  try {
    return (import.meta.env as any)[key] || '';
  } catch {
    return '';
  }
};

export const isDev = (): boolean => {
  try {
    return Boolean((import.meta.env as any).DEV);
  } catch {
    return false;
  }
};

export const isProd = (): boolean => {
  try {
    return Boolean((import.meta.env as any).PROD);
  } catch {
    return false;
  }
};

export const getEnvironment = (): 'development' | 'production' => {
  return isDev() ? 'development' : 'production';
}; 