// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

const { PUBLIC_SITE_URL } = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), 'PUBLIC_');

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
  // Canonical URLs, Open Graph URLs, robots.txt's sitemap line, and the sitemap itself switch on once
  // PUBLIC_SITE_URL is set in .env (the public domain is not decided yet).
  site: PUBLIC_SITE_URL || undefined,
  integrations: [sitemap()],
  // Headline face self-hosted at build time; the brand's Futura has no web license yet.
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
  ],
  vite: { plugins: [reloadOnAstroStyleChange] },
});
