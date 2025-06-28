import { fetchClient } from "./utils";

export class JupService {
  private static readonly JUP_API_BASE = "https://api.jup.ag/";
  private static readonly JUP_TOKENS_API_BASE = "https://tokens.jup.ag/";
  private static readonly JUP_PRICE_API_BASE =
    "https://lite-api.jup.ag/price/v2";

  static async getTokenInfo(tokenMint: string) {
    const response = await fetchClient<TokenResponse>(
      `${JupService.JUP_TOKENS_API_BASE}/token/${tokenMint}`
    );
    return response;
  }

  static async getTokenPrice(tokenMints: string[], vsToken?: string) {
    const response = await fetchClient<TokenPriceResponse>(
      `${JupService.JUP_PRICE_API_BASE}?ids=${tokenMints.join(",")}${
        vsToken ? `&vsToken=${vsToken}` : ""
      }`
    );
    return response;
  }
}

export interface TokenResponse {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  tags: string[];
  daily_volume: number;
  created_at: Date;
  freeze_authority: string;
  mint_authority: string;
  permanent_delegate: null;
  minted_at: null;
  extensions: any;
}

export interface TokenPriceResponse {
  data: {
    [key: string]: {
      id: string;
      type: string;
      price: string;
    };
  };
  timeTaken: number;
}
