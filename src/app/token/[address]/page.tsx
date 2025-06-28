import ProtectedRoute from "@/components/ProtectedRoute";
import PoolCard from "@/components/PoolCard";
import { getTokenInfo } from "@/lib/tokens";
import TokenExternalList from "@/components/TokenExternalList";
import PublicKeySpan from "@/components/PublicKeySpan";

export default async function TokenPage({
  params,
}: {
  params: { address: string };
}) {
  const tokenInfo = await getTokenInfo(params.address);

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between w-full border rounded-xl p-4 gap-4">
          {/* Logo etc */}
          <div className="flex items-center gap-4">
            <img
              src={tokenInfo.jupInfo.logoURI}
              alt={tokenInfo.jupInfo.name}
              width={50}
              height={50}
              className="rounded-full"
            />
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">{tokenInfo.jupInfo.name}</h1>
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  {tokenInfo.jupInfo.symbol}
                </p>
                <PublicKeySpan
                  publicKey={tokenInfo.jupInfo.address}
                  className="m-0"
                />
                <div className="flex items-center gap-2">
                  <TokenExternalList tokenAddress={tokenInfo.jupInfo.address} />
                </div>
              </div>
            </div>
          </div>
          {/*//TODO: Add token stats here */}
          <div className="flex items-center gap-4"></div>
        </div>

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
    </ProtectedRoute>
  );
}
