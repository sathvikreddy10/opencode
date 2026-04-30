/**
 * Aggressive mobile & connection logging utility.
 *
 * Every major subsystem logs its lifecycle so users can open the
 * browser console on mobile (or desktop) and see exactly what is
 * happening.  This is invaluable when debugging Tailscale / reverse-
 * proxy / spotty-network setups.
 */

const PREFIX = "[OPENCODE]"

function now() {
  const d = new Date()
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}.${d.getMilliseconds().toString().padStart(3, "0")}`
}

function log(level: "log" | "warn" | "error", area: string, message: string, data?: unknown) {
  const fn = console[level]
  if (!fn) return
  const tag = `${PREFIX}[${now()}][${area}] ${message}`
  if (data !== undefined) {
    fn(tag, data)
    return
  }
  fn(tag)
}

export const MobileLogger = {
  connection: {
    stateChange: (from: string, to: string, detail?: unknown) =>
      log("log", "CONN", `State changed: ${from} → ${to}`, detail),
    healthCheckStart: (url: string) => log("log", "CONN", `Health check start: ${url}`),
    healthCheckResult: (url: string, healthy: boolean, detail?: unknown) =>
      log("log", "CONN", `Health check result: ${url} healthy=${healthy}`, detail),
    healthCheckError: (url: string, error: unknown) =>
      log("error", "CONN", `Health check error: ${url}`, error),
    reconnectScheduled: (delayMs: number, reason: string) =>
      log("warn", "CONN", `Reconnect scheduled in ${delayMs}ms: ${reason}`),
    sseOpen: (url: string) => log("log", "CONN", `SSE opened: ${url}`),
    sseClose: (url: string, reason?: string) => log("warn", "CONN", `SSE closed: ${url} ${reason ?? ""}`),
    sseError: (url: string, error: unknown) => log("error", "CONN", `SSE error: ${url}`, error),
    sseEvent: (type: string, name: string, detail?: unknown) =>
      log("log", "CONN", `SSE event: ${type} (${name})`, detail),
  },
  sync: {
    bootstrapStart: (directory: string) => log("log", "SYNC", `Bootstrap start: ${directory}`),
    bootstrapDone: (directory: string, sessionCount: number) =>
      log("log", "SYNC", `Bootstrap done: ${directory} sessions=${sessionCount}`),
    childStoreCreated: (directory: string) => log("log", "SYNC", `Child store created: ${directory}`),
    sessionPrefetch: (directory: string, sessionID: string) =>
      log("log", "SYNC", `Session prefetch: ${directory}/${sessionID}`),
    messageSyncStart: (sessionID: string) => log("log", "SYNC", `Message sync start: ${sessionID}`),
    messageSyncDone: (sessionID: string, count: number) =>
      log("log", "SYNC", `Message sync done: ${sessionID} count=${count}`),
  },
  notification: {
    permissionAsked: () => log("log", "NOTIFY", "Browser notification permission asked"),
    permissionResult: (result: string) => log("log", "NOTIFY", `Browser notification permission: ${result}`),
    send: (title: string, description?: string, href?: string) =>
      log("log", "NOTIFY", `Sending notification: ${title}`, { description, href }),
    sendFailed: (error: unknown) => log("error", "NOTIFY", "Sending notification failed", error),
    questionAlert: (sessionID: string) => log("warn", "NOTIFY", `User input needed (question): ${sessionID}`),
    permissionAlert: (sessionID: string) => log("warn", "NOTIFY", `User input needed (permission): ${sessionID}`),
    soundPlay: (soundId: string) => log("log", "NOTIFY", `Playing sound: ${soundId}`),
  },
  mobile: {
    viewportSize: (width: number, height: number) =>
      log("log", "MOBILE", `Viewport: ${width}x${height}`),
    sidebarToggle: (opened: boolean) => log("log", "MOBILE", `Sidebar toggled: ${opened}`),
    terminalToggle: (opened: boolean) => log("log", "MOBILE", `Terminal toggled: ${opened}`),
    tabSwitch: (tab: string) => log("log", "MOBILE", `Tab switched: ${tab}`),
    touchDetected: () => log("log", "MOBILE", "Touch device detected"),
  },
  session: {
    navigate: (sessionID: string, directory: string) =>
      log("log", "SESSION", `Navigate: ${sessionID} in ${directory}`),
    handoffSet: (dir: string, id: string) => log("log", "SESSION", `Handoff set: ${dir}/${id}`),
    handoffCleared: () => log("log", "SESSION", "Handoff cleared"),
  },
}
