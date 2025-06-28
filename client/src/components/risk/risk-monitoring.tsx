import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Calculator, BarChart, Beaker } from "lucide-react";

export default function RiskMonitoring() {
  const riskTools = [
    {
      icon: TrendingUp,
      title: "Market Anomalies",
      description: "Real-time detection",
      color: "text-primary"
    },
    {
      icon: Calculator,
      title: "VaR Estimation",
      description: "Value at Risk analysis",
      color: "text-blue-400"
    },
    {
      icon: BarChart,
      title: "Tail Risk",
      description: "Extreme event analysis",
      color: "text-purple-400"
    },
    {
      icon: Beaker,
      title: "Stress Testing",
      description: "Scenario simulations",
      color: "text-green-400"
    }
  ];

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span>AI Risk Monitoring</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {riskTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <div 
                key={index}
                className="p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors cursor-pointer group"
              >
                <Icon className={`h-8 w-8 ${tool.color} mb-3 group-hover:scale-110 transition-transform`} />
                <h4 className="font-semibold text-sm mb-1">{tool.title}</h4>
                <p className="text-xs text-muted-foreground">{tool.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
          <h4 className="font-semibold mb-2">Current Risk Assessment</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Portfolio VaR (1-day, 95%)</span>
              <span className="text-sm font-semibold">-$12,380</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Maximum Drawdown</span>
              <span className="text-sm font-semibold">-8.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Risk Score</span>
              <span className="text-sm font-semibold text-yellow-400">Moderate</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
