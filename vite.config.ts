import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import envCompatible from "vite-plugin-env-compatible";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/Api": "http://localhost:3000",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
}); 