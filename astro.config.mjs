import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import { statSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const versionPath = join(__dirname, 'src/data/version.json');
const versionData = JSON.parse(readFileSync(versionPath, 'utf-8'));
const buildTime = new Date().toISOString();
const dataTime = versionData.timestamp;

export default defineConfig({
  base: '/KLA2026',
  output: 'static',
  build: {
    format: 'file'
  },
  server: {
    host: true
  },
  integrations: [svelte()],
  vite: {
    define: {
      'import.meta.env.APP_VERSION': JSON.stringify(buildTime),
      'import.meta.env.DATA_VERSION': JSON.stringify(dataTime)
    }
  }
});
