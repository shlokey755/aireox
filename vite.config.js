import { defineConfig } from "vite";

// base "./" keeps asset paths relative, so the build also works on GitHub Pages sub paths.
export default defineConfig({
  base: "./",
});
