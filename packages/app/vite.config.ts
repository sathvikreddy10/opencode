import { defineConfig } from "vite"
import desktopPlugin from "./vite"

const backendUrl = process.env.VITE_OPENCODE_SERVER_HOST
  ? `http://${process.env.VITE_OPENCODE_SERVER_HOST}:${process.env.VITE_OPENCODE_SERVER_PORT ?? "4096"}`
  : "http://localhost:4096"

export default defineConfig({
  plugins: [desktopPlugin] as any,
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
    port: 3000,
    proxy: {
      // Proxy all API calls to the backend so remote access (Tailscale, LAN)
      // works correctly. The Vite dev server runs on the laptop and forwards
      // requests to localhost:4096 where the backend is running.
      "/health": backendUrl,
      "/global": backendUrl,
      "/event": { target: backendUrl, ws: true },
      "/session": backendUrl,
      "/file": backendUrl,
      "/find": backendUrl,
      "/path": backendUrl,
      "/vcs": backendUrl,
      "/project": backendUrl,
      "/worktree": backendUrl,
      "/app": backendUrl,
      "/config": backendUrl,
      "/provider": backendUrl,
      "/model": backendUrl,
      "/permission": backendUrl,
      "/mcp": backendUrl,
      "/agent": backendUrl,
      "/plugin": backendUrl,
      "/db": backendUrl,
      "/stats": backendUrl,
      "/debug": backendUrl,
      "/log": backendUrl,
      "/experimental": backendUrl,
    },
  },
  build: {
    target: "esnext",
    // sourcemap: true,
  },
})
