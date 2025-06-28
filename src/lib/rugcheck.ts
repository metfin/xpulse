import { fetchClient } from "./utils";

export class RugCheckService {
  private static readonly RUGCHECK_API_BASE = "https://api.rugcheck.xyz/v1";

  static async getTokenReport(tokenMint: string): Promise<TokenCheck | null> {
    try {
      const response = await fetchClient<TokenCheck>(
        `${RugCheckService.RUGCHECK_API_BASE}/tokens/${tokenMint}/report`
      );
      return response;
    } catch (error) {
      console.error(`Failed to get token report for ${tokenMint}:`, error);
      return null;
    }
  }

  static async getTokenReportSummary(
    tokenMint: string,
    cacheOnly?: boolean
  ): Promise<TokenCheckSummary | null> {
    try {
      const params = cacheOnly ? "?cacheOnly=true" : "";
      const response = await fetchClient<TokenCheckSummary>(
        `${RugCheckService.RUGCHECK_API_BASE}/tokens/${tokenMint}/report/summary${params}`
      );
      return response;
    } catch (error) {
      console.error(
        `Failed to get token report summary for ${tokenMint}:`,
        error
      );
      return null;
    }
  }

  static async getTokenVotes(tokenMint: string): Promise<VoteResponse | null> {
    try {
      const response = await fetchClient<VoteResponse>(
        `${RugCheckService.RUGCHECK_API_BASE}/tokens/${tokenMint}/votes`
      );
      return response;
    } catch (error) {
      console.error(`Failed to get token votes for ${tokenMint}:`, error);
      return null;
    }
  }

  static async getTokenLockers(
    tokenMint: string
  ): Promise<VaultResponse | null> {
    try {
      const response = await fetchClient<VaultResponse>(
        `${RugCheckService.RUGCHECK_API_BASE}/tokens/${tokenMint}/lockers`
      );
      return response;
    } catch (error) {
      console.error(`Failed to get token lockers for ${tokenMint}:`, error);
      return null;
    }
  }

  static async getTrendingTokens(): Promise<TrendingToken[] | null> {
    try {
      const response = await fetchClient<TrendingToken[]>(
        `${RugCheckService.RUGCHECK_API_BASE}/stats/trending`
      );
      return response;
    } catch (error) {
      console.error("Failed to get trending tokens:", error);
      return null;
    }
  }

  static async getRecentTokens(): Promise<TokenInfoAgg[] | null> {
    try {
      const response = await fetchClient<TokenInfoAgg[]>(
        `${RugCheckService.RUGCHECK_API_BASE}/stats/recent`
      );
      return response;
    } catch (error) {
      console.error("Failed to get recent tokens:", error);
      return null;
    }
  }

  static async getNewTokens(): Promise<Token[] | null> {
    try {
      const response = await fetchClient<Token[]>(
        `${RugCheckService.RUGCHECK_API_BASE}/stats/new_tokens`
      );
      return response;
    } catch (error) {
      console.error("Failed to get new tokens:", error);
      return null;
    }
  }

  static async getVerifiedTokens(): Promise<VerifiedToken[] | null> {
    try {
      const response = await fetchClient<VerifiedToken[]>(
        `${RugCheckService.RUGCHECK_API_BASE}/stats/verified`
      );
      return response;
    } catch (error) {
      console.error("Failed to get verified tokens:", error);
      return null;
    }
  }

  static async getLeaderboard(
    page: number = 0,
    limit: number = 50
  ): Promise<User[] | null> {
    try {
      const response = await fetchClient<User[]>(
        `${RugCheckService.RUGCHECK_API_BASE}/leaderboard?page=${page}&limit=${limit}`
      );
      return response;
    } catch (error) {
      console.error("Failed to get leaderboard:", error);
      return null;
    }
  }
}

