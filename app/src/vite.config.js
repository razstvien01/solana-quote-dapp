import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import nodePolyfills from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills()
  ],
  resolve: {
    alias: [{
      find: "src", replacement: resolve(__dirname, "src")
    }]
  },
  build: {
    minify: 'esbuild',
    target: "esnext"
  },
  define: {
    'process.env': {}
  }
});
