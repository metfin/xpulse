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
      ].map((item) => (
        <a href={item.link} target="_blank" rel="noopener noreferrer">
          <Image
            src={item.img}
            alt={item.img}
            width={20}
            height={20}
            className="rounded-full"
          />
        </a>
      ))}
      {[
        {
          img: "/external/gmgn-logo.svg",
          link: `https://gmgn.ai/sol/token/${tokenAddress}`,
        },
      ].map((item) => (
        <a href={item.link} target="_blank" rel="noopener noreferrer" className="mt-1">
          <Image
            src={item.img}
            alt={item.img}
            width={50}
            height={20}
            className="rounded-full"
          />
        </a>
      ))}
       {[
        {
          img: "/external/dex-screener.svg",
          link: `https://dexscreener.com/solana/${tokenAddress}`,
        },
      ].map((item) => (
        <a href={item.link} target="_blank" rel="noopener noreferrer">
          <Image
            src={item.img}
            alt={item.img}
            width={18}
            height={18}
            className="rounded-full"
          />
        </a>
      ))}
      {[
        {
          img: "/external/birdeye-logo.svg",
          link: `https://birdeye.so/token${tokenAddress}`,
        },
      ].map((item) => (
        <a href={item.link} target="_blank" rel="noopener noreferrer "className="mt-1">
          <Image
            src={item.img}
            alt={item.img}
            width={50}
            height={20}
            className="rounded-full"
          />
        </a>
      ))}
       {[
        {
          img: "/external/bubblemaps-logo.svg",
          link: `https://app.bubblemaps.io/sol/token/${tokenAddress}`,
        },
      ].map((item) => (
        <a href={item.link} target="_blank" rel="noopener noreferrer">
          <Image
            src={item.img}
            alt={item.img}
            width={25}
            height={20}
            className="rounded-full"
          />
        </a>
      ))}
      
    </div>
  );
}
