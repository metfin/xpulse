"use client";

import React, { useEffect, useState } from "react";
import { useUserStore } from "@/stores/useUserStore";
import NavBar from "./NavBar";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

  // Handle hydration and loading state
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Show loading spinner during hydration
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not authenticated, show login page
  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4">
          <div className="max-w-md w-full space-y-8 text-center">
            <div>
              <h2 className="mt-6 text-3xl font-bold text-foreground">
                Connect Your Wallet
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                You need to connect a Solana wallet to access xpulse
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-muted/50 border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Supported Wallets
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Phantom</li>
                  <li>• Solflare</li>
                  <li>• Torus</li>
                  <li>• Any Wallet Connect compatible wallet</li>
                </ul>
              </div>

              <div className="flex justify-center">
                <WalletMultiButton className="!bg-primary !text-primary-foreground hover:!bg-primary/90 !px-8 !py-3 !text-base" />
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              By connecting your wallet, you agree to our terms of service
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user is authenticated, show the protected content with navbar
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
