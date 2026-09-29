import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        businessPlan: resolve(import.meta.dirname, 'business-plan.html'),
        contentIdeas: resolve(import.meta.dirname, 'idees-contenu-lc.html'),
      },
    },
  },
})
