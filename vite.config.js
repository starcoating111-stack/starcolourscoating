import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/starcolourscoating',
  server: {
    host: true,      // allows local network testing, remove if unnecessary
    port: 5173,      // fixed port for consistency
  },
  build: {
    outDir: 'dist',  // production build folder
    sourcemap: false // disable source maps in prod
  }
})
