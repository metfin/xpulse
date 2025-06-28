import PoolCard from "@/components/PoolCard";
import { TokenInfo } from "@/lib/tokens";
import React from "react";

export default function PoolList({ tokenInfo }: { tokenInfo: TokenInfo }) {
  return (
    <div className="space-y-8">
      {/* Pool List */}
      <div className="w-full border rounded-xl p-4 gap-4 space-y-4">
        <h2 className="text-2xl font-bold">Pools</h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide bg-accent p-4 rounded-xl">
          {tokenInfo.dexscreenerInfo?.map((pool) => (
            <div key={pool.pairAddress}>
              <PoolCard pair={pool} />
            </div>
          ))}
          {tokenInfo.dexscreenerInfo?.length === 0 && (
            <p className="text-sm text-muted-foreground">No pools found</p>
          )}
        </div>
      </div>
    </div>
  );
}
