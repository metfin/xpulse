"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

export default function PublicKeySpan({
  publicKey,
  className,
}: {
  publicKey: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <span
      className={cn(
        "text-xs text-muted-foreground px-2 py-1 rounded-md bg-muted cursor-pointer mx-1 w-fit font-mono transition-all min-w-0",
        className
      )}
      onClick={() => {
        navigator.clipboard.writeText(publicKey.toString());
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      }}
    >
      {copied ? "Copied!" : `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`}
    </span>
  );
}
