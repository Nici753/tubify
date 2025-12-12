import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
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
  },
});
