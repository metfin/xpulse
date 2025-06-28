import ProtectedRoute from "@/components/ProtectedRoute";
import { getTokenInfo } from "@/lib/tokens";
import TokenHeader from "./TokenHeader";
import PoolList from "./PoolList";
import GMGNGraph from "./GMGNGraph";

export default async function TokenPage({
  params,
}: {
  params: { address: string };
}) {
  const tokenInfo = await getTokenInfo(params.address);

  return (
    <ProtectedRoute>
      <div className="w-full h-full space-y-8">
        <TokenHeader tokenInfo={tokenInfo} />
        <GMGNGraph address={params.address} />
        <PoolList tokenInfo={tokenInfo} />
      </div>
    </ProtectedRoute>
  );
}
