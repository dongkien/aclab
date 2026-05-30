// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// Deploy lên GitHub Pages với tên miền tuỳ chỉnh https://aclab.plus/
export default defineConfig({
  site: 'https://aclab.plus',
  base: '/',
  integrations: [sitemap()],
});
