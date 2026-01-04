import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      "/osm": {
        target: "https://nominatim.openstreetmap.org",
        changeOrigin: true,
        secure: true,
        headers: {
          "User-Agent": "helper-finder-local-dev"
        },
        rewrite: (path) => path.replace(/^\/osm/, "")
      }
    }
  }
});
