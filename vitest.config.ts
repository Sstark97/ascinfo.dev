import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/setup.ts",
    include: ["tests/**/*.{test,spec}.{js,ts,tsx}"],
    exclude: ["tests/app/**", "node_modules", ".next"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "tests/", ".next/", "src/content/"],
    },
  },
  resolve: {
    alias: {
      "@fixtures": path.resolve(__dirname, "./tests/lib/content/fixtures"),
      "@/content/domain": path.resolve(__dirname, "./src/lib/content/domain"),
      "@/content/application": path.resolve(__dirname, "./src/lib/content/application"),
      "@/content/infrastructure": path.resolve(__dirname, "./src/lib/content/infrastructure"),
      "@": path.resolve(__dirname, "./"),
    },
  },
})