// Type definitions based on the OpenAPI spec
export interface TokenCheck {
  creator: string;
  creatorTokens: CreatorToken[];
  detectedAt: string;
  events: TokenEvent[];
  fileMeta: FileMetadata;
  freezeAuthority: string;
  graphInsidersDetected: number;
  insiderNetworks: InsiderNetwork[];
  knownAccounts: Record<string, KnownAccount>;
  lockerOwners: Record<string, boolean>;
  lockers: Record<string, Locker>;
  markets: Market[];
  mint: string;
  mintAuthority: string;
  price: number;
  risks: Risk[];
  rugged: boolean;
  score: number;
  score_normalised: number;
  token: string;
  tokenMeta: TokenMetadata;
  tokenProgram: string;
  tokenType: string;
  token_extensions: string;
  topHolders: TokenHolder[];
  totalHolders: number;
  totalLPProviders: number;
  totalMarketLiquidity: number;
  transferFee: {
    authority: string;
    maxAmount: number;
    pct: number;
  };
  verification: VerifiedToken;
}

export interface TokenCheckSummary {
  risks: Risk[];
  score: number;
  score_normalised: number;
  tokenProgram: string;
  tokenType: string;
}

export interface Risk {
  description: string;
  level: string;
  name: string;
  score: number;
  value: string;
}

export interface VoteResponse {
  down: number;
  up: number;
  userVoted: boolean;
}

export interface VaultResponse {
  lockers: Record<string, Locker>;
  total: VaultResponseSummary;
}

export interface VaultResponseSummary {
  pct: number;
  totalUSDC: number;
}

export interface Locker {
  owner: string;
  programID: string;
  tokenAccount: string;
  type: string;
  unlockDate: number;
  uri: string;
  usdcLocked: number;
}

export interface TrendingToken {
  mint: string;
  up_count: number;
  vote_count: number;
}

export interface TokenInfoAgg {
  metadata: TokenMetadata;
  mint: string;
  score: number;
  user_visits: number;
  visits: number;
}

export interface Token {
  createAt: string;
  creator: string;
  decimals: number;
  events: TokenEvent[];
  freezeAuthority: string;
  mint: string;
  mintAuthority: string;
  program: string;
  symbol: string;
  updatedAt: string;
}

export interface VerifiedToken {
  description: string;
  jup_strict: boolean;
  jup_verified: boolean;
  links: VerifiedTokenLinks[];
  mint: string;
  name: string;
  payer: string;
  symbol: string;
}

export interface VerifiedTokenLinks {
  provider: string;
  value: string;
}

export interface User {
  username: string;
  votes: number;
  weight: number;
  wins: number;
}

export interface CreatorToken {
  createdAt: string;
  marketCap: number;
  mint: string;
}

export interface TokenEvent {
  createdAt: string;
  event: number;
  newValue: string;
  oldValue: string;
}

export interface FileMetadata {
  description: string;
  image: string;
  name: string;
  symbol: string;
}

export interface InsiderNetwork {
  activeAccounts: number;
  id: string;
  size: number;
  tokenAmount: number;
  type: string;
}

export interface KnownAccount {
  name: string;
  type: string;
}

export interface Market {
  liquidityA: string;
  liquidityAAccount: string;
  liquidityB: string;
  liquidityBAccount: string;
  lp: MarketLP;
  marketType: string;
  mintA: string;
  mintAAccount: string;
  mintB: string;
  mintBAccount: string;
  mintLP: string;
  mintLPAccount: string;
  pubkey: string;
}

export interface MarketLP {
  base: number;
  baseMint: string;
  basePrice: number;
  baseUSD: number;
  currentSupply: number;
  holders: TokenHolder[];
  lpCurrentSupply: number;
  lpLocked: number;
  lpLockedPct: number;
  lpLockedUSD: number;
  lpMaxSupply: number;
  lpMint: string;
  lpTotalSupply: number;
  lpUnlocked: number;
  pctReserve: number;
  pctSupply: number;
  quote: number;
  quoteMint: string;
  quotePrice: number;
  quoteUSD: number;
  reserveSupply: number;
  tokenSupply: number;
  totalTokensUnlocked: number;
}

export interface TokenMetadata {
  mutable: boolean;
  name: string;
  symbol: string;
  updateAuthority: string;
  uri: string;
}

export interface TokenHolder {
  address: string;
  amount: number;
  decimals: number;
  insider: boolean;
  owner: string;
  pct: number;
  uiAmount: number;
  uiAmountString: string;
}
