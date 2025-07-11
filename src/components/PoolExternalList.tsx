import Image from "next/image";
import React from "react";

export function DAMMV2PoolExternalList({
  poolAddress,
}: {
  poolAddress: string;
}) {
  return (
    <div className="flex gap-2">
      {[
        {
            img: `/external/meteora-logo.svg`,
            link: `https://v2.meteora.ag/damm/${poolAddress}`
        }
          
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
            width={25}
            height={25}
            className="rounded-full"
          />
        </a>
      ))}
    </div>
  );
}

export function DLMMPoolExternalList({
  poolAddress,
}: {
  poolAddress: string;
}) {
  return (
    <div className="flex gap-2">
      {[
        {
            img: `/external/meteora-logo.svg`,
            link: `https://v2.meteora.ag/dlmm/${poolAddress}`
        }
          
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
            width={25}
            height={25}
            className="rounded-full"
          />
        </a>
      ))}
    </div>
  );
}
