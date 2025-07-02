import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DAMMPoolInfoLite } from "@/lib/types";
import { DAMMV2PoolExternalList } from "@/components/PoolExternalList";
import Link from "next/link";

interface PoolCardProps {
  pair: DAMMPoolInfoLite;
  onViewDetails?: () => void;
  DAMMPoolInfo?: any;
}


function formatNumber(num: number | string, decimals: number = 2): string {
  const value = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(value)) return "0";

  if (value >= 1e9) return `${(value / 1e9).toFixed(decimals)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(decimals)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(decimals)}K`;
  return value.toFixed(decimals);
}

export default function DAMMv2PoolCard({ pair, onViewDetails, DAMMPoolInfo }: PoolCardProps) {
  const price = parseFloat(pair.min_price);

  return (
    <Card className="group relative min-w-[400px] h-full overflow-hidden transition-all duration-300 hover:shadow-lg border border-border/50 hover:border-border bg-muted/20 hover:bg-muted/40">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center -space-x-2">
              <Avatar className="size-8 border-2 border-background">
                <AvatarFallback className="text-xs font-medium">
                  {pair.token_a_symbol}
                </AvatarFallback>
              </Avatar>
              <Avatar className="size-8 border-2 border-background">
                <AvatarFallback className="text-xs font-medium bg-muted">
                  {pair.token_b_symbol}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground leading-none">
                <Link
                  href={`/pool/damm/${pair.pool_address}`}
                  target="_"
                  className="hover:underline underline-offset-4 transition-colors"
                >
                  {pair.token_a_symbol} / {pair.token_b_symbol}
                </Link>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                DAMMv2
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-foreground">
              ${formatNumber(price, 6)}
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
              ${formatNumber(pair.tvl || 0)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              24h Volume
            </p>
            <p className="text-base font-semibold text-foreground">
              ${formatNumber(pair.volume24h || 0)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              APR
            </p>
            <p className="text-base font-semibold text-foreground">
              {formatNumber(pair.apr || 0)}%
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              24h Fees
            </p>
            <p className="text-base font-semibold text-foreground">
              ${formatNumber(pair.fee24h || 0)}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-border/30">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Fee/TVL Ratio
              </p>
              <p className="text-sm font-medium">
                {formatNumber(pair.fee_tvl_ratio || 0)}
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
            <div className="absolute bottom-3 right-3">
              <DAMMV2PoolExternalList poolAddress={pair.pool_address} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
