import Image from "next/image";
import React from "react";

export default function TokenExternalList({
  tokenAddress,
}: {
  tokenAddress: string;
}) {
  return (
    <div>
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
    </div>
  );
}
