/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// base: "./" makes the build relocatable, so it works on GitHub Pages
// (https://user.github.io/repo/) without configuration. Hash-based routing
// means no server-side rewrites are needed.
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    // Curriculum prose (topic/milestone bodies + the resource catalog) lives
    // in a lazily-loaded chunk shared by the detail routes, search, and the
    // resource library; the eager chunk carries only code and the lightweight
    // meta index. The raised limit covers the lazy prose chunk, which is
    // static TEXT, not code weight.
    chunkSizeWarningLimit: 700,
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
