"use client";

import React, { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useUserStore } from "@/stores/useUserStore";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  const { connected, publicKey, wallet, disconnect } = useWallet();
  const { user, connectWallet, disconnectWallet } = useUserStore();

  // Sync wallet connection with our store
  useEffect(() => {
    if (connected && publicKey) {
      connectWallet(publicKey.toString(), wallet?.adapter.name);
    } else if (!connected && user.isConnected) {
      disconnectWallet();
    }
  }, [
    connected,
    publicKey,
    wallet,
    connectWallet,
    disconnectWallet,
    user.isConnected,
  ]);

  const handleDisconnect = async () => {
    try {
      await disconnect();
      disconnectWallet();
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  const formatPublicKey = (key: string) => {
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  };

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-foreground">xpulse</h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </a>
              <a
                href="/portfolio"
                className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Portfolio
              </a>
              <a
                href="/analytics"
                className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Analytics
              </a>
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {user.isConnected && user.publicKey ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {formatPublicKey(user.publicKey)}
                </span>
                {user.walletName && (
                  <span className="text-xs bg-muted px-2 py-1 rounded">
                    {user.walletName}
                  </span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisconnect}
                  className="ml-2"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <WalletMultiButton className="!bg-primary !text-primary-foreground hover:!bg-primary/90" />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
