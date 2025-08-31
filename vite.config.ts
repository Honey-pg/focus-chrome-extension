import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        popup: 'src/popup.html',
      },
      output: {
        entryFileNames: 'popup.js'
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  }
})