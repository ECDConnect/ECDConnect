import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import pkg from './package.json' with { type: 'json' };

export default defineConfig(({ mode }) => {
  // Non REACT_APP_ settings that CRA used to read from the environment.
  const env = loadEnv(mode, process.cwd(), ['HTTPS', 'GENERATE_SOURCEMAP']);

  return {
    // Keep the CRA variable names so .env files and pipeline variables don't
    // change. Read them with import.meta.env.REACT_APP_* (see src/vite-env.d.ts).
    envPrefix: 'REACT_APP_',
    resolve: {
      // The @/, @store/... aliases in tsconfig.paths.json.
      tsconfigPaths: true,
      alias: [
        // msw 0.44 imports this subpath, which the hoisted headers-polyfill
        // no longer exports (webpack 4 ignored package exports maps).
        { find: /^headers-polyfill\/lib$/, replacement: 'headers-polyfill' },
        // The default (ES5) Ionic loader builds its lazy imports by string
        // concatenation, which only webpack could follow. The ES2017 build uses
        // a template literal that Vite can expand (see dynamicImportVarsOptions).
        {
          find: /^@ionic\/core\/loader$/,
          replacement: '@ionic/core/loader/index.es2017.js',
        },
      ],
    },
    define: {
      'import.meta.env.REACT_APP_VERSION': JSON.stringify(pkg.version),
    },
    plugins: [
      react(),
      svgr(),
      // The service worker is our own Workbox script (src/service-worker.ts);
      // the plugin compiles it and injects the precache manifest, exactly as
      // CRA's InjectManifest did. Registration stays in serviceWorkerRegistration.ts.
      VitePWA({
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'service-worker.ts',
        injectRegister: false,
        manifest: false,
        injectManifest: {
          // Like CRA, precache the bundle but not the files copied from public/.
          globPatterns: ['index.html', 'static/**/*'],
          globIgnores: ['**/*.map'],
          dontCacheBustURLsMatching: /^static\//,
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        },
      }),
      env.HTTPS === 'true' && basicSsl(),
    ],
    optimizeDeps: {
      // Stencil lazy-loads components relative to its own files
      // (import(`./${name}.entry.js`)), which pre-bundling would break.
      exclude: ['@ionic/core', '@ionic/pwa-elements', 'ionicons'],
    },
    css: {
      postcss: {
        plugins: [tailwindcss(), autoprefixer()],
      },
    },
    server: {
      port: 3000,
      open: true,
    },
    preview: {
      port: 3000,
    },
    build: {
      outDir: 'build',
      // CRA's layout; also keeps hashed output apart from public/assets.
      assetsDir: 'static',
      sourcemap: env.GENERATE_SOURCEMAP !== 'false',
      target: ['es2020', 'chrome87', 'edge88', 'firefox78', 'safari14'],
      dynamicImportVarsOptions: {
        // Ionic 5's Stencil loaders import(`./${bundleId}.entry.js`); let Vite
        // expand those into chunks (webpack did it via webpackInclude). Vite's
        // default skips all of node_modules.
        exclude: [/node_modules\/(?!@ionic\/core\/|ionicons\/)/],
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
    },
  };
});
