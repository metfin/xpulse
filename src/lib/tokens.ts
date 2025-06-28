import { DexScreenerService, Pair, TokensResponse } from "./dexscreener";
import { JupService, TokenResponse } from "./jup";

export async function getTokenInfo(address: string): Promise<TokenInfo> {
  const jupInfo = await JupService.getTokenInfo(address);
  const dexscreenerInfo = await DexScreenerService.getPair(address);

  return {
    jupInfo,
    dexscreenerInfo,
  };
}

type TokenInfo = {
  jupInfo: TokenResponse;
  dexscreenerInfo: Pair[];
};
