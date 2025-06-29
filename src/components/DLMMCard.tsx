import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PoolPair } from "@/lib/meteora-api";

// TokenInfo type for base/quote token metadata
interface TokenInfo {
  symbol: string;
  logoURI?: string;
}

interface DLMMPoolCardProps {
  pair: PoolPair;
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
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

export default function DLMMPoolCard({ pair, baseToken, quoteToken, onViewDetails }: DLMMPoolCardProps) {
  // No price change in PoolPair, so omit that
  return (
    <Card className="group relative min-w-[400px] h-full overflow-hidden transition-all duration-300 hover:shadow-lg border border-border/50 hover:border-border bg-muted/20 hover:bg-muted/40">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center -space-x-2">
              <Avatar className="size-8 border-2 border-background">
                {baseToken.logoURI ? (
                  <AvatarImage src={baseToken.logoURI} alt={baseToken.symbol} />
                ) : null}
                <AvatarFallback className="text-xs font-medium">
                  {(baseToken.symbol ?? "??").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <Avatar className="size-8 border-2 border-background">
                {quoteToken.logoURI ? (
                  <AvatarImage src={quoteToken.logoURI} alt={quoteToken.symbol} />
                ) : null}
                <AvatarFallback className="text-xs font-medium bg-muted">
                  {(quoteToken.symbol ?? "??").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground leading-none">
                {baseToken.symbol} / {quoteToken.symbol}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                DLMM
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-foreground">
              ${formatNumber(pair.current_price, 6)}
            </div>
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
              ${formatNumber(pair.liquidity || 0)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              24h Volume
            </p>
            <p className="text-base font-semibold text-foreground">
              ${formatNumber(pair.trade_volume_24h || 0)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              APR
            </p>
            <p className="text-base font-semibold text-foreground">
              {pair.apr ? `${formatNumber(pair.apr, 2)}%` : "N/A"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              24h Fees
            </p>
            <p className="text-base font-semibold text-foreground">
              ${formatNumber(pair.fees_24h || 0)}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-border/30">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                TVL Ratio (24h)
              </p>
              <p className="text-sm font-medium">
                {pair.fee_tvl_ratio?.hour_24 ? `${formatNumber(pair.fee_tvl_ratio.hour_24, 2)}%` : "N/A"}
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