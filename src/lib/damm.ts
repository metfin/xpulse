import { CpAmm, PositionState } from "@meteora-ag/cp-amm-sdk";
import { PublicKey, Connection } from "@solana/web3.js";

/**
 * Get all positions for a specific pool
 * @param pool - The pool's public key
 * @param connection - Solana connection instance
 * @returns Promise containing array of positions with their public keys and account data
 */
export async function getAllPositionsByPool(
  pool: PublicKey,
): Promise<Array<{ publicKey: PublicKey; account: PositionState }>> {
  try {
    const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
          "https://api.mainnet-beta.solana.com"
      );
    const cpAmm = new CpAmm(connection);
    const positions = await cpAmm.getAllPositionsByPool(pool);
    
    return positions.map(position => ({
      publicKey: position.publicKey,
      account: position.account
    }));
  } catch (error) {
    console.error("Error fetching positions for pool:", error);
    throw error;
  }
}
