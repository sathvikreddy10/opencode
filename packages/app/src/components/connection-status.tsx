import { Show, createMemo } from "solid-js"
import { useServer } from "@/context/server"
import { useLanguage } from "@/context/language"
import { IconButton } from "@opencode-ai/ui/icon-button"
import { Tooltip } from "@opencode-ai/ui/tooltip"
import { MobileLogger } from "@/utils/mobile-logger"

export function ConnectionStatus() {
  const server = useServer()
  const language = useLanguage()

  const state = createMemo(() => server.connectionState())
  const error = createMemo(() => server.lastError())
  const checks = createMemo(() => server.healthCheckCount())
  const lastHealthy = createMemo(() => server.lastHealthyAt())

  const label = createMemo(() => {
    switch (state()) {
      case "idle":
        return language.t("connection.idle")
      case "connecting":
        return language.t("connection.connecting")
      case "connected":
        return language.t("connection.connected")
      case "disconnected":
        return language.t("connection.disconnected")
      case "reconnecting":
        return language.t("connection.reconnecting")
      case "unreachable":
        return language.t("connection.unreachable")
      default:
        return String(state())
    }
  })

  const icon = createMemo(() => {
    switch (state()) {
      case "idle":
        return "help"
      case "connecting":
        return "help"
      case "connected":
        return "circle-check"
      case "disconnected":
        return "warning"
      case "reconnecting":
        return "reset"
      case "unreachable":
        return "warning"
      default:
        return "help"
    }
  })

  const colorClass = createMemo(() => {
    switch (state()) {
      case "idle":
        return "text-text-weak"
      case "connecting":
        return "text-icon-info"
      case "connected":
        return "text-icon-success"
      case "disconnected":
        return "text-icon-warning"
      case "reconnecting":
        return "text-icon-info"
      case "unreachable":
        return "text-icon-critical"
      default:
        return "text-text-weak"
    }
  })

  const healthyAgo = createMemo(() => {
    const at = lastHealthy()
    if (!at) return ""
    const sec = Math.round((Date.now() - at) / 1000)
    if (sec < 60) return `${sec}s ago`
    const min = Math.round(sec / 60)
    if (min < 60) return `${min}m ago`
    const hr = Math.round(min / 60)
    return `${hr}h ago`
  })

  return (
    <Tooltip
      placement="bottom"
      value={
        <div class="flex flex-col gap-1 max-w-xs">
          <div class="font-medium">{label()}</div>
          <Show when={server.current}>
            {(conn) => (
              <div class="text-12-regular opacity-80 break-all">
                {conn().http.url}
              </div>
            )}
          </Show>
          <Show when={error()}>
            {(err) => <div class="text-12-regular text-icon-critical break-all">{err()}</div>}
          </Show>
          <div class="text-12-regular opacity-70">
            Checks: {checks()}&nbsp;&middot;&nbsp;Last healthy: {healthyAgo() || "never"}
          </div>
          <div class="text-11-regular opacity-60 mt-1">
            Open browser console for detailed connection logs.
          </div>
        </div>
      }
    >
      <IconButton
        icon={icon()}
        variant="ghost"
        size="small"
        class={colorClass()}
        onClick={() => {
          MobileLogger.mobile.viewportSize(window.innerWidth, window.innerHeight)
          // eslint-disable-next-line no-console
          console.log("[OPENCODE] Connection debug:", {
            state: state(),
            url: server.current?.http.url,
            error: error(),
            checks: checks(),
            lastHealthy: lastHealthy(),
            healthy: server.healthy(),
          })
        }}
        aria-label={label()}
      />
    </Tooltip>
  )
}
