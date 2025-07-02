import { JupService, TokenResponse } from "./jup";
import { DAMMService, DLMMService } from "./meteora-api";
import { AllDLMMPoolsByTokenResponse, DAMMPoolsByTokenResponse, DLMMPoolPair } from "./types";

export async function getTokenInfo(address: string): Promise<TokenInfo> {
  const jupInfo = await JupService.getTokenInfo(address);
  return {
    jupInfo
  };
}

export type TokenInfo = {
  jupInfo: TokenResponse;
};
