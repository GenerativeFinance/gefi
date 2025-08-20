import type { Express } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../multiAuth";
import { insertPortfolioSchema, insertAiModelSchema, insertRiskAlertSchema, userWallets, walletTransactions, serverInfrastructure, federatedLearningNodes, serverDeployments } from "@shared/schema";
import { z } from "zod";
import { PortfolioOptimizer, RiskAssessment, MarketAnalysis } from "../aiModels";
import { marketDataService } from "../marketDataService";
import { tradingService } from "../tradingService";
import { RecommendationEngine } from "../recommendationEngine";
import { insertUserPreferencesSchema, insertUserModelInteractionSchema } from "@shared/schema";
import { aiModelsData } from "../data/ai-models.js";
export function registerGeFiRoutes(app: Express) {
  // ===========================================
  // GeFi Core Financial Platform APIs
  // ===========================================

  // ===========================================
  // Wallet Management APIs
  // ===========================================

  // Get user wallets
  app.get('/api/wallets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Return mock wallet data for demonstration
      const mockWallets = [
        {
          id: "fl_zqmi8z8e5",
          userId: userId,
          name: "FL Training Node 1",
          type: "federated_learning",
          publicAddress: "fl_zqmi8z8e5",
          privateKey: "••••••••••••••••••••••••••••••••",
          balance: 125.4567,
          isActive: true,
          lastTransactionAt: new Date(Date.now() - 3600000).toISOString(),
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "fl_abc123def",
          userId: userId,
          name: "FL Validator Node",
          type: "federated_learning",
          publicAddress: "fl_abc123def",
          privateKey: "••••••••••••••••••••••••••••••••",
          balance: 89.2341,
          isActive: true,
          lastTransactionAt: new Date(Date.now() - 7200000).toISOString(),
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "trade_xyz789",
          userId: userId,
          name: "Trading Wallet",
          type: "trading",
          publicAddress: "0x742d35cc6cd34b2c95b2e2e3a8b1f1e83d2d3e4f",
          privateKey: "••••••••••••••••••••••••••••••••",
          balance: 1250.0000,
          isActive: true,
          lastTransactionAt: new Date(Date.now() - 1800000).toISOString(),
          createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      res.json(mockWallets);
    } catch (error) {
      console.error("Error fetching wallets:", error);
      res.status(500).json({ message: "Failed to fetch wallets" });
    }
  });

  // Get wallet statistics
  app.get('/api/wallets/stats', isAuthenticated, async (req: any, res) => {
    try {
      const stats = {
        totalBalance: 1464.69,
        activeWallets: 3,
        lastActivity: "2 hours ago"
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching wallet stats:", error);
      res.status(500).json({ message: "Failed to fetch wallet stats" });
    }
  });

  // Create new wallet
  app.post('/api/wallets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { name, type } = req.body;
      
      if (!name || !type) {
        return res.status(400).json({ message: "Name and type are required" });
      }
      
      // Generate mock wallet address based on type
      let publicAddress = "";
      if (type === "federated_learning") {
        publicAddress = `fl_${Math.random().toString(36).substr(2, 9)}`;
      } else {
        publicAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
      }
      
      const mockWallet = {
        id: publicAddress,
        userId: userId,
        name: name,
        type: type,
        publicAddress: publicAddress,
        privateKey: `pk_${Math.random().toString(36).substr(2, 32)}`,
        balance: 0,
        isActive: true,
        lastTransactionAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      res.status(201).json(mockWallet);
    } catch (error) {
      console.error("Error creating wallet:", error);
      res.status(500).json({ message: "Failed to create wallet" });
    }
  });

  // Delete wallet
  app.delete('/api/wallets/:walletId', isAuthenticated, async (req: any, res) => {
    try {
      const walletId = req.params.walletId;
      res.json({ message: "Wallet deleted successfully" });
    } catch (error) {
      console.error("Error deleting wallet:", error);
      res.status(500).json({ message: "Failed to delete wallet" });
    }
  });

  // ===========================================
  // Server Management APIs
  // ===========================================

  // Get user servers
  app.get('/api/servers', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Return mock server data for demonstration
      const mockServers = [
        {
          id: "srv_aws_001",
          userId: userId,
          name: "FL-Node-Production",
          provider: "aws",
          region: "us-east-1",
          instanceType: "t3.large",
          status: "running",
          ipAddress: "54.123.45.67",
          configuration: {
            cpu: 2,
            memory: 8,
            storage: 100,
            networkSpeed: "1 Gbps",
            operatingSystem: "Ubuntu 22.04"
          },
          costPerHour: 0.0832,
          totalCost: 59.90,
          lastHealthCheck: new Date(Date.now() - 300000).toISOString(),
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "srv_gcp_002",
          userId: userId,
          name: "FL-Development",
          provider: "gcp",
          region: "us-west-2",
          instanceType: "n1-standard-2",
          status: "stopped",
          ipAddress: "35.89.123.45",
          configuration: {
            cpu: 2,
            memory: 7.5,
            storage: 50,
            networkSpeed: "1 Gbps",
            operatingSystem: "Ubuntu 22.04"
          },
          costPerHour: 0.0735,
          totalCost: 15.20,
          lastHealthCheck: new Date(Date.now() - 3600000).toISOString(),
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      res.json(mockServers);
    } catch (error) {
      console.error("Error fetching servers:", error);
      res.status(500).json({ message: "Failed to fetch servers" });
    }
  });

  // Create new server
  app.post('/api/servers', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { name, provider, region, instanceType, configuration } = req.body;
      
      if (!name || !provider || !region || !instanceType) {
        return res.status(400).json({ message: "All server details are required" });
      }
      
      const mockServer = {
        id: `srv_${provider}_${Math.random().toString(36).substr(2, 6)}`,
        userId: userId,
        name: name,
        provider: provider,
        region: region,
        instanceType: instanceType,
        status: "provisioning",
        ipAddress: null,
        configuration: configuration,
        costPerHour: 0.08,
        totalCost: 0,
        lastHealthCheck: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      res.status(201).json(mockServer);
    } catch (error) {
      console.error("Error creating server:", error);
      res.status(500).json({ message: "Failed to create server" });
    }
  });

  // Server actions (start, stop, restart)
  app.post('/api/servers/:serverId/actions', isAuthenticated, async (req: any, res) => {
    try {
      const serverId = req.params.serverId;
      const { action } = req.body;
      
      if (!["start", "stop", "restart"].includes(action)) {
        return res.status(400).json({ message: "Invalid action" });
      }
      
      res.json({ message: `Server ${action} action completed successfully` });
    } catch (error) {
      console.error("Error performing server action:", error);
      res.status(500).json({ message: "Failed to perform server action" });
    }
  });

  // Get server deployments
  app.get('/api/server-deployments', isAuthenticated, async (req: any, res) => {
    try {
      const deployments = [];
      res.json(deployments);
    } catch (error) {
      console.error("Error fetching deployments:", error);
      res.status(500).json({ message: "Failed to fetch deployments" });
    }
  });

  // Get federated learning nodes
  app.get('/api/federated-learning-nodes', isAuthenticated, async (req: any, res) => {
    try {
      const nodes = [];
      res.json(nodes);
    } catch (error) {
      console.error("Error fetching FL nodes:", error);
      res.status(500).json({ message: "Failed to fetch FL nodes" });
    }
  });

  // Get cloud providers
  app.get('/api/cloud-providers', isAuthenticated, async (req: any, res) => {
    try {
      const providers = [
        { id: "aws", name: "Amazon Web Services", regions: ["us-east-1", "us-west-2", "eu-west-1"] },
        { id: "gcp", name: "Google Cloud Platform", regions: ["us-central1", "us-west1", "europe-west1"] },
        { id: "azure", name: "Microsoft Azure", regions: ["eastus", "westus", "westeurope"] }
      ];
      res.json(providers);
    } catch (error) {
      console.error("Error fetching cloud providers:", error);
      res.status(500).json({ message: "Failed to fetch cloud providers" });
    }
  });

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
      
      // Use the updated AI models data that includes all models
      const sampleAiModels = aiModelsData;
      
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

  // Subscribe to AI Model (auth-aware with demo fallback)
  app.post('/api/ai-models/:id/subscribe', async (req, res) => {
    try {
      const allowDemo =
        (process.env.ALLOW_DEMO_SUBS !== 'false') &&
        (process.env.NODE_ENV !== 'production');

      const modelId = parseInt(req.params.id, 10);

      // Try to resolve a user ID from several possible locations
      const userId =
        (req as any)?.user?.claims?.sub ||
        (req as any)?.user?.id ||
        (req as any)?.auth?.userId ||
        (req.headers['x-user-id'] as string | undefined);

      if (!userId && !allowDemo) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Use the existing models data for pricing if available
      const model = aiModelsData?.find?.((m: any) => m.id === modelId);
      const priceNumber =
        model?.price != null ? Number(model.price) :
        model?.pricing?.monthly != null ? Number(model.pricing.monthly) :
        null;

      // In production with proper auth, you'd persist a subscription here.
      // For demo/local fallback, return an active subscription immediately.
      const subscription = {
        id: `sub_${userId || 'guest'}_${modelId}_${Date.now()}`,
        modelId,
        userId: String(userId || 'guest'),
        price: priceNumber,
        currency: 'USD',
        status: 'active',
        subscribedAt: new Date().toISOString(),
      };

      return res.json({
        success: true,
        message: userId ? 'Successfully subscribed to AI model' : 'Subscribed (demo mode, no auth)',
        subscription,
      });
    } catch (error) {
      console.error('Error subscribing to AI model:', error);
      return res.status(500).json({ success: false, message: 'Failed to subscribe to model' });
    }
  });

  // Onchain payment routes
  app.post('/api/ai-models/:id/onchain-invoice', isAuthenticated, async (req, res) => {
    try {
      const modelId = parseInt(req.params.id);
      const userId = req.user?.claims?.sub;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // In a real implementation, this would:
      // 1. Fetch the model price from database
      // 2. Generate a unique invoice ID
      // 3. Store invoice in database with expiry
      // 4. Get receiver address from config/database
      
      const invoiceId = `inv_${modelId}_${userId}_${Date.now()}`;
      const receiverAddress = process.env.ONCHAIN_RECEIVER_ADDRESS || "0x742d35Cc6634C0532925a3b8D24b693d54b32625";
      const amountEth = "0.1"; // Default price - should come from model data
      
      res.json({ 
        success: true,
        invoiceId,
        receiverAddress,
        amountEth,
        modelId,
        userId,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
      });
    } catch (error) {
      console.error("Error creating onchain invoice:", error);
      res.status(500).json({ message: "Failed to create onchain invoice" });
    }
  });

  app.post('/api/ai-models/:id/verify-onchain', isAuthenticated, async (req, res) => {
    try {
      const modelId = parseInt(req.params.id);
      const userId = req.user?.claims?.sub;
      const { invoiceId, txHash } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!invoiceId || !txHash) {
        return res.status(400).json({ message: "Missing invoiceId or txHash" });
      }

      // In a real implementation, this would:
      // 1. Validate the invoice exists and belongs to this user
      // 2. Check the transaction on blockchain using web3/ethers
      // 3. Verify the transaction amount and recipient
      // 4. Create subscription record in database
      // 5. Mark invoice as paid
      
      console.log(`Verifying onchain payment: Model ${modelId}, Invoice ${invoiceId}, TX ${txHash}`);
      
      // Mock successful verification
      res.json({ 
        success: true,
        message: "Payment verified and subscription activated",
        subscription: {
          modelId,
          userId,
          status: "active",
          activatedAt: new Date().toISOString(),
          txHash,
          invoiceId
        }
      });
    } catch (error) {
      console.error("Error verifying onchain payment:", error);
      res.status(500).json({ message: "Failed to verify onchain payment" });
    }
  });

  // Register Contract Wallet routes
  import("./contractWalletRoutes").then((module) => {
    module.default(app);
  }).catch((err) => {
    console.error("Failed to load contract wallet routes:", err);
  });

}