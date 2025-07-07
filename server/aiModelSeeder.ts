import { storage } from "./storage";
import { InsertAiModelCategory, InsertAiModelSubcategory, InsertDeveloperModel } from "@shared/schema";

// Comprehensive AI Financial Model Categories and Subcategories
export const AI_MODEL_CATEGORIES = [
  {
    name: "Risk Assessment",
    description: "Models focused on identifying, measuring, and managing various types of financial risks",
    icon: "Shield",
    sortOrder: 1,
    subcategories: [
      { name: "Credit Risk", description: "Assess creditworthiness and default probability", sortOrder: 1 },
      { name: "Market Risk", description: "Market volatility and price risk analysis", sortOrder: 2 },
      { name: "Operational Risk", description: "Business process and operational failure risks", sortOrder: 3 },
      { name: "Liquidity Risk", description: "Cash flow and funding availability risks", sortOrder: 4 },
      { name: "Stress Testing", description: "Scenario-based risk evaluation", sortOrder: 5 },
      { name: "Risk Prediction Models", description: "Predictive risk assessment and forecasting", sortOrder: 6 },
      { name: "Consumer Credit", description: "Personal credit scoring and risk assessment", sortOrder: 7 },
      { name: "Corporate Credit", description: "Business credit evaluation and rating", sortOrder: 8 },
      { name: "Value at Risk (VaR)", description: "Portfolio loss estimation models", sortOrder: 9 },
      { name: "Cybersecurity", description: "Digital threat assessment and risk modeling", sortOrder: 10 },
      { name: "Business Continuity", description: "Operational resilience and continuity planning", sortOrder: 11 },
      { name: "Cash Flow Forecasting", description: "Predictive cash flow modeling", sortOrder: 12 },
      { name: "Funding Risk", description: "Capital availability and funding cost analysis", sortOrder: 13 }
    ]
  },
  {
    name: "Trading Strategies",
    description: "Algorithmic and quantitative trading models for various market strategies",
    icon: "TrendingUp",
    sortOrder: 2,
    subcategories: [
      { name: "Algorithmic Trading", description: "Automated trading system algorithms", sortOrder: 1 },
      { name: "High-Frequency Trading", description: "Ultra-fast execution strategies", sortOrder: 2 },
      { name: "Arbitrage Strategies", description: "Price discrepancy identification and exploitation", sortOrder: 3 },
      { name: "Trend Following", description: "Trend-following trading strategies", sortOrder: 4 },
      { name: "Mean Reversion", description: "Price normalization trading models", sortOrder: 5 },
      { name: "Trading Bots", description: "Automated trading systems and bots", sortOrder: 6 },
      { name: "Statistical Arbitrage", description: "Statistical price discrepancy trading", sortOrder: 7 },
      { name: "Market Making", description: "Liquidity provision and spread optimization", sortOrder: 8 },
      { name: "Latency Arbitrage", description: "Speed-based trading opportunities", sortOrder: 9 },
      { name: "Order Book Dynamics", description: "Market microstructure analysis", sortOrder: 10 },
      { name: "Quantitative Strategies", description: "Mathematical model-based trading", sortOrder: 11 },
      { name: "Momentum", description: "Momentum-based trading strategies", sortOrder: 12 },
      { name: "Sentiment Analysis", description: "Market sentiment-driven trading", sortOrder: 13 },
      { name: "News Analytics", description: "News-based trading signal generation", sortOrder: 14 },
      { name: "Social Media Analytics", description: "Social sentiment trading strategies", sortOrder: 15 }
    ]
  },
  {
    name: "Portfolio Management",
    description: "Advanced portfolio construction, optimization, and management models",
    icon: "PieChart",
    sortOrder: 3,
    subcategories: [
      { name: "Asset Allocation", description: "Optimal asset distribution strategies", sortOrder: 1 },
      { name: "Risk-Adjusted Returns", description: "Return optimization adjusted for risk", sortOrder: 2 },
      { name: "Rebalancing Strategies", description: "Portfolio rebalancing and optimization", sortOrder: 3 },
      { name: "ESG Investing", description: "Environmental, social, and governance investing", sortOrder: 4 },
      { name: "Multi-Asset Portfolios", description: "Diversified multi-asset portfolio management", sortOrder: 5 },
      { name: "Portfolio Optimization", description: "Mathematical portfolio optimization models", sortOrder: 6 },
      { name: "Strategic Asset Allocation", description: "Long-term allocation frameworks", sortOrder: 7 },
      { name: "Tactical Asset Allocation", description: "Short-term allocation adjustments", sortOrder: 8 },
      { name: "Risk Parity", description: "Equal risk contribution strategies", sortOrder: 9 },
      { name: "Equal Risk Contribution", description: "Balanced risk distribution models", sortOrder: 10 },
      { name: "Leveraged Risk Parity", description: "Enhanced risk parity with leverage", sortOrder: 11 },
      { name: "Factor Investing", description: "Factor-based investment strategies", sortOrder: 12 },
      { name: "Value", description: "Value-oriented investment models", sortOrder: 13 },
      { name: "Growth", description: "Growth-focused investment strategies", sortOrder: 14 },
      { name: "Quality", description: "Quality-based investment selection", sortOrder: 15 },
      { name: "Robo-Advisory", description: "Automated investment advisory services", sortOrder: 16 },
      { name: "Goal-Based Investing", description: "Objective-driven investment strategies", sortOrder: 17 },
      { name: "Tax-Loss Harvesting", description: "Tax optimization strategies", sortOrder: 18 }
    ]
  },
  {
    name: "Fraud Detection",
    description: "Advanced fraud identification and prevention systems",
    icon: "Shield",
    sortOrder: 4,
    subcategories: [
      { name: "Transaction Fraud", description: "Transaction-based fraud detection and prevention", sortOrder: 1 },
      { name: "Identity Theft", description: "Identity theft detection and prevention", sortOrder: 2 },
      { name: "Money Laundering Detection", description: "Anti-money laundering detection systems", sortOrder: 3 },
      { name: "Anomaly Detection", description: "Unusual pattern identification", sortOrder: 4 },
      { name: "Synthetic Fraud", description: "Synthetic identity fraud detection", sortOrder: 5 },
      { name: "Transaction Monitoring", description: "Real-time transaction fraud detection", sortOrder: 6 },
      { name: "Real-Time Monitoring", description: "Live fraud detection systems", sortOrder: 7 },
      { name: "Batch Processing", description: "Batch-based fraud analysis", sortOrder: 8 },
      { name: "Identity Verification", description: "User identity authentication", sortOrder: 9 },
      { name: "Biometric Authentication", description: "Biometric-based identity verification", sortOrder: 10 },
      { name: "Document Verification", description: "Document authenticity validation", sortOrder: 11 },
      { name: "Unsupervised Learning", description: "Pattern discovery without labeled data", sortOrder: 12 },
      { name: "Supervised Learning", description: "Known fraud pattern recognition", sortOrder: 13 }
    ]
  },
  {
    name: "Customer Service",
    description: "AI-powered customer interaction and service enhancement models",
    icon: "MessageCircle",
    sortOrder: 5,
    subcategories: [
      { name: "Sentiment Analysis", description: "Customer sentiment analysis and tracking", sortOrder: 1 },
      { name: "Customer Segmentation", description: "Customer categorization and analysis", sortOrder: 2 },
      { name: "Personalized Recommendations", description: "Customized product and service suggestions", sortOrder: 3 },
      { name: "Complaint Resolution", description: "Automated complaint handling and resolution", sortOrder: 4 },
      { name: "Chatbots", description: "Automated customer conversation systems", sortOrder: 5 },
      { name: "Rule-Based Chatbots", description: "Logic-driven conversation systems", sortOrder: 6 },
      { name: "AI-Powered Chatbots", description: "Machine learning-driven chat systems", sortOrder: 7 },
      { name: "Virtual Assistants", description: "Comprehensive AI assistance systems", sortOrder: 8 },
      { name: "Voice Assistants", description: "Speech-based interaction systems", sortOrder: 9 },
      { name: "Text-Based Assistants", description: "Text-driven assistance platforms", sortOrder: 10 },
      { name: "Product Recommendations", description: "Financial product suggestion engines", sortOrder: 11 },
      { name: "Service Recommendations", description: "Service optimization suggestions", sortOrder: 12 }
    ]
  },
  {
    name: "Regulatory Compliance",
    description: "Compliance monitoring and regulatory adherence models",
    icon: "FileCheck",
    sortOrder: 6,
    subcategories: [
      { name: "Anti-Money Laundering (AML)", description: "AML compliance and monitoring", sortOrder: 1 },
      { name: "Transaction Monitoring", description: "AML transaction surveillance", sortOrder: 2 },
      { name: "Customer Due Diligence", description: "Enhanced customer verification", sortOrder: 3 },
      { name: "Know Your Customer (KYC)", description: "Customer identity verification processes", sortOrder: 4 },
      { name: "Identity Verification", description: "KYC identity authentication", sortOrder: 5 },
      { name: "Risk Assessment", description: "Customer risk profiling", sortOrder: 6 },
      { name: "Market Surveillance", description: "Market abuse detection systems", sortOrder: 7 },
      { name: "Insider Trading Detection", description: "Insider trading identification", sortOrder: 8 },
      { name: "Market Manipulation Detection", description: "Market manipulation surveillance", sortOrder: 9 }
    ]
  },
  {
    name: "Financial Forecasting",
    description: "Predictive models for financial and economic variables",
    icon: "TrendingUp",
    sortOrder: 7,
    subcategories: [
      { name: "Time Series Analysis", description: "Time-based data prediction models", sortOrder: 1 },
      { name: "ARIMA Models", description: "Autoregressive integrated moving average", sortOrder: 2 },
      { name: "Exponential Smoothing", description: "Weighted historical data forecasting", sortOrder: 3 },
      { name: "Econometric Modeling", description: "Economic relationship modeling", sortOrder: 4 },
      { name: "Regression Analysis", description: "Statistical relationship modeling", sortOrder: 5 },
      { name: "Vector Autoregression", description: "Multivariate time series modeling", sortOrder: 6 },
      { name: "Scenario Analysis", description: "Multiple scenario forecasting", sortOrder: 7 },
      { name: "Stress Testing", description: "Adverse scenario impact modeling", sortOrder: 8 },
      { name: "Sensitivity Analysis", description: "Parameter sensitivity modeling", sortOrder: 9 }
    ]
  },
  {
    name: "Institution Type",
    description: "Models categorized by target financial institution type",
    icon: "Building",
    sortOrder: 8,
    subcategories: [
      { name: "Retail Banking", description: "Consumer banking applications", sortOrder: 1 },
      { name: "Personal Finance Management", description: "Individual financial planning", sortOrder: 2 },
      { name: "Loan Origination", description: "Loan processing and approval", sortOrder: 3 },
      { name: "Investment Banking", description: "Corporate finance and capital markets", sortOrder: 4 },
      { name: "Mergers and Acquisitions", description: "M&A analysis and valuation", sortOrder: 5 },
      { name: "Capital Markets", description: "Securities and capital market operations", sortOrder: 6 },
      { name: "Asset Management", description: "Investment management services", sortOrder: 7 },
      { name: "Fund Management", description: "Mutual fund and ETF management", sortOrder: 8 },
      { name: "Wealth Management", description: "High net worth client services", sortOrder: 9 },
      { name: "Insurance", description: "Insurance industry applications", sortOrder: 10 },
      { name: "Underwriting", description: "Risk assessment and pricing", sortOrder: 11 },
      { name: "Claims Processing", description: "Insurance claim evaluation", sortOrder: 12 },
      { name: "Fintech", description: "Financial technology innovations", sortOrder: 13 },
      { name: "Payment Processing", description: "Payment system optimization", sortOrder: 14 },
      { name: "Peer-to-Peer Lending", description: "P2P lending platforms", sortOrder: 15 }
    ]
  },
  {
    name: "Financial Instruments",
    description: "Models specialized for specific financial instruments",
    icon: "LineChart",
    sortOrder: 9,
    subcategories: [
      { name: "Equities", description: "Stock and equity-related models", sortOrder: 1 },
      { name: "Stock Selection", description: "Equity picking algorithms", sortOrder: 2 },
      { name: "Index Tracking", description: "Index replication strategies", sortOrder: 3 },
      { name: "Fixed Income", description: "Bond and fixed income models", sortOrder: 4 },
      { name: "Bond Pricing", description: "Bond valuation models", sortOrder: 5 },
      { name: "Yield Curve Modeling", description: "Interest rate curve analysis", sortOrder: 6 },
      { name: "Derivatives", description: "Derivative instrument models", sortOrder: 7 },
      { name: "Option Pricing", description: "Options valuation models", sortOrder: 8 },
      { name: "Hedging Strategies", description: "Risk hedging methodologies", sortOrder: 9 },
      { name: "Commodities", description: "Commodity market models", sortOrder: 10 },
      { name: "Price Forecasting", description: "Commodity price prediction", sortOrder: 11 },
      { name: "Supply Chain Optimization", description: "Commodity supply chain models", sortOrder: 12 },
      { name: "Foreign Exchange", description: "Currency market models", sortOrder: 13 },
      { name: "Currency Forecasting", description: "Exchange rate prediction", sortOrder: 14 },
      { name: "Carry Trade Strategies", description: "Currency carry trade models", sortOrder: 15 }
    ]
  },
  {
    name: "AI Techniques",
    description: "Models categorized by underlying AI and ML techniques",
    icon: "Brain",
    sortOrder: 10,
    subcategories: [
      { name: "Machine Learning", description: "Traditional ML approaches", sortOrder: 1 },
      { name: "Supervised Learning", description: "Labeled data learning models", sortOrder: 2 },
      { name: "Unsupervised Learning", description: "Pattern discovery models", sortOrder: 3 },
      { name: "Reinforcement Learning", description: "Reward-based learning systems", sortOrder: 4 },
      { name: "Deep Learning", description: "Neural network-based models", sortOrder: 5 },
      { name: "Convolutional Neural Networks", description: "CNN-based financial models", sortOrder: 6 },
      { name: "Recurrent Neural Networks", description: "RNN/LSTM time series models", sortOrder: 7 },
      { name: "Natural Language Processing", description: "Text and language analysis", sortOrder: 8 },
      { name: "Sentiment Analysis", description: "Text sentiment extraction", sortOrder: 9 },
      { name: "Text Classification", description: "Document categorization models", sortOrder: 10 },
      { name: "Genetic Algorithms", description: "Evolutionary optimization methods", sortOrder: 11 },
      { name: "Optimization", description: "Mathematical optimization techniques", sortOrder: 12 },
      { name: "Feature Selection", description: "Variable selection algorithms", sortOrder: 13 }
    ]
  },
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
    name: "Compliance & Regulatory",
    description: "AI models for regulatory compliance, reporting, and audit automation",
    icon: "Building",
    sortOrder: 6,
    subcategories: [
      { name: "KYC (Know Your Customer)", description: "Customer identification and verification", sortOrder: 1 },
      { name: "AML (Anti-Money Laundering)", description: "Anti-money laundering detection and prevention", sortOrder: 2 },
      { name: "GDPR Compliance", description: "Data protection and privacy compliance", sortOrder: 3 },
      { name: "SEC/FINRA Reporting", description: "Securities and financial regulatory reporting", sortOrder: 4 },
      { name: "Audit Automation", description: "Automated audit processes and compliance checking", sortOrder: 5 }
    ]
  },
  {
    name: "Financial Forecasting",
    description: "Predictive models for financial planning and forecasting",
    icon: "TrendingUp",
    sortOrder: 7,
    subcategories: [
      { name: "Revenue Forecasting", description: "Revenue prediction and growth modeling", sortOrder: 1 },
      { name: "Expense Forecasting", description: "Cost prediction and budget planning", sortOrder: 2 },
      { name: "Market Trend Prediction", description: "Market trend analysis and forecasting", sortOrder: 3 },
      { name: "Economic Indicators", description: "Economic indicator analysis and prediction", sortOrder: 4 },
      { name: "Cash Flow Projections", description: "Cash flow forecasting and planning", sortOrder: 5 },
      { name: "Return Forecasting", description: "Investment return prediction models", sortOrder: 6 }
    ]
  },
  {
    name: "Target User Types",
    description: "Models categorized by target financial institution types",
    icon: "Users",
    sortOrder: 8,
    subcategories: [
      { name: "Banks", description: "Banking-specific AI models and solutions", sortOrder: 1 },
      { name: "Hedge Funds", description: "Hedge fund specialized trading and risk models", sortOrder: 2 },
      { name: "Asset Managers", description: "Asset management optimization models", sortOrder: 3 },
      { name: "Insurance Companies", description: "Insurance industry risk and pricing models", sortOrder: 4 },
      { name: "FinTech Startups", description: "Financial technology innovation models", sortOrder: 5 }
    ]
  },
  {
    name: "AI Techniques Enhanced",
    description: "Models categorized by underlying AI and machine learning techniques",
    icon: "Brain",
    sortOrder: 11,
    subcategories: [
      { name: "Machine Learning", description: "Traditional machine learning models", sortOrder: 1 },
      { name: "Deep Learning", description: "Neural network and deep learning models", sortOrder: 2 },
      { name: "Natural Language Processing (NLP)", description: "Text analysis and language processing", sortOrder: 3 },
      { name: "Reinforcement Learning", description: "Reinforcement learning and adaptive models", sortOrder: 4 },
      { name: "Time Series Analysis", description: "Time series forecasting and analysis", sortOrder: 5 }
    ]
  },
  {
    name: "Market Sentiment Analysis",
    description: "Real-time market sentiment analysis and investor behavior prediction",
    icon: "BarChart3",
    sortOrder: 14,
    subcategories: [
      { name: "News Sentiment Analysis", description: "Financial news sentiment analysis and impact", sortOrder: 1 },
      { name: "Social Media Monitoring", description: "Social media sentiment tracking and analysis", sortOrder: 2 },
      { name: "Investor Behavior", description: "Investor sentiment and behavior pattern analysis", sortOrder: 3 },
      { name: "Market Trend Analysis", description: "Market trend sentiment and momentum analysis", sortOrder: 4 }
    ]
  }
];

