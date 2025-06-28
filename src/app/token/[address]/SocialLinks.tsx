"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DexScreenerService } from "@/lib/dexscreener";
import { JupService } from "@/lib/jup";
import { useQuery } from "@tanstack/react-query";
import {
  Globe,
  Twitter,
  MessageCircle,
  Send,
  Github,
  ExternalLink,
  Link2,
  Users,
  BookOpen,
  FileText,
} from "lucide-react";

interface SocialLinksProps {
  tokenAddress: string;
}

interface SocialLink {
  type: string;
  url: string;
  label: string;
  icon: any;
  color?: string;
}

export default function SocialLinks({ tokenAddress }: SocialLinksProps) {
  const { data: pairs } = useQuery({
    queryKey: ["dexscreener-pairs", tokenAddress],
    queryFn: () => DexScreenerService.getTokensPairs([tokenAddress]),
  });

  const { data: jupToken } = useQuery({
    queryKey: ["jup-token", tokenAddress],
    queryFn: () => JupService.getTokenInfo(tokenAddress),
  });

  // Extract social links from the most liquid pair
  const primaryPair = pairs?.reduce((prev, current) =>
    (current.liquidity?.usd || 0) > (prev.liquidity?.usd || 0) ? current : prev
  );

  const socialLinks: SocialLink[] = [];
  const websites: SocialLink[] = [];

  // Process DexScreener social links
  if (primaryPair?.info?.socials) {
    primaryPair.info.socials.forEach((social) => {
      const socialType = social.type.toLowerCase();
      let icon, label, color;

      switch (socialType) {
        case "twitter":
        case "x":
          icon = Twitter;
          label = "Twitter";
          color = "text-blue-400";
          break;
        case "telegram":
          icon = Send;
          label = "Telegram";
          color = "text-blue-500";
          break;
        case "discord":
          icon = MessageCircle;
          label = "Discord";
          color = "text-indigo-400";
          break;
        case "github":
          icon = Github;
          label = "GitHub";
          color = "text-gray-600 dark:text-gray-400";
          break;
        case "medium":
          icon = BookOpen;
          label = "Medium";
          color = "text-green-600";
          break;
        case "reddit":
          icon = Users;
          label = "Reddit";
          color = "text-orange-500";
          break;
        default:
          icon = Link2;
          label = socialType.charAt(0).toUpperCase() + socialType.slice(1);
          break;
      }

      socialLinks.push({
        type: socialType,
        url: social.url,
        label,
        icon,
        color,
      });
    });
  }

  // Process DexScreener websites
  if (primaryPair?.info?.websites) {
    primaryPair.info.websites.forEach((website) => {
      websites.push({
        type: "website",
        url: website.url,
        label: website.label || "Website",
        icon: Globe,
        color: "text-green-600",
      });
    });
  }

  // Combine and deduplicate
  const allLinks = [...socialLinks, ...websites];
  const uniqueLinks = allLinks.filter(
    (link, index, self) => index === self.findIndex((l) => l.url === link.url)
  );

  if (uniqueLinks.length === 0) {
    return (
      <Card className="w-full h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Link2 className="w-5 h-5" />
            Social & Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No social links found for this token
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleLinkClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg">
            <Link2 className="w-5 h-5" />
            Social & Links
          </div>
          <Badge variant="outline" className="text-xs">
            {uniqueLinks.length} {uniqueLinks.length === 1 ? "Link" : "Links"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Social Media Links */}
        {socialLinks.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              Social Media
            </div>

            <div className="grid grid-cols-1 gap-2">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    className="justify-between h-auto p-3 hover:bg-muted/60"
                    onClick={() => handleLinkClick(social.url)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full bg-muted ${
                          social.color || ""
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium">
                          {social.label}
                        </div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {social.url.replace(/^https?:\/\//, "")}
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Website Links */}
        {websites.length > 0 && (
          <div className="space-y-3">
            {socialLinks.length > 0 && <div className="border-t" />}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="w-4 h-4" />
              Websites
            </div>

            <div className="grid grid-cols-1 gap-2">
              {websites.map((website, index) => {
                const IconComponent = website.icon;
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    className="justify-between h-auto p-3 hover:bg-muted/60"
                    onClick={() => handleLinkClick(website.url)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full bg-muted ${
                          website.color || ""
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium">
                          {website.label}
                        </div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {website.url.replace(/^https?:\/\//, "")}
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Token Information */}
        {primaryPair && (
          <div className="pt-3 border-t space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="w-4 h-4" />
              Token Information
            </div>

            <div className="space-y-2">
              {primaryPair.info?.header && (
                <div className="text-sm leading-relaxed">
                  <img src={primaryPair.info.header} alt="Token Image" />
                </div>
              )}

              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">DEX</span>
                <Badge variant="secondary" className="text-xs">
                  {primaryPair.dexId}
                </Badge>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Pair</span>
                <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                  {primaryPair.baseToken.symbol}/{primaryPair.quoteToken.symbol}
                </code>
              </div>
            </div>
          </div>
        )}

        {/* External Resources */}
        <div className="pt-3 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <ExternalLink className="w-4 h-4" />
            External Resources
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() =>
                handleLinkClick(`https://solscan.io/token/${tokenAddress}`)
              }
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Solscan
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() =>
                handleLinkClick(`https://rugcheck.xyz/tokens/${tokenAddress}`)
              }
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              RugCheck
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
