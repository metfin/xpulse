//DLMM


export interface AllDLMMPoolsByTokenResponse {
    groups: PoolGroup[];
  }
  
  export interface PoolGroup {
    name: string;
    pairs: DLMMPoolPair[];
  }
  
  export interface DLMMPoolPair {
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


//DAMM


export interface DAMMPoolsByTokenResponse {
  status: number;
  total: number;
  pages: number;
  current_page: number;
  data: DAMMPoolGroup[];
}

export interface DAMMPoolGroup {
  group_name: string;
  updated_at: number;
  total_tvl: number;
  max_fee_tvl_ratio: number;
  max_apr: number;
  total_volume24h: number;
  total_fee24h: number;
  pools: DAMMPoolInfoLite[];
}

export interface DAMMPoolInfoLite {
  pool_address: string;
  pool_name: string;
  token_a_mint: string;
  token_b_mint: string;
  token_a_symbol: string;
  token_b_symbol: string;
  sqrt_min_price: string;
  sqrt_max_price: string;
  min_price: string;
  max_price: string;
  updated_at: number;
  tvl: number;
  apr: number;
  fee_tvl_ratio: number;
  fee24h: number;
  volume24h: number;
  base_fee: number;
  dynamic_fee: number;
  collect_fee_mode: number;
  fee_scheduler_mode: number;
  launchpad: any;
}

export interface DAMMPoolInfo {
  pool_address: string;
  pool_name: string;
  creator: string;
  token_a_mint: string;
  token_b_mint: string;
  token_a_vault: string;
  token_b_vault: string;
  token_a_symbol: string;
  token_b_symbol: string;
  alpha_vault: string;
  sqrt_min_price: string;
  sqrt_max_price: string;
  min_price: string;
  max_price: string;
  liquidity: string;
  permanent_lock_liquidity: string;
  sqrt_price: number;
  token_a_amount: number;
  token_b_amount: number;
  token_a_amount_usd: number;
  token_b_amount_usd: number;
  pool_price: number;
  virtual_price: number;
  pool_type: number;
  created_at_slot: number;
  created_at_slot_timestamp: number;
  updated_at: number;
  tvl: number;
  apr: number;
  fee_tvl_ratio: number;
  fee24h: number;
  volume24h: number;
  base_fee: number;
  dynamic_fee: number;
  fee_scheduler_mode: number;
  collect_fee_mode: number;
  launchpad: any;
}


