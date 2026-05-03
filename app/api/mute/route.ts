import { NextResponse } from "next/server"

export function GET() {
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Notifications Muted</title>
    <style>
      body {
        font-family: system-ui, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100dvh;
        margin: 0;
        background: #f9f9f7;
        color: #1a1a1a;
      }
      .card {
        text-align: center;
        padding: 2.5rem 3rem;
        background: #fff;
        border-radius: 16px;
        border: 1px solid #e5e5e5;
        box-shadow: 0 2px 12px rgba(0,0,0,0.06);
      }
      .icon { font-size: 3rem; margin: 0; line-height: 1; }
      h1 { margin: 1rem 0 0.5rem; font-size: 1.25rem; font-weight: 600; }
      p { margin: 0; color: #666; font-size: 0.9rem; }
    </style>
  </head>
  <body>
    <div class="card">
      <p class="icon">🔕</p>
      <h1>Notifications muted</h1>
      <p>Visitor alerts are silenced on this device and browser.</p>
    </div>
  </body>
</html>`

  const response = new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html" },
  })

  response.cookies.set("mute_notifications", "true", {
    maxAge: 60 * 60 * 24 * 6, // 6 days, used to be 1 year
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    path: "/",
  })

  return response
}
