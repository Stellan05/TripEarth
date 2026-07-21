import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { fileURLToPath } from "node:url"

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: Number(process.env.PORT) || 3000,
  },
  build: {
    chunkSizeWarningLimit: 4000,
  },
})
