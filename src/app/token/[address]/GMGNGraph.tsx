"use client";

import React from "react";
import { useTheme } from "next-themes";

export default function GMGNGraph({ address }: { address: string }) {
  const { theme, resolvedTheme } = useTheme();

  // Use resolvedTheme for system theme or fallback to theme, default to light
  const gmgnTheme = (resolvedTheme || theme) === "dark" ? "dark" : "light";
  const gmgnUrl = `https://www.gmgn.cc/kline/sol/${address}?theme=${gmgnTheme}`;

  return (
    <div className="flex justify-between w-full border rounded-xl gap-4">
      <iframe
        src={gmgnUrl}
        className="w-full h-130 rounded-xl"
        allowFullScreen
        title={`GMGN Chart for ${address}`}
      />
    </div>
  );
}
