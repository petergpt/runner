
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
      '6f697112-98cc-49cd-9dee-a0a93aa2b124-00-318j0i8ug37p.kirk.replit.dev'
    ]
  }
})
