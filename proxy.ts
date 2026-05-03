import { NextFetchEvent, NextRequest, NextResponse } from "next/server"

import {
  REGION_NAMES,
  extractGeo,
  parseReferrer,
  parseUserAgent,
  toAsciiSafe,
} from "@/lib/utils"

const BOT_UA_PATTERN =
  /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebot|facebookexternalhit|ia_archiver|python-requests|curl\/|wget\/|ahrefsbot|semrushbot|mj12bot|dotbot|rogerbot|linkedinbot|screaming.frog|petalbot|bytespider|gptbot|chatgpt-user|oai-searchbot|claudebot|anthropic-ai|claude-searchbot|claude-user|applebot|meta-externalagent|amazonbot|cohere-ai|diffbot|youbot|twitterbot|whatsapp|telegrambot|slackbot|discordbot|uptimerobot|pingdom|censys|shodan|perplexitybot|ccbot|pinterestbot|tiktokbot|adsbot-google|mediapartners-google|apis-google|google-safety|duckassistbot|ai2bot|grokbot|dataforseobot|turnitinbot/i

// Referrer-based asset protection — blocks direct access to media files and
// sensitive documents. Requests from our own site (same-site Referer) are allowed.
// Only high-trust bots (search engines + social previews) bypass asset protection.
// Generic tools (curl, wget, python-requests) and AI crawlers are NOT allowed.
const ASSET_ALLOW_BOT_PATTERN =
  /googlebot|adsbot-google|bingbot|applebot|facebookexternalhit|facebot|twitterbot|linkedinbot|pinterestbot|tiktokbot|telegrambot|slackbot|discordbot/i
const PROTECTED_MEDIA_PATTERN = /\.(mp4|webm|ogg|m4v|mp3|wav|flac)$/i
const PROTECTED_FILE_PATHS = new Set([
  "/ren-letter-preview.png",
  "/Ren-Reference-Letter-images-0.jpg",
  "/Ren-Reference-Letter-images-1.jpg",
])
const OWN_ASSET_HOSTS = [
  "anshuljain.net",
  "anshuljain.co.in",
  "www.anshuljain.net",
  "dev.anshuljain.net",
  "website-portfolio-two-inky.vercel.app",
  "localhost",
]

function isProtectedAsset(path: string): boolean {
  return PROTECTED_MEDIA_PATTERN.test(path) || PROTECTED_FILE_PATHS.has(path)
}

function isOwnSiteReferrer(referer: string): boolean {
  if (!referer) return false
  try {
    const ref = new URL(referer)
    return OWN_ASSET_HOSTS.some(
      (h) => ref.hostname === h || ref.hostname === `www.${h}`
    )
  } catch {
    return false
  }
}

/** Handle protected asset requests — referrer-based access control. */
function handleProtectedAsset(
  request: NextRequest,
  event: NextFetchEvent,
  path: string
): NextResponse {
  const ua = request.headers.get("user-agent") ?? ""
  const referer = request.headers.get("referer") ?? ""
  const botTopic = process.env.NTFY_BOT_TOPIC
  const hostname = request.nextUrl.hostname

  // High-trust bots (search engines + social previews) — allow for SEO/previews, notify bot topic
  if (ua && ASSET_ALLOW_BOT_PATTERN.test(ua)) {
    if (botTopic) {
      const botName = extractBotName(ua)
      const { location } = extractGeo(request.headers)
      event.waitUntil(
        fetch(`https://ntfy.sh/${botTopic}`, {
          method: "POST",
          headers: {
            Title: toAsciiSafe(`Bot Asset Fetch - ${location}`),
            Priority: "low",
            Tags: "robot",
            "Content-Type": "text/plain",
          },
          body: `📄 ${path}\n🤖 ${botName}\n🏠 ${hostname}`,
        }).catch(() => {}),
      )
    }
    return NextResponse.next()
  }

  // Same-site referrer — our own page loaded this asset. Allow silently.
  if (isOwnSiteReferrer(referer)) {
    return NextResponse.next()
  }

  // Direct access (no referrer or foreign referrer) — block and notify
  if (botTopic) {
    const { location } = extractGeo(request.headers)
    event.waitUntil(
      fetch(`https://ntfy.sh/${botTopic}`, {
        method: "POST",
        headers: {
          Title: toAsciiSafe(`Direct Download - ${location}`),
          Priority: "low",
          Tags: "file_folder",
          "Content-Type": "text/plain",
        },
        body: `📄 ${path}\n🪪 ${ua.slice(0, 220)}\n🏠 ${hostname}`,
      }).catch(() => {}),
    )
  }

  const blocked = new NextResponse("Forbidden", { status: 403 })
  blocked.headers.set("Vary", "Referer")
  blocked.headers.set("Cache-Control", "no-store")
  return blocked
}

