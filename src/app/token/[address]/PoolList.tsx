"use client"
import PoolCard from "@/components/DAMMv2PoolCard";
import { TokenInfo } from "@/lib/tokens";
import React, { useRef, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import dynamic from "next/dynamic";
import { DLMMService, PoolPair } from "@/lib/meteora-api";

const DLMMCard = dynamic(() => import("@/components/DLMMCard"), { ssr: false });

export default function DAMMv2PoolList({ tokenInfo }: { tokenInfo: TokenInfo }) {
  // DAMMv2 scroll state
  const dammScrollRef = useRef<HTMLDivElement>(null);
  const [dammCanScrollLeft, setDammCanScrollLeft] = useState(false);
  const [dammCanScrollRight, setDammCanScrollRight] = useState(false);

  // DLMM scroll state
  const dlmmScrollRef = useRef<HTMLDivElement>(null);
  const [dlmmCanScrollLeft, setDlmmCanScrollLeft] = useState(false);
  const [dlmmCanScrollRight, setDlmmCanScrollRight] = useState(false);

  // DLMM pool state
  const [dlmmPools, setDlmmPools] = useState<PoolPair[]>([]);
  const [dlmmLoading, setDlmmLoading] = useState(false);
  const [dlmmError, setDlmmError] = useState<string | null>(null);

  // DAMMv2 scroll check
  const checkDammScroll = () => {
    const el = dammScrollRef.current;
    if (!el) return;
    setDammCanScrollLeft(el.scrollLeft > 0);
    setDammCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  // DLMM scroll check
  const checkDlmmScroll = () => {
    const el = dlmmScrollRef.current;
    if (!el) return;
    setDlmmCanScrollLeft(el.scrollLeft > 0);
    setDlmmCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    checkDammScroll();
    const el = dammScrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkDammScroll);
    window.addEventListener("resize", checkDammScroll);
    return () => {
      el.removeEventListener("scroll", checkDammScroll);
      window.removeEventListener("resize", checkDammScroll);
    };
  }, []);

  useEffect(() => {
    checkDlmmScroll();
    const el = dlmmScrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkDlmmScroll);
    window.addEventListener("resize", checkDlmmScroll);
    return () => {
      el.removeEventListener("scroll", checkDlmmScroll);
      window.removeEventListener("resize", checkDlmmScroll);
    };
  }, []);

  useEffect(() => {
    async function fetchDLMM() {
      setDlmmLoading(true);
      setDlmmError(null);
      try {
        const service = new DLMMService();
        const resp = await service.getAllPoolsByToken(tokenInfo.jupInfo.address);
        // Flatten all groups into a single array of pairs
        const allPairs = resp?.groups?.flatMap((g) => g.pairs) || [];
        setDlmmPools(allPairs);
      } catch (e: any) {
        setDlmmError(e.message || "Failed to load DLMM pools");
      } finally {
        setDlmmLoading(false);
      }
    }
    fetchDLMM();
  }, [tokenInfo.jupInfo.address]);

  const handleDammScrollRight = () => {
    if (dammScrollRef.current) {
      dammScrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };
  const handleDammScrollLeft = () => {
    if (dammScrollRef.current) {  
      dammScrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const handleDlmmScrollRight = () => {
    if (dlmmScrollRef.current) {
      dlmmScrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };
  const handleDlmmScrollLeft = () => {
    if (dlmmScrollRef.current) {
      dlmmScrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* DAMMv2 Pools */}
      <Card className="w-full relative mb-8">
        <CardContent>
          <div className="relative">
            {/* Left arrow button */}
            {dammCanScrollLeft && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 left-2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background"
                onClick={handleDammScrollLeft}
                aria-label="Scroll pools left"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            )}
            <div
              ref={dammScrollRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide p-4 rounded-xl [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-muted [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/50 [&::-webkit-scrollbar-thumb:active]:bg-muted-foreground/50"
            >
              {tokenInfo.dexscreenerInfo?.map((pool) => (
                <div key={pool.pairAddress}>
                  <PoolCard pair={pool} />
                </div>
              ))}
              {tokenInfo.dexscreenerInfo?.length === 0 && (
                <p className="text-sm text-muted-foreground">No pools found</p>
              )}
            </div>
            {/* Right arrow button */}
            {dammCanScrollRight && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background"
                onClick={handleDammScrollRight}
                aria-label="Scroll pools right"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      {/* DLMM Pools */}
      <Card className="w-full relative">
        <CardContent>
          <div className="relative">
            {/* Left arrow button for DLMM */}
            {dlmmCanScrollLeft && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 left-2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background"
                onClick={handleDlmmScrollLeft}
                aria-label="Scroll pools left"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            )}
            <div
              ref={dlmmScrollRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide p-4 rounded-xl [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-muted [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/50 [&::-webkit-scrollbar-thumb:active]:bg-muted-foreground/50"
            >
              {dlmmLoading ? (
                <p className="text-sm text-muted-foreground">Loading DLMM pools...</p>
              ) : dlmmError ? (
                <p className="text-sm text-destructive">{dlmmError}</p>
              ) : dlmmPools.length > 0 ? (
                dlmmPools.map((pair) => (
                  <div key={pair.address}>
                    <DLMMCard
                      pair={pair}
                      baseToken={{ symbol: pair.name.split("/")[0] }}
                      quoteToken={{ symbol: pair.name.split("/")[1] }}
                    />
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No DLMM pools found</p>
              )}
            </div>
            {/* Right arrow button for DLMM */}
            {dlmmCanScrollRight && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background"
                onClick={handleDlmmScrollRight}
                aria-label="Scroll pools right"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
