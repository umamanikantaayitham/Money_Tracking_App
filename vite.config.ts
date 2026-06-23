import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'zustand', 'lucide-react', 'react-hook-form'],
          charts: ['chart.js', 'react-chartjs-2'],
          supabase: ['@supabase/supabase-js']
        }
      }
    }
  },
});
