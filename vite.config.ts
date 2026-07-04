/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// base: "./" makes the build relocatable, so it works on GitHub Pages
// (https://user.github.io/repo/) without configuration. Hash-based routing
// means no server-side rewrites are needed.
export default defineConfig({
  base: "./",
  // Cast avoids a spurious type clash from vitest bundling its own copy of vite;
  // the plugin is identical at runtime.
  plugins: [react() as never],
  build: {
    // The main chunk is dominated by the static curriculum TEXT (72 topics +
    // 10 project briefs), which the roadmap page needs in full for both the
    // guided and browse views and for search. It gzips to ~205 kB. Raise the
    // advisory limit so the warning reflects real code weight, not prose.
    chunkSizeWarningLimit: 700,
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
