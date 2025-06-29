import ProtectedRoute from "@/components/ProtectedRoute";
import { getTokenInfo } from "@/lib/tokens";
import TokenHeader from "./TokenHeader";
import GMGNGraph from "./GMGNGraph";
import RugCheckInfo from "./RugCheckInfo";
import TokenMetrics from "./TokenMetrics";
import TopHolders from "./TopHolders";
import SocialLinks from "./SocialLinks";
import DAMMv2PoolList from "./PoolList";

export default async function TokenPage({
  params,
}: {
  params: { address: string };
}) {
  const tokenInfo = await getTokenInfo(params.address);

  return (
    <ProtectedRoute>
      <div className="w-full min-h-screen p-6 space-y-8">
        <TokenHeader tokenInfo={tokenInfo} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <GMGNGraph address={params.address} />
          </div>
          <div className="space-y-8">
            <TokenMetrics tokenAddress={params.address} />
          </div>
        </div>
        <DAMMv2PoolList tokenInfo={tokenInfo} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <RugCheckInfo tokenAddress={params.address} />
          <TopHolders tokenAddress={params.address} />
          <SocialLinks tokenAddress={params.address} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
