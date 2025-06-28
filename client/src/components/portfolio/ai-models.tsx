import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Download } from "lucide-react";

interface AiModelsProps {
  models: any[];
}

export default function AiModels({ models }: AiModelsProps) {
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
          <Button className="w-full gradient-primary hover:opacity-90">
            Rebalance with AI
          </Button>
          <Button variant="outline" className="w-full">
            Manual Override
          </Button>
          <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
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
