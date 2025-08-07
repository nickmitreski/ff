import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://us.i.posthog.com https://us-assets.i.posthog.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: https://cur.cursors-4u.net; font-src 'self' data: https://fonts.gstatic.com; media-src 'self' https://file.garden; connect-src 'self' https://us.i.posthog.com https://us-assets.i.posthog.com https://file.garden https://cur.cursors-4u.net https://fonts.googleapis.com https://fonts.gstatic.com ws://localhost:* wss://localhost:* http://localhost:* https://localhost:*; frame-src 'self' https://file.garden; object-src 'none'; base-uri 'self';",
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
    include: ['react', 'react-dom'],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
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
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion', 'lucide-react'],
          utils: ['clsx', 'class-variance-authority', 'tailwind-merge'],
          webamp: ['webamp', 'winamp2-js'],
          supabase: ['@supabase/supabase-js'],
          analytics: ['posthog-js'],
        },
        inlineDynamicImports: false,
      },
    },
    sourcemap: true, // Enable source maps for debugging
    target: 'es2015', // Target modern browsers
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
