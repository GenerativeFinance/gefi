import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/layout/Layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import ConfigureModelDialog from "@/components/portfolio/ConfigureModelDialog";
import StakeholderMetrics from "@/components/portfolio/StakeholderMetrics";
import { useToast } from "@/hooks/use-toast";
import { 
  Bot, 
  Settings, 
  PlayCircle,
  PauseCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from "lucide-react";

export default function PortfolioAIModels() {
  const [, setLocation] = useLocation();
  const [configuringModel, setConfiguringModel] = useState<any | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: aiModels = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/portfolio/ai-models"],
    enabled: true
  });

  // Mutation for pausing/resuming models
  const toggleMutation = useMutation({
    mutationFn: async ({ id, action }: { id: number; action: "pause" | "resume" }) => {
      try {
        const res = await fetch(`/api/portfolio/ai-models/${id}/${action}`, { method: "POST" });
        if (!res.ok) throw new Error("Server error");
        return await res.json();
      } catch {
        return { id, status: action === "pause" ? "paused" : "active" };
      }
    },
    onMutate: async ({ id, action }) => {
      await queryClient.cancelQueries({ queryKey: ["/api/portfolio/ai-models"] });
      const previous = queryClient.getQueryData<any[]>(["/api/portfolio/ai-models"]);
      queryClient.setQueryData(["/api/portfolio/ai-models"], (old: any[]) =>
        (old || defaultActiveModels).map((m) => (m.id === id ? { ...m, status: action === "pause" ? "paused" : "active" } : m))
      );
      return { previous };
    },
    onError: (err, variables, context: any) => {
      toast({
        title: "Action failed",
        description: "Could not update model status. Reverting.",
        variant: "destructive",
      });
      if (context?.previous) {
        queryClient.setQueryData(["/api/portfolio/ai-models"], context.previous);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/portfolio/ai-models"], (old: any[]) =>
        (old || defaultActiveModels).map((m) => (m.id === data.id ? { ...m, ...data } : m))
      );
      toast({
        title: "Updated",
        description: `Model ${data.status === "paused" ? "paused" : "resumed"}.`,
      });
    },
  });

  const defaultActiveModels = [
    {
      id: 1,
      name: "Quantum Risk Predictor",
      category: "Risk Assessment",
      status: "active",
      performance: 12.5,
      allocation: 25,
      monthlyFee: 99,
      lastUpdate: "2 hours ago",
      accuracy: 94.2,
      trades: 156,
      profitLoss: 2847.5,
      tags: ["risk", "predictive"],
      rating: 4.7,
      subscribers: 1200,
      description: "Real-time risk predictor",
      // NEW stakeholder/usage fields
      dailyUsers: 420,
      monthlyUsers: 5600,
      yearlyUsers: 61200,
      stakeholderSharePct: 2.5,
      roiPct: 14.2,
      otherStakeholders: 18,
      contractChain: "Solana"
    },
    {
      id: 2,
      name: "Momentum Tracker Pro",
      category: "Trend Analysis",
      status: "active",
      performance: 8.7,
      allocation: 30,
      monthlyFee: 149,
      lastUpdate: "15 minutes ago",
      accuracy: 89.1,
      trades: 234,
      profitLoss: 1923.75,
      tags: ["trend", "momentum"],
      rating: 4.4,
      subscribers: 900,
      description: "Momentum based trading signals",
      // NEW stakeholder/usage fields
      dailyUsers: 310,
      monthlyUsers: 4300,
      yearlyUsers: 48700,
      stakeholderSharePct: 1.7,
      roiPct: 9.6,
      otherStakeholders: 11,
      contractChain: "Ethereum"
    },
  ];

  const activeModels = Array.isArray(aiModels) && aiModels.length > 0 ? aiModels : defaultActiveModels;

  const handleTogglePause = (model: any) => {
    const action = model.status === "active" ? "pause" : "resume";
    toggleMutation.mutate({ id: model.id, action });
  };

  const handleOpenConfigure = (model: any) => {
    setConfiguringModel(model);
  };

  const handleCloseConfigure = () => {
    setConfiguringModel(null);
  };

  const handleSavedConfigure = (updatedModel: any) => {
    queryClient.setQueryData(["/api/portfolio/ai-models"], (old: any[]) =>
      (old || defaultActiveModels).map((m) => (m.id === updatedModel.id ? { ...m, ...updatedModel } : m))
    );
  };

  const handleAnalytics = (model: any) => {
    setLocation(`/analytics/model/${model.id}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Portfolio AI Models</h1>
                <p className="text-muted-foreground">Manage and optimize your AI-powered investment models</p>
              </div>
              <Button asChild className="gap-2">
                <Link href="/marketplace">
                  <Bot className="h-5 w-5" /> Browse Models
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {Array.isArray(activeModels) && activeModels.map((model: any) => (
              <Card key={model.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Bot className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{model.name}</h3>
                          <p className="text-sm text-muted-foreground">{model.category}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {model.status === "active" ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : model.status === "paused" ? (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        <Badge variant={model.status === "active" ? "default" : "secondary"}>
                          {model.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">Updated {model.lastUpdate}</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Portfolio Allocation</span>
                          <span>{model.allocation}%</span>
                        </div>
                        <Progress value={model.allocation} className="h-2" />
                      </div>
                    </div>

                    <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Performance</p>
                        <p className={`text-lg font-bold ${model.performance > 0 ? "text-green-600" : "text-red-600"}`}>
                          {model.performance > 0 ? `+${model.performance}` : model.performance}%
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Accuracy</p>
                        <p className="text-lg font-bold">{model.accuracy}%</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Total Trades</p>
                        <p className="text-lg font-bold">{model.trades}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">P&L</p>
                        <p className={`text-lg font-bold ${model.profitLoss > 0 ? "text-green-600" : "text-red-600"}`}>
                          ${model.profitLoss.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="lg:col-span-3 flex flex-col gap-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Monthly Fee</span>
                        <span className="text-lg font-bold">${model.monthlyFee}</span>
                      </div>

                      <div className="space-y-2">
                        <Button
                          size="sm"
                          variant={model.status === "active" ? "outline" : "default"}
                          className="w-full justify-start gap-2"
                          onClick={() => handleTogglePause(model)}
                          disabled={toggleMutation.isPending}
                        >
                          {model.status === "active" ? (
                            <>
                              <PauseCircle className="h-4 w-4" />
                              Pause
                            </>
                          ) : (
                            <>
                              <PlayCircle className="h-4 w-4" />
                              Resume
                            </>
                          )}
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full justify-start gap-2"
                          onClick={() => handleOpenConfigure(model)}
                        >
                          <Settings className="h-4 w-4" />
                          Configure
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full justify-start gap-2"
                          onClick={() => handleAnalytics(model)}
                        >
                          <BarChart3 className="h-4 w-4" />
                          Analytics
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* NEW: Stakeholder and usage metrics section */}
                  <div className="mt-6">
                    <StakeholderMetrics model={model} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <ConfigureModelDialog
          open={configuringModel !== null}
          model={configuringModel}
          onClose={handleCloseConfigure}
          onSaved={handleSavedConfigure}
        />
      </div>
    </Layout>
  );
}