import type { Express } from "express";
import { z } from "zod";
import { nanoid } from "nanoid";

const BacktestConfigSchema = z.object({
  modelId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  initialCapital: z.number().positive(),
  benchmark: z.string(),
  assets: z.array(z.string()),
  riskParameters: z.object({
    maxDrawdown: z.number(),
    stopLoss: z.number(),
    positionSize: z.number()
  }),
  dataSource: z.string(),
  frequency: z.string()
});

// In-memory storage for backtest results (in production, use database)
const backtestResults = new Map();
const runningBacktests = new Map();

// Simulated backtest execution
function simulateBacktest(config: any, backtestId: string) {
  const startTime = new Date().toISOString();
  
  // Generate realistic performance data
  const generatePerformanceData = () => {
    const startDate = new Date(config.startDate);
    const endDate = new Date(config.endDate);
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const dates = [];
    const portfolioValue = [];
    const benchmarkValue = [];
    const drawdown = [];
    const returns = [];
    
    let portfolioVal = config.initialCapital;
    let benchmarkVal = config.initialCapital;
    let peak = config.initialCapital;
    
    for (let i = 0; i <= daysDiff; i += 7) { // Weekly data points
      const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      dates.push(currentDate.toISOString().split('T')[0]);
      
      // Simulate portfolio performance with some volatility
      const portfolioReturn = (Math.random() - 0.4) * 0.02; // Slight positive bias
      const benchmarkReturn = (Math.random() - 0.45) * 0.015; // Slightly less positive bias
      
      portfolioVal *= (1 + portfolioReturn);
      benchmarkVal *= (1 + benchmarkReturn);
      
      portfolioValue.push(portfolioVal);
      benchmarkValue.push(benchmarkVal);
      returns.push(portfolioReturn);
      
      // Calculate drawdown
      if (portfolioVal > peak) {
        peak = portfolioVal;
      }
      const currentDrawdown = (portfolioVal - peak) / peak;
      drawdown.push(currentDrawdown);
    }
    
    return { dates, portfolioValue, benchmarkValue, drawdown, returns };
  };

  // Generate trades
  const generateTrades = () => {
    const trades = [];
    const numTrades = Math.floor(Math.random() * 50) + 20; // 20-70 trades
    
    for (let i = 0; i < numTrades; i++) {
      const asset = config.assets[Math.floor(Math.random() * config.assets.length)];
      const action = Math.random() > 0.5 ? 'buy' : 'sell';
      const quantity = Math.floor(Math.random() * 100) + 1;
      const price = Math.random() * 300 + 50; // $50-$350
      
      trades.push({
        date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        symbol: asset,
        action,
        quantity,
        price,
        value: quantity * price,
        reason: action === 'buy' ? 'Signal strength above threshold' : 'Risk management exit'
      });
    }
    
    return trades.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const performance = generatePerformanceData();
  const trades = generateTrades();
  
  // Calculate metrics
  const totalReturn = (performance.portfolioValue[performance.portfolioValue.length - 1] - config.initialCapital) / config.initialCapital;
  const volatility = Math.sqrt(performance.returns.reduce((sum, r) => sum + r * r, 0) / performance.returns.length) * Math.sqrt(252);
  const maxDrawdown = Math.min(...performance.drawdown);
  const winningTrades = trades.filter(t => t.action === 'sell').length;
  const totalTrades = trades.length;
  const winRate = totalTrades > 0 ? winningTrades / totalTrades : 0;
  
  const result = {
    id: backtestId,
    config,
    status: 'completed',
    progress: 100,
    startTime,
    endTime: new Date().toISOString(),
    metrics: {
      totalReturn,
      annualizedReturn: totalReturn * 0.8, // Approximate annualized
      sharpeRatio: totalReturn / volatility,
      maxDrawdown,
      volatility,
      winRate,
      profitFactor: 1.2 + Math.random() * 0.8, // 1.2-2.0
      calmarRatio: totalReturn / Math.abs(maxDrawdown),
      sortinoRatio: 1.1 + Math.random() * 0.9, // 1.1-2.0
      beta: 0.8 + Math.random() * 0.4, // 0.8-1.2
      alpha: (Math.random() - 0.5) * 0.1, // -5% to +5%
      informationRatio: 0.5 + Math.random() * 1.0 // 0.5-1.5
    },
    performance,
    trades,
    riskAnalysis: {
      varDaily: -0.02 - Math.random() * 0.03, // -2% to -5%
      varMonthly: -0.08 - Math.random() * 0.12, // -8% to -20%
      expectedShortfall: -0.025 - Math.random() * 0.035, // -2.5% to -6%
      correlations: config.assets.reduce((acc: any, asset: string) => {
        acc[asset] = 0.3 + Math.random() * 0.4; // 0.3-0.7 correlation
        return acc;
      }, {})
    }
  };

  backtestResults.set(backtestId, result);
  runningBacktests.delete(backtestId);
}

export function registerBacktestingRoutes(app: Express) {
  // Run a new backtest
  app.post("/api/backtesting/run", async (req, res) => {
    try {
      const config = BacktestConfigSchema.parse(req.body);
      const backtestId = nanoid();
      
      // Create initial backtest record
      const initialResult = {
        id: backtestId,
        config,
        status: 'running',
        progress: 0,
        startTime: new Date().toISOString(),
        metrics: {},
        performance: { dates: [], portfolioValue: [], benchmarkValue: [], drawdown: [], returns: [] },
        trades: [],
        riskAnalysis: {}
      };
      
      runningBacktests.set(backtestId, initialResult);
      
      // Simulate backtest execution (in production, this would be a real backtesting engine)
      setTimeout(() => {
        simulateBacktest(config, backtestId);
      }, 2000 + Math.random() * 3000); // 2-5 seconds delay
      
      res.json({ id: backtestId, message: "Backtest started successfully" });
    } catch (error) {
      console.error("Error starting backtest:", error);
      res.status(400).json({ 
        error: "Invalid backtest configuration",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get all backtest results
  app.get("/api/backtesting/results", async (req, res) => {
    try {
      const allResults = [
        ...Array.from(runningBacktests.values()),
        ...Array.from(backtestResults.values())
      ];
      
      // Sort by start time (newest first)
      allResults.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
      
      res.json(allResults);
    } catch (error) {
      console.error("Error fetching backtest results:", error);
      res.status(500).json({ error: "Failed to fetch backtest results" });
    }
  });

  // Get specific backtest result
  app.get("/api/backtesting/results/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const result = backtestResults.get(id) || runningBacktests.get(id);
      
      if (!result) {
        return res.status(404).json({ error: "Backtest not found" });
      }
      
      res.json(result);
    } catch (error) {
      console.error("Error fetching backtest result:", error);
      res.status(500).json({ error: "Failed to fetch backtest result" });
    }
  });

  // Delete backtest result
  app.delete("/api/backtesting/results/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const deleted = backtestResults.delete(id) || runningBacktests.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Backtest not found" });
      }
      
      res.json({ message: "Backtest result deleted successfully" });
    } catch (error) {
      console.error("Error deleting backtest result:", error);
      res.status(500).json({ error: "Failed to delete backtest result" });
    }
  });

  // Get backtest status (for polling)
  app.get("/api/backtesting/status/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const result = backtestResults.get(id) || runningBacktests.get(id);
      
      if (!result) {
        return res.status(404).json({ error: "Backtest not found" });
      }
      
      res.json({
        id: result.id,
        status: result.status,
        progress: result.progress,
        startTime: result.startTime,
        endTime: result.endTime
      });
    } catch (error) {
      console.error("Error fetching backtest status:", error);
      res.status(500).json({ error: "Failed to fetch backtest status" });
    }
  });

  // Export backtest results
  app.get("/api/backtesting/export/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const format = req.query.format || 'json';
      
      const result = backtestResults.get(id);
      
      if (!result) {
        return res.status(404).json({ error: "Backtest not found" });
      }
      
      if (format === 'csv') {
        // Generate CSV format
        const csvData = [
          'Date,Portfolio Value,Benchmark Value,Drawdown,Return',
          ...result.performance.dates.map((date: string, i: number) => 
            `${date},${result.performance.portfolioValue[i]},${result.performance.benchmarkValue[i]},${result.performance.drawdown[i]},${result.performance.returns[i]}`
          )
        ].join('\n');
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="backtest_${id}.csv"`);
        res.send(csvData);
      } else {
        // JSON format
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="backtest_${id}.json"`);
        res.json(result);
      }
    } catch (error) {
      console.error("Error exporting backtest result:", error);
      res.status(500).json({ error: "Failed to export backtest result" });
    }
  });

  // Get backtest configuration templates
  app.get("/api/backtesting/templates", async (req, res) => {
    try {
      const templates = [
        {
          id: 'conservative',
          name: 'Conservative Portfolio',
          description: 'Low-risk, diversified portfolio strategy',
          config: {
            initialCapital: 100000,
            benchmark: 'SPY',
            assets: ['SPY', 'BND', 'VTI', 'VXUS'],
            riskParameters: {
              maxDrawdown: 10,
              stopLoss: 3,
              positionSize: 5
            },
            dataSource: 'yahoo',
            frequency: 'daily'
          }
        },
        {
          id: 'aggressive',
          name: 'Aggressive Growth',
          description: 'High-risk, high-reward growth strategy',
          config: {
            initialCapital: 100000,
            benchmark: 'QQQ',
            assets: ['TSLA', 'NVDA', 'AMZN', 'GOOGL', 'MSFT'],
            riskParameters: {
              maxDrawdown: 30,
              stopLoss: 8,
              positionSize: 15
            },
            dataSource: 'yahoo',
            frequency: 'daily'
          }
        },
        {
          id: 'momentum',
          name: 'Momentum Strategy',
          description: 'Trend-following momentum strategy',
          config: {
            initialCapital: 100000,
            benchmark: 'SPY',
            assets: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA'],
            riskParameters: {
              maxDrawdown: 20,
              stopLoss: 5,
              positionSize: 10
            },
            dataSource: 'yahoo',
            frequency: 'daily'
          }
        }
      ];
      
      res.json(templates);
    } catch (error) {
      console.error("Error fetching backtest templates:", error);
      res.status(500).json({ error: "Failed to fetch backtest templates" });
    }
  });
}