/// <reference types="vitest" />

export default async () => {
  // Load modules dynamically to avoid Nx trying to `require()` ESM modules
  const { defineConfig } = await import('vite');
  const vue = (await import('@vitejs/plugin-vue')).default;
  const { nxViteTsPaths } = await import('@nx/vite/plugins/nx-tsconfig-paths.plugin');
  const { nxCopyAssetsPlugin } = await import('@nx/vite/plugins/nx-copy-assets.plugin');

  return defineConfig({
    // Root directory of this app
    root: __dirname,

    // Where Vite should cache its build data
    cacheDir: '../../node_modules/.vite/apps/ip-lookup',

    // Dev server configuration
    server: {
      port: 4500,
      host: 'localhost',
    },

    // Preview configuration (for `vite preview`)
    preview: {
      port: 4600,
      host: 'localhost',
    },

    // Plugins used by this app
    plugins: [vue(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],

    // Uncomment this if you plan to use Web Workers and need path resolution
    // worker: {
    //   plugins: [nxViteTsPaths()],
    // },

    // Build configuration
    build: {
      outDir: '../../dist/apps/ip-lookup',
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },

    // Vitest configuration for this app
    test: {
      name: 'ip-lookup',
      watch: false,
      globals: true,
      environment: 'jsdom',
      include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      reporters: ['default'],
      coverage: {
        reportsDirectory: '../../coverage/apps/ip-lookup',
        provider: 'v8' as const,
      },
    },
  });
};
