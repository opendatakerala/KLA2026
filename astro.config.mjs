import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

export default defineConfig({
  base: '/KLA2026',
  output: 'static',
  build: {
    format: 'file'
  },
  server: {
    host: true
  },
  integrations: [svelte()]
});
