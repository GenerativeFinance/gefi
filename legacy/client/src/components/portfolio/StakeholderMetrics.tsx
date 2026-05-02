import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Link as LinkIcon, Users } from "lucide-react";
import { useLocation } from "wouter";

type Props = {
  model: {
    id: number | string;
    name: string;
    dailyUsers?: number;
    monthlyUsers?: number;
    yearlyUsers?: number;
    stakeholderSharePct?: number; // 0-100
    roiPct?: number; // 12.5 means +12.5%
    otherStakeholders?: number;
    contractChain?: string;
  };
};

export default function StakeholderMetrics({ model }: Props) {
  const [, setLocation] = useLocation();
  const perfColor = typeof model.roiPct === "number" && model.roiPct >= 0 ? "text-green-600" : "text-red-600";

  const chainParam = (model.contractChain || "").toLowerCase().trim() || "solana";

  const goToContractWallet = () => {
    // Deep-link directly to Contract Wallet with preselection hints
    // Supported params the wallet now reads: contractId, modelId, contractAddress, chain
    const url = `/wallet?contractId=${encodeURIComponent(
      String(model.id)
    )}&model=${encodeURIComponent(model.name)}&chain=${encodeURIComponent(
      chainParam
    )}`;
    setLocation(url);
  };

  return (
    <Card className="border-dashed">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center">
          <div>
            <div className="text-xs text-muted-foreground">Daily Users</div>
            <div className="text-base font-semibold">{model.dailyUsers ?? "—"}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Monthly Users</div>
            <div className="text-base font-semibold">{model.monthlyUsers ?? "—"}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Yearly Users</div>
            <div className="text-base font-semibold">{model.yearlyUsers ?? "—"}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Stakeholder Share</div>
            <div className="text-base font-semibold">{typeof model.stakeholderSharePct === "number" ? `${model.stakeholderSharePct}%` : "—"}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">ROI</div>
            <div className={`text-base font-semibold ${perfColor}`}>
              {typeof model.roiPct === "number" ? `${model.roiPct >= 0 ? "+" : ""}${model.roiPct}%` : "—"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              {typeof model.otherStakeholders === "number" ? `${model.otherStakeholders} stakeholders` : "—"}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Badge variant="secondary" className="capitalize">
            {model.contractChain ? `${model.contractChain} contract` : "No chain set"}
          </Badge>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
            <Button onClick={goToContractWallet} size="sm" className="gap-2">
              <LinkIcon className="h-4 w-4" />
              Manage Contract
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}