export class AiModelSeeder {
  static async seedCategories(): Promise<void> {
    try {
      console.log("Starting AI model categories seeding...");
      
      for (const categoryData of AI_MODEL_CATEGORIES) {
        // Create or get existing main category
        const { subcategories, ...categoryInfo } = categoryData;
        let category;
        
        try {
          category = await storage.createAiModelCategory(categoryInfo as InsertAiModelCategory);
          console.log(`Created category: ${category.name}`);
        } catch (error: any) {
          if (error.code === '23505') { // Unique constraint violation
            // Category already exists, get it
            const categories = await storage.getAiModelCategories();
            category = categories.find(c => c.name === categoryInfo.name);
            console.log(`Category already exists: ${category.name}`);
          } else {
            console.error(`Error creating category ${categoryInfo.name}:`, error);
            continue;
          }
        }
        
        if (!category) {
          console.error(`Could not find or create category: ${categoryInfo.name}`);
          continue;
        }
        
        // Create subcategories
        for (const subcategoryData of subcategories) {
          try {
            const subcategory = await storage.createAiModelSubcategory({
              ...subcategoryData,
              categoryId: category.id
            } as InsertAiModelSubcategory);
            
            console.log(`  Created subcategory: ${subcategory.name}`);
          } catch (subError: any) {
            if (subError.code === '23505') {
              console.log(`  Subcategory already exists: ${subcategoryData.name}`);
            } else {
              console.error(`  Error creating subcategory ${subcategoryData.name}:`, subError);
            }
          }
        }
      }
      
      console.log("AI model categories seeding completed successfully!");
    } catch (error) {
      console.error("Error seeding AI model categories:", error);
      throw error;
    }
  }
  
