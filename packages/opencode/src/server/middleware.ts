import { Provider } from "@/provider/provider"
import { NamedError } from "@opencode-ai/core/util/error"
import { NotFoundError } from "@/storage/storage"
import { Session } from "@/session/session"
import type { ContentfulStatusCode } from "hono/utils/http-status"
import type { ErrorHandler, MiddlewareHandler } from "hono"
import { HTTPException } from "hono/http-exception"
import * as Log from "@opencode-ai/core/util/log"
import { Flag } from "@opencode-ai/core/flag/flag"
import { basicAuth } from "hono/basic-auth"
import { cors } from "hono/cors"
import { compress } from "hono/compress"
import * as ServerBackend from "./backend"

const log = Log.create({ service: "server" })

export const ErrorMiddleware: ErrorHandler = (err, c) => {
  log.error("failed", {
    error: err,
  })
  if (err instanceof NamedError) {
    let status: ContentfulStatusCode
    if (err instanceof NotFoundError) status = 404
    else if (err instanceof Provider.ModelNotFoundError) status = 400
    else if (err.name === "ProviderAuthValidationFailed") status = 400
    else if (err.name.startsWith("Worktree")) status = 400
    else status = 500
    return c.json(err.toObject(), { status })
  }
  if (err instanceof Session.BusyError) {
    return c.json(new NamedError.Unknown({ message: err.message }).toObject(), { status: 400 })
  }
  if (err instanceof HTTPException) return err.getResponse()
  const message = err instanceof Error && err.stack ? err.stack : err.toString()
  return c.json(new NamedError.Unknown({ message }).toObject(), {
    status: 500,
  })
}

export const AuthMiddleware: MiddlewareHandler = (c, next) => {
  // Allow CORS preflight requests to succeed without auth.
  // Browser clients sending Authorization headers will preflight with OPTIONS.
  if (c.req.method === "OPTIONS") return next()
  const password = Flag.OPENCODE_SERVER_PASSWORD
  if (!password) return next()
  const username = Flag.OPENCODE_SERVER_USERNAME ?? "opencode"

  if (c.req.query("auth_token")) c.req.raw.headers.set("authorization", `Basic ${c.req.query("auth_token")}`)

  return basicAuth({ username, password })(c, next)
}

export function LoggerMiddleware(backendAttributes: ServerBackend.Attributes): MiddlewareHandler {
  return async (c, next) => {
    const skip = c.req.path === "/log"
    if (skip) return next()
    const attributes = {
      method: c.req.method,
      path: c.req.path,
      ...backendAttributes,
    }
    log.info("request", attributes)
    const timer = log.time("request", attributes)
    await next()
    timer.stop()
  }
}

function isTailscaleIP(input: string): boolean {
  // Tailscale assigns IPs in the 100.64.0.0/10 CGNAT range
  const match = input.match(/^https?:\/\/(\d+)\.(\d+)\.(\d+)\.(\d+)(:\d+)?$/)
  if (!match) return false
  const [, a, b] = match.map(Number)
  if (a === undefined || b === undefined) return false
  return a === 100 && b >= 64 && b <= 127
}

function isTailscaleMagicDNS(input: string): boolean {
  // Tailscale Magic DNS domains: *.ts.net, *.tailnet-name.ts.net, etc.
  return /^https?:\/\/([a-z0-9-]+\.)*ts\.net(:\d+)?$/.test(input)
}

export function CorsMiddleware(opts?: { cors?: string[] }): MiddlewareHandler {
  return cors({
    maxAge: 86_400,
    origin(input, ctx) {
      if (!input) return

      if (input.startsWith("http://localhost:")) return input
      if (input.startsWith("http://127.0.0.1:")) return input
      if (input === "tauri://localhost" || input === "http://tauri.localhost" || input === "https://tauri.localhost")
        return input

      if (/^https:\/\/([a-z0-9-]+\.)*opencode\.ai$/.test(input)) return input
      if (opts?.cors?.includes(input)) return input

      // Auto-allow Tailscale connections so users don't need to configure CORS
      if (isTailscaleIP(input)) {
        log.info("cors: allowed tailscale ip", { origin: input, path: ctx.req.path })
        return input
      }
      if (isTailscaleMagicDNS(input)) {
        log.info("cors: allowed tailscale magic dns", { origin: input, path: ctx.req.path })
        return input
      }
    },
  })
}

const zipped = compress()
export const CompressionMiddleware: MiddlewareHandler = (c, next) => {
  const path = c.req.path
  const method = c.req.method
  if (path === "/event" || path === "/global/event") return next()
  if (method === "POST" && /\/session\/[^/]+\/(message|prompt_async)$/.test(path)) return next()
  return zipped(c, next)
}
