// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Dev-only workaround (Astro 7.3 + Vite 8): when a .astro edit changes markup and styles in the same
// save, Vite pushes the component's CSS module to the browser before Astro has recompiled the file,
// so the page reloads with the previous CSS until the next save. Reloading the page instead of
// hot-swapping .astro styles always serves the freshly compiled CSS.
const reloadOnAstroStyleChange = {
  name: 'qash:reload-on-astro-style-change',
  hotUpdate({ file, modules }) {
    if (this.environment.name !== 'client' || !file.endsWith('.astro')) return;
    if (!modules.some((m) => m.id?.includes('astro&type=style'))) return;
    this.environment.hot.send({ type: 'full-reload', path: '*' });
    return [];
  },
};

// https://astro.build/config
export default defineConfig({
  // Public address of the site: canonical and Open Graph URLs, robots.txt's sitemap line, and the sitemap.
  site: 'https://home.withqash.com',
  // Pages build as `harga.html` rather than `harga/index.html`, so Cloudflare Pages serves `/harga` without a
  // redirect and the canonical URL matches the served one.
  build: { format: 'file' },
  integrations: [sitemap()],
  // Both faces self-hosted at build time. Jost stands in for the brand's Futura (no web license yet) and Hanken
  // Grotesk for Maison Neue (commercial, no web license); both are SIL OFL from Google Fonts.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Jost',
      cssVariable: '--font-jost',
      weights: [500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Futura', 'Century Gothic', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Hanken Grotesk',
      cssVariable: '--font-hanken',
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Helvetica Neue', 'Arial', 'sans-serif'],
    },
  ],
  vite: { plugins: [reloadOnAstroStyleChange] },
});
