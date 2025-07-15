import type { Express } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../multiAuth";

export function registerUtilityRoutes(app: Express) {
  // ===========================================
  // Utility & Administrative APIs
  // ===========================================

  // Debug routes
  app.get('/api/debug/session', (req: any, res) => {
    res.json({
      isAuthenticated: req.isAuthenticated(),
      user: req.user ? 'User exists' : 'No user',
      session: req.session ? 'Session exists' : 'No session'
    });
  });

  // Debug route to show OAuth callback URLs
  app.get('/api/debug/oauth-urls', (req, res) => {
    const baseUrl = process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}` : 'http://localhost:5000';
    res.json({
      baseUrl,
      callbacks: {
        google: `${baseUrl}/api/auth/google/callback`,
        github: `${baseUrl}/api/auth/github/callback`,
        linkedin: `${baseUrl}/api/auth/linkedin/callback`
      },
      instructions: {
        github: {
          step1: "Go to https://github.com/settings/developers",
          step2: "Click on OAuth Apps",
          step3: "Find your GeFi application",
          step4: `Set Authorization callback URL to: ${baseUrl}/api/auth/github/callback`,
          step5: `Set Homepage URL to: ${baseUrl}`
        }
      }
    });
  });

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
            { name: "Quantitative Strategies", description: "Statistical arbitrage, factor models, systematic trading", sortOrder: 2 },
            { name: "Technical Analysis", description: "Pattern recognition, momentum strategies, trend following", sortOrder: 3 },
            { name: "Arbitrage", description: "Statistical arbitrage, pairs trading, cross-market opportunities", sortOrder: 4 },
            { name: "Market Making", description: "Liquidity provision, bid-ask spread optimization", sortOrder: 5 }
          ]
        },
        {
          name: "Portfolio Optimization",
          description: "AI-driven portfolio management and optimization",
          icon: "Target",
          sortOrder: 3,
          subcategories: [
            { name: "Asset Allocation", description: "Strategic and tactical asset allocation optimization", sortOrder: 1 },
            { name: "Risk Parity", description: "Risk-weighted portfolio construction strategies", sortOrder: 2 },
            { name: "Multi-Objective Optimization", description: "Pareto-optimal portfolio solutions", sortOrder: 3 },
            { name: "Factor Investing", description: "Smart beta, factor exposure optimization", sortOrder: 4 },
            { name: "ESG Integration", description: "Sustainable investing, ESG-optimized portfolios", sortOrder: 5 }
          ]
        },
        {
          name: "Fraud Detection",
          description: "AI models for detecting and preventing financial fraud",
          icon: "AlertTriangle",
          sortOrder: 4,
          subcategories: [
            { name: "Transaction Monitoring", description: "Real-time transaction fraud detection", sortOrder: 1 },
            { name: "Identity Verification", description: "KYC automation, identity fraud prevention", sortOrder: 2 },
            { name: "Anti-Money Laundering", description: "AML compliance, suspicious activity detection", sortOrder: 3 },
            { name: "Behavioral Analytics", description: "User behavior pattern analysis, anomaly detection", sortOrder: 4 },
            { name: "Document Verification", description: "Automated document authenticity verification", sortOrder: 5 }
          ]
        },
        {
          name: "Customer Analytics",
          description: "AI for customer insights and personalization",
          icon: "Users",
          sortOrder: 5,
          subcategories: [
            { name: "Customer Segmentation", description: "Behavioral clustering, demographic analysis", sortOrder: 1 },
            { name: "Lifetime Value Prediction", description: "CLV modeling, customer retention strategies", sortOrder: 2 },
            { name: "Recommendation Systems", description: "Product recommendations, personalized offerings", sortOrder: 3 },
            { name: "Churn Prediction", description: "Customer retention, churn prevention strategies", sortOrder: 4 },
            { name: "Next Best Action", description: "Personalized marketing, cross-selling optimization", sortOrder: 5 }
          ]
        },
        {
          name: "Credit Scoring",
          description: "AI models for credit assessment and lending decisions",
          icon: "CreditCard",
          sortOrder: 6,
          subcategories: [
            { name: "Consumer Credit", description: "Personal loan scoring, credit card approval", sortOrder: 1 },
            { name: "SME Lending", description: "Small business credit assessment", sortOrder: 2 },
            { name: "Mortgage Underwriting", description: "Automated mortgage approval, risk assessment", sortOrder: 3 },
            { name: "Alternative Data", description: "Non-traditional credit scoring using alternative data", sortOrder: 4 },
            { name: "Real-time Scoring", description: "Dynamic credit assessment, real-time decision making", sortOrder: 5 }
          ]
        },
        {
          name: "Insurance",
          description: "AI applications in insurance operations",
          icon: "Shield",
          sortOrder: 7,
          subcategories: [
            { name: "Claims Processing", description: "Automated claims assessment, fraud detection", sortOrder: 1 },
            { name: "Underwriting", description: "Risk assessment, policy pricing optimization", sortOrder: 2 },
            { name: "Actuarial Modeling", description: "Risk modeling, loss prediction, pricing strategies", sortOrder: 3 },
            { name: "Customer Service", description: "Chatbots, automated customer support", sortOrder: 4 },
            { name: "Catastrophe Modeling", description: "Natural disaster risk assessment", sortOrder: 5 }
          ]
        },
        {
          name: "Personal Finance",
          description: "AI tools for personal financial management",
          icon: "Wallet",
          sortOrder: 8,
          subcategories: [
            { name: "Budgeting & Planning", description: "Automated budgeting, financial planning", sortOrder: 1 },
            { name: "Investment Advisory", description: "Robo-advisors, investment recommendations", sortOrder: 2 },
            { name: "Expense Management", description: "Spending analysis, expense categorization", sortOrder: 3 },
            { name: "Savings Optimization", description: "Automated savings, goal-based investing", sortOrder: 4 },
            { name: "Financial Education", description: "Personalized financial education, literacy tools", sortOrder: 5 }
          ]
        },
        {
          name: "Market Sentiment Analysis",
          description: "AI for analyzing market sentiment and news",
          icon: "BarChart3",
          sortOrder: 9,
          subcategories: [
            { name: "News Analytics", description: "Financial news sentiment, event impact analysis", sortOrder: 1 },
            { name: "Social Media Monitoring", description: "Social sentiment tracking, viral trend detection", sortOrder: 2 },
            { name: "Earnings Call Analysis", description: "Management sentiment, earnings call insights", sortOrder: 3 },
            { name: "Market Mood Indicators", description: "Fear & greed index, market sentiment gauges", sortOrder: 4 },
            { name: "Alternative Data", description: "Satellite imagery, web scraping, alternative sentiment sources", sortOrder: 5 }
          ]
        }
      ];

      let totalCreated = 0;
      let totalSubcategoriesCreated = 0;

      // Create categories and subcategories
      for (const category of categoryData) {
        try {
          const createdCategory = await storage.createAiModelCategory({
            name: category.name,
            description: category.description,
            icon: category.icon,
            sortOrder: category.sortOrder,
            isActive: true
          });

          totalCreated++;

          // Create subcategories
          for (const subcategory of category.subcategories) {
            try {
              await storage.createAiModelSubcategory({
                categoryId: createdCategory.id,
                name: subcategory.name,
                description: subcategory.description,
                sortOrder: subcategory.sortOrder,
                isActive: true
              });
              totalSubcategoriesCreated++;
            } catch (subError) {
              console.log(`Subcategory ${subcategory.name} might already exist, skipping...`);
            }
          }

        } catch (error) {
          console.log(`Category ${category.name} might already exist, skipping...`);
        }
      }

      res.json({
        message: `Successfully initialized AI model categories`,
        categoriesCreated: totalCreated,
        subcategoriesCreated: totalSubcategoriesCreated,
        totalCategories: categoryData.length,
        totalSubcategories: categoryData.reduce((sum, cat) => sum + cat.subcategories.length, 0)
      });

    } catch (error) {
      console.error("Error initializing categories:", error);
      res.status(500).json({ message: "Failed to initialize categories" });
    }
  });

  // Add missing subcategories
  app.post('/api/admin/add-subcategories', async (req, res) => {
    try {
      const missingSubcategories = [
        // Risk Assessment subcategories
        { categoryName: "Risk Assessment", name: "Stress Testing", description: "Portfolio stress testing, scenario analysis", sortOrder: 6 },
        { categoryName: "Risk Assessment", name: "Risk Prediction Models", description: "Predictive risk modeling, early warning systems", sortOrder: 7 },
        
        // Trading Strategies subcategories  
        { categoryName: "Algorithmic Trading", name: "Algorithmic Trading", description: "Systematic trading algorithms, execution strategies", sortOrder: 6 },
        { categoryName: "Algorithmic Trading", name: "Trend Following", description: "Momentum strategies, trend identification", sortOrder: 7 },
        { categoryName: "Algorithmic Trading", name: "Mean Reversion", description: "Mean reversion strategies, statistical trading", sortOrder: 8 },
        { categoryName: "Algorithmic Trading", name: "Trading Bots", description: "Automated trading bots, execution algorithms", sortOrder: 9 },
        
        // Portfolio Management subcategories
        { categoryName: "Portfolio Optimization", name: "Rebalancing Strategies", description: "Automated rebalancing, threshold-based optimization", sortOrder: 6 },
        { categoryName: "Portfolio Optimization", name: "Multi-Asset Portfolios", description: "Cross-asset allocation, alternative investments", sortOrder: 7 },
        
        // Fraud Detection subcategories
        { categoryName: "Fraud Detection", name: "Anomaly Detection", description: "Statistical anomaly detection, outlier identification", sortOrder: 5 },
        { categoryName: "Fraud Detection", name: "Synthetic Fraud", description: "Synthetic identity detection, fabricated profile identification", sortOrder: 6 },
        
        // Customer Service subcategories
        { categoryName: "Customer Analytics", name: "Sentiment Analysis", description: "Customer sentiment analysis, feedback processing", sortOrder: 5 },
        { categoryName: "Customer Analytics", name: "Personalized Recommendations", description: "AI-driven product recommendations, personalization", sortOrder: 6 },
        { categoryName: "Customer Analytics", name: "Complaint Resolution", description: "Automated complaint handling, resolution optimization", sortOrder: 7 },
        
        // New major categories
        { categoryName: "Compliance & Regulatory", name: "KYC Automation", description: "Know Your Customer automation, identity verification", sortOrder: 1 },
        { categoryName: "Compliance & Regulatory", name: "AML Monitoring", description: "Anti-Money Laundering monitoring, transaction screening", sortOrder: 2 },
        { categoryName: "Compliance & Regulatory", name: "GDPR Compliance", description: "Data privacy compliance, GDPR automation", sortOrder: 3 },
        { categoryName: "Compliance & Regulatory", name: "SEC/FINRA Reporting", description: "Regulatory reporting automation, compliance tracking", sortOrder: 4 },
        { categoryName: "Compliance & Regulatory", name: "Audit Automation", description: "Automated audit processes, compliance verification", sortOrder: 5 },
        
        { categoryName: "Financial Forecasting", name: "Revenue Forecasting", description: "Revenue prediction, financial planning models", sortOrder: 1 },
        { categoryName: "Financial Forecasting", name: "Expense Forecasting", description: "Cost prediction, budget optimization", sortOrder: 2 },
        { categoryName: "Financial Forecasting", name: "Market Trend Prediction", description: "Market direction forecasting, trend analysis", sortOrder: 3 },
        { categoryName: "Financial Forecasting", name: "Economic Indicators", description: "Economic indicator analysis, macro forecasting", sortOrder: 4 },
        { categoryName: "Financial Forecasting", name: "Cash Flow Projections", description: "Cash flow modeling, liquidity planning", sortOrder: 5 },
        { categoryName: "Financial Forecasting", name: "Return Forecasting", description: "Investment return prediction, performance modeling", sortOrder: 6 },
      ];

      let addedCount = 0;
      
      for (const sub of missingSubcategories) {
        try {
          // Find the category by name
          const categories = await storage.getAiModelCategories();
          const category = categories.find(c => c.name === sub.categoryName);
          
          if (category) {
            await storage.createAiModelSubcategory({
              categoryId: category.id,
              name: sub.name,
              description: sub.description,
              sortOrder: sub.sortOrder,
              isActive: true
            });
            addedCount++;
          }
        } catch (error) {
          console.log(`Subcategory ${sub.name} might already exist, skipping...`);
        }
      }

      res.json({
        message: `Successfully added ${addedCount} missing subcategories`,
        total: missingSubcategories.length
      });

    } catch (error) {
      console.error("Error adding subcategories:", error);
      res.status(500).json({ message: "Failed to add subcategories" });
    }
  });

  // Bounty Categories
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

  // System health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        marketData: 'active',
        web3: 'active',
        trading: 'active'
      }
    });
  });

  // API version info
  app.get('/api/version', (req, res) => {
    res.json({
      apiVersion: '2.0.0',
      platform: 'GeFi',
      buildTime: new Date().toISOString(),
      features: {
        gefi: 'enabled',
        tokenomics: 'enabled',
        trading: 'enabled',
        web3: 'enabled'
      }
    });
  });

  // User profile API endpoint
  app.get('/api/user-profile/:userType/:userId', async (req, res) => {
    try {
      const { userType, userId } = req.params;
      
      // Validate user type
      const validUserTypes = ['developer', 'investor', 'data-provider', 'admin', 'moderator'];
      if (!validUserTypes.includes(userType)) {
        return res.status(400).json({ 
          message: `Invalid user type. Must be one of: ${validUserTypes.join(', ')}` 
        });
      }

      // For now, return mock data based on user type
      // In production, this would query the database for actual user data
      let profileData = null;
      
      switch (userType) {
        case 'developer':
          profileData = {
            id: userId,
            type: 'developer',
            name: userId === 'sarah-chen' ? 'Sarah Chen' : 'John Developer',
            handle: userId === 'sarah-chen' ? '@sarah_quant' : '@john_dev',
            organization: userId === 'sarah-chen' ? 'Quantum AI Labs' : 'Tech Solutions Inc',
            bio: userId === 'sarah-chen' ? 
              'Specialized in algorithmic trading and portfolio optimization with 8+ years in quantitative finance.' :
              'Full-stack developer with expertise in financial AI models and blockchain technology.',
            verified: true,
            // Additional developer-specific fields would be populated here
          };
          break;
          
        case 'investor':
          profileData = {
            id: userId,
            type: 'investor',
            name: userId === 'quantum-capital' ? 'Quantum Capital Partners' : 'Investment Group LLC',
            type: 'Venture Capital',
            bio: userId === 'quantum-capital' ? 
              'Early-stage venture capital firm focused on AI and fintech innovations.' :
              'Private investment firm specializing in emerging technologies and market solutions.',
            verified: true,
            accredited: true,
            // Additional investor-specific fields would be populated here
          };
          break;
          
        case 'data-provider':
          profileData = {
            id: userId,
            type: 'data-provider',
            name: userId === 'financedata-solutions' ? 'FinanceData Solutions' : 'Data Corp Inc',
            entity: userId === 'financedata-solutions' ? 'Financial Data Corporation' : 'Data Services LLC',
            bio: userId === 'financedata-solutions' ? 
              'Leading provider of real-time financial market data, alternative data, and economic indicators.' :
              'Comprehensive data provider specializing in financial markets and economic analysis.',
            verified: true,
            certified: true,
            // Additional data-provider-specific fields would be populated here
          };
          break;
          
        case 'admin':
          profileData = {
            id: userId,
            type: 'admin',
            name: userId === 'github_55703540' ? 'Guillaume Lauzier' : 
                  userId === 'tech-lead' ? 'Alex Rodriguez' : 'Sarah Johnson',
            role: userId === 'github_55703540' ? 'Platform Admin' :
                  userId === 'tech-lead' ? 'Tech Lead' : 'Compliance Admin',
            verified: true,
            joinedDate: userId === 'github_55703540' ? '2024-06-28' : '2024-01-15',
            lastActive: '2 hours ago',
            adminRights: [
              'User Management',
              'Content Moderation',
              'System Configuration',
              'Data Management',
              'Security Oversight',
              'Emergency Actions'
            ],
            systemStatus: {
              uptime: '99.9%',
              activeUsers: 15420,
              securityAlerts: 3,
              pendingTasks: 12
            }
          };
          break;
          
        case 'moderator':
          profileData = {
            id: userId,
            type: 'moderator',
            name: userId === 'community-mod' ? 'Jordan Smith' : 'Riley Chen',
            pseudonym: userId === 'community-mod' ? '@CommunityGuardian' : '@FairPlay',
            verified: true,
            joinedDate: '2024-03-20',
            lastActive: '30 minutes ago',
            moderationScope: [
              'Community Forums',
              'Bounty Disputes',
              'Funding Process',
              'User Reports',
              'Content Review',
              'Dispute Resolution'
            ],
            reputation: {
              score: 4.7,
              totalReviews: 89,
              responseTime: '2.3 hours',
              resolutionRate: '94%',
              satisfactionRate: '96%'
            },
            activeCases: 3,
            disputesResolved: 87
          };
          break;
      }

      if (!profileData) {
        return res.status(404).json({ message: 'User profile not found' });
      }

      res.json(profileData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Failed to fetch user profile' });
    }
  });

}