"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  Wallet,
  Copy,
  Check,
  ChevronDown,
  Power,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface WalletButtonProps {
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
}

export default function WalletButton({
  className,
  variant = "default",
  size = "default",
}: WalletButtonProps) {
  const { connection } = useConnection();
  const {
    publicKey,
    wallet,
    connect,
    disconnect,
    connecting,
    connected,
    disconnecting,
  } = useWallet();
  const { setVisible } = useWalletModal();

  const [balance, setBalance] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Format public key for display
  const formatPublicKey = useCallback((key: PublicKey) => {
    const keyStr = key.toString();
    return `${keyStr.slice(0, 4)}...${keyStr.slice(-4)}`;
  }, []);

  // Fetch wallet balance
  const fetchBalance = useCallback(async () => {
    if (!publicKey || !connection) return;

    try {
      setLoadingBalance(true);
      setError(null);
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / LAMPORTS_PER_SOL);
    } catch (err) {
      console.error("Error fetching balance:", err);
      setError("Failed to fetch balance");
      setBalance(null);
    } finally {
      setLoadingBalance(false);
    }
  }, [publicKey, connection]);

  // Copy address to clipboard
  const copyAddress = useCallback(async () => {
    if (!publicKey) return;

    try {
      await navigator.clipboard.writeText(publicKey.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  }, [publicKey]);

  // Handle wallet connection
  const handleConnect = useCallback(async () => {
    try {
      setError(null);
      if (wallet) {
        await connect();
      } else {
        setVisible(true);
      }
    } catch (err) {
      console.error("Connection error:", err);
      setError("Failed to connect wallet");
    }
  }, [wallet, connect, setVisible]);

  // Handle wallet disconnection
  const handleDisconnect = useCallback(async () => {
    try {
      setError(null);
      await disconnect();
      setBalance(null);
      setIsDropdownOpen(false);
    } catch (err) {
      console.error("Disconnection error:", err);
      setError("Failed to disconnect wallet");
    }
  }, [disconnect]);

  // Open wallet in explorer
  const openInExplorer = useCallback(() => {
    if (!publicKey) return;
    const url = `https://explorer.solana.com/address/${publicKey.toString()}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [publicKey]);

  // Fetch balance when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance();
      // Set up polling for balance updates
      const interval = setInterval(fetchBalance, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [connected, publicKey, fetchBalance]);

  // Loading state
  if (connecting) {
    return (
      <Button
        variant={variant}
        size={size}
        disabled
        className={cn("min-w-32", className)}
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    );
  }

  // Disconnecting state
  if (disconnecting) {
    return (
      <Button
        variant={variant}
        size={size}
        disabled
        className={cn("min-w-32", className)}
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        Disconnecting...
      </Button>
    );
  }

  // Connected state
  if (connected && publicKey) {
    return (
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={cn(
              "min-w-32 max-w-48 transition-all duration-200 bg-primary",
              error && "border-destructive",
              className
            )}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 min-w-0">
                {wallet?.adapter.icon && (
                  <img
                    src={wallet.adapter.icon}
                    alt={wallet.adapter.name}
                    className="w-4 h-4 rounded-sm flex-shrink-0"
                  />
                )}
                <span className="truncate text-sm font-medium">
                  {formatPublicKey(publicKey)}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "h-3 w-3 transition-transform duration-200 flex-shrink-0 ml-1",
                  isDropdownOpen && "rotate-180"
                )}
              />
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end">
          {/* Wallet info header */}
          <div className="px-2 py-2 border-b">
            <div className="flex items-center gap-2 mb-2">
              {wallet?.adapter.icon && (
                <img
                  src={wallet.adapter.icon}
                  alt={wallet.adapter.name}
                  className="w-5 h-5 rounded-sm"
                />
              )}
              <span className="font-medium text-sm">
                {wallet?.adapter.name}
              </span>
            </div>

            {/* Balance display */}
            <div className="text-xs text-muted-foreground">
              Balance:{" "}
              {loadingBalance ? (
                <Loader2 className="h-3 w-3 animate-spin inline" />
              ) : balance !== null ? (
                <span className="font-mono">{balance.toFixed(4)} SOL</span>
              ) : error ? (
                <span className="text-destructive">Error</span>
              ) : (
                "Loading..."
              )}
            </div>
          </div>

          {/* Address with copy */}
          <DropdownMenuItem
            onClick={copyAddress}
            className="cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span>{copied ? "Copied!" : "Copy Address"}</span>
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              {formatPublicKey(publicKey)}
            </span>
          </DropdownMenuItem>

          {/* View in explorer */}
          <DropdownMenuItem onClick={openInExplorer} className="cursor-pointer">
            <ExternalLink className="h-4 w-4" />
            <span>View in Explorer</span>
          </DropdownMenuItem>

          {/* Refresh balance */}
          <DropdownMenuItem
            onClick={fetchBalance}
            disabled={loadingBalance}
            className="cursor-pointer"
          >
            <Loader2
              className={cn("h-4 w-4", loadingBalance && "animate-spin")}
            />
            <span>Refresh Balance</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Error display */}
          {error && (
            <div className="px-2 py-1 text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {error}
            </div>
          )}

          {/* Disconnect */}
          <DropdownMenuItem
            onClick={handleDisconnect}
            className="cursor-pointer text-destructive focus:text-destructive"
            variant="destructive"
          >
            <Power className="h-4 w-4" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Not connected state
  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleConnect}
      className={cn(
        "min-w-32 transition-all duration-200 hover:scale-[1.02]",
        className
      )}
    >
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </Button>
  );
}
