import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Percent, BarChart } from "lucide-react";

interface PortfolioOverviewProps {
  portfolio: any;
}

export default function PortfolioOverview({ portfolio }: PortfolioOverviewProps) {
  if (!portfolio) {
    return (
      <Card className="glass">
        <CardHeader>
          <CardTitle>Portfolio Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No portfolio data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Portfolio Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Total Investment</p>
            </div>
            <p className="text-2xl font-bold">${parseFloat(portfolio.totalInvestment).toLocaleString()}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <p className="text-sm text-muted-foreground">Live P&L</p>
            </div>
            <p className="text-2xl font-bold text-green-400">
              +${parseFloat(portfolio.livePnL).toLocaleString()}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Percent className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Annual Returns</p>
            </div>
            <p className="text-2xl font-bold">{parseFloat(portfolio.annualReturns).toFixed(1)}%</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <BarChart className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
            </div>
            <p className="text-2xl font-bold">{parseFloat(portfolio.sharpeRatio).toFixed(1)}</p>
          </div>
        </div>
        
        <div className="pt-4 border-t border-border">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Performance vs Market</span>
            <span className="text-green-400 font-semibold">+5.2% better</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
