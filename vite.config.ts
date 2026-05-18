import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import basicSsl from "@vitejs/plugin-basic-ssl";

/**
 * Vite configuration file for the Cinebh frontend application.
 * Defines plugins (React, Tailwind), testing environment (Vitest), and server settings.
 */
export default defineConfig({
  plugins: [react(), tailwindcss(), basicSsl()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "cinebh.com",
    port: 5173,
    strictPort: true,
    allowedHosts: ["cinebh.com"],
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setup.ts",
  },
});
