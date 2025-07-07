import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupMultiAuth, isAuthenticated } from "./multiAuth";
import { insertPortfolioSchema, insertAiModelSchema, insertRiskAlertSchema } from "@shared/schema";
import { z } from "zod";
import { PortfolioOptimizer, RiskAssessment, MarketAnalysis } from "./aiModels";
import { marketDataService } from "./marketDataService";
import { tradingService } from "./tradingService";
import { web3Service } from "./web3Service";
import { RecommendationEngine } from "./recommendationEngine";
import { insertWeb3WalletSchema, insertCryptoHoldingSchema, insertDefiPositionSchema, insertDefiTransactionSchema, insertYieldFarmingPositionSchema, insertNftHoldingSchema, insertUserPreferencesSchema, insertUserModelInteractionSchema } from "@shared/schema";

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

  // Comprehensive User Profile API
  app.get('/api/users/:userId/profile', async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Get basic user information
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get comprehensive profile data
      const [profile, education, experience, certifications, skills, publications, reviews, stats] = await Promise.all([
        storage.getUserProfile(userId),
        storage.getUserEducation(userId),
        storage.getUserExperience(userId), 
        storage.getUserCertifications(userId),
        storage.getUserSkills(userId),
        storage.getUserPublications(userId),
        storage.getUserReviews(userId),
        storage.getUserStats(userId)
      ]);

      // Create comprehensive user profile response
      const userProfile = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        profile: profile || {},
        education: education || [],
        experience: experience || [],
        certifications: certifications || [],
        skills: skills || [],
        publications: publications || [],
        reviews: reviews || [],
        stats: stats || {}
      };

      res.json(userProfile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  // Profile setup route
  app.post('/api/profile/setup', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const profileData = req.body;

      // First update the user's basic information
      if (profileData.firstName || profileData.lastName) {
        await storage.updateUser(userId, {
          firstName: profileData.firstName,
          lastName: profileData.lastName
        });
      }

      // Create or update user profile
      const userProfile = await storage.createOrUpdateUserProfile(userId, {
        company: profileData.company,
        jobTitle: profileData.jobTitle,
        location: profileData.location,
        bio: profileData.bio,
        investmentExperience: profileData.investmentExperience,
        riskTolerance: profileData.riskTolerance,
        preferredAssetTypes: profileData.preferredAssetTypes,
        investmentGoals: profileData.investmentGoals,
        tradingFrequency: profileData.tradingFrequency,
        portfolioSize: profileData.portfolioSize,
        interestedInDeveloping: profileData.interestedInDeveloping,
        notifications: profileData.notifications,
        profileCompleted: true
      });

      res.json({ 
        success: true, 
        message: "Profile setup completed successfully",
        profile: userProfile 
      });
    } catch (error) {
      console.error("Error setting up user profile:", error);
      res.status(500).json({ message: "Failed to setup profile" });
    }
  });

  // Get user profile route
  app.get('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const profile = await storage.getUserProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
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

  // Portfolio AI Models Subscriptions
  app.get('/api/portfolio/ai-models/subscriptions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Mock data for user subscriptions with detailed info
      const subscriptions = [
        {
          id: 1,
          name: "Quantum Risk Predictor",
          description: "Advanced quantum computing algorithms for predicting market volatility and risk patterns with 94% accuracy.",
          category: "Risk Assessment",
          creator: "QuantumTech Labs",
          rating: 4.8,
          totalRatings: 156,
          subscription: {
            id: 1,
            plan: "monthly",
            status: "active",
            price: 299.99,
            subscribedAt: "2024-11-15T10:00:00Z",
            renewalDate: "2025-01-15T10:00:00Z",
            totalUsageHours: 47.5
          },
          performance: {
            totalReturn: 12.45,
            sharpeRatio: 1.8,
            maxDrawdown: -8.2,
            winRate: 68.5
          }
        },
        {
          id: 2,
          name: "Neural Portfolio Optimizer",
          description: "Deep learning model that optimizes portfolio allocation based on market sentiment and technical indicators.",
          category: "Portfolio Optimization",
          creator: "AI Capital Solutions",
          rating: 4.6,
          totalRatings: 89,
          subscription: {
            id: 2,
            plan: "monthly",
            status: "active",
            price: 199.99,
            subscribedAt: "2024-12-01T10:00:00Z",
            renewalDate: "2025-01-01T10:00:00Z",
            totalUsageHours: 23.2
          },
          performance: {
            totalReturn: 8.73,
            sharpeRatio: 1.6,
            maxDrawdown: -5.1,
            winRate: 72.3
          }
        }
      ];
      
      res.json(subscriptions);
    } catch (error) {
      console.error("Error fetching AI model subscriptions:", error);
      res.status(500).json({ message: "Failed to fetch subscriptions" });
    }
  });

  // Portfolio AI Models Usage History
  app.get('/api/portfolio/ai-models/usage-history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Mock usage history data
      const usageHistory = [
        {
          id: 1,
          modelName: "Quantum Risk Predictor",
          sessionDuration: 2.5,
          performanceResult: 3.2,
          profitLoss: 1250.75,
          usageType: "live_trading",
          sessionStarted: "2024-12-29T14:30:00Z",
          sessionEnded: "2024-12-29T17:00:00Z"
        },
        {
          id: 2,
          modelName: "Neural Portfolio Optimizer",
          sessionDuration: 1.8,
          performanceResult: -1.1,
          profitLoss: -345.20,
          usageType: "backtesting",
          sessionStarted: "2024-12-28T09:15:00Z",
          sessionEnded: "2024-12-28T11:03:00Z"
        },
        {
          id: 3,
          modelName: "Quantum Risk Predictor",
          sessionDuration: 4.2,
          performanceResult: 5.7,
          profitLoss: 2890.45,
          usageType: "analysis",
          sessionStarted: "2024-12-27T13:20:00Z",
          sessionEnded: "2024-12-27T17:32:00Z"
        },
        {
          id: 4,
          modelName: "Neural Portfolio Optimizer",
          sessionDuration: 3.1,
          performanceResult: 2.8,
          profitLoss: 987.60,
          usageType: "live_trading",
          sessionStarted: "2024-12-26T10:45:00Z",
          sessionEnded: "2024-12-26T13:51:00Z"
        }
      ];
      
      res.json(usageHistory);
    } catch (error) {
      console.error("Error fetching usage history:", error);
      res.status(500).json({ message: "Failed to fetch usage history" });
    }
  });

  // Portfolio AI Models Recommendations
  app.get('/api/portfolio/ai-models/recommendations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Mock recommendations based on user profile and current models
      const recommendations = [
        {
          id: 3,
          name: "Sentiment-Driven Alpha Generator",
          description: "AI model that analyzes social media sentiment, news, and market data to identify alpha opportunities.",
          category: "Alpha Generation",
          creator: "SentimentAI Corp",
          rating: 4.7,
          price: 349.99,
          matchScore: 92,
          reasonsForRecommendation: [
            "Complements your existing risk assessment tools",
            "High correlation with your successful trading patterns",
            "Recommended by users with similar portfolios",
            "Strong performance in current market conditions"
          ]
        },
        {
          id: 4,
          name: "Crypto Volatility Predictor",
          description: "Specialized model for predicting cryptocurrency price movements using blockchain analytics and market data.",
          category: "Cryptocurrency",
          creator: "BlockChain Analytics",
          rating: 4.5,
          price: 249.99,
          matchScore: 87,
          reasonsForRecommendation: [
            "Your portfolio has 15% crypto exposure",
            "Pairs well with your risk prediction models",
            "High demand among similar investors",
            "Proven track record in volatile markets"
          ]
        },
        {
          id: 5,
          name: "ESG Impact Analyzer",
          description: "Evaluates environmental, social, and governance factors to optimize sustainable investment strategies.",
          category: "ESG Analytics",
          creator: "Green Finance AI",
          rating: 4.4,
          price: 179.99,
          matchScore: 78,
          reasonsForRecommendation: [
            "Growing trend in sustainable investing",
            "Complements your portfolio optimization strategy",
            "High user satisfaction ratings",
            "Regulatory compliance benefits"
          ]
        }
      ];
      
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  // Portfolio AI Models Management
  app.post('/api/portfolio/ai-models/manage', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { action, subscriptionId } = req.body;
      
      // Mock management actions
      const validActions = ['pause', 'resume', 'cancel'];
      
      if (!validActions.includes(action)) {
        return res.status(400).json({ message: "Invalid action" });
      }
      
      // In a real implementation, this would update the database
      // For now, we'll just return success
      res.json({ 
        message: `Subscription ${action}d successfully`,
        subscriptionId,
        action,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error managing subscription:", error);
      res.status(500).json({ message: "Failed to manage subscription" });
    }
  });

  // Portfolio Rebalancing
  app.post('/api/portfolio/rebalance', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { targetAllocation, threshold, autoRebalance } = req.body;
      
      // Mock rebalancing logic
      const portfolio = await storage.getUserPortfolio(userId);
      
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      
      // Calculate rebalancing actions based on target allocation
      const rebalanceActions = [];
      const currentAllocation = {
        stocks: 75,
        bonds: 15,
        crypto: 8,
        commodities: 2
      };
      
      Object.entries(targetAllocation).forEach(([asset, target]) => {
        const current = currentAllocation[asset as keyof typeof currentAllocation] || 0;
        const drift = Math.abs(current - target);
        
        if (drift >= threshold) {
          rebalanceActions.push({
            asset,
            currentAllocation: current,
            targetAllocation: target,
            action: current > target ? 'sell' : 'buy',
            amount: drift,
            estimatedValue: drift * parseFloat(portfolio.totalInvestment) / 100
          });
        }
      });
      
      // In a real implementation, this would:
      // 1. Create pending orders
      // 2. Update portfolio allocation
      // 3. Log the rebalancing event
      
      res.json({
        message: "Portfolio rebalancing initiated successfully",
        rebalanceActions,
        settings: {
          targetAllocation,
          threshold,
          autoRebalance
        },
        status: "pending",
        estimatedCompletionTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
        totalTransactions: rebalanceActions.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error rebalancing portfolio:", error);
      res.status(500).json({ message: "Failed to rebalance portfolio" });
    }
  });

  // Risk Assessment Endpoints
  app.get('/api/risk-assessment/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Mock risk profile data
      const riskProfile = {
        id: 1,
        userId,
        riskTolerance: 'moderate',
        investmentHorizon: 10,
        financialGoals: ['retirement', 'wealth building', 'emergency fund'],
        currentIncome: 75000,
        netWorth: 250000,
        age: 35,
        experience: 'intermediate',
        riskCapacity: 65,
        questionnaire: {
          riskComfort: 6,
          volatilityTolerance: 5,
          lossReaction: 'hold',
          investmentKnowledge: 7,
          financialStability: 8
        },
        lastAssessment: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        riskScore: 58
      };
      
      res.json(riskProfile);
    } catch (error) {
      console.error("Error fetching risk profile:", error);
      res.status(500).json({ message: "Failed to fetch risk profile" });
    }
  });

  app.get('/api/risk-assessment/metrics', isAuthenticated, async (req: any, res) => {
    try {
      // Mock risk metrics
      const riskMetrics = {
        portfolioRisk: 12.5,
        valueAtRisk: 8420,
        expectedReturn: 8.2,
        sharpeRatio: 1.15,
        maxDrawdown: 18.3,
        volatility: 15.8,
        correlationRisk: 23.1,
        concentrationRisk: 31.5
      };
      
      res.json(riskMetrics);
    } catch (error) {
      console.error("Error fetching risk metrics:", error);
      res.status(500).json({ message: "Failed to fetch risk metrics" });
    }
  });

  app.get('/api/risk-assessment/recommendations', isAuthenticated, async (req: any, res) => {
    try {
      // Mock recommendations
      const recommendations = [
        {
          id: 1,
          title: "Diversify International Exposure",
          description: "Consider increasing international equity allocation to reduce concentration risk in domestic markets.",
          priority: "medium",
          category: "allocation",
          impact: "moderate"
        },
        {
          id: 2,
          title: "Review Bond Duration",
          description: "Your bond holdings may be overly sensitive to interest rate changes. Consider shorter duration bonds.",
          priority: "low",
          category: "risk_management",
          impact: "low"
        },
        {
          id: 3,
          title: "Rebalance Portfolio",
          description: "Several asset classes have drifted significantly from target allocation. Consider rebalancing.",
          priority: "high",
          category: "rebalancing",
          impact: "high"
        }
      ];
      
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  app.post('/api/risk-assessment', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const assessmentData = req.body;
      
      // In a real implementation, this would save to database
      // For now, we'll just return success with calculated data
      
      const riskProfile = {
        id: Date.now(),
        userId,
        ...assessmentData,
        lastAssessment: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      
      res.json({
        message: "Risk assessment saved successfully",
        profile: riskProfile,
        recommendations: [
          {
            title: "Assessment Complete",
            description: "Your risk profile has been updated based on your responses.",
            priority: "info"
          }
        ]
      });
    } catch (error) {
      console.error("Error saving risk assessment:", error);
      res.status(500).json({ message: "Failed to save risk assessment" });
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
      const categoryName = req.query.category as string;
      if (categoryName && categoryName !== 'all') {
        // Get subcategories by category name
        const subcategories = await storage.getAiModelSubcategoriesByCategoryName(categoryName);
        res.json(subcategories);
      } else {
        const subcategories = await storage.getAiModelSubcategories();
        res.json(subcategories);
      }
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

  // Add new categories only
  app.post('/api/add-new-categories', async (req, res) => {
    try {
      // New categories to add
      const newCategories = [
        {
          name: "Credit Scoring",
          description: "Advanced credit assessment and loan default prediction models",
          icon: "CreditCard",
          sortOrder: 10,
          subcategories: [
            { name: "Borrower Creditworthiness", description: "Comprehensive borrower assessment models", sortOrder: 1 },
            { name: "Loan Default Prediction", description: "Predictive models for loan default risk", sortOrder: 2 },
            { name: "Alternative Credit Data Models", description: "Non-traditional credit scoring using alternative data", sortOrder: 3 }
          ]
        },
        {
          name: "Insurance",
          description: "AI models for insurance underwriting, claims processing, and risk modeling",
          icon: "Shield",
          sortOrder: 11,
          subcategories: [
            { name: "Underwriting Models", description: "Automated insurance underwriting and risk assessment", sortOrder: 1 },
            { name: "Claims Processing", description: "Automated claims analysis and fraud detection", sortOrder: 2 },
            { name: "Risk Modeling", description: "Actuarial and risk prediction models", sortOrder: 3 },
            { name: "Premium Optimization", description: "Dynamic pricing and premium calculation models", sortOrder: 4 }
          ]
        },
        {
          name: "Personal Finance",
          description: "AI-powered personal financial management and optimization tools",
          icon: "Wallet",
          sortOrder: 12,
          subcategories: [
            { name: "Budgeting Tools", description: "Intelligent budget planning and expense tracking", sortOrder: 1 },
            { name: "Savings Optimization", description: "Automated savings strategies and goal planning", sortOrder: 2 },
            { name: "Retirement Planning", description: "Long-term retirement and investment planning", sortOrder: 3 },
            { name: "Debt Management", description: "Debt consolidation and repayment optimization", sortOrder: 4 }
          ]
        },
        {
          name: "Market Sentiment Analysis",
          description: "Real-time market sentiment analysis and investor behavior prediction",
          icon: "BarChart3",
          sortOrder: 13,
          subcategories: [
            { name: "News Sentiment Analysis", description: "Real-time news sentiment extraction and market impact analysis", sortOrder: 1 },
            { name: "Social Media Monitoring", description: "Social media sentiment tracking and trading signals", sortOrder: 2 },
            { name: "Investor Behavior Models", description: "Predictive models for investor decision-making patterns", sortOrder: 3 },
            { name: "Market Trend Analysis Models", description: "Advanced trend identification and momentum analysis", sortOrder: 4 }
          ]
        }
      ];

      let addedCategories = 0;
      let addedSubcategories = 0;

      for (const categoryInfo of newCategories) {
        const { subcategories, ...categoryData } = categoryInfo;
        
        try {
          // Try to create category
          const category = await storage.createAiModelCategory(categoryData);
          addedCategories++;
          console.log(`Added new category: ${category.name}`);
          
          // Create subcategories
          for (const subcategoryData of subcategories) {
            try {
              const subcategory = await storage.createAiModelSubcategory({
                ...subcategoryData,
                categoryId: category.id
              });
              addedSubcategories++;
              console.log(`  Added subcategory: ${subcategory.name}`);
            } catch (subError) {
              console.log(`Subcategory ${subcategoryData.name} might already exist`);
            }
          }
        } catch (error) {
          console.log(`Category ${categoryData.name} might already exist`);
        }
      }
      
      res.json({ 
        message: `Successfully added ${addedCategories} new categories and ${addedSubcategories} subcategories`,
        addedCategories,
        addedSubcategories
      });
    } catch (error) {
      console.error("Error adding new categories:", error);
      res.status(500).json({ message: "Failed to add new categories", error: error.message });
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

  // Trading Bots API endpoints
  app.get('/api/trading-bots', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Mock trading bots data for now - can be replaced with database queries later
      const mockTradingBots = [
        {
          id: 1,
          userId: userId,
          name: 'SOL/FDUSD Grid',
          type: 'spot_grid',
          symbol: 'SOL/FDUSD',
          status: 'active',
          configuration: { profitPerGrid: 0.5, grids: 50, priceRange: '$125.00 - $175.00', mode: 'Geometric' },
          investment: "1000.00",
          currentPnL: "2560.45",
          totalTrades: 147,
          successfulTrades: 124,
          runtime: '12 days',
          grids: 50,
          profitPerGrid: 0.5,
          priceRange: '$125.00 - $175.00',
          mode: 'Geometric',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date(),
          startedAt: new Date('2024-01-15'),
          stoppedAt: null
        },
        {
          id: 2,
          userId: userId,
          name: 'BTC Arbitrage Pro',
          type: 'arbitrage_bot',
          symbol: 'BTC/USDT',
          status: 'active',
          configuration: { strategy: 'delta_neutral', riskLevel: 'medium' },
          investment: "5000.00",
          currentPnL: "1890.32",
          totalTrades: 89,
          successfulTrades: 67,
          runtime: '8 days',
          grids: null,
          profitPerGrid: null,
          priceRange: null,
          mode: 'Delta Neutral',
          createdAt: new Date('2024-01-20'),
          updatedAt: new Date(),
          startedAt: new Date('2024-01-20'),
          stoppedAt: null
        },
        {
          id: 3,
          userId: userId,
          name: 'ETH DCA Strategy',
          type: 'spot_dca',
          symbol: 'ETH/USDT',
          status: 'paused',
          configuration: { interval: '1h', dcaAmount: 100 },
          investment: "2500.00",
          currentPnL: "-1250.75",
          totalTrades: 56,
          successfulTrades: 32,
          runtime: '15 days',
          grids: null,
          profitPerGrid: null,
          priceRange: null,
          mode: 'Hourly DCA',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date(),
          startedAt: new Date('2024-01-10'),
          stoppedAt: null
        }
      ];

      res.json(mockTradingBots);
    } catch (error) {
      console.error("Error fetching trading bots:", error);
      res.status(500).json({ message: "Failed to fetch trading bots" });
    }
  });

  app.post('/api/trading-bots', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const botData = req.body;
      
      const newBot = {
        id: Math.floor(Math.random() * 10000),
        userId: userId,
        ...botData,
        status: 'active',
        currentPnL: "0.00",
        totalTrades: 0,
        successfulTrades: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        startedAt: new Date(),
        stoppedAt: null
      };

      res.json(newBot);
    } catch (error) {
      console.error("Error creating trading bot:", error);
      res.status(500).json({ message: "Failed to create trading bot" });
    }
  });

  app.patch('/api/trading-bots/:id', isAuthenticated, async (req: any, res) => {
    try {
      const botId = req.params.id;
      const updates = req.body;
      
      // Mock update response
      res.json({ 
        id: botId, 
        ...updates, 
        updatedAt: new Date() 
      });
    } catch (error) {
      console.error("Error updating trading bot:", error);
      res.status(500).json({ message: "Failed to update trading bot" });
    }
  });

  app.delete('/api/trading-bots/:id', isAuthenticated, async (req: any, res) => {
    try {
      const botId = req.params.id;
      
      res.json({ message: "Trading bot deleted successfully" });
    } catch (error) {
      console.error("Error deleting trading bot:", error);
      res.status(500).json({ message: "Failed to delete trading bot" });
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
      const userId = req.user.id;
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
      const userId = req.user.id;
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
      const userId = req.user.id;
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
      const userId = req.user.id;
      const positions = tradingService.getPositions(userId);
      res.json(positions);
    } catch (error) {
      console.error("Error fetching positions:", error);
      res.status(500).json({ message: "Failed to fetch positions" });
    }
  });

  app.get('/api/trading/portfolio', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const portfolio = tradingService.getPortfolio(userId);
      res.json(portfolio);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  app.get('/api/trading/portfolio/stream', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const portfolio = tradingService.streamPortfolio(userId);
      res.json(portfolio);
    } catch (error) {
      console.error("Error streaming portfolio:", error);
      res.status(500).json({ message: "Failed to stream portfolio" });
    }
  });

  // Model funding endpoints
  app.get('/api/developer-models', isAuthenticated, async (req: any, res) => {
    try {
      const fundable = req.query.fundable === 'true';
      let models;
      
      if (fundable) {
        // Return only approved/testing models for funding
        models = await storage.getDeveloperModels('approved', 'testing');
      } else {
        models = await storage.getAllDeveloperModels();
      }
      
      res.json(models);
    } catch (error) {
      console.error("Error fetching developer models:", error);
      res.status(500).json({ message: "Failed to fetch models" });
    }
  });

  app.get('/api/developer-models/categories', isAuthenticated, async (req: any, res) => {
    try {
      const categories = await storage.getDeveloperModelCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching model categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Model Funding routes
  app.get('/api/model-funding/requests', async (req, res) => {
    try {
      // For now, return empty array since we don't have model funding requests schema
      // This matches the structure needed by the frontend
      res.json([]);
    } catch (error) {
      console.error("Error fetching model funding requests:", error);
      res.status(500).json({ message: "Failed to fetch funding requests" });
    }
  });

  app.get('/api/model-funding/my-requests', isAuthenticated, async (req: any, res) => {
    try {
      // For now, return empty array since we don't have model funding requests schema
      res.json([]);
    } catch (error) {
      console.error("Error fetching user's model funding requests:", error);
      res.status(500).json({ message: "Failed to fetch your funding requests" });
    }
  });

  app.get('/api/model-funding/my-contributions', isAuthenticated, async (req: any, res) => {
    try {
      // For now, return empty array since we don't have model funding contributions schema
      res.json([]);
    } catch (error) {
      console.error("Error fetching user's model funding contributions:", error);
      res.status(500).json({ message: "Failed to fetch your contributions" });
    }
  });

  app.post('/api/model-funding/requests', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const requestData = req.body;

      // For now, return success message since we don't have schema
      res.json({ 
        message: "Model funding request created successfully",
        id: Math.floor(Math.random() * 1000)
      });
    } catch (error) {
      console.error("Error creating model funding request:", error);
      res.status(500).json({ message: "Failed to create funding request" });
    }
  });

  app.post('/api/model-funding/contribute', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { requestId, amount } = req.body;

      if (!requestId || !amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid contribution parameters" });
      }

      // For now, return success message since we don't have schema
      res.json({ 
        message: "Contribution successful",
        contributionId: Math.floor(Math.random() * 1000)
      });
    } catch (error) {
      console.error("Error contributing to model funding:", error);
      res.status(500).json({ message: "Failed to contribute" });
    }
  });

  app.post('/api/model-funding/invest', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { modelId, amount, expectedStake } = req.body;
      
      // Validate investment
      if (!modelId || !amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid investment parameters" });
      }
      
      // Get model details
      const model = await storage.getDeveloperModel(modelId);
      if (!model) {
        return res.status(404).json({ message: "Model not found" });
      }
      
      // Check if model is fundable
      if (!['approved', 'testing'].includes(model.status)) {
        return res.status(400).json({ message: "Model is not available for funding" });
      }
      
      // Check if funding goal would be exceeded
      const currentRaised = parseFloat(model.fundingRaised || "0");
      const goal = parseFloat(model.fundingGoal);
      const newTotal = currentRaised + amount;
      
      if (newTotal > goal) {
        return res.status(400).json({ 
          message: `Investment would exceed funding goal. Maximum available: $${(goal - currentRaised).toFixed(2)}` 
        });
      }
      
      // Create funding record
      const funding = await storage.createModelFunding({
        modelId,
        investorId: userId,
        amount: amount.toString(),
        stake: expectedStake.toString(),
        status: "pledged",
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      });
      
      // Update model funding raised
      await storage.updateDeveloperModelFunding(modelId, newTotal.toString());
      
      // Create audit trail
      await storage.createAuditEntry({
        userId,
        action: "model_funding_investment",
        entityType: "developer_model",
        entityId: modelId.toString(),
        newValues: JSON.stringify({ amount, stake: expectedStake }),
      });
      
      res.json({ success: true, funding });
    } catch (error) {
      console.error("Error creating investment:", error);
      res.status(500).json({ message: "Failed to process investment" });
    }
  });

  app.get('/api/model-funding/my-investments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const investments = await storage.getUserModelFunding(userId);
      res.json(investments);
    } catch (error) {
      console.error("Error fetching user investments:", error);
      res.status(500).json({ message: "Failed to fetch investments" });
    }
  });

  // Bounty Funding API routes
  app.get('/api/bounty-funding', async (req: any, res) => {
    try {
      // Sample bounty funding requests data
      const sampleRequests = [
        {
          id: 1,
          title: "Advanced Portfolio Risk Analytics",
          description: "Develop an AI model that provides real-time portfolio risk assessment using advanced machine learning algorithms.",
          category: "risk-management",
          fundingRequired: 25000,
          fundingRaised: 18500,
          timeline: "3 months",
          difficulty: "advanced",
          skills: ["Python", "Machine Learning", "Risk Management", "TensorFlow"],
          deliverables: ["Complete AI model implementation", "Documentation and API", "Testing suite", "Performance benchmarks"],
          status: "approved",
          estimatedReward: 30000,
          developerName: "Alex Rodriguez",
          submittedAt: "2024-06-20T10:00:00Z",
          approvedAt: "2024-06-22T14:30:00Z",
          backers: 12,
        },
        {
          id: 2,
          title: "Cryptocurrency Trading Algorithm",
          description: "Create a sophisticated trading algorithm that analyzes market sentiment and executes trades automatically.",
          category: "trading-algorithms",
          fundingRequired: 35000,
          fundingRaised: 8200,
          timeline: "4 months",
          difficulty: "expert",
          skills: ["Python", "Algorithmic Trading", "Cryptocurrency", "Deep Learning"],
          deliverables: ["Trading algorithm", "Backtesting framework", "Real-time execution system", "Performance analytics"],
          status: "submitted",
          estimatedReward: 45000,
          developerName: "Sarah Chen",
          submittedAt: "2024-06-25T09:15:00Z",
          backers: 6,
        },
        {
          id: 3,
          title: "ESG Portfolio Optimization",
          description: "Build an AI system that optimizes portfolios while maintaining ESG compliance and maximizing returns.",
          category: "portfolio-optimization",
          fundingRequired: 20000,
          fundingRaised: 20000,
          timeline: "2 months",
          difficulty: "intermediate",
          skills: ["Portfolio Theory", "ESG Analysis", "Optimization", "Python"],
          deliverables: ["Optimization engine", "ESG scoring system", "Portfolio recommendations", "Compliance reports"],
          status: "funded",
          estimatedReward: 25000,
          developerName: "Michael Thompson",
          submittedAt: "2024-06-18T16:45:00Z",
          approvedAt: "2024-06-19T10:00:00Z",
          fundedAt: "2024-06-21T12:30:00Z",
          backers: 15,
        },
        {
          id: 4,
          title: "Market Sentiment Analysis Engine",
          description: "Develop a comprehensive sentiment analysis system that processes news, social media, and market data.",
          category: "sentiment-analysis",
          fundingRequired: 30000,
          fundingRaised: 12000,
          timeline: "3.5 months",
          difficulty: "advanced",
          skills: ["NLP", "Sentiment Analysis", "Data Mining", "API Integration"],
          deliverables: ["Sentiment engine", "Data pipelines", "Real-time dashboard", "API endpoints"],
          status: "approved",
          estimatedReward: 38000,
          developerName: "Emma Wilson",
          submittedAt: "2024-06-23T11:20:00Z",
          approvedAt: "2024-06-24T15:45:00Z",
          backers: 8,
        },
        {
          id: 5,
          title: "Derivatives Pricing Model",
          description: "Create an advanced AI model for pricing complex financial derivatives with high accuracy.",
          category: "market-prediction",
          fundingRequired: 40000,
          fundingRaised: 2500,
          timeline: "5 months",
          difficulty: "expert",
          skills: ["Quantitative Finance", "Derivatives", "Machine Learning", "Monte Carlo"],
          deliverables: ["Pricing model", "Risk calculations", "Validation framework", "Documentation"],
          status: "submitted",
          estimatedReward: 50000,
          developerName: "David Kumar",
          submittedAt: "2024-06-26T14:00:00Z",
          backers: 3,
        }
      ];
      
      res.json(sampleRequests);
    } catch (error) {
      console.error("Error fetching bounty funding requests:", error);
      res.status(500).json({ message: "Failed to fetch funding requests" });
    }
  });

  app.get('/api/bounty-categories', async (req: any, res) => {
    try {
      const categories = [
        { id: "risk-management", name: "Risk Management", count: 12 },
        { id: "trading-algorithms", name: "Trading Algorithms", count: 8 },
        { id: "portfolio-optimization", name: "Portfolio Optimization", count: 15 },
        { id: "market-prediction", name: "Market Prediction", count: 6 },
        { id: "sentiment-analysis", name: "Sentiment Analysis", count: 9 }
      ];
      
      res.json(categories);
    } catch (error) {
      console.error("Error fetching bounty categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post('/api/bounty-funding', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const requestData = req.body;
      
      // Validate required fields
      if (!requestData.title || !requestData.description || !requestData.category || 
          !requestData.fundingRequired || !requestData.timeline || !requestData.difficulty) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Get user information for developer name
      const user = await storage.getUser(userId);
      const developerName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Anonymous Developer';
      
      // Create new funding request
      const newRequest = {
        id: Math.floor(Math.random() * 10000) + 100,
        ...requestData,
        fundingRaised: 0,
        status: 'submitted',
        developerName,
        submittedAt: new Date().toISOString(),
        backers: 0,
        estimatedReward: Math.floor(requestData.fundingRequired * 1.2),
      };
      
      // In a real application, you would save to database here
      // await storage.createBountyFundingRequest(newRequest);
      
      res.status(201).json(newRequest);
    } catch (error) {
      console.error("Error creating bounty funding request:", error);
      res.status(500).json({ message: "Failed to create funding request" });
    }
  });

  app.post('/api/bounty-funding/:id/fund', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const requestId = parseInt(req.params.id);
      const { amount } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid funding amount" });
      }
      
      // In a real application, you would:
      // 1. Get the funding request from database
      // 2. Validate that funding is still needed
      // 3. Process payment
      // 4. Update funding amounts
      // 5. Create contribution record
      
      const contribution = {
        id: Math.floor(Math.random() * 10000) + 1000,
        requestId,
        contributorId: userId,
        amount,
        status: 'active',
        contributedAt: new Date().toISOString(),
      };
      
      // Mock success response
      res.status(201).json({
        message: "Funding contribution successful",
        contribution,
      });
    } catch (error) {
      console.error("Error processing funding contribution:", error);
      res.status(500).json({ message: "Failed to process funding" });
    }
  });

  // Web3 and Cryptocurrency API Routes
  
  // Get user's connected wallets
  app.get('/api/web3/wallets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const wallets = await storage.getUserWallets(userId);
      res.json(wallets);
    } catch (error) {
      console.error("Error fetching wallets:", error);
      res.status(500).json({ message: "Failed to fetch wallets" });
    }
  });

  // Add a new wallet
  app.post('/api/web3/wallets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const walletData = insertWeb3WalletSchema.parse({
        ...req.body,
        userId
      });

      // Validate wallet address
      if (!web3Service.isValidAddress(walletData.walletAddress)) {
        return res.status(400).json({ message: "Invalid wallet address" });
      }

      const wallet = await storage.addWallet(walletData);
      res.status(201).json(wallet);
    } catch (error) {
      console.error("Error adding wallet:", error);
      res.status(500).json({ message: "Failed to add wallet" });
    }
  });

  // Get wallet portfolio
  app.get('/api/web3/wallets/:walletId/portfolio', isAuthenticated, async (req: any, res) => {
    try {
      const walletId = parseInt(req.params.walletId);
      const wallet = await storage.getWallet(walletId);
      
      if (!wallet || wallet.userId !== req.user.id) {
        return res.status(404).json({ message: "Wallet not found" });
      }

      const portfolio = await web3Service.getWalletPortfolio(
        wallet.walletAddress, 
        wallet.chainId
      );
      
      res.json(portfolio);
    } catch (error) {
      console.error("Error fetching wallet portfolio:", error);
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  // Get user's crypto holdings
  app.get('/api/web3/holdings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const holdings = await storage.getUserCryptoHoldings(userId);
      res.json(holdings);
    } catch (error) {
      console.error("Error fetching holdings:", error);
      res.status(500).json({ message: "Failed to fetch holdings" });
    }
  });

  // Update holdings for a wallet
  app.post('/api/web3/wallets/:walletId/sync', isAuthenticated, async (req: any, res) => {
    try {
      const walletId = parseInt(req.params.walletId);
      const wallet = await storage.getWallet(walletId);
      
      if (!wallet || wallet.userId !== req.user.id) {
        return res.status(404).json({ message: "Wallet not found" });
      }

      // Get native balance
      const nativeBalance = await web3Service.getNativeBalance(
        wallet.walletAddress, 
        wallet.chainId
      );

      // Update or create native token holding
      const nativeHolding = {
        userId: req.user.id,
        walletId: walletId,
        tokenAddress: "native",
        tokenSymbol: "ETH", // This would be dynamic based on chain
        tokenName: "Ethereum",
        balance: nativeBalance,
        chainId: wallet.chainId
      };

      await storage.addCryptoHolding(nativeHolding);

      res.json({ message: "Holdings synced successfully" });
    } catch (error) {
      console.error("Error syncing holdings:", error);
      res.status(500).json({ message: "Failed to sync holdings" });
    }
  });

  // Get user's DeFi positions
  app.get('/api/web3/defi/positions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const positions = await storage.getUserDefiPositions(userId);
      res.json(positions);
    } catch (error) {
      console.error("Error fetching DeFi positions:", error);
      res.status(500).json({ message: "Failed to fetch DeFi positions" });
    }
  });

  // Get user's DeFi transactions
  app.get('/api/web3/defi/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit as string) || 50;
      const transactions = await storage.getUserTransactions(userId, limit);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Get DeFi protocol data
  app.get('/api/web3/defi/protocols/:protocol', async (req, res) => {
    try {
      const protocol = req.params.protocol;
      const chainId = parseInt(req.query.chainId as string) || 1;
      
      const protocolData = await web3Service.getDefiProtocolData(protocol, chainId);
      
      if (!protocolData) {
        return res.status(404).json({ message: "Protocol data not found" });
      }
      
      res.json(protocolData);
    } catch (error) {
      console.error("Error fetching protocol data:", error);
      res.status(500).json({ message: "Failed to fetch protocol data" });
    }
  });

  // Get user's NFTs
  app.get('/api/web3/nfts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const nfts = await storage.getUserNFTs(userId);
      res.json(nfts);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      res.status(500).json({ message: "Failed to fetch NFTs" });
    }
  });

  // Get gas price for a chain
  app.get('/api/web3/gas/:chainId', async (req, res) => {
    try {
      const chainId = parseInt(req.params.chainId);
      const gasPrice = await web3Service.getGasPrice(chainId);
      res.json({ gasPrice, chainId });
    } catch (error) {
      console.error("Error fetching gas price:", error);
      res.status(500).json({ message: "Failed to fetch gas price" });
    }
  });

  // Get transaction history for a wallet
  app.get('/api/web3/wallets/:walletId/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const walletId = parseInt(req.params.walletId);
      const wallet = await storage.getWallet(walletId);
      
      if (!wallet || wallet.userId !== req.user.id) {
        return res.status(404).json({ message: "Wallet not found" });
      }

      const limit = parseInt(req.query.limit as string) || 10;
      const transactions = await web3Service.getTransactionHistory(
        wallet.walletAddress,
        wallet.chainId,
        limit
      );
      
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      res.status(500).json({ message: "Failed to fetch transaction history" });
    }
  });

  // AI Marketplace Recommendation Engine API endpoints
  app.get('/api/recommendations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { context, categoryFilter, riskLevel, maxPrice, limit } = req.query;

      const recommendations = await RecommendationEngine.generateRecommendations({
        userId,
        context: context || 'home',
        categoryFilter: categoryFilter ? categoryFilter.split(',') : undefined,
        riskLevel,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        limit: limit ? parseInt(limit) : 10
      });

      res.json(recommendations);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      res.status(500).json({ message: "Failed to generate recommendations" });
    }
  });

  app.post('/api/recommendations/interact', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { modelId, interactionType, metadata } = req.body;

      if (!modelId || !interactionType) {
        return res.status(400).json({ message: "Model ID and interaction type are required" });
      }

      await RecommendationEngine.trackInteraction(userId, modelId, interactionType, metadata);
      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking interaction:", error);
      res.status(500).json({ message: "Failed to track interaction" });
    }
  });

  app.get('/api/recommendations/trending', async (req, res) => {
    try {
      const { timeFrame, category, limit } = req.query;
      
      // This would fetch from the trending models table
      const trending = [];
      
      res.json(trending);
    } catch (error) {
      console.error("Error fetching trending models:", error);
      res.status(500).json({ message: "Failed to fetch trending models" });
    }
  });

  app.get('/api/user/preferences', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // This would fetch user preferences
      const preferences = {
        riskTolerance: 'moderate',
        investmentHorizon: 'medium',
        preferredCategories: [],
        excludedCategories: [],
        maxMonthlySpend: 500,
        experienceLevel: 'intermediate',
        financialGoals: ['wealth_building'],
        preferredRegions: ['US', 'EU']
      };
      
      res.json(preferences);
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      res.status(500).json({ message: "Failed to fetch user preferences" });
    }
  });

  app.post('/api/user/preferences', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const preferences = req.body;

      // This would save user preferences and recalculate recommendations
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating user preferences:", error);
      res.status(500).json({ message: "Failed to update user preferences" });
    }
  });

  app.get('/api/recommendations/personalized-feed', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { feedType, limit } = req.query;

      // This would fetch personalized feed items
      const feed = [];
      
      res.json(feed);
    } catch (error) {
      console.error("Error fetching personalized feed:", error);
      res.status(500).json({ message: "Failed to fetch personalized feed" });
    }
  });

  // Custom Reports API Routes
  app.get('/api/custom-reports', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // In a real implementation, this would fetch from database
      const reports = [
        {
          id: 1,
          userId,
          name: "Monthly Portfolio Performance",
          description: "Comprehensive monthly analysis of portfolio performance",
          reportType: "portfolio",
          dateRange: "last-30-days",
          metrics: ["total_value", "net_returns", "sharpe_ratio", "max_drawdown"],
          visualizations: ["line-chart", "bar-chart", "table"],
          schedule: "monthly",
          isPublic: false,
          status: "active",
          createdAt: new Date().toISOString(),
          lastRunAt: new Date().toISOString()
        }
      ];
      
      res.json(reports);
    } catch (error) {
      console.error("Error fetching custom reports:", error);
      res.status(500).json({ message: "Failed to fetch custom reports" });
    }
  });

  app.post('/api/custom-reports', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const reportData = req.body;
      
      // In a real implementation, this would save to database
      const newReport = {
        id: Date.now(),
        userId,
        ...reportData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      res.json(newReport);
    } catch (error) {
      console.error("Error creating custom report:", error);
      res.status(500).json({ message: "Failed to create custom report" });
    }
  });

  app.post('/api/custom-reports/:id/run', isAuthenticated, async (req: any, res) => {
    try {
      const reportId = req.params.id;
      const userId = req.user.id;
      
      // In a real implementation, this would trigger report generation
      const reportRun = {
        id: Date.now(),
        reportId,
        userId,
        status: "completed",
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        resultData: JSON.stringify({ success: true })
      };
      
      res.json(reportRun);
    } catch (error) {
      console.error("Error running custom report:", error);
      res.status(500).json({ message: "Failed to run custom report" });
    }
  });

  app.delete('/api/custom-reports/:id', isAuthenticated, async (req: any, res) => {
    try {
      const reportId = req.params.id;
      const userId = req.user.id;
      
      // In a real implementation, this would delete from database
      res.json({ success: true, message: "Report deleted successfully" });
    } catch (error) {
      console.error("Error deleting custom report:", error);
      res.status(500).json({ message: "Failed to delete custom report" });
    }
  });

  app.get('/api/report-templates', async (req, res) => {
    try {
      // In a real implementation, this would fetch from database
      const templates = [
        {
          id: 1,
          name: "Portfolio Performance",
          description: "Comprehensive portfolio performance analysis",
          category: "portfolio",
          reportType: "portfolio",
          defaultMetrics: ["total_value", "net_returns", "sharpe_ratio", "max_drawdown", "volatility", "alpha", "beta", "sortino_ratio"],
          defaultVisualizations: ["line-chart", "bar-chart", "pie-chart", "table"],
          defaultSchedule: "monthly",
          usageCount: 156
        },
        {
          id: 2,
          name: "Risk Analysis",
          description: "Detailed risk assessment and stress testing",
          category: "risk",
          reportType: "risk",
          defaultMetrics: ["portfolio_var", "credit_risk", "market_risk", "liquidity_risk", "stress_test_results", "correlation_matrix"],
          defaultVisualizations: ["heatmap", "bar-chart", "line-chart", "scatter", "table"],
          defaultSchedule: "weekly",
          usageCount: 89
        },
        {
          id: 3,
          name: "Trading Activity",
          description: "Trading performance and activity analysis",
          category: "trading",
          reportType: "trading",
          defaultMetrics: ["total_trades", "win_rate", "profit_factor", "avg_trade_duration", "commission_costs", "daily_pnl", "monthly_pnl"],
          defaultVisualizations: ["line-chart", "bar-chart", "table"],
          defaultSchedule: "daily",
          usageCount: 67
        }
      ];
      
      res.json(templates);
    } catch (error) {
      console.error("Error fetching report templates:", error);
      res.status(500).json({ message: "Failed to fetch report templates" });
    }
  });

  const httpServer = createServer(app);
  // Initialize AI model categories and subcategories
  app.post('/api/init-categories', async (req, res) => {
    try {
      // Financial AI Model Categories with comprehensive subcategories
      const categoryData = [
        {
          name: "Risk Assessment",
          description: "AI models for risk analysis and management",
          icon: "Shield",
          sortOrder: 1,
          subcategories: [
            { name: "Credit Risk", description: "Consumer credit scoring, corporate default prediction, loan approval", sortOrder: 1 },
            { name: "Market Risk", description: "Portfolio VaR, stress testing, volatility forecasting", sortOrder: 2 },
            { name: "Operational Risk", description: "Fraud detection, compliance monitoring, internal controls", sortOrder: 3 },
            { name: "Liquidity Risk", description: "Cash flow forecasting, funding risk, liquidity stress testing", sortOrder: 4 },
            { name: "Counterparty Risk", description: "CCP risk, settlement risk, exposure assessment", sortOrder: 5 }
          ]
        },
        {
          name: "Algorithmic Trading",
          description: "Automated trading strategies and execution",
          icon: "TrendingUp",
          sortOrder: 2,
          subcategories: [
            { name: "High-Frequency Trading", description: "Ultra-low latency strategies, market making", sortOrder: 1 },
            { name: "Statistical Arbitrage", description: "Pairs trading, mean reversion strategies", sortOrder: 2 },
            { name: "Momentum Trading", description: "Trend following, breakout strategies", sortOrder: 3 },
            { name: "Market Making", description: "Liquidity provision, bid-ask spread optimization", sortOrder: 4 },
            { name: "Execution Algorithms", description: "TWAP, VWAP, implementation shortfall", sortOrder: 5 }
          ]
        },
        {
          name: "Portfolio Management",
          description: "Investment portfolio optimization and analysis",
          icon: "Target",
          sortOrder: 3,
          subcategories: [
            { name: "Asset Allocation", description: "Strategic and tactical allocation models", sortOrder: 1 },
            { name: "Risk Parity", description: "Risk-balanced portfolio construction", sortOrder: 2 },
            { name: "Factor Investing", description: "Multi-factor models, style analysis", sortOrder: 3 },
            { name: "ESG Integration", description: "Sustainable investing, ESG scoring", sortOrder: 4 },
            { name: "Alternative Investments", description: "Private equity, hedge funds, real estate", sortOrder: 5 }
          ]
        },
        {
          name: "Market Prediction",
          description: "Forecasting market movements and trends",
          icon: "Brain",
          sortOrder: 4,
          subcategories: [
            { name: "Price Forecasting", description: "Stock price prediction, commodity forecasting", sortOrder: 1 },
            { name: "Volatility Modeling", description: "GARCH models, implied volatility", sortOrder: 2 },
            { name: "Macroeconomic Indicators", description: "GDP growth, inflation, interest rates", sortOrder: 3 },
            { name: "Sentiment Analysis", description: "News sentiment, social media analysis", sortOrder: 4 },
            { name: "Technical Analysis", description: "Pattern recognition, indicator optimization", sortOrder: 5 }
          ]
        },
        {
          name: "Regulatory Compliance",
          description: "Compliance monitoring and regulatory reporting",
          icon: "ShieldCheck",
          sortOrder: 5,
          subcategories: [
            { name: "Basel III", description: "Capital adequacy, liquidity ratios", sortOrder: 1 },
            { name: "MiFID II", description: "Best execution, transaction reporting", sortOrder: 2 },
            { name: "Dodd-Frank", description: "Volcker rule, swap reporting", sortOrder: 3 },
            { name: "GDPR", description: "Data privacy, consent management", sortOrder: 4 },
            { name: "AML/KYC", description: "Anti-money laundering, customer verification", sortOrder: 5 }
          ]
        },
        {
          name: "Alternative Data",
          description: "Non-traditional data sources for financial insights",
          icon: "Zap",
          sortOrder: 6,
          subcategories: [
            { name: "Satellite Data", description: "Economic activity, crop yields, retail foot traffic", sortOrder: 1 },
            { name: "Social Media", description: "Sentiment analysis, trend detection", sortOrder: 2 },
            { name: "Web Scraping", description: "News analysis, competitor monitoring", sortOrder: 3 },
            { name: "Transaction Data", description: "Credit card spending, retail analytics", sortOrder: 4 },
            { name: "ESG Data", description: "Environmental metrics, governance scoring", sortOrder: 5 }
          ]
        }
      ];

      // Create categories and subcategories
      for (const categoryInfo of categoryData) {
        const { subcategories, ...categoryData } = categoryInfo;
        
        // Create or get category
        let category;
        try {
          category = await storage.createAiModelCategory(categoryData);
        } catch (error) {
          // Category might already exist, try to get it
          const existingCategories = await storage.getAiModelCategories();
          category = existingCategories.find(c => c.name === categoryData.name);
          if (!category) {
            throw error;
          }
        }

        // Create subcategories
        for (const subcategoryData of subcategories) {
          try {
            await storage.createAiModelSubcategory({
              ...subcategoryData,
              categoryId: category.id
            });
          } catch (error) {
            // Subcategory might already exist, continue
            console.log(`Subcategory ${subcategoryData.name} might already exist`);
          }
        }
      }

      res.json({ message: "Categories and subcategories initialized successfully" });
    } catch (error) {
      console.error("Error initializing categories:", error);
      res.status(500).json({ message: "Failed to initialize categories" });
    }
  });
  
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