// Path-based scanner detection — catches automated probes that use browser-like UAs.
// These paths don't exist on this Next.js site; only scanners request them.
const SCANNER_PATH_PATTERN =
  /\.php(?:[?#]|$)|\/wp-(?:login|admin|includes|content)|\/xmlrpc\.php|\/swagger(?:\.json|\.yaml|-ui|-hub)?(?:\/|$)|\/(?:v\d+\/)?api[-_]?docs(?:\/|$)|\/actuator(?:\/|$)|\/phpmyadmin(?:\/|$)|\/\.(?:git|env|aws|ssh|htaccess|htpasswd|DS_Store)(?:\/|$)/i

// Maps bot UA patterns to human-readable names for ntfy bot topic notifications.
const extractBotName = (ua: string): string => {
  const patterns: [RegExp, string][] = [
    // Search engine crawlers
    [/googlebot/i, "Googlebot"],
    [/adsbot-google/i, "AdsBot-Google"],
    [/mediapartners-google/i, "Mediapartners-Google"],
    [/apis-google/i, "APIs-Google"],
    [/google-safety/i, "Google-Safety"],
    [/bingbot/i, "Bingbot"],
    [/slurp/i, "Yahoo Slurp"],
    [/duckduckbot/i, "DuckDuckBot"],
    [/duckassistbot/i, "DuckAssistBot"],
    [/baiduspider/i, "Baiduspider"],
    [/yandexbot/i, "YandexBot"],
    [/applebot/i, "Applebot"],
    // AI/LLM crawlers
    [/gptbot/i, "GPTBot"],
    [/chatgpt-user/i, "ChatGPT-User"],
    [/oai-searchbot/i, "OAI-SearchBot"],
    [/claudebot/i, "ClaudeBot"],
    [/claude-searchbot/i, "Claude-SearchBot"],
    [/claude-user/i, "Claude-User"],
    [/anthropic-ai/i, "Anthropic AI"],
    [/meta-externalagent/i, "Meta AI"],
    [/amazonbot/i, "Amazonbot"],
    [/cohere-ai/i, "Cohere AI"],
    [/perplexitybot/i, "PerplexityBot"],
    [/grokbot/i, "GrokBot"],
    [/diffbot/i, "Diffbot"],
    [/youbot/i, "Youbot"],
    [/bytespider/i, "ByteSpider"],
    [/ai2bot/i, "AI2Bot"],
    [/ccbot/i, "CCBot"],
    // Social preview bots
    [/facebookexternalhit/i, "Facebook Preview"],
    [/facebot/i, "Facebookbot"],
    [/twitterbot/i, "Twitterbot"],
    [/pinterestbot/i, "PinterestBot"],
    [/tiktokbot/i, "TikTokBot"],
    [/whatsapp/i, "WhatsApp Preview"],
    [/telegrambot/i, "TelegramBot"],
    [/slackbot/i, "Slackbot"],
    [/discordbot/i, "DiscordBot"],
    // SEO crawlers
    [/ahrefsbot/i, "AhrefsBot"],
    [/semrushbot/i, "SEMrushBot"],
    [/mj12bot/i, "MajesticBot"],
    [/dotbot/i, "DotBot"],
    [/rogerbot/i, "Rogerbot"],
    [/linkedinbot/i, "LinkedInBot"],
    [/screaming.frog/i, "Screaming Frog"],
    [/petalbot/i, "PetalBot"],
    [/dataforseobot/i, "DataForSeoBot"],
    [/turnitinbot/i, "TurnitinBot"],
    // Monitoring & security
    [/uptimerobot/i, "UptimeRobot"],
    [/pingdom/i, "Pingdom"],
    [/censys/i, "Censys"],
    [/shodan/i, "Shodan"],
    // Generic tools
    [/ia_archiver/i, "Archive.org"],
    [/python-requests/i, "Python Requests"],
    [/curl\//i, "curl"],
    [/wget\//i, "wget"],
  ]
  for (const [pattern, name] of patterns) {
    if (pattern.test(ua)) return name
  }
  return "Unknown Bot"
}

const logDecision = (message: string, details?: Record<string, unknown>) => {
  // Uncomment while debugging proxy behavior in Vercel logs.
  // if (details) {
  //   console.log(`[visitor-notify] ${message}`, details)
  //   return
  // }
  //
  // console.log(`[visitor-notify] ${message}`)
}

/** Fire an "Unverified" notification to the bot topic for human-candidate requests. */
function fireUnverifiedNotification(
  event: NextFetchEvent,
  botTopic: string,
  request: NextRequest,
  path: string
) {
  const { location } = extractGeo(request.headers)
  const hostname = request.nextUrl.hostname
  const ua = request.headers.get("user-agent") ?? ""
  const { deviceType, browser, os, impossible } = parseUserAgent(ua)
  const rawReferrer = request.headers.get("referer") ?? ""
  const referrer = parseReferrer(rawReferrer, [
    "anshuljain.net",
    "anshuljain.co.in",
  ])
  const referrerLine =
    referrer === "Direct" ? "Direct" : `Referral (${referrer})`

  // Build device line with bot-signal flags
  let deviceLine = [deviceType, browser, os].filter(Boolean).join(" / ")
  if (impossible) {
    deviceLine += " ⚠️ Impossible UA"
  }
  // Real Chrome/Edge 89+ always sends sec-ch-ua; absence strongly suggests a bot
  if (
    (browser === "Chrome" || browser === "Edge") &&
    !request.headers.get("sec-ch-ua")
  ) {
    deviceLine += " ⚠️ Spoofed UA"
  }

  event.waitUntil(
    fetch(`https://ntfy.sh/${botTopic}`, {
      method: "POST",
      headers: {
        Title: toAsciiSafe(`Unverified - ${location}`),
        Priority: "low",
        Tags: "mag",
        "Content-Type": "text/plain",
      },
      body: `📄 ${path}\n🔗 ${referrerLine}\n📱 ${deviceLine}\n🪪 ${ua.slice(0, 220)}\n🏠 ${hostname}`,
    }).catch(() => {}),
  )
}

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  // 1. Environment guard — skip local dev, but allow Vercel preview and production deployments
  if (process.env.NODE_ENV !== "production") {
    logDecision("skip: non-production runtime", {
      nodeEnv: process.env.NODE_ENV,
      path: request.nextUrl.pathname,
    })
    return NextResponse.next()
  }

  // 2. Method guard — only real page GETs (and protected asset GETs)
  if (request.method !== "GET") {
    logDecision("skip: non-GET request", {
      method: request.method,
      path: request.nextUrl.pathname,
    })
    return NextResponse.next()
  }

  // 2b. Asset protection — referrer-based access control for media and sensitive files.
  //     Runs before all visitor notification guards because asset requests have
  //     different sec-fetch-dest/accept headers that would be filtered by guards 3-5.
  //
  // TEMPORARILY DISABLED: was blocking Clarity session replay and potentially
  // clients on Safari/iOS (Referer stripping). All helper code below is intact.
  // To re-enable: uncomment the block below and remove this comment.
  //
  // const assetPath = request.nextUrl.pathname
  // if (isProtectedAsset(assetPath)) {
  //   return handleProtectedAsset(request, event, assetPath)
  // }

  // 3. Prefetch guard — Next.js router and browser speculation prefetches
  if (
    request.headers.get("purpose") === "prefetch" ||
    request.headers.get("next-router-prefetch") === "1" ||
    request.headers.get("x-purpose") === "prefetch" ||
    request.headers.get("sec-purpose") === "prefetch"
  ) {
    logDecision("skip: prefetch request", {
      path: request.nextUrl.pathname,
      purpose: request.headers.get("purpose"),
      nextRouterPrefetch: request.headers.get("next-router-prefetch"),
      xPurpose: request.headers.get("x-purpose"),
      secPurpose: request.headers.get("sec-purpose"),
    })
    return NextResponse.next()
  }

  // 4. Navigation guard — only notify on real HTML document navigations
  const secFetchDest = request.headers.get("sec-fetch-dest")
  if (secFetchDest && secFetchDest !== "document") {
    logDecision("skip: non-document navigation", {
      path: request.nextUrl.pathname,
      secFetchDest,
    })
    return NextResponse.next()
  }

  const accept = request.headers.get("accept") ?? ""
  if (!accept.includes("text/html")) {
    logDecision("skip: non-HTML accept header", {
      path: request.nextUrl.pathname,
      accept,
    })
    return NextResponse.next()
  }

  // 5. System inactive — bail early only if neither topic is configured.
  // Bot logging (NTFY_BOT_TOPIC) is intentionally independent of visitor
  // notifications (NTFY_TOPIC) so either channel can operate alone.
  const ntfyTopic = process.env.NTFY_TOPIC
  const botTopic = process.env.NTFY_BOT_TOPIC
  if (!ntfyTopic && !botTopic) {
    logDecision("skip: no ntfy topics configured", {
      path: request.nextUrl.pathname,
    })
    return NextResponse.next()
  }

  // 6. Mute check — site owner exclusion
  if (request.cookies.get("mute_notifications")?.value === "true") {
    logDecision("skip: muted browser", {
      path: request.nextUrl.pathname,
    })
    return NextResponse.next()
  }

  // 7. Dedupe check — already notified within the session window
  if (request.cookies.get("visitor_notified")?.value === "true") {
    logDecision("skip: dedupe cookie present", {
      path: request.nextUrl.pathname,
    })
    return NextResponse.next()
  }

  // 8. Bot check — filter major crawlers by User-Agent
  const ua = request.headers.get("user-agent") ?? ""
  if (!ua || BOT_UA_PATTERN.test(ua)) {
    logDecision("skip: bot or missing user-agent", {
      path: request.nextUrl.pathname,
      hasUserAgent: Boolean(ua),
      userAgentSample: ua.slice(0, 120),
    })

    // Bot logging — fire to a separate silent ntfy topic if configured
    if (botTopic && ua) {
      const rawBotName = extractBotName(ua)
      // For unrecognised bots, append a short UA snippet so it's actionable
      const botLabel =
        rawBotName === "Unknown Bot"
          ? `Unknown (${ua.slice(0, 60)})`
          : rawBotName
      const botPath = request.nextUrl.pathname
      const { location: botLocation } = extractGeo(request.headers)
      const botHostname = request.nextUrl.hostname

      event.waitUntil(
        fetch(`https://ntfy.sh/${botTopic}`, {
          method: "POST",
          headers: {
            Title: toAsciiSafe(`${botLabel} - ${botLocation}`),
            Priority: "low",
            Tags: "robot",
            "Content-Type": "text/plain",
          },
          body: `📄 ${botPath}\n🏠 ${botHostname}`,
        }).catch(() => {}),
      )
    }

    return NextResponse.next()
  }

  // 9. Scanner path check — catches probes to non-existent paths with browser-like UAs
  const path = request.nextUrl.pathname
  if (SCANNER_PATH_PATTERN.test(path)) {
    logDecision("skip: scanner probe path", { path })

    if (botTopic) {
      const { location: scanLocation } = extractGeo(request.headers)
      const scanHostname = request.nextUrl.hostname
      const scanUa = request.headers.get("user-agent") ?? ""
      const rawScanReferrer = request.headers.get("referer") ?? ""
      const scanReferrer = parseReferrer(rawScanReferrer, [
        "anshuljain.net",
        "anshuljain.co.in",
      ])
      const scanReferrerLine =
        scanReferrer === "Direct" ? "Direct" : `Referral (${scanReferrer})`

      event.waitUntil(
        fetch(`https://ntfy.sh/${botTopic}`, {
          method: "POST",
          headers: {
            Title: toAsciiSafe(`Scanner - ${scanLocation}`),
            Priority: "low",
            Tags: "warning",
            "Content-Type": "text/plain",
          },
          body: `📄 ${path}\n🔗 ${scanReferrerLine}\n🪪 ${scanUa.slice(0, 220)}\n🏠 ${scanHostname}`,
        }).catch(() => {}),
      )
    }

    return NextResponse.next()
  }

  // 10. Human candidate — dual-fire approach:
  //     a) Fire "Unverified" notification to bot topic immediately (visibility)
  //     b) Set visit_pending cookie for JS verification (main topic gate)
  //     The proxy no longer fires to the main topic or sets visitor_notified.
  //     Those responsibilities move to /api/visitor/verify.

  logDecision("human candidate: setting visit_pending", { path })

  // Fire "Unverified" to bot topic for full traffic visibility
  if (botTopic) {
    fireUnverifiedNotification(event, botTopic, request, path)
  }

  // Set visit_pending cookie only if NTFY_TOPIC is configured.
  // Without it, the verify API would return 503 on every beacon call.
  if (!ntfyTopic) {
    logDecision("skip visit_pending: no NTFY_TOPIC configured", { path })
    return NextResponse.next()
  }

  // Not httpOnly — client JS must read it to trigger the verification beacon.
  const response = NextResponse.next()
  response.cookies.set("visit_pending", crypto.randomUUID(), {
    maxAge: 300, // 5 minutes
    httpOnly: false,
    sameSite: "strict",
    secure: true,
    path: "/",
  })

  logDecision("set visit_pending cookie", { path })

  return response
}

export const config = {
  matcher: [
    /*
     * Match all page routes except:
     * - api          (API routes)
     * - _next/static (static chunks)
     * - _next/image  (image optimisation)
     * - assets       (public assets folder)
     * - Well-known files, static extensions, and media files
     */
    "/((?!api|_next/static|_next/image|assets|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|css|js|mp4|webm|ogg|m4v)$).*)",
    /*
     * Protected media files — re-admitted for referrer-based asset protection.
     * These are excluded by the first matcher but need to enter the proxy
     * so handleProtectedAsset can check the Referer header.
     */
    "/(.*\\.(?:mp4|webm|ogg|m4v|mp3|wav|flac))",
    /*
     * Protected specific files (Ren's reference letter images).
     * General images stay excluded (SEO, social preview, etc.).
     */
    "/ren-letter-preview.png",
    "/Ren-Reference-Letter-images-0.jpg",
    "/Ren-Reference-Letter-images-1.jpg",
  ],
}
