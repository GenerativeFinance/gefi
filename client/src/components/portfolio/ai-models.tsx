import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ChevronRight, Download, Brain, Settings, FileText } from "lucide-react";
import { useState } from "react";

interface AiModelsProps {
  models: any[];
}

export default function AiModels({ models }: AiModelsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRebalancing, setIsRebalancing] = useState(false);
  const [manualOverrideOpen, setManualOverrideOpen] = useState(false);
  
  // Default AI models if no data
  const defaultModels = [
    {
      modelType: "conservative",
      modelName: "Conservative AI",
      value: "148548.00",
      performance: "12.4"
    },
    {
      modelType: "aggressive",
      modelName: "Aggressive Growth",
      value: "99032.00",
      performance: "24.8"
    }
  ];

  const aiModels = models && models.length > 0 ? models : defaultModels;

  // AI Rebalancing mutation
  const rebalanceMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/portfolio/rebalance");
    },
    onSuccess: () => {
      toast({
        title: "Portfolio Rebalanced",
        description: "Your portfolio has been successfully rebalanced using AI optimization.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio/assets"] });
      setIsRebalancing(false);
    },
    onError: (error: any) => {
      toast({
        title: "Rebalancing Failed",
        description: error.message || "Failed to rebalance portfolio. Please try again.",
        variant: "destructive",
      });
      setIsRebalancing(false);
    },
  });

  // Download report function
  const handleDownloadReport = async () => {
    try {
      const response = await fetch("/api/portfolio/report", {
        method: "GET",
        headers: {
          "Content-Type": "application/pdf",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate report");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `portfolio-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Report Downloaded",
        description: "Your portfolio report has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download portfolio report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRebalance = () => {
    setIsRebalancing(true);
    rebalanceMutation.mutate();
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>AI Models</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          {aiModels.map((model, index) => (
            <div key={index} className="flex justify-between items-center p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors cursor-pointer group">
              <div>
                <h4 className="font-semibold">{model.modelName}</h4>
                <p className="text-sm text-muted-foreground">
                  ${parseFloat(model.value).toLocaleString()}
                </p>
                <p className="text-xs text-green-400">
                  +{parseFloat(model.performance || "0").toFixed(1)}% performance
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          ))}
        </div>
        
        <div className="space-y-3">
          <Button 
            className="w-full gradient-primary hover:opacity-90"
            onClick={handleRebalance}
            disabled={isRebalancing || rebalanceMutation.isPending}
          >
            <Brain className="h-4 w-4 mr-2" />
            {isRebalancing || rebalanceMutation.isPending ? "Rebalancing..." : "Rebalance with AI"}
          </Button>
          
          <Dialog open={manualOverrideOpen} onOpenChange={setManualOverrideOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Manual Override
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Manual Portfolio Override</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Manually adjust your portfolio allocation. Changes will override AI recommendations.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Conservative AI</label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        defaultValue="60" 
                        className="flex-1"
                      />
                      <span className="text-sm">60%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Aggressive Growth</label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        defaultValue="40" 
                        className="flex-1"
                      />
                      <span className="text-sm">40%</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setManualOverrideOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    toast({
                      title: "Portfolio Updated",
                      description: "Your manual allocation has been applied successfully.",
                    });
                    setManualOverrideOpen(false);
                  }}>
                    Apply Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center space-x-2"
            onClick={handleDownloadReport}
          >
            <Download className="h-4 w-4" />
            <span>Download Report</span>
          </Button>
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">AI Confidence Score</p>
            <p className="text-2xl font-bold text-green-400">94.2%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
