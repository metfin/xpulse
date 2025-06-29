import { fetchClient } from "./utils";

export interface DAMMPoolInfoResponse {
  status: number;
  error?: string;
  data: DAMMPoolInfo;
}

export interface DAMMPoolInfo {
  alpha_vault: string;
  apr: number;
  base_fee: number;
  collect_fee_mode: number;
  created_at_slot: number;
  created_at_slot_timestamp: number;
  creator: string;
  dynamic_fee: number;
  fee24h: number;
  fee_scheduler_mode: number;
  fee_tvl_ratio: number;
  launchpad: string;
  liquidity: string;
  max_price: string;
  min_price: string;
  permanent_lock_liquidity: string;
  pool_address: string;
  pool_name: string;
  pool_price: number;
  pool_type: number;
  sqrt_max_price: string;
  sqrt_min_price: string;
  sqrt_price: number;
  token_a_amount: number;
  token_a_amount_usd: number;
  token_a_mint: string;
  token_a_symbol: string;
  token_a_vault: string;
  token_b_amount: number;
  token_b_amount_usd: number;
  token_b_mint: string;
  token_b_symbol: string;
  token_b_vault: string;
  tvl: number;
  updated_at: number;
  virtual_price: number;
  volume24h: number;
}

export class DAMMService {
  private static readonly DAMM_API_BASE = "https://dammv2-api.meteora.ag";

  async getDAMMPoolInfo(poolAddress: string) {
    const response = await fetchClient<DAMMPoolInfoResponse>(
      `${DAMMService.DAMM_API_BASE}/pools/${poolAddress}`
    );
    if (response.error) {
      throw new Error(response.error);
    }
    return response;
  }
}

export class DLMMService {
  private static readonly DLMM_API_BASE = "https://dlmm-api.meteora.ag";

  async getPoolInfo(pairAddress: string) {
    const response = await fetchClient<DAMMPoolInfoResponse>(
      `${DLMMService.DLMM_API_BASE}/pair/${pairAddress}`
    );
    if (response.error) {
      throw new Error(response.error);
    }
    return response;
  }

  async getPositionInfo(positionAddress: string, v2: boolean = false) {
    const response = await fetchClient<DAMMPoolInfoResponse>(
      `${DLMMService.DLMM_API_BASE}/position${
        v2 ? "_v2" : ""
      }/${positionAddress}`
    );
    if (response.error) {
      throw new Error(response.error);
    }
    return response;
  }
}
