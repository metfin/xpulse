import { DexScreenerService, Pair, TokensResponse } from "./dexscreener";
import { JupService, TokenResponse } from "./jup";

export async function getTokenInfo(address: string): Promise<TokenInfo> {
  const jupInfo = await JupService.getTokenInfo(address);
  const dexscreenerInfo = await DexScreenerService.getTokensPairs([address]);

  //filter out pairs that aren't from meteora
  const meteoraPairs = dexscreenerInfo?.filter((pair) =>
    pair.dexId.includes("meteora")
  );

  return {
    jupInfo,
    dexscreenerInfo: meteoraPairs,
  };
}

type TokenInfo = {
  jupInfo: TokenResponse;
  dexscreenerInfo: Pair[] | undefined;
};
