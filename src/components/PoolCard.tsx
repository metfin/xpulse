import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PoolCardProps {
  tokenA: string;
  tokenB: string;
  tvl: string;
  volume24h: string;
  fee: string;
  apr: string;
}

export default function PoolCard({
  tokenA,
  tokenB,
  tvl,
  volume24h,
  fee,
  apr,
}: PoolCardProps) {
  return (
    <Card className="min-w-[280px] hover:shadow-lg transition-all duration-200 border border-border/50 hover:border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground">
          {tokenA} / {tokenB}
        </CardTitle>
        <div className="text-sm text-muted-foreground">Fee: {fee}%</div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground">TVL</div>
            <div className="text-sm font-medium">${tvl}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">24h Volume</div>
            <div className="text-sm font-medium">${volume24h}</div>
          </div>
        </div>
        <div className="pt-2 border-t border-border/30">
          <div className="text-xs text-muted-foreground">APR</div>
          <div className="text-lg font-semibold text-green-500">{apr}%</div>
        </div>
      </CardContent>
    </Card>
  );
}
