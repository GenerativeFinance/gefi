import type { Express } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../multiAuth";
import { insertPortfolioSchema, insertAiModelSchema, insertRiskAlertSchema } from "@shared/schema";
import { z } from "zod";
import { PortfolioOptimizer, RiskAssessment, MarketAnalysis } from "../aiModels";
import { marketDataService } from "../marketDataService";
import { tradingService } from "../tradingService";
import { RecommendationEngine } from "../recommendationEngine";
import { insertUserPreferencesSchema, insertUserModelInteractionSchema } from "@shared/schema";
import { aiModelsData } from "../data/ai-models.js";
import reportRoutes from "./reportRoutes";

export function registerGeFiRoutes(app: Express) {
  // ===========================================
  // GeFi Core Financial Platform APIs
  // ===========================================
  
  // Register report routes
  app.use('/api', reportRoutes);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      console.log('🔍 Auth user request - Session user:', req.user);
      console.log('🔍 Session ID:', req.sessionID);
      console.log('🔍 Is authenticated:', req.isAuthenticated());
      
      // For multi-provider auth, user ID is directly available
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      console.log('📝 Found user in DB:', !!user);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Data Provider routes with static data (no database dependency)
  app.get('/api/data-provider', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Return static sample data for demonstration
      const sampleProvider = {
        id: 1,
        userId: userId,
        companyName: "Advanced Financial Data Solutions",
        description: "Leading provider of real-time market data and analytics for institutional investors",
        specialization: "Market Data, Risk Analytics, ESG Data, Algorithmic Trading Data",
        complianceCertifications: ["SOC 2", "ISO 27001", "GDPR", "MiFID II"],
        dataQualityRating: "9.4",
        totalRevenue: "2847500.00",
        totalDatasets: 24,
        activeSubscriptions: 1847,
        isVerified: true,
        status: "active",
        createdAt: "2024-03-15T10:30:00Z",
        updatedAt: "2025-01-14T16:45:00Z"
      };
      
      res.json(sampleProvider);
    } catch (error) {
      console.error("Error fetching data provider:", error);
      res.status(500).json({ message: "Failed to fetch data provider" });
    }
  });

  app.get('/api/datasets', isAuthenticated, async (req: any, res) => {
    try {
      // Return static sample datasets for demonstration
      const sampleDatasets = [
        {
          id: 1,
          providerId: 1,
          name: "S&P 500 Historical Prices",
          description: "Complete historical pricing data for all S&P 500 companies from 2010-2024 with adjusted close prices, volume, and market cap data.",
          category: "Market Data",
          subcategory: "Equity Prices",
          dataType: "Time Series",
          fileSize: 2457600000, // 2.3 GB in bytes
          recordCount: 2850000,
          updateFrequency: "Daily",
          qualityScore: "98",
          pricePerRecord: "0.002",
          monthlySubscriptionFee: "299.00",
          oneTimePurchasePrice: "1499.00",
          licenseType: "Commercial",
          downloadCount: 1250,
          subscriptionCount: 145,
          revenue: "23450.00",
          isActive: true,
          isPublic: true,
          complianceStatus: "SOC 2, GDPR",
          createdAt: "2024-01-15T08:30:00Z",
          updatedAt: "2025-01-14T16:45:00Z"
        },
        {
          id: 2,
          providerId: 1,
          name: "Cryptocurrency Order Book Data",
          description: "Real-time order book snapshots from major crypto exchanges including Binance, Coinbase, and Kraken for top 100 cryptocurrencies.",
          category: "Alternative Data",
          subcategory: "Crypto Market Data",
          dataType: "Streaming",
          fileSize: 5368709120, // 5 GB in bytes
          recordCount: 15000000,
          updateFrequency: "Real-time",
          qualityScore: "96",
          pricePerRecord: "0.001",
          monthlySubscriptionFee: "599.00",
          oneTimePurchasePrice: "2999.00",
          licenseType: "Commercial",
          downloadCount: 890,
          subscriptionCount: 234,
          revenue: "18750.00",
          isActive: true,
          isPublic: true,
          complianceStatus: "ISO 27001, GDPR",
          createdAt: "2024-02-20T14:15:00Z",
          updatedAt: "2025-01-14T16:45:00Z"
        },
        {
          id: 3,
          providerId: 1,
          name: "ESG Ratings Database",
          description: "Comprehensive ESG (Environmental, Social, Governance) ratings for 5000+ global companies with quarterly updates and historical trends.",
          category: "ESG Data",
          subcategory: "Sustainability Metrics",
          dataType: "Structured",
          fileSize: 1073741824, // 1 GB in bytes
          recordCount: 500000,
          updateFrequency: "Quarterly",
          qualityScore: "94",
          pricePerRecord: "0.05",
          monthlySubscriptionFee: "799.00",
          oneTimePurchasePrice: "3999.00",
          licenseType: "Research & Commercial",
          downloadCount: 567,
          subscriptionCount: 89,
          revenue: "15600.00",
          isActive: true,
          isPublic: true,
          complianceStatus: "SOC 2, GDPR, MiFID II",
          createdAt: "2024-03-10T11:20:00Z",
          updatedAt: "2025-01-14T16:45:00Z"
        }
      ];
      
      res.json(sampleDatasets);
    } catch (error) {
      console.error("Error fetching datasets:", error);
      res.status(500).json({ message: "Failed to fetch datasets" });
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
      console.log("Full req.user object:", req.user);
      
      // Try multiple ways to get user ID depending on auth system used
      let userId = null;
      if (req.user?.claims?.sub) {
        userId = req.user.claims.sub;
      } else if (req.user?.id) {
        userId = req.user.id;
      } else if (req.user?.sub) {
        userId = req.user.sub;
      } else if (typeof req.user === 'string') {
        userId = req.user;
      }
      
      console.log("Extracted userId:", userId);
      
      if (!userId) {
        console.error("Could not extract user ID from req.user:", req.user);
        return res.status(401).json({ message: "User not authenticated - no user ID found" });
      }
      
      const profileData = req.body;

      console.log("Setting up profile for user:", userId);
      console.log("Profile data received:", profileData);

      // First update the user's basic information
      if (profileData.firstName || profileData.lastName) {
        try {
          await storage.updateUser(userId, {
            firstName: profileData.firstName,
            lastName: profileData.lastName
          });
          console.log("User basic info updated successfully");
        } catch (error) {
          console.error("Error updating user basic info:", error);
          // Continue with profile setup even if user update fails
        }
      }

      // Then create or update the profile
      try {
        const profile = await storage.createOrUpdateUserProfile(userId, profileData);
        console.log("Profile created/updated successfully:", profile);
        
        res.json({ 
          message: "Profile setup completed successfully",
          profile,
          redirectTo: req.query.returnTo || '/'
        });
      } catch (profileError) {
        console.error("Error creating/updating profile:", profileError);
        
        // Try to at least return success if user info was updated
        if (profileData.firstName || profileData.lastName) {
          return res.json({ 
            message: "Basic profile information updated successfully",
            redirectTo: req.query.returnTo || '/'
          });
        }
        
        throw profileError;
      }
    } catch (error) {
      console.error("Error setting up profile:", error);
      res.status(500).json({ 
        message: "Failed to set up profile", 
        error: error instanceof Error ? error.message : "Unknown error",
        redirectTo: req.query.returnTo || '/'
      });
    }
  });

  // Profile skip route
  app.post('/api/profile/skip', isAuthenticated, async (req: any, res) => {
    try {
      // Just return success for skipping profile setup
      res.json({ 
        message: "Profile setup skipped",
        redirectTo: req.query.returnTo || '/'
      });
    } catch (error) {
      console.error("Error skipping profile setup:", error);
      res.status(500).json({ message: "Failed to skip profile setup" });
    }
  });

  // User profile information
  app.get('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const profile = await storage.getUserProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // ===========================================
  // Portfolio Management APIs
  // ===========================================

  // Get user portfolio
  app.get('/api/portfolio', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const portfolio = await storage.getUserPortfolio(userId);
      
      if (!portfolio) {
        // Return default empty portfolio structure
        return res.json({
          id: null,
          userId,
          totalValue: "0.00",
          totalInvestment: "0.00",
          totalPnL: "0.00",
          totalPnLPercentage: "0.00",
          assets: []
        });
      }
      
      res.json(portfolio);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  // Get portfolio assets
  app.get('/api/portfolio/assets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      // First get the user's portfolio
      const portfolio = await storage.getUserPortfolio(userId);
      if (!portfolio) {
        // Create a default portfolio if none exists
        const newPortfolio = await storage.createPortfolio({
          userId,
          totalInvestment: "0",
          livePnL: "0",
          annualReturns: "0",
          sharpeRatio: "0"
        });
        return res.json([]);
      }
      const assets = await storage.getPortfolioAssets(portfolio.id);
      res.json(assets);
    } catch (error) {
      console.error("Error fetching portfolio assets:", error);
      res.status(500).json({ message: "Failed to fetch portfolio assets" });
    }
  });

  // Portfolio AI Models
  app.get('/api/portfolio/ai-models', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const aiModels = await storage.getUserAiModels(userId);
      res.json(aiModels);
    } catch (error) {
      console.error("Error fetching AI models:", error);
      res.status(500).json({ message: "Failed to fetch AI models" });
    }
  });

  // Portfolio AI Models Subscriptions
  app.get('/api/portfolio/ai-models/subscriptions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Mock subscription data for demonstration
      const subscriptions = [
        {
          id: 1,
          name: "Quantum Risk Predictor",
          description: "Advanced quantum computing-based risk assessment model that analyzes market volatility and predicts potential downturns.",
          category: "Risk Management",
          creator: "QuantumFinance Labs",
          rating: 4.8,
          totalRatings: 152,
          subscription: {
            id: 1,
            plan: "yearly",
            status: "active",
            price: 2999.99,
            subscribedAt: "2024-01-15T08:30:00Z",
            renewalDate: "2025-01-15T08:30:00Z",
            totalUsageHours: 87.5
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
      
      Object.entries(targetAllocation || {}).forEach(([asset, target]) => {
        const current = currentAllocation[asset as keyof typeof currentAllocation] || 0;
        const targetValue = Number(target) || 0;
        const drift = Math.abs(current - targetValue);
        
        if (drift >= (threshold || 5)) {
          rebalanceActions.push({
            asset,
            currentAllocation: current,
            targetAllocation: targetValue,
            action: current > targetValue ? 'sell' : 'buy',
            amount: drift,
            estimatedValue: drift * (parseFloat(portfolio.totalInvestment || '100000') / 100)
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

  // ===========================================
  // Risk Assessment APIs
  // ===========================================

  // Risk Assessment Endpoints
  app.get('/api/risk-assessment/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Mock risk profile data
      const riskProfile = {
        riskTolerance: "moderate",
        riskScore: 6.5,
        riskCapacity: "high",
        timeHorizon: "long-term",
        investmentGoals: ["growth", "income"],
        riskFactors: [
          { factor: "Age", score: 7, weight: 0.2 },
          { factor: "Income Stability", score: 8, weight: 0.25 },
          { factor: "Investment Experience", score: 6, weight: 0.15 },
          { factor: "Financial Obligations", score: 5, weight: 0.2 },
          { factor: "Emergency Fund", score: 7, weight: 0.2 }
        ]
      };
      
      res.json(riskProfile);
    } catch (error) {
      console.error("Error fetching risk profile:", error);
      res.status(500).json({ message: "Failed to fetch risk profile" });
    }
  });

  app.get('/api/risk-assessment/metrics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Mock risk metrics
      const riskMetrics = {
        var: { oneDay: 2.3, fiveDay: 5.1, monthlyVaR: 12.8 },
        sharpeRatio: 1.85,
        beta: 1.12,
        maxDrawdown: -8.5,
        volatility: 16.2,
        correlationMatrix: {
          stocks: { bonds: -0.3, crypto: 0.4, commodities: 0.2 },
          bonds: { crypto: -0.1, commodities: 0.1 },
          crypto: { commodities: 0.3 }
        }
      };
      
      res.json(riskMetrics);
    } catch (error) {
      console.error("Error fetching risk metrics:", error);
      res.status(500).json({ message: "Failed to fetch risk metrics" });
    }
  });

  app.get('/api/risk-assessment/recommendations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Mock risk-based recommendations
      const recommendations = [
        {
          type: "allocation",
          priority: "high",
          title: "Reduce Crypto Exposure",
          description: "Current crypto allocation (15%) exceeds recommended level for your risk profile (10%)",
          suggestedAction: "Consider reducing crypto holdings by 5%",
          impact: "Reduce portfolio volatility by ~2.3%"
        },
        {
          type: "diversification",
          priority: "medium",
          title: "Add International Exposure",
          description: "Portfolio is heavily concentrated in domestic markets",
          suggestedAction: "Add 15-20% international equity exposure",
          impact: "Improve risk-adjusted returns through diversification"
        },
        {
          type: "rebalancing",
          priority: "low",
          title: "Quarterly Rebalancing Due",
          description: "Some asset classes have drifted from target allocation",
          suggestedAction: "Rebalance back to target allocation",
          impact: "Maintain desired risk level"
        }
      ];
      
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching risk recommendations:", error);
      res.status(500).json({ message: "Failed to fetch risk recommendations" });
    }
  });

  app.post('/api/risk-assessment', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const riskData = insertRiskAlertSchema.parse(req.body);
      
      // Run risk assessment
      const riskAssessment = new RiskAssessment();
      const assessment = await riskAssessment.assessPortfolio(userId, riskData);
      
      // Store risk alert if needed
      if (assessment.riskLevel === 'high') {
        await storage.createRiskAlert({
          ...riskData,
          userId,
          alertType: 'high_risk',
          severity: 'high',
          description: assessment.description
        });
      }
      
      res.json(assessment);
    } catch (error) {
      console.error("Error performing risk assessment:", error);
      res.status(500).json({ message: "Failed to perform risk assessment" });
    }
  });

  // ===========================================
  // AI Model & Marketplace APIs
  // ===========================================

  // AI Model Categories
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
      const subcategories = await storage.getAiModelSubcategories(categoryId);
      res.json(subcategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      res.status(500).json({ message: "Failed to fetch subcategories" });
    }
  });

  // AI Models Marketplace
  app.get('/api/ai-models', async (req, res) => {
    try {
      // Use the specific AI models data from user specifications
      const sampleAiModels = aiModelsData;

      // Apply filtering based on query parameters
      const { 
        category, 
        subcategory, 
        riskLevel, 
        priceMin, 
        priceMax,
        search,
        featured,
        sortBy = 'rating',
        sortOrder = 'desc'
      } = req.query;

      let filteredModels = sampleAiModels;

      // Apply filters
      if (category && category !== 'all') {
        filteredModels = filteredModels.filter(model => 
          model.category.toLowerCase().includes(category.toLowerCase())
        );
      }

      if (subcategory && subcategory !== 'all') {
        filteredModels = filteredModels.filter(model => 
          model.subcategory.toLowerCase().includes(subcategory.toLowerCase())
        );
      }

      if (riskLevel && riskLevel !== 'all') {
        filteredModels = filteredModels.filter(model => 
          model.riskLevel.toLowerCase() === riskLevel.toLowerCase()
        );
      }

      if (priceMin) {
        filteredModels = filteredModels.filter(model => 
          parseFloat(model.price) >= parseFloat(priceMin)
        );
      }

      if (priceMax) {
        filteredModels = filteredModels.filter(model => 
          parseFloat(model.price) <= parseFloat(priceMax)
        );
      }

      if (search) {
        const searchTerm = search.toLowerCase();
        filteredModels = filteredModels.filter(model => 
          model.name.toLowerCase().includes(searchTerm) ||
          model.description.toLowerCase().includes(searchTerm) ||
          model.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }

      if (featured === 'true') {
        filteredModels = filteredModels.filter(model => model.isFeatured);
      }

      // Apply sorting
      filteredModels.sort((a, b) => {
        let comparison = 0;
        switch (sortBy) {
          case 'rating':
            comparison = a.rating - b.rating;
            break;
          case 'price':
            comparison = parseFloat(a.price) - parseFloat(b.price);
            break;
          case 'subscribers':
            comparison = a.monthlySubscribers - b.monthlySubscribers;
            break;
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          default:
            comparison = a.rating - b.rating;
        }
        return sortOrder === 'desc' ? -comparison : comparison;
      });

      res.json(filteredModels);
    } catch (error) {
      console.error("Error fetching AI models:", error);
      res.status(500).json({ message: "Failed to fetch AI models" });
    }
  });

  // Individual AI Model Details
  app.get('/api/ai-models/:id', async (req, res) => {
    try {
      const modelId = parseInt(req.params.id);
      
      // Get all models from the same source as above
      const sampleAiModels = aiModelsData.concat([
        {
          id: 4,
          name: "QuantRisk Pro",
          description: "Advanced portfolio risk assessment using Monte Carlo simulations, VaR calculations, and stress testing. Provides real-time risk metrics and alerts for institutional portfolios.",
          category: "Risk Assessment",
          subcategory: "Market Risk",
          creator: "QuantAI Labs",
          rating: 4.8,
          totalRatings: 342,
          price: "299.99",
          monthlySubscribers: 2847,
          accuracy: 94.2,
          riskLevel: "Low",
          aiTechnique: "Machine Learning",
          targetUserType: "Asset Managers",
          financialInstrument: "Multi-Asset",
          tags: ["Risk Assessment", "VaR", "Monte Carlo", "Portfolio Management"],
          features: {
            realTimeAnalysis: true,
            backtesting: true,
            alertSystem: true,
            apiAccess: true,
            customDashboard: true
          },
          performance: {
            accuracy: 94.2,
            sharpeRatio: 2.1,
            maxDrawdown: 8.5,
            annualReturn: 18.7,
            calmarRatio: 2.2
          },
          dataRequirements: ["Historical Market Data", "Economic Indicators", "Volatility Data"],
          supportedRegions: ["US", "EU", "Asia-Pacific"],
          complianceFrameworks: ["BASEL III", "MiFID II", "GDPR"],
          minInvestment: "10000.00",
          isFeatured: true,
          isActive: true,
          createdAt: "2024-03-15T10:30:00Z",
          lastUpdated: "2025-07-10T16:45:00Z"
        },
        {
          id: 2,
          name: "CryptoSentiment AI",
          description: "Deep learning model analyzing social media sentiment, news sentiment, and on-chain metrics to predict cryptocurrency price movements with high accuracy.",
          category: "Trading Strategies", 
          subcategory: "Cryptocurrency",
          creator: "BlockChain Analytics",
          rating: 4.6,
          totalRatings: 189,
          price: "449.99",
          monthlySubscribers: 1203,
          accuracy: 87.8,
          riskLevel: "High",
          aiTechnique: "Deep Learning",
          targetUserType: "Crypto Traders",
          financialInstrument: "Cryptocurrency",
          tags: ["Cryptocurrency", "Sentiment Analysis", "Social Media", "Price Prediction"],
          features: {
            realTimeAnalysis: true,
            backtesting: true,
            alertSystem: true,
            apiAccess: true,
            socialMediaIntegration: true
          },
          performance: {
            accuracy: 87.8,
            sharpeRatio: 1.8,
            maxDrawdown: 15.2,
            annualReturn: 35.4,
            winRate: 68.5
          },
          dataRequirements: ["Social Media Data", "News Data", "On-Chain Metrics", "Market Data"],
          supportedRegions: ["Global"],
          complianceFrameworks: ["AML", "KYC"],
          minInvestment: "1000.00",
          isFeatured: true,
          isActive: true,
          createdAt: "2024-05-20T14:15:00Z",
          lastUpdated: "2025-07-12T09:30:00Z"
        },
        {
          id: 3,
          name: "ESG Alpha Generator",
          description: "AI-powered ESG scoring and sustainable investment screener that identifies alpha opportunities in ESG-compliant securities while maintaining competitive returns.",
          category: "Portfolio Management",
          subcategory: "ESG Investing", 
          creator: "Green Finance AI",
          rating: 4.4,
          totalRatings: 156,
          price: "179.99",
          monthlySubscribers: 834,
          accuracy: 91.3,
          riskLevel: "Medium",
          aiTechnique: "Machine Learning",
          targetUserType: "Sustainable Investors",
          financialInstrument: "Equities",
          tags: ["ESG", "Sustainability", "Alpha Generation", "Screening"],
          features: {
            esgScoring: true,
            sustainabilityMetrics: true,
            backtesting: true,
            portfolioOptimization: true,
            impactReporting: true
          },
          performance: {
            accuracy: 91.3,
            sharpeRatio: 1.9,
            maxDrawdown: 12.1,
            annualReturn: 16.8,
            esgScore: 8.7
          },
          dataRequirements: ["ESG Data", "Financial Data", "Impact Metrics"],
          supportedRegions: ["US", "EU", "UK"],
          complianceFrameworks: ["SFDR", "TCFD", "SASB"],
          minInvestment: "5000.00",
          isFeatured: false,
          isActive: true,
          createdAt: "2024-08-10T11:20:00Z",
          lastUpdated: "2025-07-08T14:15:00Z"
        },
        {
          id: 4,
          name: "Credit Default Predictor",
          description: "Machine learning model for predicting corporate credit defaults using financial ratios, market indicators, and alternative data sources with 95% accuracy.",
          category: "Risk Assessment",
          subcategory: "Credit Risk",
          creator: "CreditAI Solutions",
          rating: 4.7,
          totalRatings: 278,
          price: "399.99",
          monthlySubscribers: 567,
          accuracy: 95.1,
          riskLevel: "Low",
          aiTechnique: "Machine Learning",
          targetUserType: "Banks",
          financialInstrument: "Fixed Income",
          tags: ["Credit Risk", "Default Prediction", "Financial Ratios", "Alternative Data"],
          features: {
            defaultPrediction: true,
            creditScoring: true,
            earlyWarning: true,
            portfolioAnalysis: true,
            regulatoryReporting: true
          },
          performance: {
            accuracy: 95.1,
            precision: 92.8,
            recall: 89.4,
            f1Score: 91.1,
            auc: 0.947
          },
          dataRequirements: ["Financial Statements", "Market Data", "Alternative Data"],
          supportedRegions: ["US", "EU", "Asia"],
          complianceFrameworks: ["BASEL III", "IFRS 9", "CECL"],
          minInvestment: "25000.00",
          isFeatured: true,
          isActive: true,
          createdAt: "2024-01-12T08:45:00Z",
          lastUpdated: "2025-07-05T13:20:00Z"
        },
        {
          id: 5,
          name: "HFT Arbitrage Engine",
          description: "High-frequency trading algorithm for cross-exchange arbitrage opportunities using ultra-low latency execution and advanced order management.",
          category: "Trading Strategies",
          subcategory: "High-Frequency Trading",
          creator: "Velocity Trading Systems",
          rating: 4.9,
          totalRatings: 89,
          price: "2999.99",
          monthlySubscribers: 234,
          accuracy: 96.7,
          riskLevel: "Medium",
          aiTechnique: "Reinforcement Learning",
          targetUserType: "Hedge Funds",
          financialInstrument: "Multi-Asset",
          tags: ["HFT", "Arbitrage", "Low Latency", "Cross-Exchange"],
          features: {
            ultraLowLatency: true,
            crossExchange: true,
            smartRouting: true,
            riskControls: true,
            realTimeMonitoring: true
          },
          performance: {
            accuracy: 96.7,
            averageLatency: 0.5, // microseconds
            dailyTrades: 15420,
            profitFactor: 3.2,
            maxDrawdown: 2.1
          },
          dataRequirements: ["Real-Time Market Data", "Order Book Data", "Exchange APIs"],
          supportedRegions: ["US", "EU"],
          complianceFrameworks: ["MiFID II", "Reg NMS"],
          minInvestment: "100000.00",
          isFeatured: true,
          isActive: true,
          createdAt: "2024-09-05T15:30:00Z",
          lastUpdated: "2025-07-14T10:45:00Z"
        },
        {
          id: 6,
          name: "Fraud Detection Shield",
          description: "Advanced AI system for real-time fraud detection in financial transactions using behavioral analytics, pattern recognition, and anomaly detection.",
          category: "Risk Assessment",
          subcategory: "Fraud Detection",
          creator: "SecureAI Technologies",
          rating: 4.5,
          totalRatings: 445,
          price: "599.99",
          monthlySubscribers: 1156,
          accuracy: 98.3,
          riskLevel: "Low",
          aiTechnique: "Deep Learning",
          targetUserType: "Banks",
          financialInstrument: "Payments",
          tags: ["Fraud Detection", "Behavioral Analytics", "Real-Time", "Anomaly Detection"],
          features: {
            realTimeScoring: true,
            behavioralAnalytics: true,
            ruleEngine: true,
            investigationTools: true,
            reportingDashboard: true
          },
          performance: {
            accuracy: 98.3,
            falsePositiveRate: 0.8,
            detectionRate: 97.1,
            responseTime: 15, // milliseconds
            savingsRatio: 8.4
          },
          dataRequirements: ["Transaction Data", "Behavioral Data", "Device Information"],
          supportedRegions: ["Global"],
          complianceFrameworks: ["PCI DSS", "AML", "KYC", "GDPR"],
          minInvestment: "15000.00",
          isFeatured: false,
          isActive: true,
          createdAt: "2024-02-28T12:15:00Z",
          lastUpdated: "2025-07-11T16:30:00Z"
        }
      ]);
      
      const model = sampleAiModels.find(m => m.id === modelId);
      
      if (!model) {
        return res.status(404).json({ message: "AI model not found" });
      }

      // Add additional detailed information for individual model view
      const detailedModel = {
        ...model,
        documentation: {
          overview: `${model.name} is a state-of-the-art AI model designed for ${model.category.toLowerCase()}. This model leverages ${model.aiTechnique.toLowerCase()} techniques to provide accurate predictions and insights.`,
          methodology: `The model uses advanced ${model.aiTechnique.toLowerCase()} algorithms trained on comprehensive datasets including ${model.dataRequirements.join(', ').toLowerCase()}.`,
          useCases: [
            `Portfolio risk assessment for ${model.targetUserType.toLowerCase()}`,
            `Real-time monitoring and alerts`,
            `Backtesting and strategy validation`,
            `Compliance reporting and documentation`
          ],
          limitations: [
            "Requires high-quality input data",
            "Performance may vary in extreme market conditions",
            "Regular model updates required for optimal performance"
          ]
        },
        pricing: {
          monthly: parseFloat(model.price),
          annual: parseFloat(model.price) * 10, // 20% discount
          enterprise: "Custom pricing available",
          trial: "14-day free trial",
          features: {
            basic: ["Real-time analysis", "Basic alerts", "API access"],
            premium: ["Advanced analytics", "Custom dashboards", "Priority support"],
            enterprise: ["White-label solution", "Custom integration", "Dedicated support"]
          }
        },
        reviews: [
          {
            id: 1,
            userName: "Sarah Chen",
            userRole: "Portfolio Manager",
            rating: 5,
            comment: "Exceptional accuracy and real-time insights. Has significantly improved our risk management process.",
            date: "2025-07-01T10:30:00Z",
            verified: true
          },
          {
            id: 2,
            userName: "Michael Rodriguez",
            userRole: "Quantitative Analyst", 
            rating: 4,
            comment: "Great model with solid performance. The API integration was seamless and documentation is excellent.",
            date: "2025-06-28T14:15:00Z",
            verified: true
          },
          {
            id: 3,
            userName: "Emily Zhang",
            userRole: "Risk Manager",
            rating: 5,
            comment: "Best-in-class risk assessment tool. The stress testing features are particularly impressive.",
            date: "2025-06-25T09:45:00Z",
            verified: true
          }
        ],
        relatedModels: sampleAiModels
          .filter(m => m.id !== modelId && (m.category === model.category || m.subcategory === model.subcategory))
          .slice(0, 3)
          .map(m => ({ id: m.id, name: m.name, rating: m.rating, price: m.price }))
      };

      res.json(detailedModel);
    } catch (error) {
      console.error("Error fetching AI model details:", error);
      res.status(500).json({ message: "Failed to fetch AI model details" });
    }
  });

  // Subscribe to AI Model
  app.post('/api/ai-models/:id/subscribe', isAuthenticated, async (req, res) => {
    try {
      const modelId = parseInt(req.params.id);
      const userId = req.user?.claims?.sub;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // In a real app, this would create a subscription record in the database
      // For now, we'll just return a success response
      res.json({ 
        success: true, 
        message: "Successfully subscribed to AI model",
        subscription: {
          modelId,
          userId,
          subscribedAt: new Date().toISOString(),
          status: "active"
        }
      });
    } catch (error) {
      console.error("Error subscribing to AI model:", error);
      res.status(500).json({ message: "Failed to subscribe to AI model" });
    }
  });

}