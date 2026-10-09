import path from "node:path";
import fs from "node:fs/promises";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} Documentation`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await fs.readFile(
    path.join(process.cwd(), "public", "icon-512.png")
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#0f0f12",
          color: "#f4f4f5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <img src={logoSrc} width={72} height={72} alt="" />
          <span style={{ fontSize: "40px", fontWeight: 600 }}>{site.name}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <span
            style={{
              fontSize: "72px",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            Documentation
          </span>
          <span style={{ fontSize: "28px", color: "#a1a1aa" }}>
            Guides, API reference, and SDKs for {site.product}.
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "24px",
            color: "#71717a",
          }}
        >
          <span>{site.url.replace("https://", "")}</span>
          <span
            style={{
              padding: "8px 20px",
              border: "1px solid #3f3f46",
              borderRadius: "8px",
              color: "#a1a1aa",
            }}
          >
            v2
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
