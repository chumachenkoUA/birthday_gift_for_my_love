import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const base = process.env.VITE_APP_BASE ?? './birthday_gift_for_my_love'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
})
