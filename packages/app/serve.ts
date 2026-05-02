#!/usr/bin/env bun
/**
 * Production web UI server.
 * Serves the built web app and proxies API requests to the backend.
 * Uses Bun.file() directly - no serveStatic dependency.
 */

import { serve } from "bun"
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

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".wasm": "application/wasm",
  ".map": "application/json",
}

async function serveFile(p: string) {
  const f = Bun.file(p)
  if (await f.exists()) {
    return new Response(f, { headers: { "Content-Type": MIME[path.extname(p)] || "application/octet-stream" } })
  }
  return null
}

serve({
  port: 3001,
  hostname: "0.0.0.0",
  async fetch(req) {
    const url = new URL(req.url)
    const p = url.pathname

    if (API_PREFIXES.some(x => p.startsWith(x))) {
      return fetch(BACKEND + p + url.search, {
        method: req.method,
        headers: { ...Object.fromEntries(req.headers), host: new URL(BACKEND).host },
        body: req.body,
        redirect: "manual",
      })
    }

    const filePath = p === "/" ? "index.html" : p.replace(/^\//, "")
    const resp = await serveFile(path.join(distDir, filePath))
    return resp ?? await serveFile(path.join(distDir, "index.html")) ?? new Response("Not Found", { status: 404 })
  },
})

console.log(`Web UI: http://0.0.0.0:3000 | Backend: ${BACKEND}`)
