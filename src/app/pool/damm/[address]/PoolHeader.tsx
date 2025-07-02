"use client";

import { DAMMPoolInfo } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PublicKeySpan from "@/components/PublicKeySpan";
import React from "react";
import { JupService} from "@/lib/jup";
import { useQuery } from "@tanstack/react-query";
import { BarChart3 } from "lucide-react";
import { DAMMV2PoolExternalList } from "@/components/PoolExternalList";

export default function PoolHeader({ poolInfo }: { poolInfo: DAMMPoolInfo }) {
  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };
  const {data: Tokens, isLoading } = useQuery({
    queryKey: ['Tokens', poolInfo.token_a_mint , poolInfo.token_b_mint],
    queryFn: async () => {
      const [a, b] = await Promise.all([
        JupService.getTokenInfo(poolInfo.token_a_mint),
        JupService.getTokenInfo(poolInfo.token_b_mint)
      ]);
      
      return { a, b };
    },
    refetchInterval: 15000, // 30 seconds
})

if(isLoading){
  return(
    <Card className="w-full h-full">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-lg">
        <BarChart3 className="w-5 h-5" />
        Market Metrics
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
  )
}
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
              <div className="w-12 h-12 rounded-full flex items-center justify-center">
                {Tokens?.a?.logoURI ? (
                  <img
                    src={Tokens.a.logoURI}
                    alt="Token A Logo"
                    className="w-10 h-10 rounded-full object-contain"
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-600">?</span>
                )}
              </div>
              
              <div className="w-12 h-12 rounded-full flex items-center justify-center">
                {Tokens?.b?.logoURI ? (
                  <img
                    src={Tokens.b.logoURI}
                    alt="Token B Logo"
                    className="w-10 h-10 rounded-full object-contain"
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-600">?</span>
                )}
              </div>
            </div>
            
            {/* Pool Name and Address */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{poolInfo.pool_name}</h1>
                {/* Meteora button to the right of the pool name */}
                <DAMMV2PoolExternalList poolAddress={poolInfo.pool_address} />
              </div>
              <PublicKeySpan
                publicKey={poolInfo.pool_address}
                className="m-0 text-[10px] px-1 py-0.5 rounded bg-muted"
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