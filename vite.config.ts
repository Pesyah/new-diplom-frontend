import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:3000/api/', // целевой сервер
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ''), // переписываем путь
  //     },
  //   },
  // },
})
