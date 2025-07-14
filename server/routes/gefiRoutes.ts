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

export function registerGeFiRoutes(app: Express) {
  // ===========================================
  // GeFi Core Financial Platform APIs
  // ===========================================

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

}