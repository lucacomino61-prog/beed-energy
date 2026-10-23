// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// PUBLIC_ORIGIN (e.g. https://beed.al) is the address buyers use when the server sits behind a proxy:
// canonical URLs, payment return/webhook URLs and Secure cookies follow it. Unset in local dev.
const site = /^https?:\/\/[^/]+\/?$/.test(process.env.PUBLIC_ORIGIN ?? '') ? process.env.PUBLIC_ORIGIN : undefined;

export default defineConfig({
  site,
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  server: { port: 3810, host: '127.0.0.1' },
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'auto' },
  devToolbar: { enabled: false },
  security: { checkOrigin: true },
  vite: {
    // Never inline a bundled <script> into the page: the CSP allows script files ('self') and one hashed snippet.
    build: { assetsInlineLimit: 0 },
    server: { watch: { ignored: ['**/research/**', '**/data/**', '**/tools/**', '**/.probes/**'] } },
  },
});
