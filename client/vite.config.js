import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "manifest.json",
          dest: "", // Copies manifest.json to the root of dist/
        },
        {
          src: "./src/background.js",
          dest: "src/",
        }
      ],
    }),
  ],
});
