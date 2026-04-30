import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** Frozen when Vite loads config (each `vite build` or dev-server start gets a new id). */
const APP_BUILD_ID = new Date().toISOString()

export default defineConfig({
  define: {
    __APP_BUILD_ID__: JSON.stringify(APP_BUILD_ID),
  },
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
