import { NextRequest, NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import { JupService } from "./src/lib/jup";
import { DAMMService, DLMMService } from "./src/lib/meteora-api";

// Check if it's a valid Solana public key
function isValidSolanaPublicKey(key: string): boolean {
  try {
    new PublicKey(key);
    return true;
  } catch {
    return false;
  }
}

// Check if it's a token using JupService
async function checkToken(publicKey: string): Promise<boolean> {
  try {
    const response = await JupService.getTokenInfo(publicKey);
    return !!response.address;
  } catch {
    return false;
  }
}

// Check if it's a DAMM pool using DAMMService
async function checkDAMMPool(publicKey: string): Promise<boolean> {
  try {
    const dammService = new DAMMService();
    const response = await dammService.getDAMMPoolInfo(publicKey);
    return !!response.data;
  } catch {
    return false;
  }
}

// Check if it's a DLMM pool using DLMMService
async function checkDLMMPool(publicKey: string): Promise<boolean> {
  try {
    const dlmmService = new DLMMService();
    const response = await dlmmService.getPoolInfo(publicKey);
    return !!response.data;
  } catch {
    return false;
  }
}

// Check if it's a DLMM position using DLMMService
async function checkDLMMPosition(publicKey: string): Promise<boolean> {
  try {
    const dlmmService = new DLMMService();

    // Try both v1 and v2 position endpoints
    const [v1Result, v2Result] = await Promise.allSettled([
      dlmmService.getPositionInfo(publicKey, false),
      dlmmService.getPositionInfo(publicKey, true),
    ]);

    const v1Success = v1Result.status === "fulfilled" && !!v1Result.value.data;
    const v2Success = v2Result.status === "fulfilled" && !!v2Result.value.data;

    return v1Success || v2Success;
  } catch {
    return false;
  }
}

// Check if it's a wallet (account exists on Solana)
async function checkWallet(publicKey: string): Promise<boolean> {
  try {
    // Use a public RPC endpoint with timeout
    const connection = new Connection("https://api.mainnet-beta.solana.com", {
      commitment: "confirmed",
      confirmTransactionInitialTimeout: 2000,
    });

    const pubkey = new PublicKey(publicKey);
    const accountInfo = await connection.getAccountInfo(pubkey);

    // An account exists if it has some data or lamports
    return accountInfo !== null;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only handle root-level paths that look like Solana public keys
  const pathSegments = pathname.split("/").filter(Boolean);

  // Must be exactly one segment and look like a base58 public key
  if (pathSegments.length !== 1) {
    return NextResponse.next();
  }

  const publicKey = pathSegments[0];

  // Basic validation - Solana public keys are 32-44 characters, base58
  if (publicKey.length < 32 || publicKey.length > 44) {
    return NextResponse.next();
  }

  // Validate it's a proper Solana public key
  if (!isValidSolanaPublicKey(publicKey)) {
    return NextResponse.next();
  }

  try {
    // Run all checks concurrently for maximum speed
    const [isToken, isDAMMPool, isDLMMPool, isDLMMPosition, isWallet] =
      await Promise.all([
        checkToken(publicKey),
        checkDAMMPool(publicKey),
        checkDLMMPool(publicKey),
        checkDLMMPosition(publicKey),
        checkWallet(publicKey),
      ]);

    // Redirect based on priority order
    const baseUrl = request.nextUrl.origin;

    if (isToken) {
      return NextResponse.redirect(`${baseUrl}/token/${publicKey}`);
    }

    if (isDAMMPool) {
      return NextResponse.redirect(`${baseUrl}/pool/${publicKey}`);
    }

    if (isDLMMPool) {
      return NextResponse.redirect(`${baseUrl}/pool/${publicKey}`);
    }

    if (isDLMMPosition) {
      return NextResponse.redirect(`${baseUrl}/dlmm/position/${publicKey}`);
    }

    if (isWallet) {
      return NextResponse.redirect(`${baseUrl}/wallet/${publicKey}`);
    }

    // If none of the checks pass, let Next.js handle it (will likely 404)
    return NextResponse.next();
  } catch (error) {
    // If there's any error in the middleware, just continue
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public|token|pool|dlmm|wallet).*)",
  ],
};
