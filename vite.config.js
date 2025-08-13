import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    allowedHosts: ['dev-demo.leelabot.net', 'demo.leelabot.net'],
  },
  // Add this for SPA fallback in development
  preview: {
    port: 4173
  },
  // Ensure proper base path for SPA
  base: './'
})
