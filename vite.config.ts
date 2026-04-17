import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        'index-cc': path.resolve(__dirname, 'index-cc.html'),
      },
    },
  },
  server: {
    port: 5175,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@harmony-data': path.resolve(__dirname, './harmony-data'),
      '@deltek/harmony-components/styles': path.resolve(__dirname, './harmony-styles'),
    },
  },
})
