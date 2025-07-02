import { fetchClient } from "./utils";
import { AllDLMMPoolsByTokenResponse, DAMMPoolsByTokenResponse } from "./types";
import { DLMMPoolPair } from "./types";
import { DAMMPoolInfo } from "./types";

export class DAMMService {
  private static readonly DAMM_API_BASE = "https://dammv2-api.meteora.ag";

  async getDAMMPoolInfo(poolAddress: string) {
    const response = await fetchClient<DAMMPoolInfo>(
      `${DAMMService.DAMM_API_BASE}/pools/${poolAddress}`
    );
    return response;
  }
  async getDAMMpoolByToken(tokenAddress: string) {
    const response = await fetchClient<DAMMPoolsByTokenResponse>(
      `${DAMMService.DAMM_API_BASE}/pools/grouped?token_a_mint=${tokenAddress}&order_by=total_tvl&order=asc&pool_order_by=tvl&pool_order=asc&limit=50&offset=0`
    );
    return response;
  } 
}

export class DLMMService {
  private static readonly DLMM_API_BASE = "https://dlmm-api.meteora.ag";

  async getPoolInfo(pairAddress: string) {
    const response = await fetchClient<DLMMPoolPair>(
      `${DLMMService.DLMM_API_BASE}/pair/${pairAddress}`
    );
    return response;
  }

  async getPositionInfo(positionAddress: string, v2: boolean = false) {
    const response = await fetchClient<DLMMPoolPair>(
      `${DLMMService.DLMM_API_BASE}/position${
        v2 ? "_v2" : ""
      }/${positionAddress}`
    );
    return response;
  }
  async getAllPoolsByToken(tokenaddress: string){
    const response = await fetchClient<AllDLMMPoolsByTokenResponse>(
      `${DLMMService.DLMM_API_BASE}/pair/all_by_groups?include_token_mints=${tokenaddress}`
    );
    return response;
  }
}
