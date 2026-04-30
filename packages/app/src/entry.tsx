// @refresh reload

import { render } from "solid-js/web"
import { AppBaseProviders, AppInterface } from "@/app"
import { type Platform, PlatformProvider } from "@/context/platform"
import { dict as en } from "@/i18n/en"
import { dict as zh } from "@/i18n/zh"
import { handleNotificationClick } from "@/utils/notification-click"
import pkg from "../package.json"
import { ServerConnection } from "./context/server"

const DEFAULT_SERVER_URL_KEY = "opencode.settings.dat:defaultServerUrl"

const getLocale = () => {
  if (typeof navigator !== "object") return "en" as const
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const language of languages) {
    if (!language) continue
    if (language.toLowerCase().startsWith("zh")) return "zh" as const
  }
  return "en" as const
}

const getRootNotFoundError = () => {
  const key = "error.dev.rootNotFound" as const
  const locale = getLocale()
  return locale === "zh" ? (zh[key] ?? en[key]) : en[key]
}

const getStorage = (key: string) => {
  if (typeof localStorage === "undefined") return null
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

const setStorage = (key: string, value: string | null) => {
  if (typeof localStorage === "undefined") return
  try {
    if (value !== null) {
      localStorage.setItem(key, value)
      return
    }
    localStorage.removeItem(key)
  } catch {
    return
  }
}

const readDefaultServerUrl = () => getStorage(DEFAULT_SERVER_URL_KEY)
const writeDefaultServerUrl = (url: string | null) => setStorage(DEFAULT_SERVER_URL_KEY, url)

const notify: Platform["notify"] = async (title, description, href) => {
  console.log("[OPENCODE][NOTIFY] Attempting notification:", { title, description, href })

  if (!("Notification" in window)) {
    console.warn("[OPENCODE][NOTIFY] Notifications not supported in this browser")
    return
  }

  const permission =
    Notification.permission === "default"
      ? await Notification.requestPermission().catch((err) => {
          console.error("[OPENCODE][NOTIFY] Permission request failed:", err)
          return "denied"
        })
      : Notification.permission

  console.log("[OPENCODE][NOTIFY] Permission status:", permission)

  if (permission !== "granted") {
    console.warn("[OPENCODE][NOTIFY] Permission not granted:", permission)
    return
  }

  // On mobile via Tailscale, we ALWAYS notify even if tab is visible
  // because the user might be on another app. The only time we skip is
  // when the document has focus AND we're on desktop-sized viewport.
  const isMobile = window.innerWidth < 768
  const inView = document.visibilityState === "visible" && document.hasFocus()
  if (inView && !isMobile) {
    console.log("[OPENCODE][NOTIFY] Skipping: desktop tab is focused")
    return
  }

  try {
    const notification = new Notification(title, {
      body: description ?? "",
      icon: "https://opencode.ai/favicon-96x96-v3.png",
      tag: href ?? "opencode",
      requireInteraction: true,
    })

    notification.onclick = () => {
      console.log("[OPENCODE][NOTIFY] Notification clicked:", href)
      handleNotificationClick(href)
      notification.close()
    }

    notification.onerror = (err) => {
      console.error("[OPENCODE][NOTIFY] Notification error:", err)
    }

    console.log("[OPENCODE][NOTIFY] Sent successfully")
  } catch (err) {
    console.error("[OPENCODE][NOTIFY] Failed to create notification:", err)
  }
}

const openLink: Platform["openLink"] = (url) => {
  window.open(url, "_blank")
}

const back: Platform["back"] = () => {
  window.history.back()
}

const forward: Platform["forward"] = () => {
  window.history.forward()
}

const restart: Platform["restart"] = async () => {
  window.location.reload()
}

const root = document.getElementById("root")
if (!(root instanceof HTMLElement) && import.meta.env.DEV) {
  throw new Error(getRootNotFoundError())
}

const getCurrentUrl = () => {
  if (location.hostname.includes("opencode.ai")) return "http://localhost:4096"

  // When accessed remotely (Tailscale, LAN, etc.), use the same origin
  // so API calls go to the correct server instead of localhost.
  const isLocalhost = ["localhost", "127.0.0.1", "::1"].includes(location.hostname)

  if (import.meta.env.DEV) {
    if (!isLocalhost) {
      // Remote dev access: API calls go to same origin (Vite proxy handles it)
      console.log("[OPENCODE][BOOT] Remote dev detected, using same origin:", location.origin)
      return location.origin
    }
    return `http://${import.meta.env.VITE_OPENCODE_SERVER_HOST ?? "localhost"}:${import.meta.env.VITE_OPENCODE_SERVER_PORT ?? "4096"}`
  }

  return location.origin
}

const getDefaultUrl = () => {
  const lsDefault = readDefaultServerUrl()
  if (lsDefault) return lsDefault
  return getCurrentUrl()
}

const platform: Platform = {
  platform: "web",
  version: pkg.version,
  openLink,
  back,
  forward,
  restart,
  notify,
  getDefaultServer: async () => {
    const stored = readDefaultServerUrl()
    console.log("[OPENCODE][PLATFORM] Default server from storage:", stored)
    return stored ? ServerConnection.Key.make(stored) : null
  },
  setDefaultServer: writeDefaultServerUrl,
}

if (root instanceof HTMLElement) {
  const server: ServerConnection.Http = { type: "http", http: { url: getCurrentUrl() } }

  // Log startup info for debugging Tailscale/mobile connections
  console.log("[OPENCODE][BOOT] Starting Opencode web app")
  console.log("[OPENCODE][BOOT] User agent:", navigator.userAgent)
  console.log("[OPENCODE][BOOT] Viewport:", `${window.innerWidth}x${window.innerHeight}`)
  console.log("[OPENCODE][BOOT] Current URL:", location.href)
  console.log("[OPENCODE][BOOT] Server URL:", server.http.url)

  // Request notification permission early so we're ready when needed
  if ("Notification" in window && Notification.permission === "default") {
    console.log("[OPENCODE][BOOT] Requesting notification permission early...")
    Notification.requestPermission().then((result) => {
      console.log("[OPENCODE][BOOT] Notification permission:", result)
    })
  }

  // Log resize events for mobile debugging
  window.addEventListener("resize", () => {
    console.log("[OPENCODE][EVENT] Resize:", `${window.innerWidth}x${window.innerHeight}`)
  })

  render(
    () => (
      <PlatformProvider value={platform}>
        <AppBaseProviders>
          <AppInterface
            defaultServer={ServerConnection.Key.make(getDefaultUrl())}
            servers={[server]}
          />
        </AppBaseProviders>
      </PlatformProvider>
    ),
    root,
  )
}
