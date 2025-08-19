import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Layout from "@/components/layout/Layout";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Settings, 
  Target,
  BarChart3,
  Zap,
  Brain,
  ChevronUp,
  ChevronDown
} from "lucide-react";

export default function AlgorithmicTradingPage() {
  const [strategyType, setStrategyType] = useState("DQN Neural Network");
  const [positionSizeMin, setPositionSizeMin] = useState("1000");
  const [positionSizeMax, setPositionSizeMax] = useState("10000");
  const [stopLoss, setStopLoss] = useState("2.5");
  const [takeProfit, setTakeProfit] = useState("5.0");
  const [currentPrice, setCurrentPrice] = useState(150.58);
  const [spread, setSpread] = useState(0.027);
  const [qValue, setQValue] = useState(0.87);
  const [signal, setSignal] = useState("BUY");

  // Mock real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.5) * 0.5;
        return Math.max(140, Math.min(160, prev + change));
      });
      setSpread(prev => Math.max(0.01, Math.min(0.05, prev + (Math.random() - 0.5) * 0.005)));
      setQValue(prev => Math.max(0, Math.min(1, prev + (Math.random() - 0.5) * 0.1)));
      setSignal(Math.random() > 0.6 ? "BUY" : Math.random() > 0.3 ? "SELL" : "HOLD");
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Generate candlestick data
  const candlestickData = useMemo(() => {
    const data = [];
    let price = currentPrice;
    for (let i = 0; i < 50; i++) {
      const open = price;
      const change = (Math.random() - 0.5) * 2;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * 0.5;
      const low = Math.min(open, close) - Math.random() * 0.5;
      data.push({ open, high, low, close, time: i });
      price = close;
    }
    return data;
  }, [currentPrice]);

  const handleUpdateParameters = () => {
    // Simulate parameter update
    console.log("Updating trading parameters:", {
      strategyType,
      positionSizeMin,
      positionSizeMax,
      stopLoss,
      takeProfit
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Algorithmic & High-Frequency Trading
                </h1>
                <p className="text-muted-foreground">
                  Advanced DQN-powered trading decisions with real-time market analysis
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  <Activity className="h-3 w-3 mr-1" />
                  Live Trading
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Market View & DQN Decisions */}
            <div className="lg:col-span-2">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Market View & DQN Decisions</CardTitle>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Price:</p>
                        <p className="text-xl font-bold">${currentPrice.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Spread:</p>
                        <p className="text-xl font-bold text-muted-foreground">${spread.toFixed(3)}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Live Candlestick Chart */}
                  <div className="bg-gradient-to-br from-blue-900/20 via-teal-900/20 to-green-900/20 rounded-xl p-6 mb-6 min-h-[300px] flex flex-col items-center justify-center border border-blue-500/20">
                    <div className="text-center mb-6">
                      <TrendingUp className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                      <h3 className="text-xl font-semibold text-white mb-2">Live Candlestick Chart</h3>
                      <p className="text-blue-200/80">Real-time market data with DQN decision overlay</p>
                    </div>
                    
                    {/* Simple candlestick visualization */}
                    <div className="flex items-end gap-1 mb-6">
                      {candlestickData.slice(-20).map((candle, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div 
                            className={`w-2 ${candle.close > candle.open ? 'bg-green-400' : 'bg-red-400'}`}
                            style={{ height: Math.max(2, (candle.high - candle.low) * 20) }}
                          />
                          <div 
                            className={`w-4 mt-1 ${candle.close > candle.open ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ height: Math.max(1, Math.abs(candle.close - candle.open) * 40) }}
                          />
                        </div>
                      ))}
                    </div>

                    {/* DQN Decision Display */}
                    <div className="flex items-center gap-4">
                      <Badge 
                        className={`px-4 py-2 text-sm font-medium ${
                          signal === "BUY" ? "bg-green-600 text-white" :
                          signal === "SELL" ? "bg-red-600 text-white" :
                          "bg-gray-600 text-white"
                        }`}
                      >
                        {signal} Signal
                      </Badge>
                      <div className="text-white">
                        <span className="text-sm opacity-80">Q-Value: </span>
                        <span className="font-bold">{qValue.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Trading Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Win Rate</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">87.3%</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Trades/Min</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">24.7</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">Neural Score</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-600">0.94</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-medium">P&L Today</span>
                      </div>
                      <p className="text-2xl font-bold text-emerald-600">+$1,247</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trading Parameters */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-900 border-gray-700 text-white">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <Settings className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-white">Trading Parameters</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Strategy Type */}
                  <div className="space-y-2">
                    <Label className="text-white font-medium">Strategy Type</Label>
                    <Select value={strategyType} onValueChange={setStrategyType}>
                      <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DQN Neural Network">DQN Neural Network</SelectItem>
                        <SelectItem value="LSTM Predictor">LSTM Predictor</SelectItem>
                        <SelectItem value="Reinforcement Learning">Reinforcement Learning</SelectItem>
                        <SelectItem value="Genetic Algorithm">Genetic Algorithm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Position Size */}
                  <div className="space-y-3">
                    <Label className="text-white font-medium">Position Size</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <Input
                          value={positionSizeMin}
                          onChange={(e) => setPositionSizeMin(e.target.value)}
                          placeholder="Min"
                          className="bg-white border-gray-300 text-gray-900 pr-8"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                          <ChevronUp className="h-3 w-3 text-gray-500 cursor-pointer" />
                          <ChevronDown className="h-3 w-3 text-gray-500 cursor-pointer" />
                        </div>
                      </div>
                      <div className="relative">
                        <Input
                          value={positionSizeMax}
                          onChange={(e) => setPositionSizeMax(e.target.value)}
                          placeholder="Max"
                          className="bg-white border-gray-300 text-gray-900 pr-8"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                          <ChevronUp className="h-3 w-3 text-gray-500 cursor-pointer" />
                          <ChevronDown className="h-3 w-3 text-gray-500 cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Risk Controls */}
                  <div className="space-y-3">
                    <Label className="text-white font-medium">Risk Controls</Label>
                    <div className="space-y-3">
                      <div className="relative">
                        <Input
                          value={stopLoss}
                          onChange={(e) => setStopLoss(e.target.value)}
                          placeholder="Stop Loss %"
                          className="bg-white border-gray-300 text-gray-900 pr-8"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                          <ChevronUp className="h-3 w-3 text-gray-500 cursor-pointer" />
                          <ChevronDown className="h-3 w-3 text-gray-500 cursor-pointer" />
                        </div>
                      </div>
                      <div className="relative">
                        <Input
                          value={takeProfit}
                          onChange={(e) => setTakeProfit(e.target.value)}
                          placeholder="Take Profit %"
                          className="bg-white border-gray-300 text-gray-900 pr-8"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                          <ChevronUp className="h-3 w-3 text-gray-500 cursor-pointer" />
                          <ChevronDown className="h-3 w-3 text-gray-500 cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Update Button */}
                  <Button 
                    onClick={handleUpdateParameters}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Update Parameters
                  </Button>
                </CardContent>
              </Card>

              {/* Performance Summary */}
              <Card className="mt-6 border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Performance Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Trades</span>
                    <span className="font-semibold">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Profitable Trades</span>
                    <span className="font-semibold text-green-600">1,089</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average Holding</span>
                    <span className="font-semibold">2.3s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
                    <span className="font-semibold text-blue-600">2.84</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Max Drawdown</span>
                    <span className="font-semibold text-red-600">-1.2%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}