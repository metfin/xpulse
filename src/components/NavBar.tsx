"use client";

import React, { useEffect, useId } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useUserStore } from "@/stores/useUserStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { SearchIcon } from "lucide-react";
import WalletButton from "./WalletButton";

export default function NavBar() {
  const { connected, publicKey, wallet } = useWallet();
  const { user, connectWallet, disconnectWallet } = useUserStore();
  const id = useId();

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

  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
          </Popover>
          {/* Logo */}
          <div className="flex items-center gap-3 select-none">
            <div className="flex items-center">
              <div>
                <Image
                  src="/blue-nobg.svg"
                  alt="xpulse"
                  width={32}
                  height={32}
                />
              </div>
              <span className="ml-1 text-xl font-bold text-primary">
                xpulse
              </span>
            </div>
          </div>
        </div>

        {/* Middle area */}
        <div className="grow flex items-center justify-center gap-6">
          {/* Search form */}
          <div className="relative w-full max-w-xs">
            <Input
              id={id}
              className="peer h-8 ps-8 pe-10"
              placeholder="Search..."
              type="search"
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>
            <div className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-2">
              <kbd className="text-muted-foreground/70 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right side - Wallet Connection */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
