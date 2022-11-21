import path from 'node:path';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import progress from 'vite-plugin-progress';
import react from '@vitejs/plugin-react';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  build: {
    outDir: 'build',
    emptyOutDir: true,
    sourcemap: false,
    chunkSizeWarningLimit: 20,
    minify: true,
    manifest: true,
    cssCodeSplit: true,
    target: 'esnext',
    rollupOptions: {
      input: path.resolve(__dirname, './src/App.tsx'),
    },
  },
  server: {
    hmr: true,
    port: 3001,
    https: true,
    open: true,
    host: true,
  },
  plugins: [react(), mkcert(), progress(), topLevelAwait()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      { find: '@@', replacement: path.resolve(__dirname, '.') },
    ],
  },
});
