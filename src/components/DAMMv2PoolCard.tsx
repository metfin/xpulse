import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pair } from "@/lib/dexscreener";

interface PoolCardProps {
  pair: Pair;
  onViewDetails?: () => void;
}

function formatNumber(num: number | string, decimals: number = 2): string {
  const value = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(value)) return "0";

  if (value >= 1e9) return `${(value / 1e9).toFixed(decimals)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(decimals)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(decimals)}K`;
  return value.toFixed(decimals);
}

function formatPercentage(num: number | null | undefined): string {
  if (num === null || num === undefined || isNaN(num)) return "N/A";
  const sign = num >= 0 ? "+" : "";
  return `${sign}${num.toFixed(2)}%`;
}

export default function PoolCard({ pair, onViewDetails }: PoolCardProps) {
  const priceChange24h = pair.priceChange?.h24;
  const isPricePositive = priceChange24h && priceChange24h >= 0;

  return (
    <Card className="group relative min-w-[400px] h-full overflow-hidden transition-all duration-300 hover:shadow-lg border border-border/50 hover:border-border bg-muted/20 hover:bg-muted/40">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center -space-x-2">
              <Avatar className="size-8 border-2 border-background">
                <AvatarImage
                  src={pair.info?.imageUrl}
                  alt={pair.baseToken.symbol}
                />
                <AvatarFallback className="text-xs font-medium">
                  {pair.baseToken.symbol.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <Avatar className="size-8 border-2 border-background">
                <AvatarFallback className="text-xs font-medium bg-muted">
                  {pair.quoteToken.symbol.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground leading-none">
                {pair.baseToken.symbol} / {pair.quoteToken.symbol}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {pair.labels[0] === "DYN2" && "DAMMv2"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-foreground">
              ${formatNumber(pair.priceUsd, 6)}
            </div>
            {priceChange24h !== undefined && (
              <div
                className={`text-sm font-medium ${
                  isPricePositive
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {formatPercentage(priceChange24h)}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Liquidity
            </p>
            <p className="text-base font-semibold text-foreground">
              ${formatNumber(pair.liquidity?.usd || 0)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              24h Volume
            </p>
            <p className="text-base font-semibold text-foreground">
              ${formatNumber(pair.volume?.h24 || 0)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Market Cap
            </p>
            <p className="text-base font-semibold text-foreground">
              ${formatNumber(pair.marketCap || 0)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              24h Txns
            </p>
            <p className="text-base font-semibold text-foreground">
              {(pair.txns?.h24?.buys || 0) + (pair.txns?.h24?.sells || 0)}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-border/30">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                6h Change
              </p>
              <p
                className={`text-sm font-medium ${
                  pair.priceChange?.h6 && pair.priceChange.h6 >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {formatPercentage(pair.priceChange?.h6)}
              </p>
            </div>
            {onViewDetails && (
              <Button
                variant="outline"
                size="sm"
                onClick={onViewDetails}
                className="shrink-0"
              >
                View Details
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
