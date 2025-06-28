"use client"
import PoolCard from "@/components/PoolCard";
import { TokenInfo } from "@/lib/tokens";
import React, { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function PoolList({ tokenInfo }: { tokenInfo: TokenInfo }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };
  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  return (
    <Card className="w-full relative">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Pools</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Left arrow button */}
          {canScrollLeft && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 left-2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background"
              onClick={handleScrollLeft}
              aria-label="Scroll pools left"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          )}
          <div
            ref={scrollRef}
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
          {canScrollRight && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background"
              onClick={handleScrollRight}
              aria-label="Scroll pools right"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
