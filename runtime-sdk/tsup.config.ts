import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    minify: true,          // Keep bundle < 10kb
    splitting: false,
    treeshake: true,
    outDir: 'dist',
    target: 'es2017',      // Broad browser support
    globalName: 'Vyzora',  // Browser global for script tag usage
    platform: 'browser',
    banner: {
        js: '/* @vyzora/sdk - lightweight analytics - MIT license */',
    },
});
