import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    // THE FIX: Add this 'alias' object.
    // This tells Vite how to handle path aliases.
    alias: {
      // The '@' alias will now resolve to the './src' directory.
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})