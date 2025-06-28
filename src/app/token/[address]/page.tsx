import ProtectedRoute from "@/components/ProtectedRoute";
import PoolCard from "@/components/PoolCard";

export default async function TokenPage({
  params,
}: {
  params: { address: string };
}) {
  // Mock data for pools - this would typically come from an API
  const mockPools = [
    {
      tokenA: "SOL",
      tokenB: "USDC",
      tvl: "1,250,000",
      volume24h: "450,000",
      fee: "0.3",
      apr: "12.5",
    },
    {
      tokenA: "SOL",
      tokenB: "USDT",
      tvl: "890,000",
      volume24h: "320,000",
      fee: "0.3",
      apr: "8.7",
    },
    {
      tokenA: "SOL",
      tokenB: "BONK",
      tvl: "567,000",
      volume24h: "180,000",
      fee: "1.0",
      apr: "24.3",
    },
    {
      tokenA: "SOL",
      tokenB: "WIF",
      tvl: "234,000",
      volume24h: "95,000",
      fee: "1.0",
      apr: "18.9",
    },
    {
      tokenA: "SOL",
      tokenB: "JUP",
      tvl: "789,000",
      volume24h: "275,000",
      fee: "0.3",
      apr: "15.2",
    },
  ];

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        {/* Header Section - Full Width */}
        <div className="w-full bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-8 border border-border/30">
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Token Details
              </h1>
              <p className="text-muted-foreground mt-2">
                Address: {params.address}
              </p>
            </div>

            {/* Token Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Price</div>
                <div className="text-xl font-semibold">$0.0234</div>
                <div className="text-xs text-green-500">+5.67%</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Market Cap</div>
                <div className="text-xl font-semibold">$45.2M</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">24h Volume</div>
                <div className="text-xl font-semibold">$1.8M</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">
                  Total Supply
                </div>
                <div className="text-xl font-semibold">1.5B</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pools Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Pools</h2>
            <p className="text-muted-foreground mt-1">
              Liquidity pools containing this token
            </p>
          </div>

          {/* Horizontal Scrollable Pool Cards */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
              {mockPools.map((pool, index) => (
                <PoolCard
                  key={index}
                  tokenA={pool.tokenA}
                  tokenB={pool.tokenB}
                  tvl={pool.tvl}
                  volume24h={pool.volume24h}
                  fee={pool.fee}
                  apr={pool.apr}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
