import { defineConfig } from 'tsup';
import * as dotenv from 'dotenv';

dotenv.config();

const apiUrl = process.env.VYZORA_API_URL || 'http://localhost:3001/api/ingest';

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
    define: {
        __VYZORA_API_URL__: JSON.stringify(apiUrl),
    },
    banner: {
        js: '/* @vyzora/sdk - lightweight analytics - MIT license */',
    },
});
