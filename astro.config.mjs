// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  server: { port: 3810, host: '127.0.0.1' },
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'auto' },
  devToolbar: { enabled: false },
  security: { checkOrigin: true },
  vite: {
    server: { watch: { ignored: ['**/research/**', '**/data/**', '**/tools/**', '**/.probes/**'] } },
  },
});
