import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig(({ mode }) => {
  // Non REACT_APP_ settings that CRA used to read from the environment.
  const env = loadEnv(mode, process.cwd(), ['HTTPS', 'GENERATE_SOURCEMAP']);

  return {
    // Keep the CRA variable names so .env files and pipeline variables don't
    // change. Read them with import.meta.env.REACT_APP_* (see src/vite-env.d.ts).
    envPrefix: 'REACT_APP_',
    plugins: [react(), env.HTTPS === 'true' && basicSsl()],
    css: {
      postcss: {
        plugins: [tailwindcss(), autoprefixer()],
      },
    },
    server: {
      port: 3003,
      open: true,
    },
    preview: {
      port: 3003,
    },
    build: {
      outDir: 'build',
      assetsDir: 'static',
      // CRA inlined images under 10KB as data: URLs (Vite's default is 4KB).
      // Shared components check icon.startsWith('data:image/') and otherwise
      // treat the icon as a heroicon name, so keep CRA's limit.
      assetsInlineLimit: 10000,
      sourcemap: env.GENERATE_SOURCEMAP !== 'false',
      target: ['es2020', 'chrome87', 'edge88', 'firefox78', 'safari14'],
    },
    test: {
      globals: true,
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
    },
  };
});
