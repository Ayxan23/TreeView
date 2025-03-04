import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://c2b-fbusiness.customs.gov.az",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
