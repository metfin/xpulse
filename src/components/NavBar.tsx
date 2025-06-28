"use client";

import React, { useEffect, useId } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useUserStore } from "@/stores/useUserStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: "/dashboard", label: "Dashboard", active: true },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/analytics", label: "Analytics" },
];

export default function NavBar() {
  const { connected, publicKey, wallet, disconnect } = useWallet();
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
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index} className="w-full">
                      <NavigationMenuLink
                        href={link.href}
                        className="py-1.5"
                        active={link.active}
                      >
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <img 
                src="/favicon.ico" 
                alt="Metfin" 
                className="h-6 w-6"
              />
              <span className="ml-1 text-xl font-bold text-primary">metfin</span>
            </div>
            <div className="h-6 w-px bg-border"></div>
            <Link href="/" className="text-primary hover:text-primary/90">
              <h1 className="text-xl font-bold">xpulse</h1>
            </Link>
          </div>
        </div>
        
        {/* Middle area */}
        <div className="grow flex items-center justify-center gap-6">
          {/* Navigation menu */}
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              {navigationLinks.map((link, index) => (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink
                    active={link.active}
                    href={link.href}
                    className="text-muted-foreground hover:text-primary py-1.5 font-medium"
                  >
                    {link.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
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
          {user.isConnected && user.publicKey ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-border hover:bg-muted">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">user1</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {formatPublicKey(user.publicKey)}
                    </p>
                    {user.walletName && (
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.walletName}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDisconnect}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Disconnect</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <WalletMultiButton className="!bg-primary !text-primary-foreground hover:!bg-primary/90" />
          )}
        </div>
      </div>
    </header>
  );
}
