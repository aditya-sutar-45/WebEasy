import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "./src/extension/manifest.json",
          dest: "",
        },
        {
          src: "./src/extension/background.js",
          dest: "src/",
        },
        {
          src: "./src/extension/content.js",
          dest: "src/",
        },
        {
          src: "./src/extension/css/sidebar.css",
          dest: "",
        },
        {
          src: "./src/extension/sidebar.html",
          dest: "",
        },
      ],
    }),
  ],
});
