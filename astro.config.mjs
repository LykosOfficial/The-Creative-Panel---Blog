// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';
import contentRefresh from './src/integrations/contentRefresh.mjs';
import remarkDemoteH1 from './src/lib/remarkDemoteH1.mjs';


// https://astro.build/config
export default defineConfig({
  // Fixed dev port so `pnpm dev` (all apps at once) never shuffles ports.
  // blog 4321 · author 4322 · admin 4323 · api 8787
  server: { port: 4321 },

  site: 'https://joelgreen.studio', // used for RSS links, sitemap, canonical + OG URLs

  // Start loading a page when a reader hovers or taps its link, so navigation feels instant
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },

  // SEO: '# Heading 1' in a post becomes h2 (the post title is the page's only h1)
  markdown: { remarkPlugins: [remarkDemoteH1] },

  integrations: [mdx(), sitemap({
    // Legal pages are noindex (see LegalPage.astro), so they stay out of the sitemap too
    filter: (page) => !/^\/(privacy|terms|cookies|disclaimer)\/?$/.test(new URL(page).pathname),
  }), react(), contentRefresh()],

  // Astro Fonts API: downloads these from Fontsource at build time and
  // self-hosts them. Each one becomes a CSS variable used in global.css.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Barlow Condensed", // display: logo, hero titles, section labels
      cssVariable: "--font-barlow-condensed",
      weights: [400, 500, 600, 700],
      fallbacks: ["sans-serif"],
      subsets: ["latin"], // English only: skips cyrillic/greek/vietnamese files
      styles: ["normal"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Barlow", // headings + nav
      cssVariable: "--font-barlow",
      weights: [400, 500, 600],
      fallbacks: ["sans-serif"],
      subsets: ["latin"],
      styles: ["normal"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Inter", // body text
      cssVariable: "--font-inter",
      weights: [400, 500, 600, 700],
      fallbacks: ["sans-serif"],
      subsets: ["latin"],
      styles: ["normal", "italic"], // italics for <em> in posts
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});