// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// PUBLIC_ORIGIN (e.g. https://beed.al) is the address buyers use when the server sits behind a proxy:
// canonical URLs, payment return/webhook URLs and Secure cookies follow it. Unset in local dev.
const site = /^https?:\/\/[^/]+\/?$/.test(process.env.PUBLIC_ORIGIN ?? '') ? process.env.PUBLIC_ORIGIN : undefined;

export default defineConfig({
  site,
  output: 'server',
  // Adapter v14 wires the bindings itself through @cloudflare/vite-plugin, which reads
  // wrangler.jsonc: `astro dev` gets the same DB binding as the Worker, backed by the local D1 file
  // under .wrangler/state.
  // imageService 'passthrough': the site draws its own SVG and serves its own files, so nothing goes
  // through astro:assets and the Cloudflare Images binding would be provisioned for nothing.
  adapter: cloudflare({ imageService: 'passthrough' }),
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
