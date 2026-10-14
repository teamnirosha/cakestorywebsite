import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    watch: {
      ignored: [
        "**/assets/**",
        "**/public/**",
        "**/*.jpg",
        "**/*.JPG",
        "**/*.jpeg",
        "**/*.png",
        "**/*.ARW",
      ],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "gsap-vendor": ["gsap"],
          "leaflet-vendor": ["leaflet", "react-leaflet"],
          "three-vendor": ["three", "@react-three/fiber", "@react-three/drei"],
        },
      },
    },
  },
});
