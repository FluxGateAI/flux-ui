import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 3100 },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
