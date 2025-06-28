"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RugCheckService, TokenCheckSummary, Risk } from "@/lib/rugcheck";
import { useEffect, useState } from "react";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface RugCheckInfoProps {
  tokenAddress: string;
}

export default function RugCheckInfo({ tokenAddress }: RugCheckInfoProps) {
  const [rugCheckData, setRugCheckData] = useState<TokenCheckSummary | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRugCheckData() {
      try {
        setLoading(true);
        const data = await RugCheckService.getTokenReportSummary(tokenAddress);
        setRugCheckData(data);
      } catch (err) {
        setError("Failed to load RugCheck data");
        console.error("Error fetching RugCheck data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRugCheckData();
  }, [tokenAddress]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-4 h-4" />;
    if (score >= 60) return <AlertTriangle className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  const getRiskBadgeVariant = (level: string) => {
    switch (level.toLowerCase()) {
      case "low":
        return "default";
      case "medium":
        return "secondary";
      case "high":
      case "critical":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getImportantRisks = (risks: Risk[]) => {
    // Filter and sort risks by importance
    return risks
      .filter(
        (risk) =>
          risk.level.toLowerCase() === "high" ||
          risk.level.toLowerCase() === "critical" ||
          risk.score >= 50
      )
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Show top 5 most important risks
  };

  if (loading) {
    return (
      <Card className="w-full h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5" />
            Security Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4 animate-spin" />
            Loading security analysis...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !rugCheckData) {
    return (
      <Card className="w-full h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5" />
            Security Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm">
            {error || "Security data unavailable"}
          </div>
        </CardContent>
      </Card>
    );
  }

  const importantRisks = getImportantRisks(rugCheckData.risks || []);

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5" />
            Security Analysis
          </div>
          <div
            className={`flex items-center gap-2 font-semibold ${getScoreColor(
              rugCheckData.score_normalised
            )}`}
          >
            {getScoreIcon(rugCheckData.score_normalised)}
            <span className="text-lg">
              {Math.round(rugCheckData.score_normalised)}/100
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Token Program Info */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Program:</span>
          <Badge variant="outline" className="font-mono text-xs">
            {rugCheckData.tokenProgram}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {rugCheckData.tokenType}
          </Badge>
        </div>

        {/* Risk Summary */}
        {importantRisks.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Key Risks
            </h4>
            <div className="space-y-2">
              {importantRisks.map((risk, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between gap-3 p-3 rounded-lg border bg-muted/30"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{risk.name}</span>
                      <Badge
                        variant={getRiskBadgeVariant(risk.level)}
                        className="text-xs"
                      >
                        {risk.level}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {risk.description}
                    </p>
                    {risk.value && risk.value !== risk.name && (
                      <div className="mt-1">
                        <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                          {risk.value}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-xs font-medium text-muted-foreground shrink-0">
                    {risk.score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No significant risks message */}
        {importantRisks.length === 0 && rugCheckData.score_normalised >= 70 && (
          <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted text-foreground">
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm">
              No significant security risks detected
            </span>
          </div>
        )}

        {/* Powered by RugCheck */}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Powered by{" "}
            <a
              href="https://rugcheck.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-medium"
            >
              RugCheck
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
