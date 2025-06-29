import ProtectedRoute from "@/components/ProtectedRoute";
import { DAMMService } from "@/lib/meteora-api";
import PoolHeader from "./PoolHeader";
import GMGNGraph from "./GMGNGraph";
import PoolMetrics from "./PoolMetrics";

export default async function DAMMPoolPage({
  params,
}: {
  params: { address: string };
}) {
  const dammService = new DAMMService();
  const poolResponse = await dammService.getDAMMPoolInfo(params.address);
  const poolInfo = poolResponse.data;

  return (
    <ProtectedRoute>
      <div className="w-full min-h-screen p-6 space-y-8">
        <PoolHeader poolInfo={poolInfo} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <GMGNGraph address={poolInfo.token_a_mint} />
          </div>
          <div className="space-y-8">
            <PoolMetrics poolInfo={poolInfo} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
