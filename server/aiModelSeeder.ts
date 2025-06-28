import { storage } from "./storage";
import { InsertAiModelCategory, InsertAiModelSubcategory } from "@shared/schema";

// Comprehensive AI Financial Model Categories and Subcategories
export const AI_MODEL_CATEGORIES = [
  {
    name: "Risk Assessment",
    description: "Models focused on identifying, measuring, and managing various types of financial risks",
    icon: "Shield",
    sortOrder: 1,
    subcategories: [
      { name: "Credit Risk", description: "Assess creditworthiness and default probability", sortOrder: 1 },
      { name: "Consumer Credit", description: "Personal credit scoring and risk assessment", sortOrder: 2 },
      { name: "Corporate Credit", description: "Business credit evaluation and rating", sortOrder: 3 },
      { name: "Market Risk", description: "Market volatility and price risk analysis", sortOrder: 4 },
      { name: "Value at Risk (VaR)", description: "Portfolio loss estimation models", sortOrder: 5 },
      { name: "Stress Testing", description: "Scenario-based risk evaluation", sortOrder: 6 },
      { name: "Operational Risk", description: "Business process and operational failure risks", sortOrder: 7 },
      { name: "Cybersecurity", description: "Digital threat assessment and risk modeling", sortOrder: 8 },
      { name: "Business Continuity", description: "Operational resilience and continuity planning", sortOrder: 9 },
      { name: "Liquidity Risk", description: "Cash flow and funding availability risks", sortOrder: 10 },
      { name: "Cash Flow Forecasting", description: "Predictive cash flow modeling", sortOrder: 11 },
      { name: "Funding Risk", description: "Capital availability and funding cost analysis", sortOrder: 12 }
    ]
  },
  {
    name: "Trading Strategies",
    description: "Algorithmic and quantitative trading models for various market strategies",
    icon: "TrendingUp",
    sortOrder: 2,
    subcategories: [
      { name: "Algorithmic Trading", description: "Automated trading system algorithms", sortOrder: 1 },
      { name: "Statistical Arbitrage", description: "Price discrepancy identification and exploitation", sortOrder: 2 },
      { name: "Market Making", description: "Liquidity provision and spread optimization", sortOrder: 3 },
      { name: "High-Frequency Trading", description: "Ultra-fast execution strategies", sortOrder: 4 },
      { name: "Latency Arbitrage", description: "Speed-based trading opportunities", sortOrder: 5 },
      { name: "Order Book Dynamics", description: "Market microstructure analysis", sortOrder: 6 },
      { name: "Quantitative Strategies", description: "Mathematical model-based trading", sortOrder: 7 },
      { name: "Momentum", description: "Trend-following trading strategies", sortOrder: 8 },
      { name: "Mean Reversion", description: "Price normalization trading models", sortOrder: 9 },
      { name: "Sentiment Analysis", description: "Market sentiment-driven trading", sortOrder: 10 },
      { name: "News Analytics", description: "News-based trading signal generation", sortOrder: 11 },
      { name: "Social Media Analytics", description: "Social sentiment trading strategies", sortOrder: 12 }
    ]
  },
  {
    name: "Portfolio Management",
    description: "Advanced portfolio construction, optimization, and management models",
    icon: "PieChart",
    sortOrder: 3,
    subcategories: [
      { name: "Asset Allocation", description: "Optimal asset distribution strategies", sortOrder: 1 },
      { name: "Strategic Asset Allocation", description: "Long-term allocation frameworks", sortOrder: 2 },
      { name: "Tactical Asset Allocation", description: "Short-term allocation adjustments", sortOrder: 3 },
      { name: "Risk Parity", description: "Equal risk contribution strategies", sortOrder: 4 },
      { name: "Equal Risk Contribution", description: "Balanced risk distribution models", sortOrder: 5 },
      { name: "Leveraged Risk Parity", description: "Enhanced risk parity with leverage", sortOrder: 6 },
      { name: "Factor Investing", description: "Factor-based investment strategies", sortOrder: 7 },
      { name: "Value", description: "Value-oriented investment models", sortOrder: 8 },
      { name: "Growth", description: "Growth-focused investment strategies", sortOrder: 9 },
      { name: "Quality", description: "Quality-based investment selection", sortOrder: 10 },
      { name: "Robo-Advisory", description: "Automated investment advisory services", sortOrder: 11 },
      { name: "Goal-Based Investing", description: "Objective-driven investment strategies", sortOrder: 12 },
      { name: "Tax-Loss Harvesting", description: "Tax optimization strategies", sortOrder: 13 }
    ]
  },
  {
    name: "Fraud Detection",
    description: "Advanced fraud identification and prevention systems",
    icon: "Shield",
    sortOrder: 4,
    subcategories: [
      { name: "Transaction Monitoring", description: "Real-time transaction fraud detection", sortOrder: 1 },
      { name: "Real-Time Monitoring", description: "Live fraud detection systems", sortOrder: 2 },
      { name: "Batch Processing", description: "Batch-based fraud analysis", sortOrder: 3 },
      { name: "Identity Verification", description: "User identity authentication", sortOrder: 4 },
      { name: "Biometric Authentication", description: "Biometric-based identity verification", sortOrder: 5 },
      { name: "Document Verification", description: "Document authenticity validation", sortOrder: 6 },
      { name: "Anomaly Detection", description: "Unusual pattern identification", sortOrder: 7 },
      { name: "Unsupervised Learning", description: "Pattern discovery without labeled data", sortOrder: 8 },
      { name: "Supervised Learning", description: "Known fraud pattern recognition", sortOrder: 9 }
    ]
  },
  {
    name: "Customer Service",
    description: "AI-powered customer interaction and service enhancement models",
    icon: "MessageCircle",
    sortOrder: 5,
    subcategories: [
      { name: "Chatbots", description: "Automated customer conversation systems", sortOrder: 1 },
      { name: "Rule-Based Chatbots", description: "Logic-driven conversation systems", sortOrder: 2 },
      { name: "AI-Powered Chatbots", description: "Machine learning-driven chat systems", sortOrder: 3 },
      { name: "Virtual Assistants", description: "Comprehensive AI assistance systems", sortOrder: 4 },
      { name: "Voice Assistants", description: "Speech-based interaction systems", sortOrder: 5 },
      { name: "Text-Based Assistants", description: "Text-driven assistance platforms", sortOrder: 6 },
      { name: "Personalized Recommendations", description: "Customized product and service suggestions", sortOrder: 7 },
      { name: "Product Recommendations", description: "Financial product suggestion engines", sortOrder: 8 },
      { name: "Service Recommendations", description: "Service optimization suggestions", sortOrder: 9 }
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
  }
];

export class AiModelSeeder {
  static async seedCategories(): Promise<void> {
    try {
      console.log("Starting AI model categories seeding...");
      
      for (const categoryData of AI_MODEL_CATEGORIES) {
        // Create main category
        const { subcategories, ...categoryInfo } = categoryData;
        const category = await storage.createAiModelCategory(categoryInfo as InsertAiModelCategory);
        
        console.log(`Created category: ${category.name}`);
        
        // Create subcategories
        for (const subcategoryData of subcategories) {
          const subcategory = await storage.createAiModelSubcategory({
            ...subcategoryData,
            categoryId: category.id
          } as InsertAiModelSubcategory);
          
          console.log(`  Created subcategory: ${subcategory.name}`);
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
        },
        {
          name: "Alpha Generation Engine",
          description: "Sophisticated algorithmic trading system generating consistent alpha through multi-factor models",
          category: "Trading Strategies", 
          categoryId: tradingCategory.id,
          subcategoryId: algoTradingSub?.id,
          price: "599.00",
          rating: "4.6",
          totalRatings: 89,
          creator: "QuantEdge",
          tags: ["alpha", "algorithmic", "multi-factor"],
          aiTechnique: "Reinforcement Learning",
          targetUserType: "Asset Management",
          financialInstrument: "Mixed",
          riskLevel: "High",
          minInvestment: "50000.00",
          dataRequirements: ["price_data", "volume_data", "fundamental_data"],
          supportedRegions: ["US", "EU"],
          complianceFrameworks: ["SEC", "FCA"],
          features: {
            "real_time": true,
            "paper_trading": true,
            "portfolio_optimization": true,
            "risk_management": true
          },
          performance: {
            "accuracy": 87.3,
            "sharpe_ratio": 1.8,
            "max_drawdown": 12.1,
            "annual_return": 22.4
          },
          isFeatured: true,
          isActive: true
        },
        {
          name: "Smart Asset Allocator",
          description: "AI-driven portfolio optimization using Modern Portfolio Theory with machine learning enhancements",
          category: "Portfolio Management",
          categoryId: portfolioCategory.id,
          subcategoryId: assetAllocationSub?.id,
          price: "199.00",
          rating: "4.7",
          totalRatings: 203,
          creator: "WealthTech AI",
          tags: ["portfolio", "optimization", "mpt", "robo-advisor"],
          aiTechnique: "Machine Learning",
          targetUserType: "Wealth Management",
          financialInstrument: "Mixed",
          riskLevel: "Low",
          minInvestment: "5000.00",
          dataRequirements: ["asset_prices", "correlation_matrix", "risk_preferences"],
          supportedRegions: ["Global"],
          complianceFrameworks: ["GDPR", "SOX"],
          features: {
            "rebalancing": true,
            "tax_optimization": true,
            "goal_tracking": true,
            "reporting": true
          },
          performance: {
            "accuracy": 91.5,
            "sharpe_ratio": 1.6,
            "max_drawdown": 6.8,
            "annual_return": 14.2
          },
          isFeatured: false,
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
}