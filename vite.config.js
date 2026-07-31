import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // <-- This forces Vite to fail/clear instead of drifting to 5177!
  }
})
