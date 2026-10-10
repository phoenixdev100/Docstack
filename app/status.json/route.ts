import { NextResponse } from "next/server";

/**
 * Docs-site status endpoint - in production this proxies the status page API.
 * Swap the static payload for a fetch to your status provider.
 */
export function GET() {
  return NextResponse.json({
    status: "operational", // operational | degraded | outage
    message: "All systems operational",
    updated_at: new Date().toISOString(),
  });
}
