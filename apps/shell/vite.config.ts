/// <reference types="vitest" />

export default async () => {
  // Load everything dynamically so Nx won't try to require ESM modules
  const { defineConfig } = await import('vite');
  const vue = (await import('@vitejs/plugin-vue')).default;
  const { nxViteTsPaths } = await import('@nx/vite/plugins/nx-tsconfig-paths.plugin');
  const { nxCopyAssetsPlugin } = await import('@nx/vite/plugins/nx-copy-assets.plugin');

  return defineConfig({
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/shell',

    server: {
      port: 4200,
      host: 'localhost',
    },

    preview: {
      port: 4300,
      host: 'localhost',
    },

    plugins: [vue(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],

    // Uncomment this if you are using workers and need TS paths there as well
    // worker: {
    //   plugins: [nxViteTsPaths()],
    // },

    build: {
      outDir: '../../dist/apps/shell',
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },

    test: {
      name: 'shell',
      watch: false,
      globals: true,
      environment: 'jsdom',
      include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      reporters: ['default'],
      coverage: {
        reportsDirectory: '../../coverage/apps/shell',
        provider: 'v8' as const,
      },
    },
  });
};
