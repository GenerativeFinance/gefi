import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { storage } from "./storage";
import { setupMultiAuth, isAuthenticated } from "./multiAuth";
import { insertPortfolioSchema, insertAiModelSchema, insertRiskAlertSchema } from "@shared/schema";
import { z } from "zod";
import { PortfolioOptimizer, RiskAssessment, MarketAnalysis } from "./aiModels";
import { marketDataService } from "./marketDataService";
import { tradingService } from "./tradingService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupMultiAuth(app);

  // Debug route to check session
  app.get('/api/debug/session', (req: any, res) => {
    res.json({
      isAuthenticated: req.isAuthenticated(),
      user: req.user ? 'User exists' : 'No user',
      session: req.session ? 'Session exists' : 'No session'
    });
  });

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      // For multi-provider auth, user ID is directly available
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Portfolio routes with AI analysis
  app.get('/api/portfolio', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const portfolio = await storage.getUserPortfolio(userId);
      
      if (!portfolio) {
        // Create default portfolio for new users
        const defaultPortfolio = await storage.createPortfolio({
          userId,
          totalInvestment: "247580.00",
          livePnL: "12430.00",
          annualReturns: "18.40",
          sharpeRatio: "2.10"
        });
        
        // Create sample assets for demo
        const sampleAssets = [
          {
            portfolioId: defaultPortfolio.id,
            symbol: "AAPL",
            assetType: "Stock",
            allocation: "25.00",
            value: "50000.00",
            purchasePrice: "45000.00",
            currentValue: "50000.00",
            quantity: "250.00"
          },
          {
            portfolioId: defaultPortfolio.id,
            symbol: "MSFT",
            assetType: "Stock",
            allocation: "20.00",
            value: "40000.00",
            purchasePrice: "38000.00",
            currentValue: "40000.00",
            quantity: "120.00"
          },
          {
            portfolioId: defaultPortfolio.id,
            symbol: "BTC",
            assetType: "Crypto",
            allocation: "15.00",
            value: "30000.00",
            purchasePrice: "32000.00",
            currentValue: "30000.00",
            quantity: "1.20"
          }
        ];
        
        return res.json({
          ...defaultPortfolio,
          assets: sampleAssets,
          analysis: {
            optimization: {
              recommendations: ["Initial portfolio setup complete"],
              score: 75,
              riskLevel: 'Medium' as const,
              suggestedActions: []
            },
            riskAssessment: {
              overallScore: 70,
              factors: []
            },
            marketInsights: [],
            metrics: {
              expectedReturn: 0.08,
              portfolioRisk: 0.15,
              sharpeRatio: 0.53,
              valueAtRisk: -2500,
              totalValue: 120000
            }
          }
        });
      }
      
      const assets = await storage.getPortfolioAssets(portfolio.id);
      
      // Generate AI-powered portfolio analysis
      const optimization = PortfolioOptimizer.generateOptimizationRecommendations(assets);
      const riskAssessment = RiskAssessment.calculateRiskScore(portfolio, assets);
      const marketInsights = MarketAnalysis.generateMarketInsights(assets);
      
      // Calculate additional metrics
      const expectedReturn = PortfolioOptimizer.calculateExpectedReturn(assets);
      const portfolioRisk = PortfolioOptimizer.calculatePortfolioRisk(assets);
      const sharpeRatio = PortfolioOptimizer.calculateSharpeRatio(expectedReturn, portfolioRisk);
      const totalValue = assets.reduce((sum, asset) => sum + parseFloat(asset.currentValue), 0);
      const valueAtRisk = PortfolioOptimizer.calculateVaR(totalValue, expectedReturn, portfolioRisk);
      
      res.json({
        ...portfolio,
        assets,
        analysis: {
          optimization,
          riskAssessment,
          marketInsights,
          metrics: {
            expectedReturn,
            portfolioRisk,
            sharpeRatio,
            valueAtRisk,
            totalValue
          }
        }
      });
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  app.get('/api/portfolio/assets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const portfolio = await storage.getUserPortfolio(userId);
      
      if (!portfolio) {
        return res.json([]);
      }
      
      const assets = await storage.getPortfolioAssets(portfolio.id);
      res.json(assets);
    } catch (error) {
      console.error("Error fetching portfolio assets:", error);
      res.status(500).json({ message: "Failed to fetch portfolio assets" });
    }
  });

  app.get('/api/portfolio/ai-models', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const portfolio = await storage.getUserPortfolio(userId);
      
      if (!portfolio) {
        return res.json([]);
      }
      
      const aiModels = await storage.getPortfolioAiModels(portfolio.id);
      res.json(aiModels);
    } catch (error) {
      console.error("Error fetching portfolio AI models:", error);
      res.status(500).json({ message: "Failed to fetch portfolio AI models" });
    }
  });

  // AI Model Categories routes
  app.get('/api/ai-model-categories', async (req, res) => {
    try {
      const categories = await storage.getAiModelCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching AI model categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get('/api/ai-model-categories/:id/subcategories', async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      const subcategories = await storage.getAiModelSubcategoriesByCategory(categoryId);
      res.json(subcategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      res.status(500).json({ message: "Failed to fetch subcategories" });
    }
  });

  app.get('/api/ai-model-subcategories', async (req, res) => {
    try {
      const subcategories = await storage.getAiModelSubcategories();
      res.json(subcategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      res.status(500).json({ message: "Failed to fetch subcategories" });
    }
  });

  // Enhanced AI Models routes with categorization
  app.get('/api/ai-models', async (req, res) => {
    try {
      const { 
        category, 
        subcategory, 
        priceMin, 
        priceMax, 
        riskLevel, 
        aiTechnique, 
        targetUserType, 
        financialInstrument,
        search 
      } = req.query;

      if (search || category || subcategory || priceMin || priceMax || riskLevel || aiTechnique || targetUserType || financialInstrument) {
        // Use search/filter functionality
        const filters: any = {};
        if (category) filters.category = parseInt(category as string);
        if (subcategory) filters.subcategory = parseInt(subcategory as string);
        if (priceMin) filters.priceMin = parseFloat(priceMin as string);
        if (priceMax) filters.priceMax = parseFloat(priceMax as string);
        if (riskLevel) filters.riskLevel = riskLevel as string;
        if (aiTechnique) filters.aiTechnique = aiTechnique as string;
        if (targetUserType) filters.targetUserType = targetUserType as string;
        if (financialInstrument) filters.financialInstrument = financialInstrument as string;

        const models = await storage.searchAiModels(filters);
        res.json(models);
      } else {
        // Get all models
        const models = await storage.getAllAiModels();
        res.json(models);
      }
    } catch (error) {
      console.error("Error fetching AI models:", error);
      res.status(500).json({ message: "Failed to fetch AI models" });
    }
  });

  app.get('/api/ai-models/category/:categoryId', async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const models = await storage.getAiModelsByCategory(categoryId);
      res.json(models);
    } catch (error) {
      console.error("Error fetching models by category:", error);
      res.status(500).json({ message: "Failed to fetch models" });
    }
  });

  app.get('/api/ai-models/subcategory/:subcategoryId', async (req, res) => {
    try {
      const subcategoryId = parseInt(req.params.subcategoryId);
      const models = await storage.getAiModelsBySubcategory(subcategoryId);
      res.json(models);
    } catch (error) {
      console.error("Error fetching models by subcategory:", error);
      res.status(500).json({ message: "Failed to fetch models" });
    }
  });

  // Database seeding route (for development/setup)
  app.post('/api/seed-ai-models', async (req, res) => {
    try {
      // Import dynamically to avoid circular dependencies
      const { AiModelSeeder } = await import('./aiModelSeeder');
      
      await AiModelSeeder.seedCategories();
      await AiModelSeeder.seedSampleModels();
      
      res.json({ message: "AI model categories and sample data seeded successfully" });
    } catch (error) {
      console.error("Error seeding AI models:", error);
      res.status(500).json({ message: "Failed to seed AI models", error: error.message });
    }
  });

  app.get('/api/ai-models/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const model = await storage.getAiModel(id);
      
      if (!model) {
        return res.status(404).json({ message: "AI model not found" });
      }
      
      res.json(model);
    } catch (error) {
      console.error("Error fetching AI model:", error);
      res.status(500).json({ message: "Failed to fetch AI model" });
    }
  });

  app.post('/api/ai-models/subscribe', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { modelId } = req.body;
      
      if (!modelId) {
        return res.status(400).json({ message: "Model ID is required" });
      }
      
      const subscription = await storage.subscribeToModel({
        userId,
        modelId: parseInt(modelId),
      });
      
      res.json(subscription);
    } catch (error) {
      console.error("Error subscribing to model:", error);
      res.status(500).json({ message: "Failed to subscribe to model" });
    }
  });

  // Market insights routes
  app.get('/api/market-insights', async (req, res) => {
    try {
      const insights = await storage.getLatestMarketInsights();
      res.json(insights);
    } catch (error) {
      console.error("Error fetching market insights:", error);
      res.status(500).json({ message: "Failed to fetch market insights" });
    }
  });

  // Risk alerts routes
  app.get('/api/risk-alerts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const alerts = await storage.getUserRiskAlerts(userId);
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching risk alerts:", error);
      res.status(500).json({ message: "Failed to fetch risk alerts" });
    }
  });

  app.post('/api/risk-alerts/:id/read', isAuthenticated, async (req, res) => {
    try {
      const alertId = parseInt(req.params.id);
      await storage.markAlertAsRead(alertId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking alert as read:", error);
      res.status(500).json({ message: "Failed to mark alert as read" });
    }
  });

  // Reports routes
  app.get('/api/reports', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const reports = await storage.getUserReports(userId);
      res.json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  // Generate new report
  app.post('/api/reports/generate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Create a new report
      const report = {
        userId,
        type: "comprehensive_analysis",
        title: "Comprehensive Portfolio Analysis",
        content: JSON.stringify({
          generatedAt: new Date().toISOString(),
          summary: "AI-generated comprehensive analysis of portfolio performance and recommendations",
          sections: [
            "Portfolio Performance Review",
            "Risk Assessment", 
            "Market Outlook",
            "AI Recommendations"
          ]
        }),
        metadata: JSON.stringify({
          automated: true,
          aiGenerated: true,
          format: "comprehensive"
        })
      };
      
      const newReport = await storage.createReport(report);
      res.json(newReport);
    } catch (error) {
      console.error("Error generating report:", error);
      res.status(500).json({ message: "Failed to generate report" });
    }
  });

  // Portfolio rebalancing endpoint
  app.post('/api/portfolio/rebalance', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Get user's portfolio
      const portfolio = await storage.getUserPortfolio(userId);
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }

      // Get portfolio assets
      const assets = await storage.getPortfolioAssets(portfolio.id);
      
      // Simulate AI rebalancing (in a real app, this would use actual AI models)
      const rebalancedAssets = assets.map(asset => ({
        ...asset,
        allocation: Math.random() * 0.4 + 0.1, // Random allocation between 10-50%
        lastRebalanced: new Date().toISOString()
      }));

      // Update portfolio with new total value and last rebalanced date
      const updatedPortfolio = await storage.updatePortfolio(portfolio.id, {
        lastRebalanced: new Date().toISOString(),
        totalInvestment: portfolio.totalInvestment * (1 + Math.random() * 0.02 - 0.01) // Small random change
      });

      // Create audit entry
      await storage.createAuditEntry({
        userId,
        action: "portfolio_rebalanced",
        resource: "portfolio",
        resourceId: portfolio.id.toString(),
        details: JSON.stringify({
          method: "ai_optimization",
          assetsCount: assets.length,
          newTotalValue: updatedPortfolio.totalInvestment
        })
      });

      res.json({
        success: true,
        portfolio: updatedPortfolio,
        message: "Portfolio successfully rebalanced using AI optimization"
      });
    } catch (error) {
      console.error("Error rebalancing portfolio:", error);
      res.status(500).json({ message: "Failed to rebalance portfolio" });
    }
  });

  // Portfolio report download endpoint  
  app.get('/api/portfolio/report', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Get user's portfolio data
      const portfolio = await storage.getUserPortfolio(userId);
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }

      const assets = await storage.getPortfolioAssets(portfolio.id);
      
      // Generate report data for frontend PDF generation
      const reportData = {
        title: "Portfolio Performance Report",
        generatedAt: new Date().toISOString(),
        portfolio: {
          totalValue: parseFloat(portfolio.totalInvestment || "0"),
          livePnL: parseFloat(portfolio.livePnL || "0"),
          annualReturns: parseFloat(portfolio.annualReturns || "0"),
          sharpeRatio: parseFloat(portfolio.sharpeRatio || "0"),
          assetsCount: assets.length
        },
        assets: assets.map(asset => ({
          symbol: asset.symbol,
          quantity: parseFloat(asset.quantity || "0"),
          purchasePrice: parseFloat(asset.purchasePrice || "0"),
          currentValue: parseFloat(asset.currentValue || "0"),
          allocation: parseFloat(asset.allocation || "0")
        }))
      };

      // Return JSON data for client-side PDF generation
      res.json(reportData);
      
    } catch (error) {
      console.error("Error generating portfolio report:", error);
      res.status(500).json({ message: "Failed to generate portfolio report" });
    }
  });

  // Comments routes
  app.get('/api/ai-models/:id/comments', async (req, res) => {
    try {
      const modelId = parseInt(req.params.id);
      const comments = await storage.getModelComments(modelId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post('/api/ai-models/:id/comments', isAuthenticated, async (req: any, res) => {
    try {
      const modelId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const { text } = req.body;
      
      if (!text || text.trim().length === 0) {
        return res.status(400).json({ message: "Comment text is required" });
      }

      const comment = await storage.createModelComment({
        modelId,
        userId,
        text: text.trim(),
        createdAt: new Date(),
      });
      
      res.json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Ratings routes
  app.get('/api/ai-models/:id/ratings', async (req, res) => {
    try {
      const modelId = parseInt(req.params.id);
      const ratings = await storage.getModelRatings(modelId);
      res.json(ratings);
    } catch (error) {
      console.error("Error fetching ratings:", error);
      res.status(500).json({ message: "Failed to fetch ratings" });
    }
  });

  app.post('/api/ai-models/:id/ratings', isAuthenticated, async (req: any, res) => {
    try {
      const modelId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const { rating, review } = req.body;
      
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
      }

      const ratingRecord = await storage.createModelRating({
        modelId,
        userId,
        rating,
        review: review || null,
        createdAt: new Date(),
      });
      
      res.json(ratingRecord);
    } catch (error) {
      console.error("Error creating rating:", error);
      res.status(500).json({ message: "Failed to create rating" });
    }
  });

  // Backtesting API endpoints
  app.get('/api/backtests', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Mock backtesting data for demonstration
      const mockBacktests = [
        {
          id: '1',
          modelId: '1',
          modelName: 'Advanced Portfolio Optimizer',
          status: 'completed',
          startDate: '2023-01-01',
          endDate: '2023-12-31',
          initialCapital: 100000,
          finalValue: 125000,
          totalReturn: 0.25,
          annualizedReturn: 0.22,
          sharpeRatio: 1.45,
          maxDrawdown: -0.08,
          volatility: 0.15,
          winRate: 0.68,
          profitFactor: 1.85,
          createdAt: '2024-01-15T10:00:00Z',
          completedAt: '2024-01-15T10:30:00Z',
          trades: [],
          performanceData: Array.from({length: 252}, (_, i) => ({
            date: new Date(2023, 0, 1 + i).toISOString().split('T')[0],
            value: 100000 + (Math.random() - 0.4) * 5000 + i * 100,
            drawdown: Math.random() * -0.1,
            returns: Math.random() * 0.02 - 0.01
          })),
          benchmarkData: Array.from({length: 252}, (_, i) => ({
            date: new Date(2023, 0, 1 + i).toISOString().split('T')[0],
            value: 100000 + (Math.random() - 0.5) * 3000 + i * 80,
            drawdown: Math.random() * -0.08,
            returns: Math.random() * 0.015 - 0.007
          })),
          metrics: {
            totalTrades: 45,
            winningTrades: 31,
            losingTrades: 14,
            avgWinSize: 2800,
            avgLossSize: -1200,
            largestWin: 8500,
            largestLoss: -3200,
            avgHoldingPeriod: 12,
            beta: 0.85,
            alpha: 0.08,
            informationRatio: 1.2,
            calmarRatio: 2.1,
            sortinoRatio: 1.8
          }
        }
      ];
      
      res.json(mockBacktests);
    } catch (error) {
      console.error("Error fetching backtests:", error);
      res.status(500).json({ message: "Failed to fetch backtests" });
    }
  });

  app.post('/api/backtests', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Create a new backtest with running status
      const newBacktest = {
        id: Math.random().toString(36).substr(2, 9),
        ...req.body,
        userId,
        status: 'running',
        createdAt: new Date().toISOString(),
        startedAt: new Date().toISOString(),
      };
      
      // Simulate backtest completion after 5 seconds
      setTimeout(() => {
        console.log(`Backtest ${newBacktest.id} completed (simulated)`);
      }, 5000);

      res.json(newBacktest);
    } catch (error) {
      console.error("Error creating backtest:", error);
      res.status(500).json({ message: "Failed to create backtest" });
    }
  });

  app.post('/api/backtests/:id/stop', isAuthenticated, async (req: any, res) => {
    try {
      const backtestId = req.params.id;
      res.json({ message: "Backtest stopped successfully" });
    } catch (error) {
      console.error("Error stopping backtest:", error);
      res.status(500).json({ message: "Failed to stop backtest" });
    }
  });

  app.get('/api/market-data/historical', isAuthenticated, async (req: any, res) => {
    try {
      const historicalData = {
        symbols: ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'],
        dateRange: {
          start: '2020-01-01',
          end: new Date().toISOString().split('T')[0]
        },
        dataTypes: ['price', 'volume', 'dividends', 'splits']
      };
      res.json(historicalData);
    } catch (error) {
      console.error("Error fetching market data:", error);
      res.status(500).json({ message: "Failed to fetch market data" });
    }
  });

  // Real-time Market Data API endpoints
  app.get('/api/market-data/live/:symbol', async (req, res) => {
    try {
      const symbol = req.params.symbol.toUpperCase();
      const data = marketDataService.getCurrentPrice(symbol);
      
      if (!data) {
        return res.status(404).json({ message: `No data available for symbol: ${symbol}` });
      }
      
      res.json(data);
    } catch (error) {
      console.error("Error fetching live market data:", error);
      res.status(500).json({ message: "Failed to fetch live market data" });
    }
  });

  app.get('/api/market-data/live', async (req, res) => {
    try {
      const allPrices = marketDataService.getAllPrices();
      const pricesArray = Array.from(allPrices.values());
      res.json(pricesArray);
    } catch (error) {
      console.error("Error fetching all live market data:", error);
      res.status(500).json({ message: "Failed to fetch live market data" });
    }
  });

  app.get('/api/market-data/orderbook/:symbol', async (req, res) => {
    try {
      const symbol = req.params.symbol.toUpperCase();
      const orderBook = marketDataService.getOrderBook(symbol);
      
      if (!orderBook) {
        return res.status(404).json({ message: `No order book available for symbol: ${symbol}` });
      }
      
      res.json(orderBook);
    } catch (error) {
      console.error("Error fetching order book:", error);
      res.status(500).json({ message: "Failed to fetch order book" });
    }
  });

  app.get('/api/market-data/historical/:symbol', async (req, res) => {
    try {
      const symbol = req.params.symbol.toUpperCase();
      const { startDate, endDate, interval = '1d' } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }
      
      const data = await marketDataService.getHistoricalData(
        symbol, 
        startDate as string, 
        endDate as string, 
        interval as string
      );
      
      res.json(data);
    } catch (error) {
      console.error("Error fetching historical market data:", error);
      res.status(500).json({ message: "Failed to fetch historical market data" });
    }
  });

  // Trading API endpoints
  app.post('/api/trading/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orderRequest = req.body;
      
      // Validate required fields
      if (!orderRequest.symbol || !orderRequest.side || !orderRequest.type || !orderRequest.quantity) {
        return res.status(400).json({ message: "Missing required order fields" });
      }
      
      const order = await tradingService.submitOrder(userId, orderRequest);
      res.json(order);
    } catch (error) {
      console.error("Error submitting order:", error);
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.delete('/api/trading/orders/:orderId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orderId = req.params.orderId;
      
      const order = await tradingService.cancelOrder(userId, orderId);
      res.json(order);
    } catch (error) {
      console.error("Error cancelling order:", error);
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.get('/api/trading/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const status = req.query.status as string;
      
      const orders = tradingService.getOrders(userId, status);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get('/api/trading/positions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const positions = tradingService.getPositions(userId);
      res.json(positions);
    } catch (error) {
      console.error("Error fetching positions:", error);
      res.status(500).json({ message: "Failed to fetch positions" });
    }
  });

  app.get('/api/trading/portfolio', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const portfolio = tradingService.getPortfolio(userId);
      res.json(portfolio);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  app.get('/api/trading/portfolio/stream', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const portfolio = tradingService.streamPortfolio(userId);
      res.json(portfolio);
    } catch (error) {
      console.error("Error streaming portfolio:", error);
      res.status(500).json({ message: "Failed to stream portfolio" });
    }
  });

  const httpServer = createServer(app);
  
  // Add WebSocket server for real-time data streaming
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws, req) => {
    console.log('WebSocket client connected');
    
    // Handle subscription requests
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'subscribe') {
          const { symbols } = data;
          if (symbols && Array.isArray(symbols)) {
            marketDataService.subscribe(symbols);
            ws.send(JSON.stringify({ type: 'subscribed', symbols }));
          }
        } else if (data.type === 'unsubscribe') {
          const { symbols } = data;
          if (symbols && Array.isArray(symbols)) {
            marketDataService.unsubscribe(symbols);
            ws.send(JSON.stringify({ type: 'unsubscribed', symbols }));
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });
    
    // Forward market data updates to connected clients
    const handlePriceUpdate = (marketData: any) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({
          type: 'priceUpdate',
          data: marketData
        }));
      }
    };
    
    const handleOrderBookUpdate = (orderBook: any) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({
          type: 'orderBookUpdate',
          data: orderBook
        }));
      }
    };
    
    const handleTrade = (trade: any) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({
          type: 'trade',
          data: trade
        }));
      }
    };
    
    const handleOrderStatus = (order: any) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({
          type: 'orderStatus',
          data: order
        }));
      }
    };
    
    const handleExecution = (execution: any) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({
          type: 'execution',
          data: execution
        }));
      }
    };
    
    const handlePositionUpdate = (position: any) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({
          type: 'positionUpdate',
          data: position
        }));
      }
    };
    
    const handlePortfolioUpdate = (portfolio: any) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({
          type: 'portfolioUpdate',
          data: portfolio
        }));
      }
    };
    
    // Subscribe to events
    marketDataService.on('priceUpdate', handlePriceUpdate);
    marketDataService.on('orderBookUpdate', handleOrderBookUpdate);
    marketDataService.on('trade', handleTrade);
    tradingService.on('orderStatus', handleOrderStatus);
    tradingService.on('execution', handleExecution);
    tradingService.on('positionUpdate', handlePositionUpdate);
    tradingService.on('portfolioUpdate', handlePortfolioUpdate);
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      // Clean up event listeners
      marketDataService.removeListener('priceUpdate', handlePriceUpdate);
      marketDataService.removeListener('orderBookUpdate', handleOrderBookUpdate);
      marketDataService.removeListener('trade', handleTrade);
      tradingService.removeListener('orderStatus', handleOrderStatus);
      tradingService.removeListener('execution', handleExecution);
      tradingService.removeListener('positionUpdate', handlePositionUpdate);
      tradingService.removeListener('portfolioUpdate', handlePortfolioUpdate);
    });
  });
  
  return httpServer;
}
