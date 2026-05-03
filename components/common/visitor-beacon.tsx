"use client"

import { useEffect } from "react"

/**
 * JS verification beacon for visitor notifications.
 *
 * Reads the `visit_pending` cookie set by the proxy and calls
 * /api/visitor/verify after a 3-second delay. Only real browsers
 * that execute JS will trigger this, filtering out bots.
 */
export function VisitorBeacon() {
  useEffect(() => {
    const timerId = setTimeout(() => {
      // Parse visit_pending from document.cookie
      const cookies = document.cookie.split("; ")
      const pending = cookies
        .find((c) => c.startsWith("visit_pending="))
        ?.split("=")[1]

      if (!pending) return

      // Fire verification beacon with client-side referrer and path
      fetch("/api/visitor/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referrer: document.referrer,
          path: window.location.pathname,
        }),
      }).catch(() => {
        // Silent failure — visitor notification is best-effort
      })
    }, 3000)

    return () => clearTimeout(timerId)
  }, [])

  return null
}
