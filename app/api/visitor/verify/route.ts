import { NextRequest, NextResponse } from "next/server"

import {
  extractGeo,
  parseReferrer,
  parseUserAgent,
  toAsciiSafe,
} from "@/lib/utils"

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function POST(request: NextRequest) {
  // 1. Check visit_pending cookie exists and has a valid UUID value
  const pendingToken = request.cookies.get("visit_pending")?.value
  if (!pendingToken || !UUID_PATTERN.test(pendingToken)) {
    return NextResponse.json(
      { error: "Missing or invalid verification token" },
      { status: 400 }
    )
  }

  // 2. Check visitor_notified is not already set (prevents duplicate notifications)
  if (request.cookies.get("visitor_notified")?.value === "true") {
    return NextResponse.json(
      { error: "Already notified" },
      { status: 409 }
    )
  }

  // 3. Check ntfy topic is configured
  const ntfyTopic = process.env.NTFY_TOPIC
  if (!ntfyTopic) {
    return NextResponse.json(
      { error: "Notification system not configured" },
      { status: 503 }
    )
  }

  // 4. Parse request body for client-side data
  let clientReferrer = ""
  let clientPath = "/"
  try {
    const body = await request.json()
    clientReferrer = typeof body.referrer === "string" ? body.referrer : ""
    clientPath = typeof body.path === "string" ? body.path : "/"
  } catch {
    // Body parsing failed — continue with defaults
  }

  // 5. Geo extraction — Vercel injects these headers on all function invocations
  const { location } = extractGeo(request.headers)

  // 6. Parse referrer — use client-side document.referrer (more accurate than
  //    the Referer header on this API request, which would be the portfolio itself)
  const referrer = parseReferrer(clientReferrer, [
    "anshuljain.net",
    "anshuljain.co.in",
  ])
  const referrerLine =
    referrer === "Direct" ? "Direct" : `Referral (${referrer})`

  // 7. Parse UA — the browser sends its real UA on this fetch() call
  const ua = request.headers.get("user-agent") ?? ""
  const { deviceType, browser, os } = parseUserAgent(ua)
  // Append primary language to device line (e.g., "Mobile / Chrome / Android / en")
  const rawLang = request.headers.get("accept-language") ?? ""
  const primaryLang = rawLang.split(",")[0]?.split(";")[0]?.trim() || ""
  const deviceParts = [deviceType, browser, os]
  if (primaryLang) deviceParts.push(primaryLang)
  const deviceLine = deviceParts.filter(Boolean).join(" / ")

  // 8. Build ntfy action buttons
  const actions: string[] = []
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
  if (umamiId) {
    actions.push(
      `view, Open Umami, https://cloud.umami.is/analytics/eu/websites/${umamiId}`
    )
  }
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID
  if (clarityId) {
    actions.push(
      `view, Open Clarity, https://clarity.microsoft.com/projects/view/${clarityId}/dashboard`
    )
  }

  // 9. Fire notification to main topic
  let ntfyOk = false
  try {
    const ntfyResponse = await fetch(`https://ntfy.sh/${ntfyTopic}`, {
      method: "POST",
      headers: {
        Title: `New Visitor - ${toAsciiSafe(location)}`,
        Priority: "default",
        Tags: "globe_with_meridians",
        ...(actions.length > 0 && { Actions: actions.join("; ") }),
        "Content-Type": "text/plain",
      },
      body: `📄 ${clientPath}\n🔗 ${referrerLine}\n📱 ${deviceLine}\n🏠 ${request.headers.get("host") ?? "unknown"}`,
    })

    ntfyOk = ntfyResponse.ok
    if (!ntfyOk) {
      console.error("[visitor-verify] ntfy publish failed", {
        path: clientPath,
        status: ntfyResponse.status,
      })
    } else {
      console.log("[visitor-verify] ntfy publish success", {
        path: clientPath,
        status: ntfyResponse.status,
      })
    }
  } catch (error) {
    console.error("[visitor-verify] ntfy publish error", {
      path: clientPath,
      error: error instanceof Error ? error.message : String(error),
    })
  }

  // 10. Only seal cookies if ntfy actually succeeded.
  //     On failure, leave visit_pending intact so the beacon can retry
  //     on the next page navigation within the 5-minute cookie window.
  if (!ntfyOk) {
    return NextResponse.json(
      { error: "Notification delivery failed" },
      { status: 502 }
    )
  }

  const response = NextResponse.json({ ok: true })

  response.cookies.set("visitor_notified", "true", {
    maxAge: 60 * 60 * 1.5, // 1.5 hours
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    path: "/",
  })

  response.cookies.set("visit_pending", "", {
    maxAge: 0,
    httpOnly: false,
    sameSite: "strict",
    secure: true,
    path: "/",
  })

  return response
}
