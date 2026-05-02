import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, DollarSign, PieChart, AlertTriangle } from "lucide-react";

interface MarketInsightsProps {
  insights: any[];
}

export default function MarketInsights({ insights }: MarketInsightsProps) {
  return (
    <Card className="glass">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span>AI-Generated Market Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Real-Time Market Sentiment */}
          <div className="p-4 bg-secondary/50 rounded-lg">
            <h4 className="font-semibold mb-2">Real-Time Market Sentiment</h4>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Current sentiment</span>
              <span className="text-green-400 font-semibold">75% Bullish</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>

          {/* Macroeconomic Trends */}
          <div className="p-4 bg-secondary/50 rounded-lg">
            <h4 className="font-semibold mb-4">Macroeconomic Trends</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">USD Index</p>
                <p className="text-lg font-semibold">102.4</p>
                <p className="text-xs text-green-400">+0.3%</p>
              </div>
              <div className="text-center">
                <PieChart className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">GDP Growth</p>
                <p className="text-lg font-semibold">2.8%</p>
                <p className="text-xs text-yellow-400">Stable</p>
              </div>
            </div>
          </div>

          {/* Fed Decision Prediction */}
          <div className="p-4 bg-secondary/50 rounded-lg">
            <h4 className="font-semibold mb-2">Fed Decision Prediction</h4>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <p className="text-sm text-muted-foreground">
                AI predicts 0.25% rate cut probability: 68%
              </p>
            </div>
          </div>

          {/* Additional Insights */}
          {insights && insights.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold">Latest AI Insights</h4>
              {insights.slice(0, 3).map((insight: any, index) => (
                <div key={index} className="p-3 bg-secondary/30 rounded-lg">
                  <h5 className="text-sm font-medium">{insight.title}</h5>
                  <p className="text-xs text-muted-foreground">{insight.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
