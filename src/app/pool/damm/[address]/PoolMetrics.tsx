import { TrendingUp, DollarSign, Activity, Percent } from "lucide-react";
import { DAMMPoolInfo } from "@/lib/meteora-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PublicKeySpan from "@/components/PublicKeySpan";
import React from "react";

export default function PoolMetrics({ poolInfo }: { poolInfo: DAMMPoolInfo }) {
  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatPercentage = (num: number) => {
    return `${(num * 100).toFixed(2)}%`;
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(6)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Pool Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pool Overview */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Pool Price</span>
              <p className="text-lg font-semibold">{formatPrice(poolInfo.pool_price)}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Virtual Price</span>
              <p className="text-lg font-semibold">{formatPrice(poolInfo.virtual_price)}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">APR</span>
              <p className="text-lg font-semibold text-green-600">{formatPercentage(poolInfo.apr)}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">24h Fees</span>
              <p className="text-lg font-semibold">{formatNumber(poolInfo.fee24h)}</p>
            </div>
          </div>
        </div>

        {/* Token Information */}
        <div className="space-y-4 pt-4 border-t">
          {/* Token A */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{poolInfo.token_a_symbol}</Badge>
                <span className="text-sm text-muted-foreground">{poolInfo.token_a_symbol}</span>
                <PublicKeySpan publicKey={poolInfo.token_a_mint} className="text-xs" />
              </div>
              <p className="font-medium">{poolInfo.token_a_amount.toLocaleString()}</p>
            </div>
          </div>

          {/* Token B */}
          <div className="space-y-2 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{poolInfo.token_b_symbol}</Badge>
                <span className="text-sm text-muted-foreground">{poolInfo.token_b_symbol}</span>
                <PublicKeySpan publicKey={poolInfo.token_b_mint} className="text-xs" />
              </div>
              <p className="font-medium">{poolInfo.token_b_amount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Pool Configuration */}
        <div className="space-y-4 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Base Fee</span>
              <p className="font-semibold">{formatPercentage(poolInfo.base_fee)}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Dynamic Fee</span>
              <p className="font-semibold">{formatPercentage(poolInfo.dynamic_fee)}</p>
            </div>
          </div>
          
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Creator:</span>
                <PublicKeySpan publicKey={poolInfo.creator} className="text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Created:</span>
                <span className="text-sm font-medium">{formatDate(poolInfo.created_at_slot_timestamp)}</span>
              </div>
            </div>
          </div>


        {/* Additional Metrics */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Pool Type</span>
              <p className="font-semibold">{poolInfo.pool_type === 0 ? "Linear" : "Exponential"}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Collect Fee Mode</span>
              <p className="font-semibold">{poolInfo.collect_fee_mode === 1 ? "Quote" : "Quote+Base"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 