  static async seedSampleModels(): Promise<void> {
    try {
      console.log("Starting sample AI models seeding...");
      
      // Get some categories for sample models
      const categories = await storage.getAiModelCategories();
      const riskCategory = categories.find(c => c.name === "Risk Assessment");
      const tradingCategory = categories.find(c => c.name === "Trading Strategies");
      const portfolioCategory = categories.find(c => c.name === "Portfolio Management");
      
      if (!riskCategory || !tradingCategory || !portfolioCategory) {
        throw new Error("Required categories not found for sample models");
      }
      
      const subcategories = await storage.getAiModelSubcategories();
      const creditRiskSub = subcategories.find(s => s.name === "Credit Risk");
      const algoTradingSub = subcategories.find(s => s.name === "Algorithmic Trading");
      const assetAllocationSub = subcategories.find(s => s.name === "Asset Allocation");
      
      const sampleModels = [
        {
          name: "Conservative AI",
          description: "Risk-averse AI model designed for capital preservation with steady, consistent returns. Employs defensive strategies, dividend-focused stock selection, and bond allocation optimization with sophisticated risk management.",
          category: "Portfolio Management",
          categoryId: portfolioCategory.id,
          subcategoryId: assetAllocationSub?.id,
          price: "199.00",
          rating: "4.9",
          totalRatings: 342,
          creator: "Prudent Capital Management",
          tags: ["conservative", "capital-preservation", "dividend-focused", "low-risk", "bonds"],
          aiTechnique: "Machine Learning",
          targetUserType: "Wealth Management",
          financialInstrument: "Mixed",
          riskLevel: "Low",
          minInvestment: "5000.00",
          dataRequirements: ["dividend_yields", "bond_ratings", "market_data", "volatility_measures"],
          supportedRegions: ["US", "EU", "APAC"],
          complianceFrameworks: ["SEC", "MiFID II", "GDPR"],
          features: {
            "rebalancing": true,
            "dividend_reinvestment": true,
            "tax_optimization": true,
            "capital_preservation": true,
            "risk_monitoring": true,
            "income_optimization": true
          },
          performance: {
            "accuracy": 89.7,
            "sharpe_ratio": 1.8,
            "max_drawdown": 4.2,
            "annual_return": 12.4,
            "current_value": 148548,
            "beta": 0.65,
            "alpha": 5.2,
            "win_rate": 68.2
          },
          isFeatured: true,
          isActive: true
        },
        {
          name: "Aggressive Growth",
          description: "High-performance growth-oriented AI model targeting maximum capital appreciation through technology stocks, emerging markets, and momentum strategies. Utilizes advanced pattern recognition for growth opportunities.",
          category: "Trading Strategies", 
          categoryId: tradingCategory.id,
          subcategoryId: algoTradingSub?.id,
          price: "349.00",
          rating: "4.6",
          totalRatings: 198,
          creator: "GrowthTech Dynamics",
          tags: ["aggressive", "growth", "high-risk", "momentum", "tech-focused", "emerging-markets"],
          aiTechnique: "Deep Learning",
          targetUserType: "Hedge Funds",
          financialInstrument: "Equities",
          riskLevel: "High",
          minInvestment: "15000.00",
          dataRequirements: ["growth_metrics", "momentum_indicators", "earnings_data", "sector_rotation"],
          supportedRegions: ["US", "EU", "APAC", "Emerging"],
          complianceFrameworks: ["SEC", "CFTC", "FCA"],
          features: {
            "real_time": true,
            "momentum_detection": true,
            "sector_rotation": true,
            "growth_screening": true,
            "risk_scaling": true,
            "volatility_targeting": true
          },
          performance: {
            "accuracy": 91.2,
            "sharpe_ratio": 1.6,
            "max_drawdown": 18.7,
            "annual_return": 24.8,
            "current_value": 299032,
            "beta": 1.35,
            "alpha": 8.7,
            "win_rate": 64.8
          },
          isFeatured: true,
          isActive: true
        },
        {
          name: "Quantum Risk Predictor",
          description: "Advanced ML model for predicting market volatility with 94% accuracy using quantum-inspired algorithms",
          category: "Risk Assessment",
          categoryId: riskCategory.id,
          subcategoryId: creditRiskSub?.id,
          price: "299.00",
          rating: "4.8",
          totalRatings: 156,
          creator: "TechnoCapital",
          tags: ["quantum", "volatility", "machine-learning"],
          aiTechnique: "Deep Learning",
          targetUserType: "Investment Banking",
          financialInstrument: "Equities",
          riskLevel: "Medium",
          minInvestment: "10000.00",
          dataRequirements: ["market_data", "volatility_index", "economic_indicators"],
          supportedRegions: ["US", "EU", "APAC"],
          complianceFrameworks: ["MiFID II", "BASEL III"],
          features: {
            "real_time": true,
            "backtesting": true,
            "risk_alerts": true,
            "api_access": true
          },
          performance: {
            "accuracy": 94.2,
            "sharpe_ratio": 2.1,
            "max_drawdown": 8.5,
            "annual_return": 18.7
          },
          isFeatured: true,
          isActive: true
        }
      ];
      
      for (const modelData of sampleModels) {
        await storage.createAiModel(modelData);
        console.log(`Created sample model: ${modelData.name}`);
      }
      
      console.log("Sample AI models seeding completed successfully!");
    } catch (error) {
      console.error("Error seeding sample models:", error);
      throw error;
    }
  }

