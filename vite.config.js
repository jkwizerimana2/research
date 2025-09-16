import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwind()],
  server: {
    host: true,            // allow external access (required for tunneling)
    port: 5173,
    proxy: {
      // Forward /api/* from Vite → FastAPI at localhost:8000
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // /api/ask -> /ask
      },
    },
    // If HMR ever fails over a tunnel, uncomment the next lines:
    // hmr: { clientPort: 443, protocol: "wss" },
  },
});
