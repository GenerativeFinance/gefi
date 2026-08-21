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
  },
  {
    name: "DeFi & Blockchain",
    description: "Decentralized Finance and blockchain-based financial models",
    icon: "Coins",
    sortOrder: 15,
    subcategories: [
      { name: "On-chain Anomaly Detection", description: "Detection of rug pulls, flash-loan attacks, and wash trading", sortOrder: 1 },
      { name: "Liquidity Mining Optimization", description: "Yield farming and liquidity provision optimization", sortOrder: 2 },
      { name: "Smart Contract Security", description: "Smart contract risk assessment and security auditing", sortOrder: 3 },
      { name: "DeFi Protocol Analysis", description: "Protocol health monitoring and risk assessment", sortOrder: 4 },
      { name: "Cross-chain Analytics", description: "Multi-blockchain analysis and arbitrage opportunities", sortOrder: 5 }
    ]
  },
  {
    name: "ESG & Sustainability",
    description: "Environmental, Social, and Governance investment and risk models",
    icon: "Leaf",
    sortOrder: 16,
    subcategories: [
      { name: "Climate Risk", description: "Climate change impact and transition risk assessment", sortOrder: 1 },
      { name: "ESG Scoring", description: "Environmental, social, and governance scoring models", sortOrder: 2 },
      { name: "Sustainable Investing", description: "Sustainable and responsible investment strategies", sortOrder: 3 },
      { name: "Carbon Footprint", description: "Carbon emission tracking and reduction models", sortOrder: 4 },
      { name: "Green Finance", description: "Green bonds and sustainable finance instruments", sortOrder: 5 }
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
            console.log(`Category already exists: ${category?.name}`);
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
      const defiCategory = categories.find(c => c.name === "DeFi & Blockchain");
      const esgCategory = categories.find(c => c.name === "ESG & Sustainability");
      const forecastingCategory = categories.find(c => c.name === "Financial Forecasting");
      
      if (!riskCategory || !tradingCategory || !portfolioCategory) {
        throw new Error("Required categories not found for sample models");
      }
      
      const subcategories = await storage.getAiModelSubcategories();
      const creditRiskSub = subcategories.find(s => s.name === "Credit Risk");
      const algoTradingSub = subcategories.find(s => s.name === "Algorithmic Trading");
      const assetAllocationSub = subcategories.find(s => s.name === "Asset Allocation");
      const yieldOptimizationSub = subcategories.find(s => s.name === "Liquidity Mining Optimization");
      const climateRiskSub = subcategories.find(s => s.name === "Climate Risk"); 
      const timeSeriesSub = subcategories.find(s => s.name === "Time Series Analysis");
      
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
          name: "Fraud Detection & Anomaly Detection (Bayesian Inference)",
          description: "Advanced Bayesian inference models for real-time fraud detection and anomaly identification. Features real-time monitoring, probability heatmaps, and explainable AI reasoning for financial crime prevention.",
          category: "Risk Assessment",
          categoryId: riskCategory.id,
          subcategoryId: creditRiskSub?.id,
          price: "449.00",
          rating: "4.8",
          totalRatings: 156,
          creator: "FinSecure AI Labs",
          tags: ["fraud-detection", "bayesian-inference", "real-time", "anomaly-detection", "explainable-ai"],
          aiTechnique: "Bayesian Inference",
          targetUserType: "Risk Management",
          financialInstrument: "Transactions",
          riskLevel: "High",
          minInvestment: "25000.00",
          dataRequirements: ["transaction_data", "customer_profiles", "merchant_data", "device_fingerprints"],
          supportedRegions: ["US", "EU", "APAC"],
          complianceFrameworks: ["AML", "KYC", "PCI-DSS", "GDPR"],
          features: {
            "real_time_monitoring": true,
            "anomaly_alerts": true,
            "explainability": true,
            "probability_heatmaps": true,
            "network_analysis": true,
            "case_management": true
          },
          performance: {
            "accuracy": 96.7,
            "precision": 94.2,
            "recall": 97.8,
            "false_positive_rate": 2.3,
            "detection_time_ms": 45,
            "throughput_tps": 10000,
            "fraud_value_prevented": 15600000,
            "cases_flagged": 2847
          },
          isFeatured: true,
          isActive: true
        },
        {
          name: "Algorithmic & High-Frequency Trading (Deep Q-Networks)",
          description: "Deep Q-Network powered algorithmic trading system for high-frequency decision making. Features real-time market feeds, strategy optimization, and ultra-low latency execution monitoring.",
          category: "Trading Strategies",
          categoryId: tradingCategory.id,
          subcategoryId: algoTradingSub?.id,
          price: "899.00",
          rating: "4.9",
          totalRatings: 89,
          creator: "QuantFlow Technologies",
          tags: ["deep-q-networks", "high-frequency", "algorithmic-trading", "real-time", "market-making"],
          aiTechnique: "Reinforcement Learning",
          targetUserType: "Quantitative Trading",
          financialInstrument: "Multi-Asset",
          riskLevel: "High",
          minInvestment: "100000.00",
          dataRequirements: ["level2_market_data", "order_flow", "volatility_surfaces", "latency_metrics"],
          supportedRegions: ["US", "EU", "APAC"],
          complianceFrameworks: ["MiFID II", "SEC", "CFTC"],
          features: {
            "hft_execution": true,
            "dqn_decision_engine": true,
            "latency_monitoring": true,
            "order_book_analysis": true,
            "risk_controls": true,
            "backtesting": true
          },
          performance: {
            "accuracy": 91.3,
            "sharpe_ratio": 3.2,
            "max_drawdown": 5.8,
            "annual_return": 47.6,
            "execution_latency_us": 12,
            "win_rate": 73.4,
            "alpha": 8.9,
            "calmar_ratio": 8.2
          },
          isFeatured: true,
          isActive: true
        },
        {
          name: "ESG & Alternative Data (Satellite Geospatial AI)",
          description: "Satellite imagery and geospatial AI for commodities forecasting and ESG compliance. Combines satellite data, weather patterns, and supply chain intelligence for predictive commodity analytics.",
          category: "Portfolio Management",
          categoryId: portfolioCategory.id,
          subcategoryId: assetAllocationSub?.id,
          price: "599.00",
          rating: "4.7",
          totalRatings: 124,
          creator: "GeoFinance Analytics",
          tags: ["satellite-imagery", "geospatial-ai", "esg", "commodities", "climate-risk"],
          aiTechnique: "Computer Vision + Time Series",
          targetUserType: "Institutional Investors",
          financialInstrument: "Commodities",
          riskLevel: "Medium",
          minInvestment: "50000.00",
          dataRequirements: ["satellite_imagery", "weather_data", "supply_chain_data", "esg_scores"],
          supportedRegions: ["Global"],
          complianceFrameworks: ["TCFD", "SASB", "GRI", "EU Taxonomy"],
          features: {
            "satellite_analysis": true,
            "climate_modeling": true,
            "supply_chain_risk": true,
            "esg_scoring": true,
            "commodity_forecasting": true,
            "geospatial_visualization": true
          },
          performance: {
            "accuracy": 88.5,
            "forecast_horizon_days": 90,
            "correlation_with_actuals": 0.87,
            "early_warning_accuracy": 92.1,
            "risk_events_predicted": 156,
            "esg_score_accuracy": 89.3,
            "annual_return": 18.7,
            "information_ratio": 1.4
          },
          isFeatured: true,
          isActive: true
        },
        {
          name: "Forecasting & Time Series (GRU Models)",
          description: "Advanced Gated Recurrent Unit models for sophisticated time series forecasting. Features sequence modeling, uncertainty quantification, and multi-horizon predictions for financial markets.",
          category: "Portfolio Management",
          categoryId: portfolioCategory.id,
          subcategoryId: assetAllocationSub?.id,
          price: "379.00",
          rating: "4.6",
          totalRatings: 203,
          creator: "Temporal AI Research",
          tags: ["gru", "time-series", "forecasting", "deep-learning", "sequence-modeling"],
          aiTechnique: "Deep Learning (GRU)",
          targetUserType: "Quantitative Analysts",
          financialInstrument: "Multi-Asset",
          riskLevel: "Medium",
          minInvestment: "15000.00",
          dataRequirements: ["historical_prices", "macro_indicators", "sentiment_data", "volatility_surfaces"],
          supportedRegions: ["US", "EU", "APAC"],
          complianceFrameworks: ["SEC", "MiFID II"],
          features: {
            "sequence_modeling": true,
            "uncertainty_bands": true,
            "multi_horizon_forecasts": true,
            "feature_importance": true,
            "model_explainability": true,
            "scenario_testing": true
          },
          performance: {
            "accuracy": 84.2,
            "rmse": 0.023,
            "mae": 0.018,
            "mape": 3.7,
            "hit_rate": 76.8,
            "sharpe_ratio": 1.9,
            "annual_return": 22.3,
            "max_drawdown": 7.4
          },
          isFeatured: false,
          isActive: true
        },
        {
          name: "DeFi Liquidity Mining & Yield Farming Optimizer",
          description: "AI-powered yield optimization for DeFi protocols. Features smart contract integration, multi-chain yield farming, and risk-adjusted return maximization across liquidity pools.",
          category: "Portfolio Management",
          categoryId: portfolioCategory.id,
          subcategoryId: assetAllocationSub?.id,
          price: "299.00",
          rating: "4.5",
          totalRatings: 178,
          creator: "DeFiOptimize Labs",
          tags: ["defi", "yield-farming", "liquidity-mining", "multi-chain", "smart-contracts"],
          aiTechnique: "Reinforcement Learning",
          targetUserType: "DeFi Investors",
          financialInstrument: "Cryptocurrencies",
          riskLevel: "High",
          minInvestment: "10000.00",
          dataRequirements: ["pool_data", "tvl_metrics", "apy_history", "impermanent_loss"],
          supportedRegions: ["Global"],
          complianceFrameworks: ["KYC", "AML"],
          features: {
            "multi_chain_optimization": true,
            "smart_contract_integration": true,
            "impermanent_loss_protection": true,
            "auto_compounding": true,
            "risk_monitoring": true,
            "governance_integration": true
          },
          performance: {
            "accuracy": 82.7,
            "average_apy": 34.6,
            "risk_adjusted_return": 28.9,
            "impermanent_loss_mitigation": 67.3,
            "protocol_uptime": 99.2,
            "gas_optimization": 23.4,
            "sharpe_ratio": 2.1,
            "max_drawdown": 12.8
          },
          isFeatured: false,
          isActive: true
        },
        {
          name: "Social Media Sentiment Trading (LSTMs/Transformers)",
          description: "Advanced sentiment analysis using LSTMs and Transformers for social media intelligence. Processes Twitter, Reddit, and news feeds for real-time trading signals and market sentiment.",
          category: "Trading Strategies",
          categoryId: tradingCategory.id,
          subcategoryId: algoTradingSub?.id,
          price: "499.00",
          rating: "4.4",
          totalRatings: 267,
          creator: "SentimentSignals AI",
          tags: ["sentiment-analysis", "social-media", "transformers", "lstm", "trading-signals"],
          aiTechnique: "Natural Language Processing",
          targetUserType: "Retail Traders",
          financialInstrument: "Stocks",
          riskLevel: "Medium",
          minInvestment: "5000.00",
          dataRequirements: ["social_media_data", "news_feeds", "price_data", "volume_data"],
          supportedRegions: ["US", "EU"],
          complianceFrameworks: ["SEC", "GDPR"],
          features: {
            "real_time_sentiment": true,
            "multi_source_aggregation": true,
            "transformer_models": true,
            "signal_generation": true,
            "sentiment_visualization": true,
            "backtesting": true
          },
          performance: {
            "accuracy": 79.6,
            "precision": 81.2,
            "recall": 76.8,
            "sentiment_correlation": 0.73,
            "signal_latency_ms": 150,
            "annual_return": 19.4,
            "sharpe_ratio": 1.6,
            "max_drawdown": 9.7
          },
          isFeatured: false,
          isActive: true
        },
        {
          name: "On-Chain Anomaly Detection (DeFi Security)",
          description: "Real-time on-chain anomaly detection for DeFi security. Identifies rug pulls, flash-loan attacks, and wash trading using graph neural networks and behavioral analysis.",
          category: "Risk Assessment",
          categoryId: riskCategory.id,
          subcategoryId: creditRiskSub?.id,
          price: "699.00",
          rating: "4.9",
          totalRatings: 87,
          creator: "ChainGuard Security",
          tags: ["defi-security", "anomaly-detection", "blockchain", "graph-neural-networks", "real-time"],
          aiTechnique: "Graph Neural Networks",
          targetUserType: "DeFi Security",
          financialInstrument: "Cryptocurrencies",
          riskLevel: "Critical",
          minInvestment: "75000.00",
          dataRequirements: ["blockchain_data", "transaction_graphs", "smart_contract_code", "wallet_behaviors"],
          supportedRegions: ["Global"],
          complianceFrameworks: ["AML", "FATF"],
          features: {
            "real_time_monitoring": true,
            "graph_analysis": true,
            "smart_contract_auditing": true,
            "threat_intelligence": true,
            "automated_alerts": true,
            "forensic_analysis": true
          },
          performance: {
            "accuracy": 97.3,
            "false_positive_rate": 1.2,
            "detection_speed_seconds": 3.7,
            "threats_prevented": 234,
            "attack_success_rate": 2.1,
            "funds_protected": 45600000,
            "protocol_coverage": 156,
            "alert_precision": 94.8
          },
          isFeatured: true,
          isActive: true
        },
        {
          name: "DeFi Yield Farming Optimizer (Liquidity Mining)",
          description: "AI-powered yield farming optimization across DeFi protocols. Uses reinforcement learning to maximize returns while minimizing impermanent loss and smart contract risks across multiple chains.",
          category: "DeFi & Blockchain",
          categoryId: defiCategory.id,
          subcategoryId: yieldOptimizationSub?.id,
          price: "599.00",
          rating: "4.7",
          totalRatings: 142,
          creator: "YieldMaximizer Labs",
          tags: ["yield-farming", "liquidity-mining", "defi-optimization", "multi-chain", "impermanent-loss"],
          aiTechnique: "Reinforcement Learning",
          targetUserType: "DeFi Investors",
          financialInstrument: "Cryptocurrencies",
          riskLevel: "Medium",
          minInvestment: "25000.00",
          dataRequirements: ["defi_protocols", "pool_liquidity", "apy_history", "smart_contract_data"],
          supportedRegions: ["Global"],
          complianceFrameworks: ["KYC", "AML"],
          features: {
            "multi_protocol_optimization": true,
            "impermanent_loss_protection": true,
            "auto_rebalancing": true,
            "risk_adjusted_returns": true,
            "cross_chain_arbitrage": true,
            "smart_contract_integration": true
          },
          performance: {
            "accuracy": 89.4,
            "average_apy": 28.6,
            "risk_adjusted_return": 23.7,
            "impermanent_loss_mitigation": 73.2,
            "protocol_coverage": 15,
            "auto_compound_efficiency": 94.8,
            "sharpe_ratio": 1.9,
            "max_drawdown": 11.4
          },
          isFeatured: false,
          isActive: true
        },
        {
          name: "ESG & Climate Risk Intelligence (Satellite AI)",
          description: "Advanced climate risk assessment using satellite imagery analysis and AI. Combines physical and transition risk modeling with regulatory compliance tracking for sustainable investing.",
          category: "ESG & Sustainability",
          categoryId: esgCategory.id,
          subcategoryId: climateRiskSub?.id,
          price: "799.00",
          rating: "4.8",
          totalRatings: 96,
          creator: "ClimateIntel Analytics",
          tags: ["climate-risk", "satellite-imagery", "esg-compliance", "regulatory-tracking", "sustainability"],
          aiTechnique: "Computer Vision + NLP",
          targetUserType: "Asset Managers",
          financialInstrument: "Multi-Asset",
          riskLevel: "Medium",
          minInvestment: "50000.00",
          dataRequirements: ["satellite_imagery", "climate_data", "regulatory_filings", "esg_scores"],
          supportedRegions: ["Global"],
          complianceFrameworks: ["TCFD", "EU Taxonomy", "SASB", "SFDR"],
          features: {
            "satellite_analysis": true,
            "climate_scenario_modeling": true,
            "regulatory_compliance_tracking": true,
            "physical_risk_assessment": true,
            "transition_risk_modeling": true,
            "esg_opportunity_identification": true
          },
          performance: {
            "climate_prediction_accuracy": 91.7,
            "regulatory_compliance_score": 94.2,
            "risk_identification_precision": 87.8,
            "satellite_coverage_km2": 148000000,
            "scenario_confidence": 89.4,
            "alert_lead_time_days": 14,
            "esg_score_correlation": 0.82,
            "carbon_footprint_accuracy": 93.6
          },
          isFeatured: true,
          isActive: true
        },
        {
          name: "Advanced GRU Time Series Forecasting",
          description: "State-of-the-art Gated Recurrent Unit model for financial time series prediction. Features sequence forecasting, uncertainty quantification, and comprehensive model diagnostics with real-time training monitoring.",
          category: "Forecasting",
          categoryId: forecastingCategory.id,
          subcategoryId: timeSeriesSub?.id,
          price: "449.00",
          rating: "4.6",
          totalRatings: 203,
          creator: "DeepSequence Labs",
          tags: ["gru", "time-series", "deep-learning", "forecasting", "uncertainty-quantification"],
          aiTechnique: "Gated Recurrent Units",
          targetUserType: "Quantitative Analysts",
          financialInstrument: "Multi-Asset",
          riskLevel: "Medium",
          minInvestment: "15000.00",
          dataRequirements: ["price_data", "volume_data", "technical_indicators", "macro_variables"],
          supportedRegions: ["Global"],
          complianceFrameworks: ["SEC", "MiFID II"],
          features: {
            "sequence_forecasting": true,
            "uncertainty_bands": true,
            "model_comparison": true,
            "real_time_training": true,
            "feature_importance": true,
            "residual_analysis": true
          },
          performance: {
            "rmse": 2.34,
            "mae": 1.78,
            "mape": 3.45,
            "r2_score": 0.924,
            "direction_accuracy": 76.8,
            "training_convergence": 94.2,
            "forecast_horizon_days": 30,
            "feature_stability": 89.6
          },
          isFeatured: false,
          isActive: true
        },
        {
          name: "ESG & Geospatial AI Commodities Forecasting",
          description: "Intelligence dashboard combining satellite imagery analysis with commodity price forecasting. Features real-time geospatial monitoring, climate risk assessment, and ESG compliance tracking for commodities markets.",
          category: "ESG & Sustainability",
          categoryId: esgCategory.id,
          subcategoryId: climateRiskSub?.id,
          price: "899.00",
          rating: "4.7",
          totalRatings: 142,
          creator: "GeoIntel Analytics",
          tags: ["satellite-imagery", "geospatial-ai", "commodities", "esg-compliance", "climate-risk"],
          aiTechnique: "Computer Vision + CNN",
          targetUserType: "Commodity Traders",
          financialInstrument: "Commodities",
          riskLevel: "Medium",
          minInvestment: "75000.00",
          dataRequirements: ["satellite_imagery", "weather_data", "commodity_prices", "supply_chain_data"],
          supportedRegions: ["Global"],
          complianceFrameworks: ["TCFD", "EU Taxonomy", "SASB"],
          features: {
            "satellite_monitoring": true,
            "climate_risk_assessment": true,
            "supply_chain_tracking": true,
            "esg_compliance_monitoring": true,
            "real_time_alerts": true,
            "scenario_modeling": true
          },
          performance: {
            "forecast_accuracy": 84.7,
            "satellite_coverage_km2": 510000000,
            "climate_prediction_precision": 89.3,
            "supply_disruption_detection": 92.1,
            "esg_risk_identification": 87.6,
            "alert_lead_time_hours": 48,
            "commodity_correlation": 0.78,
            "seasonal_adjustment_accuracy": 91.4
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