  static async seedDeveloperModels(): Promise<void> {
    try {
      console.log("Starting developer models seeding...");
      
      const sampleDeveloperModels = [
        {
          name: "CryptoMomentum AI",
          description: "Advanced neural network model for cryptocurrency momentum trading with real-time sentiment analysis",
          category: "Trading Strategies",
          fundingGoal: "250000.00",
          fundingRaised: "85000.00",
          status: "approved",
          developerId: "dev_001",
          tags: ["crypto", "momentum", "neural-network", "sentiment"],
          testResults: { accuracy: 87.2, sharpe: 2.1, maxDrawdown: 8.3 },
          performanceMetrics: { returns: 45.6, volatility: 12.8, trades: 342 }
        },
        {
          name: "ESG Portfolio Optimizer",
          description: "Machine learning model optimizing portfolios for environmental, social, and governance factors",
          category: "Portfolio Management", 
          fundingGoal: "500000.00",
          fundingRaised: "320000.00",
          status: "deployed",
          developerId: "dev_002",
          tags: ["esg", "sustainability", "portfolio", "optimization"],
          testResults: { accuracy: 91.5, sharpe: 1.8, maxDrawdown: 6.1 },
          performanceMetrics: { returns: 23.4, volatility: 9.2, trades: 156 }
        },
        {
          name: "Forex Predictive Engine",
          description: "Deep learning model for foreign exchange rate prediction using macroeconomic indicators",
          category: "Market Prediction",
          fundingGoal: "180000.00", 
          fundingRaised: "45000.00",
          status: "testing",
          developerId: "dev_003",
          tags: ["forex", "prediction", "macroeconomic", "deep-learning"],
          testResults: { accuracy: 78.9, sharpe: 1.4, maxDrawdown: 11.2 },
          performanceMetrics: { returns: 18.7, volatility: 15.3, trades: 624 }
        },
        {
          name: "Credit Risk Analyzer Pro",
          description: "Advanced AI model for real-time credit risk assessment using alternative data sources",
          category: "Risk Management",
          fundingGoal: "350000.00",
          fundingRaised: "120000.00", 
          status: "approved",
          developerId: "dev_004",
          tags: ["credit-risk", "alternative-data", "real-time", "assessment"],
          testResults: { accuracy: 94.1, sharpe: 2.3, maxDrawdown: 4.2 },
          performanceMetrics: { returns: 28.9, volatility: 7.8, trades: 89 }
        },
        {
          name: "Options Volatility Forecaster",
          description: "Neural network model for predicting options implied volatility with high precision",
          category: "Derivatives",
          fundingGoal: "200000.00",
          fundingRaised: "160000.00",
          status: "deployed",
          developerId: "dev_005", 
          tags: ["options", "volatility", "forecasting", "derivatives"],
          testResults: { accuracy: 89.7, sharpe: 2.0, maxDrawdown: 7.5 },
          performanceMetrics: { returns: 34.2, volatility: 11.6, trades: 267 }
        },
        {
          name: "DeFi Yield Optimizer",
          description: "Automated yield farming strategy using decentralized finance protocols analysis",
          category: "DeFi",
          fundingGoal: "300000.00",
          fundingRaised: "75000.00",
          status: "testing",
          developerId: "dev_006",
          tags: ["defi", "yield-farming", "automated", "protocols"],
          testResults: { accuracy: 82.4, sharpe: 1.9, maxDrawdown: 13.7 },
          performanceMetrics: { returns: 67.3, volatility: 22.1, trades: 428 }
        }
      ];

      for (const modelData of sampleDeveloperModels) {
        // Note: In a real app, you'd use the actual storage method for developer models
        // For now, we'll just log them since the developer models are handled by the frontend
        console.log(`Sample developer model ready: ${modelData.name} - ${modelData.status}`);
      }
      
      console.log("Developer models seeding completed successfully!");
    } catch (error) {
      console.error("Error seeding developer models:", error);
      throw error;
    }
  }
}