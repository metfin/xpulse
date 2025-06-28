"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RugCheckService } from "@/lib/rugcheck";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Lock,
  Wallet,
  Crown,
  TrendingUp,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

interface TopHoldersProps {
  tokenAddress: string;
}

export default function TopHolders({ tokenAddress }: TopHoldersProps) {
  const { data: rugCheckData, isLoading: rugCheckLoading } = useQuery({
    queryKey: ["rugcheck-full", tokenAddress],
    queryFn: () => RugCheckService.getTokenReport(tokenAddress),
    refetchInterval: 120000, // 2 minutes
  });

  const [expanded, setExpanded] = useState(false);

  if (rugCheckLoading) {
    return (
      <Card className="w-full h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5" />
            Token Holders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex justify-between items-center mb-2">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-4 bg-muted rounded w-16"></div>
                </div>
                <div className="h-2 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!rugCheckData?.topHolders || rugCheckData.topHolders.length === 0) {
    return (
      <Card className="w-full h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5" />
            Token Holders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Holder data unavailable for this token
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalHolders = rugCheckData.totalHolders || 0;
  const topHolders = rugCheckData.topHolders.slice(0, expanded ? 10 : 5);
  const knownAccounts = rugCheckData.knownAccounts || {};
  const lockers = rugCheckData.lockers || {};
  const lockerOwners = rugCheckData.lockerOwners || {};

  // Calculate concentration metrics
  const top30Concentration = topHolders.reduce(
    (sum, holder) => sum + holder.pct,
    0
  );
  const top10Concentration = topHolders
    .slice(0, 10)
    .reduce((sum, holder) => sum + holder.pct, 0);
  const top5Concentration = topHolders
    .slice(0, 5)
    .reduce((sum, holder) => sum + holder.pct, 0);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const getHolderType = (address: string) => {
    if (knownAccounts[address]) {
      return {
        type: knownAccounts[address].type,
        name: knownAccounts[address].name,
        isKnown: true,
      };
    }

    if (lockerOwners[address]) {
      return {
        type: "locked",
        name: "Locked Tokens",
        isKnown: true,
      };
    }

    return {
      type: "unknown",
      name: "Unknown Wallet",
      isKnown: false,
    };
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "locked":
      case "locker":
        return <Lock className="w-3 h-3" />;
      case "creator":
      case "deployer":
        return <Crown className="w-3 h-3" />;
      case "exchange":
      case "cex":
        return <TrendingUp className="w-3 h-3" />;
      case "pool":
      case "liquidity":
        return <TrendingUp className="w-3 h-3" />;
      default:
        return <Wallet className="w-3 h-3" />;
    }
  };

  const getTypeBadgeVariant = (type: string, isKnown: boolean) => {
    if (!isKnown) return "outline";

    switch (type.toLowerCase()) {
      case "locked":
      case "locker":
        return "default";
      case "creator":
      case "deployer":
        return "destructive";
      case "exchange":
      case "cex":
        return "secondary";
      default:
        return "outline";
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5" />
            Token Holders
          </div>
          <Badge variant="outline" className="text-xs">
            {totalHolders.toLocaleString()} Total
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Concentration Analysis */}
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="space-y-1">
              <div className="text-lg font-semibold">
                {top5Concentration.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Top 5</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-semibold">
                {top10Concentration.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Top 10</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-semibold">
                {top30Concentration.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Top 30</div>
            </div>
          </div>
        </div>

        {/* Top Holders List */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Crown className="w-4 h-4" />
            Top Holders
          </div>

          <div className="space-y-2">
            {topHolders.map((holder, index) => {
              const holderInfo = getHolderType(holder.address);

              return (
                <div
                  key={holder.address}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        #{index + 1}
                      </span>
                      {getTypeIcon(holderInfo.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                          {formatAddress(holder.address)}
                        </code>
                        <Badge
                          variant={getTypeBadgeVariant(
                            holderInfo.type,
                            holderInfo.isKnown
                          )}
                          className="text-xs"
                        >
                          {getTypeIcon(holderInfo.type)}
                          {holderInfo.name}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{formatNumber(holder.uiAmount)} tokens</span>
                        <span className="font-medium">
                          {holder.pct.toFixed(2)}%
                        </span>
                      </div>

                      <div className="mt-2 w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${Math.min(holder.pct, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(holder.address)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() =>
                        window.open(
                          `https://solscan.io/account/${holder.address}`,
                          "_blank"
                        )
                      }
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
            
            {/* Dropdown button after the 5th holder */}
            {!expanded && rugCheckData.topHolders.length > 5 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(true)}
                className="w-full h-8 text-muted-foreground hover:text-foreground"
              >
                <ChevronDown className="w-4 h-4 mr-2" />
                Show more holders
              </Button>
            )}
            
            {/* Collapse button when expanded */}
            {expanded && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(false)}
                className="w-full h-8 text-muted-foreground hover:text-foreground"
              >
                <ChevronUp className="w-4 h-4 mr-2" />
                Show less
              </Button>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="pt-2 border-t space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Holders</span>
              <span className="font-medium">
                {totalHolders.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Known Accounts</span>
              <span className="font-medium">
                {Object.keys(knownAccounts).length}
              </span>
            </div>
          </div>

          {Object.keys(lockers).length > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Locked Positions</span>
              <span className="font-medium">{Object.keys(lockers).length}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
