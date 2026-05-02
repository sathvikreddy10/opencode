#!/usr/bin/env bun
/**
 * Production web UI server.
 * Serves the built web app and proxies API requests to the backend.
 * No Vite dev server overhead - pure Bun static file serving.
 */

import { serve, serveStatic } from "bun"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(__dirname, "dist")

const BACKEND = process.env.OPENCODE_BACKEND || "http://localhost:4096"

const API_PREFIXES = [
  "/health", "/global", "/event", "/session", "/file", "/find", "/path",
  "/vcs", "/project", "/worktree", "/app", "/config", "/provider", "/model",
  "/permission", "/mcp", "/agent", "/plugin", "/db", "/stats", "/debug",
  "/log", "/experimental",
]

const server = serve({
  port: 3000,
  hostname: "0.0.0.0",
  async fetch(req) {
    const url = new URL(req.url)
    const pathname = url.pathname

    // Proxy API requests to backend
    if (API_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
      const target = BACKEND + pathname + url.search
      const headers = new Headers(req.headers)
      headers.set("host", new URL(BACKEND).host)

      return fetch(target, {
        method: req.method,
        headers,
        body: req.body,
        redirect: "manual",
      })
    }

    // Serve static files from dist
    const response = await serveStatic(req, {
      dir: distDir,
      fallback: "index.html",
    })

    return response
  },
})

console.log(`Web UI server running at http://0.0.0.0:3000`)
console.log(`Proxying API requests to ${BACKEND}`)
