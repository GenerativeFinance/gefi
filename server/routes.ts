import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupMultiAuth, isAuthenticated } from "./multiAuth";
import { insertPortfolioSchema, insertAiModelSchema, insertRiskAlertSchema } from "@shared/schema";
import { z } from "zod";
import { PortfolioOptimizer, RiskAssessment, MarketAnalysis } from "./aiModels";

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

  // AI Models routes
  app.get('/api/ai-models', async (req, res) => {
    try {
      const models = await storage.getAllAiModels();
      res.json(models);
    } catch (error) {
      console.error("Error fetching AI models:", error);
      res.status(500).json({ message: "Failed to fetch AI models" });
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

  const httpServer = createServer(app);
  return httpServer;
}
