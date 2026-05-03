import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// HTTP headers are ByteString (ASCII only, 0–255). NFD normalization
// converts accented chars (Zürich → Zurich) before stripping the rest.
export const toAsciiSafe = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x00-\x7F]/g, "")
    .trim()

// Initialized once at module load; reused across all warm invocations.
export const REGION_NAMES = new Intl.DisplayNames(["en"], { type: "region" })

/** Extract geo location from Vercel's auto-injected headers. */
export function extractGeo(headers: Headers) {
  const rawCity = headers.get("x-vercel-ip-city") ?? ""
  const city = rawCity ? decodeURIComponent(rawCity) : ""
  const region = headers.get("x-vercel-ip-country-region") ?? ""
  const countryCode = headers.get("x-vercel-ip-country") ?? ""
  const countryName = countryCode
    ? (REGION_NAMES.of(countryCode) ?? countryCode)
    : ""
  // Prefer city; fall back to region code if city is unavailable
  const localPart = city || region
  const location =
    [localPart, countryName].filter(Boolean).join(", ") || "Unknown Location"
  return { city, region, countryCode, countryName, location }
}

/** Parse User-Agent into device type, browser name, and OS. */
export function parseUserAgent(ua: string) {
  const isMobile = /mobile|android|iphone|ipad|ipod/i.test(ua)
  const deviceType = isMobile ? "Mobile" : "Desktop"

  let browser = "Unknown"
  if (/edg\//i.test(ua)) browser = "Edge"
  else if (/chrome\//i.test(ua) && !/chromium/i.test(ua)) browser = "Chrome"
  else if (/firefox\//i.test(ua)) browser = "Firefox"
  else if (/safari\//i.test(ua)) browser = "Safari"

  let os = "Unknown"
  if (/windows/i.test(ua)) os = "Windows"
  else if (/android/i.test(ua)) os = "Android"
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS"
  else if (/mac os x|macintosh/i.test(ua)) os = "macOS"
  else if (/cros/i.test(ua)) os = "ChromeOS"
  else if (/linux/i.test(ua)) os = "Linux"

  // Detect impossible browser/OS combinations (spoofed UAs)
  const impossible =
    (browser === "Safari" && os === "Android") ||
    (browser === "Safari" && os === "Linux") ||
    (browser === "Safari" && os === "Windows") ||
    (browser === "Edge" && os === "iOS") ||
    (browser === "Edge" && os === "Android")

  return { deviceType, browser, os, impossible }
}

/** Parse referrer string, ignoring same-site navigations. */
export function parseReferrer(
  rawReferrer: string,
  ownHostnames: string[]
): string {
  if (!rawReferrer) return "Direct"
  try {
    const ref = new URL(rawReferrer)
    if (ownHostnames.some((h) => ref.hostname === h || ref.hostname === `www.${h}`)) {
      return "Direct"
    }
    return ref.hostname
  } catch {
    return rawReferrer
  }
}

export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateFromObj(
  input: Date,
  options?: { showPresent?: boolean }
): string {
  const date = new Date(input);
  if (options?.showPresent) {
    const now = new Date();
    if (
      date.getFullYear() > now.getFullYear() ||
      (date.getFullYear() === now.getFullYear() &&
        date.getMonth() >= now.getMonth())
    ) {
      return "Present";
    }
  }
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}
