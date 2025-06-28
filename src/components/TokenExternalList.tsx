import Image from "next/image";
import React from "react";

export default function TokenExternalList({
  tokenAddress,
}: {
  tokenAddress: string;
}) {
  return (
    <div className="flex gap-2">
      {[
        {
          img: "/external/jup-logo.svg",
          link: `https://jup.ag/tokens/${tokenAddress}`,
        },
        {
          img: "/external/gmgn-logo.svg",
          link: `https://gmgn.ai/sol/token/${tokenAddress}`,
        },
        {
          img: "/external/dex-screener.svg",
          link: `https://dexscreener.com/solana/${tokenAddress}`,
        },

        {
          img: "/external/birdeye-logo.svg",
          link: `https://birdeye.so/token/${tokenAddress}`,
        },
      ].map((item) => (
        <a
          href={item.link}
          key={item.img}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={item.img}
            alt={item.img}
            width={20}
            height={20}
            className="rounded-full"
          />
        </a>
      ))}
    </div>
  );
}
