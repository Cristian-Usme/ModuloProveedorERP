import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Optimize bundle with proper chunking
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-bundle': ['react', 'react-dom', 'react-router-dom'],
          'api-bundle': ['axios', '@tanstack/react-query'],
          'ui-bundle': ['lucide-react', 'react-hot-toast', 'recharts'],
          'form-bundle': ['react-hook-form'],
        },
      },
    },
    // Reduce chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Source maps only for debugging
    sourcemap: false,
    // Minify for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      '@tanstack/react-query',
      'lucide-react',
      'react-hot-toast',
      'react-hook-form',
    ],
  },
})
