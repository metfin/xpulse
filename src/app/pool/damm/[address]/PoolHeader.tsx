import { DAMMPoolInfo } from "@/lib/meteora-api";
import { Card, CardContent } from "@/components/ui/card";
import PublicKeySpan from "@/components/PublicKeySpan";
import React from "react";

export default function PoolHeader({ poolInfo }: { poolInfo: DAMMPoolInfo }) {
  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatPercentage = (num: number) => {
    return `${(num * 100).toFixed(2)}%`;
  };

  return (
    <Card className="w-full">
      <CardContent className="p-1">
        <div className="flex justify-between items-start w-full">
          {/* Pool Details with Icons */}
          <div className="flex items-center gap-4">
            {/* Token Icons */}
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {poolInfo.token_a_symbol}
                </span>
              </div>
              
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {poolInfo.token_b_symbol}
                </span>
              </div>
            </div>
            
            {/* Pool Name and Address */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">{poolInfo.pool_name}</h1>
              <PublicKeySpan
                publicKey={poolInfo.pool_address}
                className="m-0"
              />
            </div>
          </div>
          
          {/* Metrics on the right side */}
          <div className="flex gap-25">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">TVL</span>
              <span className="text-lg font-semibold">
                {formatNumber(poolInfo.tvl)}
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">24h Volume</span>
              <span className="text-lg font-semibold">
                {formatNumber(poolInfo.volume24h)}
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">24h Fee/TVL</span>
              <span className="text-lg font-semibold">
                {(poolInfo.fee_tvl_ratio).toFixed(3)}%
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Permanently Locked</span>
              <span className="text-lg font-semibold">
                {poolInfo.permanent_lock_liquidity}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 