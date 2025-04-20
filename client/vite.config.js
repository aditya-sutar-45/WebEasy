import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "manifest.json",
          dest: "",
        },
        {
          src: "./src/background.js",
          dest: "src/",
        },
        {
          src: "./src/content.js",
          dest: "src/",
        },
        {
          src: "./src/css/sidebar.css",
          dest: "",
        },
      ],
    }),
  ],
});
