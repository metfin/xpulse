import { fetchClient } from "./utils";

export class DexScreenerService {
  private static readonly DEXSCREENER_API_BASE =
    "https://api.dexscreener.com/latest/dex";

  static async getTokensPairs(tokenMints: string[]): Promise<Pair[] | null> {
    const response = await fetchClient<TokensResponse>(
      `${DexScreenerService.DEXSCREENER_API_BASE}/tokens/${tokenMints.join(
        ","
      )}`
    );

    if (response.pairs.length === 0) {
      return null;
    }

    return response.pairs;
  }
}

export interface TokensResponse {
  schemaVersion: string;
  pairs: Pair[];
}

export interface Pair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: EToken;
  quoteToken: EToken;
  priceNative: string;
  priceUsd: string;
  txns: Txns;
  labels: string[];
  volume: Volume;
  priceChange: PriceChange;
  liquidity: Liquidity;
  fdv: number;
  marketCap: number;
  pairCreatedAt: number;
  info: Info;
}

interface EToken {
  address: string;
  name: string;
  symbol: string;
}

interface Info {
  imageUrl: string;
  header: string;
  openGraph: string;
  websites: Website[];
  socials: Social[];
}

interface Social {
  type: string;
  url: string;
}

interface Website {
  label: string;
  url: string;
}

interface Liquidity {
  usd: number;
  base: number;
  quote: number;
}

interface PriceChange {
  h6: number;
  h24: number;
}

interface Txns {
  m5: H1;
  h1: H1;
  h6: H1;
  h24: H1;
}

interface H1 {
  buys: number;
  sells: number;
}

interface Volume {
  h24: number;
  h6: number;
  h1: number;
  m5: number;
}
