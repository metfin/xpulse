"use client"
import DAMMv2PoolCard from "@/components/DAMMv2PoolCard";
import { TokenInfo } from "@/lib/tokens";
import React, { useRef, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import dynamic from "next/dynamic";
import { DLMMService } from "@/lib/meteora-api";
import { DAMMService } from "@/lib/meteora-api";
import DLMMPoolCard from "@/components/DLMMPoolCard";
import { useQuery } from "@tanstack/react-query";

export default function PoolList({ tokenInfo }: { tokenInfo: TokenInfo }) {
  // DAMMv2 scroll state
  const dammScrollRef = useRef<HTMLDivElement>(null);
  const [dammCanScrollLeft, setDammCanScrollLeft] = useState(false);
  const [dammCanScrollRight, setDammCanScrollRight] = useState(false);

  // DLMM scroll state
  const dlmmScrollRef = useRef<HTMLDivElement>(null);
  const [dlmmCanScrollLeft, setDlmmCanScrollLeft] = useState(false);
  const [dlmmCanScrollRight, setDlmmCanScrollRight] = useState(false);

  // DLMM useQuery
  const {
    data: dlmmResp,
    isLoading: dlmmLoading,
    error: dlmmErrorObj,
  } = useQuery({
    queryKey: ["dlmm-pools", tokenInfo.jupInfo.address],
    queryFn: async () => {
      const service = new DLMMService();
      return await service.getAllPoolsByToken(tokenInfo.jupInfo.address);
    },
    refetchInterval: 30000,
    staleTime: 30000,
  });
  const dlmmPools = dlmmResp?.groups?.flatMap((g) => g.pairs) || [];
  const dlmmError = dlmmErrorObj ? (dlmmErrorObj as Error).message : null;

  // DAMMv2 useQuery
  const {
    data: dammResp,
    isLoading: dammLoading,
    error: dammErrorObj,
  } = useQuery({
    queryKey: ["damm-pools", tokenInfo.jupInfo.address],
    queryFn: async () => {
      const service = new DAMMService();
      return await service.getDAMMpoolByToken(tokenInfo.jupInfo.address);
    },
    refetchInterval: 30000,
    staleTime: 30000,
  });
  const dammPools = dammResp?.data || [];
  const dammError = dammErrorObj ? (dammErrorObj as Error).message : null;

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
              {dammLoading ? (
                <p className="text-sm text-muted-foreground">Loading DAMM pools...</p>
              ) : dammError ? (
                <p className="text-sm text-destructive">{dammError}</p>
              ) : dammPools.length > 0 ? (
                dammPools.flatMap((group) =>
                  group.pools.map((pool) => (
                    <div key={pool.pool_address}>
                      <DAMMv2PoolCard pair={pool} DAMMPoolInfo={group} />
                    </div>
                  ))
                )
              ) : (
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
                    <DLMMPoolCard
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
