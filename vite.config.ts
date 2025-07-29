import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://us.i.posthog.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://us.i.posthog.com https://file.garden;",
    },
  },
  preview: {
    headers: {
      // Long cache for static assets
      '**/*.js': 'Cache-Control: public, max-age=31536000, immutable',
      '**/*.css': 'Cache-Control: public, max-age=31536000, immutable',
      '**/*.png': 'Cache-Control: public, max-age=2592000, immutable',
      '**/*.jpg': 'Cache-Control: public, max-age=2592000, immutable',
      '**/*.webp': 'Cache-Control: public, max-age=2592000, immutable',
      '**/*.woff2': 'Cache-Control: public, max-age=31536000, immutable',
      '**/*.mp3': 'Cache-Control: public, max-age=31536000, immutable',
      // Short cache for HTML
      '**/*.html': 'Cache-Control: public, max-age=3600',
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: [
      'react', 
      'react-dom',
      'framer-motion',
      'clsx',
      'class-variance-authority',
      'tailwind-merge',
      '@supabase/supabase-js',
      'posthog-js'
    ],
    force: true, // Force re-optimization
  },
  build: {
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    cssCodeSplit: false, // Combine all CSS into a single file
    assetsInlineLimit: 4096, // Inline small assets as base64
    cssMinify: true, // Minify CSS
    target: 'es2015', // Target modern browsers
    sourcemap: true, // Enable source maps for debugging
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: {
        safari10: true,
      },
    },
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: (id: string) => {
          // Core React dependencies
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-core';
          }
          
          // UI and animation libraries
          if (id.includes('node_modules/framer-motion') || 
              id.includes('node_modules/lucide-react') ||
              id.includes('node_modules/@radix-ui')) {
            return 'ui-libs';
          }
          
          // Utility libraries
          if (id.includes('node_modules/clsx') || 
              id.includes('node_modules/class-variance-authority') ||
              id.includes('node_modules/tailwind-merge')) {
            return 'utils';
          }
          
          // Audio and media libraries
          if (id.includes('node_modules/webamp') || 
              id.includes('node_modules/winamp2-js') ||
              id.includes('node_modules/tone')) {
            return 'audio';
          }
          
          // Backend and API
          if (id.includes('node_modules/@supabase')) {
            return 'supabase';
          }
          
          // Analytics
          if (id.includes('node_modules/posthog-js')) {
            return 'analytics';
          }
          
          // Windows 95 specific components
          if (id.includes('Windows95') || id.includes('winamp')) {
            return 'win95';
          }
          
          // iPhone emulator components
          if (id.includes('iPhoneEmu') || id.includes('iphone')) {
            return 'iphone';
          }
          
          // Modern site components
          if (id.includes('modern-site')) {
            return 'modern';
          }
          
          // Admin components
          if (id.includes('admin')) {
            return 'admin';
          }
          
          // Default vendor chunk for other dependencies
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        inlineDynamicImports: false,
      },
    },
  },
  define: {
    // Inject all environment variables as constants at build time
    'import.meta.env.DEV': JSON.stringify(process.env.NODE_ENV === 'development'),
    'import.meta.env.PROD': JSON.stringify(process.env.NODE_ENV === 'production'),
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || ''),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || ''),
    'import.meta.env.VITE_OPENAI_API_KEY': JSON.stringify(process.env.VITE_OPENAI_API_KEY || ''),
    'import.meta.env.OPENAI_API_KEY': JSON.stringify(process.env.OPENAI_API_KEY || ''),
    'import.meta.env.VITE_MISTRAL_API_KEY': JSON.stringify(process.env.VITE_MISTRAL_API_KEY || ''),
    'import.meta.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.VITE_GOOGLE_MAPS_API_KEY || ''),
    'import.meta.env.VITE_YOUTUBE_API_KEY': JSON.stringify(process.env.VITE_YOUTUBE_API_KEY || ''),
    'import.meta.env.VITE_PUBLIC_POSTHOG_KEY': JSON.stringify(process.env.VITE_PUBLIC_POSTHOG_KEY || ''),
    'import.meta.env.VITE_PUBLIC_POSTHOG_HOST': JSON.stringify(process.env.VITE_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'),
    'import.meta.env.VITE_POSTHOG_KEY': JSON.stringify(process.env.VITE_POSTHOG_KEY || ''),
    'import.meta.env.VITE_DEBUG_APIS': JSON.stringify(process.env.VITE_DEBUG_APIS || 'false'),
  },
});
