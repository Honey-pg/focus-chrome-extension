import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      // HTML at project root to emit popup.html at dist root
      input: {
        popup: 'popup.html',
        background: 'src/background.ts',
        content: 'src/content.ts'
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name][extname]'
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  }
})