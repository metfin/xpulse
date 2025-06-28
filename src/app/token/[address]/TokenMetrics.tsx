"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DexScreenerService, Pair } from "@/lib/dexscreener";
import { JupService } from "@/lib/jup";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Timer,
} from "lucide-react";

interface TokenMetricsProps {
  tokenAddress: string;
}

export default function TokenMetrics({ tokenAddress }: TokenMetricsProps) {
  const { data: pairs, isLoading } = useQuery({
    queryKey: ["dexscreener-pairs", tokenAddress],
    queryFn: () => DexScreenerService.getTokensPairs([tokenAddress]),
    refetchInterval: 15000, // 30 seconds
  });

  const { data: jupPrice } = useQuery({
    queryKey: ["jup-price", tokenAddress],
    queryFn: () => JupService.getTokenPrice([tokenAddress]),
    refetchInterval: 10000, // 10 seconds
  });

  if (isLoading) {
    return (
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
    );
  }

  if (!pairs || pairs.length === 0) {
    return (
      <Card className="w-full h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="w-5 h-5" />
            Market Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No market data available
          </p>
        </CardContent>
      </Card>
    );
  }

  // Get the most liquid pair (highest liquidity)
  const primaryPair = pairs.reduce((prev, current) =>
    (current.liquidity?.usd || 0) > (prev.liquidity?.usd || 0) ? current : prev
  );

  // Aggregate data from all pairs
  const aggregatedData = pairs.reduce(
    (acc, pair) => {
      acc.totalVolume24h += pair.volume?.h24 || 0;
      acc.totalLiquidity += pair.liquidity?.usd || 0;
      acc.totalMarketCap = Math.max(acc.totalMarketCap, pair.marketCap || 0);
      acc.totalFDV = Math.max(acc.totalFDV, pair.fdv || 0);

      if (pair.txns?.h24) {
        acc.totalBuys24h += pair.txns.h24.buys || 0;
        acc.totalSells24h += pair.txns.h24.sells || 0;
      }

      return acc;
    },
    {
      totalVolume24h: 0,
      totalLiquidity: 0,
      totalMarketCap: 0,
      totalFDV: 0,
      totalBuys24h: 0,
      totalSells24h: 0,
    }
  );

  const currentPrice = jupPrice?.data?.[tokenAddress]?.price
    ? parseFloat(jupPrice.data[tokenAddress].price)
    : parseFloat(primaryPair.priceUsd || "0");

  const priceChange24h = primaryPair.priceChange?.h24 || 0;
  const buyVsSellRatio =
    aggregatedData.totalBuys24h / (aggregatedData.totalSells24h || 1);

  const formatNumber = (num: number, decimals = 2) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(decimals)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(decimals)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(decimals)}K`;
    return `$${num.toFixed(decimals)}`;
  };

  const formatPrice = (price: number) => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(2)}`;
  };

  const MetricCard = ({
    label,
    value,
    change,
    icon: Icon,
    trend,
  }: {
    label: string;
    value: string;
    change?: string;
    icon: any;
    trend?: "up" | "down" | "neutral";
  }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="w-4 h-4" />
        {label}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold">{value}</span>
        {change && (
          <div
            className={`flex items-center gap-1 text-sm ${
              trend === "up"
                ? "text-green-600 dark:text-green-400"
                : trend === "down"
                ? "text-red-600 dark:text-red-400"
                : "text-muted-foreground"
            }`}
          >
            {trend === "up" && <ArrowUpRight className="w-3 h-3" />}
            {trend === "down" && <ArrowDownRight className="w-3 h-3" />}
            {change}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg">
            <BarChart3 className="w-5 h-5" />
            Market Metrics
          </div>
          <Badge variant="outline" className="text-xs">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Section */}
        <MetricCard
          label="Current Price"
          value={formatPrice(currentPrice)}
          change={`${priceChange24h > 0 ? "+" : ""}${priceChange24h.toFixed(
            2
          )}%`}
          icon={DollarSign}
          trend={
            priceChange24h > 0 ? "up" : priceChange24h < 0 ? "down" : "neutral"
          }
        />

        {/* Volume & Market Cap */}
        <div className="grid grid-cols-2 gap-4">
          <MetricCard
            label="Volume 24h"
            value={formatNumber(aggregatedData.totalVolume24h)}
            icon={Activity}
          />
          <MetricCard
            label="Market Cap"
            value={formatNumber(aggregatedData.totalMarketCap)}
            icon={TrendingUp}
          />
        </div>

        {/* Trading Activity */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Timer className="w-4 h-4" />
            Trading Activity (24h)
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Buys</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {aggregatedData.totalBuys24h}
                </span>
                <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 dark:bg-green-400"
                    style={{
                      width: `${
                        (aggregatedData.totalBuys24h /
                          (aggregatedData.totalBuys24h +
                            aggregatedData.totalSells24h)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Sells</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {aggregatedData.totalSells24h}
                </span>
                <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 dark:bg-red-400"
                    style={{
                      width: `${
                        (aggregatedData.totalSells24h /
                          (aggregatedData.totalBuys24h +
                            aggregatedData.totalSells24h)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Buy/Sell Ratio</span>
                <Badge
                  variant={buyVsSellRatio > 1 ? "default" : "secondary"}
                  className="text-xs"
                >
                  {buyVsSellRatio.toFixed(2)}x
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <MetricCard
            label="Liquidity"
            value={formatNumber(aggregatedData.totalLiquidity)}
            icon={Activity}
          />
          <MetricCard
            label="FDV"
            value={formatNumber(aggregatedData.totalFDV)}
            icon={TrendingUp}
          />
        </div>

        {/* Trading Pairs Count */}
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Active Pairs</span>
            <span className="font-medium">{pairs.length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
