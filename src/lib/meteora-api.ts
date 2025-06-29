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

export interface AllPoolsByTokenResponse {
  groups: PoolGroup[];
}

export interface PoolGroup {
  name: string;
  pairs: PoolPair[];
}

export interface PoolPair {
  address: string;
  apr: number;
  apy: number;
  base_fee_percentage: string;
  bin_step: number;
  cumulative_fee_volume: string;
  cumulative_trade_volume: string;
  current_price: number;
  farm_apr: number;
  farm_apy: number;
  fee_tvl_ratio: FeeTvlRatio;
  fees: Fees;
  fees_24h: number;
  hide: boolean;
  is_blacklisted: boolean;
  launchpad: string;
  liquidity: string;
  max_fee_percentage: string;
  mint_x: string;
  mint_y: string;
  name: string;
  protocol_fee_percentage: string;
  reserve_x: string;
  reserve_x_amount: number;
  reserve_y: string;
  reserve_y_amount: number;
  reward_mint_x: string;
  reward_mint_y: string;
  tags: string[];
  today_fees: number;
  trade_volume_24h: number;
  volume: any; // Type unknown, please specify if possible
}

export interface FeeTvlRatio {
  hour_1: number;
  hour_12: number;
  hour_2: number;
  hour_24: number;
  hour_4: number;
  min_30: number;
}

export interface Fees {
  hour_1: number;
  hour_12: number;
  hour_2: number;
  hour_24: number;
  hour_4: number;
  min_30: number;
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
  async getAllPoolsByToken(tokenaddress: string){
    const response = await fetchClient<AllPoolsByTokenResponse>(
      `${DLMMService.DLMM_API_BASE}/pair/all_by_groups?include_token_mints=${tokenaddress}`
    );
    return response;
  }
}
