import { ImageResponse } from "next/og";
import React from "react";

export const runtime = "edge";
export const alt = "Nicolas Steinberg";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 200,
          background: "#0D0D0D",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia, serif",
          color: "#B8860B",
          letterSpacing: 20,
        }}
      >
        NS
      </div>
    ),
    { ...size }
  );
}
