import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  Square, 
  Activity,
  Clock,
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Zap
} from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface RealTimeMonitorProps {
  backtest: any;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
}

export default function RealTimeMonitor({ backtest, onStop, onPause, onResume }: RealTimeMonitorProps) {
  const [isLive, setIsLive] = useState(backtest.status === 'running');
  const [currentProgress, setCurrentProgress] = useState(0);
  const [liveMetrics, setLiveMetrics] = useState({
    currentValue: 100000,
    dailyPnL: 0,
    totalPnL: 0,
    openPositions: 0,
    todayTrades: 0,
    avgExecutionTime: 120,
    riskUtilization: 45
  });

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Simulate progress update
      setCurrentProgress(prev => {
        const newProgress = prev + Math.random() * 2;
        return newProgress > 100 ? 100 : newProgress;
      });

      // Simulate live metrics updates
      setLiveMetrics(prev => ({
        ...prev,
        currentValue: prev.currentValue + (Math.random() - 0.5) * 1000,
        dailyPnL: (Math.random() - 0.5) * 2000,
        totalPnL: prev.totalPnL + (Math.random() - 0.45) * 500,
        openPositions: Math.floor(Math.random() * 8) + 2,
        todayTrades: prev.todayTrades + (Math.random() > 0.8 ? 1 : 0),
        avgExecutionTime: 100 + Math.random() * 50,
        riskUtilization: 30 + Math.random() * 40
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive]);

  const handleStop = () => {
    setIsLive(false);
    onStop();
  };

  const handlePause = () => {
    setIsLive(false);
    onPause();
  };

  const handleResume = () => {
    setIsLive(true);
    onResume();
  };

  // Real-time chart data
  const realtimeChartData = {
    labels: Array.from({length: 20}, (_, i) => `${9 + Math.floor(i/4)}:${(i%4)*15}`),
    datasets: [
      {
        label: "Portfolio Value",
        data: Array.from({length: 20}, (_, i) => 
          100000 + i * 200 + (Math.random() - 0.5) * 2000
        ),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0 // Disable animation for real-time data
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Activity className={`h-5 w-5 ${isLive ? 'text-green-600' : 'text-gray-400'}`} />
                <span>Live Backtest Monitor</span>
              </CardTitle>
              <CardDescription>Real-time execution monitoring and controls</CardDescription>
            </div>
            <div className="flex space-x-2">
              {backtest.status === 'running' ? (
                <>
                  <Button variant="outline" size="sm" onClick={handlePause}>
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleStop}>
                    <Square className="h-4 w-4 mr-1" />
                    Stop
                  </Button>
                </>
              ) : (
                <Button size="sm" onClick={handleResume}>
                  <Play className="h-4 w-4 mr-1" />
                  Resume
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Backtest Progress</span>
                <span className="text-sm text-muted-foreground">{currentProgress.toFixed(1)}%</span>
              </div>
              <Progress value={currentProgress} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Start: {backtest.startDate}</span>
                <span>Current: {new Date().toISOString().split('T')[0]}</span>
                <span>End: {backtest.endDate}</span>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-sm">
                  {isLive ? 'Running' : 'Paused'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {liveMetrics.avgExecutionTime}ms avg
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {liveMetrics.openPositions} positions
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {liveMetrics.todayTrades} trades today
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${liveMetrics.currentValue.toLocaleString()}
            </div>
            <div className={`text-sm flex items-center ${liveMetrics.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {liveMetrics.totalPnL >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              ${Math.abs(liveMetrics.totalPnL).toLocaleString()} total P&L
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Daily P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${liveMetrics.dailyPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {liveMetrics.dailyPnL >= 0 ? '+' : ''}${liveMetrics.dailyPnL.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              {((liveMetrics.dailyPnL / liveMetrics.currentValue) * 100).toFixed(2)}% today
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Risk Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {liveMetrics.riskUtilization.toFixed(1)}%
            </div>
            <Progress value={liveMetrics.riskUtilization} className="h-2 mt-2" />
            <div className="text-sm text-muted-foreground mt-1">
              of max risk budget
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Execution Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">98.5%</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Fill rate (last 100 orders)
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Live Portfolio Value</CardTitle>
          <CardDescription>Real-time performance tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Line data={realtimeChartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      {/* Recent Trades */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
          <CardDescription>Latest execution activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: "14:32:15", symbol: "AAPL", action: "BUY", quantity: 100, price: 185.42, pnl: "+$245" },
              { time: "14:28:03", symbol: "GOOGL", action: "SELL", quantity: 50, price: 2750.18, pnl: "-$120" },
              { time: "14:25:41", symbol: "MSFT", action: "BUY", quantity: 75, price: 378.95, pnl: "+$890" },
              { time: "14:22:17", symbol: "TSLA", action: "SELL", quantity: 25, price: 245.73, pnl: "+$450" },
            ].map((trade, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Badge variant={trade.action === 'BUY' ? 'default' : 'secondary'}>
                    {trade.action}
                  </Badge>
                  <div>
                    <div className="font-medium">{trade.symbol}</div>
                    <div className="text-sm text-muted-foreground">
                      {trade.quantity} @ ${trade.price}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">{trade.time}</div>
                  <div className={`font-medium ${trade.pnl.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {trade.pnl}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Alerts</CardTitle>
          <CardDescription>Real-time risk monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <div className="text-sm font-medium">Position Concentration Warning</div>
                <div className="text-xs text-muted-foreground">
                  AAPL position exceeds 15% of portfolio (current: 17.2%)
                </div>
              </div>
              <div className="text-xs text-muted-foreground">2m ago</div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <div className="text-sm font-medium">Risk Limit Compliance</div>
                <div className="text-xs text-muted-foreground">
                  All risk limits within acceptable ranges
                </div>
              </div>
              <div className="text-xs text-muted-foreground">5m ago</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}