/// <reference types="vitest" />

export default async () => {
  // Load ESM modules dynamically so Nx won't try to require them
  const { defineConfig } = await import('vite');
  const vue = (await import('@vitejs/plugin-vue')).default;
  const dts = (await import('vite-plugin-dts')).default;
  const path = await import('path');
  const { nxViteTsPaths } = await import('@nx/vite/plugins/nx-tsconfig-paths.plugin');
  const { nxCopyAssetsPlugin } = await import('@nx/vite/plugins/nx-copy-assets.plugin');

  return defineConfig({
    root: __dirname,
    cacheDir: '../../../node_modules/.vite/libs/list/components',

    plugins: [
      vue(),
      nxViteTsPaths(),
      nxCopyAssetsPlugin(['*.md']),
      dts({
        entryRoot: 'src',
        tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
        pathsToAliases: false,
      }),
    ],

    // Configuration for building your library in Vite library mode
    build: {
      outDir: '../../../dist/libs/list/components',
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      lib: {
        entry: 'src/public-api/index.ts',
        name: 'components',
        fileName: 'index',
        formats: ['es'],
      },
      rollupOptions: {
        // Add external packages here if you don't want them bundled
        external: [],
      },
    },

    test: {
      name: 'components',
      watch: false,
      globals: true,
      environment: 'jsdom',
      include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      reporters: ['default'],
      coverage: {
        reportsDirectory: '../../../coverage/libs/list/components',
        provider: 'v8' as const,
      },
    },
  });
};
