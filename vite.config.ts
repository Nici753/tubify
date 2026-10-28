import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  // GitHub Pages serves the project site under /tubify/. Checking `mode` (not
  // `command`) gives `vite preview` the same base as `vite build`.
  base: mode === 'production' ? '/tubify/' : '/',
  plugins: [react()],
  server: {
    //host: '::1', //could IPv6 for spotify auth callback
    host: '127.0.0.1', //using fixed IPv4 for spotify auth callback
    port: 5173,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom'],
  },
}));
