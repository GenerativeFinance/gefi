// AI Models data based on user specifications
export const aiModelsData = [
  {
    id: 1,
    name: "Stock Prediction Model",
    description: "Forecasts stock prices using historical data, market indicators, and sentiment analysis. Leverages machine learning to predict price movements with 85% accuracy.",
    category: "Trading Strategies",
    subcategory: "Stock Prediction",
    creator: "PredictiveAI Labs",
    rating: 4.7,
    totalRatings: 289,
    price: "199.99",
    monthlySubscribers: 1200,
    accuracy: 85,
    riskLevel: "Medium",
    aiTechnique: "Machine Learning",
    targetUserType: "Individual Traders",
    financialInstrument: "Stocks",
    tags: ["Stock Prediction", "Sentiment Analysis", "Price Forecasting", "Technical Analysis"],
    features: {
      realTimeAnalysis: true,
      backtesting: true,
      alertSystem: true,
      apiAccess: true,
      customDashboard: true
    },
    performance: {
      accuracy: 85,
      sharpeRatio: 1.8,
      maxDrawdown: 12.0,
      annualReturn: 12.0,
      winRate: 68.0
    },
    dataRequirements: ["Historical Stock Data", "Market Indicators", "Sentiment Data"],
    supportedRegions: ["US", "EU", "Asia-Pacific"],
    complianceFrameworks: ["SEC", "MiFID II", "GDPR"],
    minInvestment: "5000.00",
    isFeatured: true,
    isActive: true,
    createdAt: "2024-03-15T10:30:00Z",
    lastUpdated: "2025-07-10T16:45:00Z"
  },
  {
    id: 2,
    name: "Portfolio Optimization Algorithm",
    description: "Recommends optimal asset allocations based on risk tolerance and market conditions. Uses advanced algorithms to maximize returns while minimizing risk.",
    category: "Portfolio Management",
    subcategory: "Asset Allocation",
    creator: "OptimizeAI Corp",
    rating: 4.8,
    totalRatings: 167,
    price: "299.99",
    monthlySubscribers: 500,
    accuracy: 90,
    riskLevel: "Medium",
    aiTechnique: "Machine Learning",
    targetUserType: "Asset Managers",
    financialInstrument: "Multi-Asset",
    tags: ["Portfolio Optimization", "Asset Allocation", "Risk Management", "Machine Learning"],
    features: {
      realTimeAnalysis: true,
      backtesting: true,
      alertSystem: true,
      apiAccess: true,
      customDashboard: true
    },
    performance: {
      accuracy: 90,
      sharpeRatio: 1.5,
      maxDrawdown: 8.0,
      annualReturn: 10.0,
      winRate: 75.0
    },
    dataRequirements: ["Historical Market Data", "Risk Metrics", "Economic Indicators"],
    supportedRegions: ["US", "EU", "Asia-Pacific"],
    complianceFrameworks: ["SEC", "MiFID II", "GDPR"],
    minInvestment: "10000.00",
    isFeatured: true,
    isActive: true,
    createdAt: "2024-05-20T14:15:00Z",
    lastUpdated: "2025-07-12T09:30:00Z"
  },
  // Autonomous Economic Agents (AEAs) & AI Wallet Tools
  {
    id: 3,
    name: "Conservative Yield Farmer Agent",
    description: "Autonomous DeFi agent that optimizes stablecoin yields across Aave, Compound, and Curve. Automatically rebalances to maximize APY while maintaining low risk exposure.",
    category: "Autonomous Economic Agents",
    subcategory: "Yield Optimization",
    creator: "DefiAI Protocol",
    rating: 4.6,
    totalRatings: 134,
    price: "149.99",
    monthlySubscribers: 780,
    accuracy: 94,
    riskLevel: "Low",
    aiTechnique: "Reinforcement Learning",
    targetUserType: "DeFi Investors",
    financialInstrument: "Stablecoins",
    tags: ["DeFi", "Yield Farming", "Automated", "Low Risk", "Stablecoin"],
    features: {
      realTimeAnalysis: true,
      backtesting: true,
      alertSystem: true,
      apiAccess: true,
      customDashboard: true,
      multiChain: true,
      gasOptimization: true,
      autoRebalancing: true
    },
    performance: {
      accuracy: 94,
      sharpeRatio: 2.1,
      maxDrawdown: 3.2,
      annualReturn: 8.5,
      winRate: 89.0
    },
    dataRequirements: ["DeFi Protocol APYs", "Gas Prices", "Liquidity Metrics"],
    supportedRegions: ["Global"],
    supportedChains: ["Ethereum", "Polygon", "Arbitrum", "Optimism"],
    complianceFrameworks: ["DeFi Best Practices"],
    minInvestment: "1000.00",
    isFeatured: true,
    isActive: true,
    createdAt: "2024-06-01T08:00:00Z",
    lastUpdated: "2025-08-15T12:00:00Z"
  },
  {
    id: 4,
    name: "Aggressive Arbitrageur Bot",
    description: "High-frequency MEV arbitrage agent that exploits price differences across DEXs. Uses flashloans and advanced routing to capture arbitrage opportunities in real-time.",
    category: "Autonomous Economic Agents",
    subcategory: "Arbitrage Trading",
    creator: "MEV Labs",
    rating: 4.4,
    totalRatings: 89,
    price: "499.99",
    monthlySubscribers: 340,
    accuracy: 87,
    riskLevel: "High",
    aiTechnique: "Deep Reinforcement Learning",
    targetUserType: "Advanced Traders",
    financialInstrument: "Multi-Asset",
    tags: ["MEV", "Arbitrage", "Flashloans", "DEX", "High Frequency"],
    features: {
      realTimeAnalysis: true,
      backtesting: true,
      alertSystem: true,
      apiAccess: true,
      customDashboard: true,
      flashloanIntegration: true,
      memPoolMonitoring: true,
      gasOptimization: true
    },
    performance: {
      accuracy: 87,
      sharpeRatio: 3.2,
      maxDrawdown: 18.5,
      annualReturn: 45.8,
      winRate: 72.0
    },
    dataRequirements: ["DEX Prices", "Mempool Data", "Gas Prices", "Liquidity Depth"],
    supportedRegions: ["Global"],
    supportedChains: ["Ethereum", "BSC", "Polygon"],
    complianceFrameworks: ["MEV Ethics Guidelines"],
    minInvestment: "10000.00",
    isFeatured: false,
    isActive: true,
    createdAt: "2024-07-15T14:30:00Z",
    lastUpdated: "2025-08-18T10:15:00Z"
  },
  {
    id: 5,
    name: "Forecasting Time Series Model (ARIMA/SARIMA + ML Enhancements)",
    description: "Advanced time series forecasting model combining classical ARIMA/SARIMA methods with machine learning enhancements. Features interactive visualization, automated parameter tuning, and scenario testing for financial markets.",
    category: "Market Forecasting",
    subcategory: "Time Series Analysis",
    creator: "QuantumForecast Labs",
    rating: 4.9,
    totalRatings: 245,
    price: "399.99",
    monthlySubscribers: 890,
    accuracy: 92.5,
    riskLevel: "Medium",
    aiTechnique: "ARIMA/SARIMA + ML",
    targetUserType: "Quant Analysts",
    financialInstrument: "Multi-Asset",
    tags: ["Time Series", "ARIMA", "SARIMA", "Forecasting", "ML Enhancement", "Scenario Testing"],
    features: {
      realTimeAnalysis: true,
      backtesting: true,
      alertSystem: true,
      apiAccess: true,
      customDashboard: true,
      scenarioTesting: true,
      autoParameterTuning: true,
      residualDiagnostics: true,
      exogenousVariables: true,
      confidenceIntervals: true
    },
    performance: {
      accuracy: 92.5,
      sharpeRatio: 2.2,
      maxDrawdown: 6.8,
      annualReturn: 15.4,
      winRate: 78.3,
      rmse: 0.045,
      mae: 0.032,
      mape: 2.1
    },
    dataRequirements: [
      "Historical Price Data", 
      "Trading Volume", 
      "Economic Indicators (Optional)", 
      "Interest Rates (Optional)",
      "GDP Data (Optional)",
      "CPI Data (Optional)"
    ],
    supportedRegions: ["US", "EU", "Asia-Pacific", "Global"],
    complianceFrameworks: ["SEC", "MiFID II", "GDPR", "Basel III"],
    minInvestment: "2500.00",
    isFeatured: true,
    isActive: true,
    createdAt: "2024-08-01T09:00:00Z",
    lastUpdated: "2025-08-17T10:00:00Z",
    technicalSpecs: {
      modelTypes: ["ARIMA", "SARIMA", "Auto-ARIMA", "Hybrid (ARIMA + ML)"],
      frequencies: ["Daily", "Weekly", "Monthly", "Quarterly"],
      forecastHorizons: ["1 week", "1 month", "3 months", "6 months", "1 year"],
      hyperparameters: {
        arimaOrders: "Auto-tuning (p,d,q)",
        seasonalOrders: "Auto-tuning (P,D,Q,s)",
        exogenousFactors: "Configurable",
        mlEnhancements: "Neural Networks, Random Forest, XGBoost"
      },
      visualizations: [
        "Interactive Time Series Charts",
        "Forecast vs Actual Overlays", 
        "Confidence Interval Bands",
        "Residual Diagnostic Plots",
        "ACF/PACF Correlation Plots",
        "Feature Importance (ML components)"
      ],
      exportFormats: ["CSV", "Excel", "JSON", "PDF Reports", "PNG Charts"]
    },
    useCases: [
      "Stock Price Forecasting",
      "Commodity Price Prediction", 
      "Currency Exchange Rate Forecasting",
      "Economic Indicator Prediction",
      "Portfolio Value Projection",
      "Risk Scenario Analysis"
    ]
  },
  {
    id: 6,
    name: "Risk Management & Credit Models (Deep Neural Networks for PD/LGD)",
    description: "Advanced deep neural network models for credit risk assessment, featuring PD (Probability of Default) and LGD (Loss Given Default) modeling with explainable AI and real-time stress testing capabilities.",
    category: "Risk Assessment",
    subcategory: "Credit Risk",
    creator: "CreditRisk AI Labs",
    rating: 4.8,
    totalRatings: 187,
    price: "599.99",
    monthlySubscribers: 543,
    accuracy: 94.7,
    riskLevel: "Low",
    aiTechnique: "Deep Neural Networks",
    targetUserType: "Risk Managers",
    financialInstrument: "Credit Products",
    tags: ["Credit Risk", "PD Modeling", "LGD Estimation", "Deep Learning", "XAI", "Basel III"],
    features: {
      realTimeAnalysis: true,
      backtesting: true,
      alertSystem: true,
      apiAccess: true,
      customDashboard: true,
      explainableAI: true,
      stressTesting: true,
      portfolioAnalysis: true,
      borrowerLevelRisk: true,
      regulatoryCompliance: true
    },
    performance: {
      accuracy: 94.7,
      auc: 0.92,
      precision: 0.89,
      recall: 0.91,
      f1Score: 0.90,
      rmse: 0.067,
      mae: 0.043,
      rSquared: 0.87
    },
    dataRequirements: [
      "Borrower Demographics",
      "Credit Bureau Data", 
      "Income Verification",
      "Employment History",
      "Debt-to-Income Ratios",
      "Collateral Valuations",
      "Payment History",
      "Economic Indicators"
    ],
    supportedRegions: ["US", "EU", "UK", "Canada", "Australia"],
    complianceFrameworks: ["Basel III", "CCAR", "CECL", "IFRS 9", "GDPR", "Fair Credit Reporting Act"],
    minInvestment: "25000.00",
    isFeatured: true,
    isActive: true,
    createdAt: "2024-06-15T14:30:00Z",
    lastUpdated: "2025-08-17T10:30:00Z",
    technicalSpecs: {
      modelTypes: ["Deep Neural Networks", "Logistic Regression", "Random Forest", "Gradient Boosting"],
      targetVariables: ["PD (Probability of Default)", "LGD (Loss Given Default)", "EAD (Exposure at Default)"],
      architectures: ["Feedforward DNN", "LSTM", "Transformer", "Ensemble Methods"],
      hyperparameters: {
        layers: "3-8 hidden layers",
        neurons: "64-512 per layer", 
        activation: "ReLU, Sigmoid, Tanh",
        optimizer: "Adam, SGD, RMSprop",
        learningRate: "0.001-0.1 (adaptive)"
      },
      featureEngineering: [
        "Income-to-Debt Ratios",
        "Credit Utilization Metrics",
        "Payment Behavior Patterns",
        "Collateral Risk Scores",
        "Macroeconomic Indicators",
        "Industry Risk Factors"
      ],
      explainabilityTools: [
        "SHAP (Shapley Values)",
        "LIME (Local Interpretable Model)",
        "Feature Importance Rankings",
        "Partial Dependence Plots",
        "Individual Prediction Explanations",
        "Global Model Behavior Analysis"
      ],
      stressTestingScenarios: [
        "Economic Recession Simulation",
        "Interest Rate Shock",
        "Unemployment Rate Changes",
        "Industry-Specific Downturns",
        "Housing Market Volatility",
        "Regulatory Environment Changes"
      ],
      dataConnectors: ["Banking Core Systems", "Credit Bureaus", "Economic Data APIs", "Real Estate APIs"],
      exportFormats: ["Excel", "CSV", "JSON", "PDF Reports", "API Endpoints"]
    },
    uiComponents: {
      inputPanel: [
        "Data Upload Interface",
        "API Connector Configuration",
        "Model Selection Options",
        "Feature Selection Checkboxes",
        "Hyperparameter Tuning Controls"
      ],
      mainDashboard: [
        "Risk Heatmap Visualization",
        "PD Distribution Histogram", 
        "Credit Scoring Scatter Plot",
        "ROC Curve & AUC Display",
        "Confusion Matrix",
        "Model Performance Metrics"
      ],
      insightsPanel: [
        "Borrower-Level Risk Table",
        "SHAP Explanation Charts",
        "Top Risk Drivers Analysis",
        "Portfolio Risk Pie Chart",
        "Stress Testing Sliders",
        "Dynamic Risk Updates"
      ],
      exportReporting: [
        "Automated Risk Reports",
        "Excel/CSV Export",
        "API Integration",
        "Regulatory Compliance Reports"
      ]
    },
    useCases: [
      "Consumer Credit Underwriting",
      "Mortgage Risk Assessment", 
      "Corporate Credit Analysis",
      "Portfolio Risk Management",
      "Regulatory Capital Calculation",
      "Early Warning Systems",
      "Collection Strategy Optimization",
      "Pricing Model Development"
    ]
  },
  {
    id: 7,
    name: "ESG & Alternative Data Models (AI Climate Risk Models)",
    description: "Advanced AI-powered ESG scoring and climate risk assessment platform featuring satellite data integration, carbon footprint analysis, and regulatory compliance tracking with real-time sustainability insights.",
    category: "ESG & Sustainability",
    subcategory: "Climate Risk Assessment",
    creator: "GreenFinance AI Labs",
    rating: 4.7,
    totalRatings: 156,
    price: "699.99",
    monthlySubscribers: 432,
    accuracy: 91.3,
    riskLevel: "Low",
    aiTechnique: "Machine Learning + NLP",
    targetUserType: "ESG Analysts",
    financialInstrument: "Portfolio Holdings",
    tags: ["ESG Scoring", "Climate Risk", "Sustainability", "Alternative Data", "Satellite Imagery", "Carbon Footprint"],
    features: {
      realTimeAnalysis: true,
      backtesting: true,
      alertSystem: true,
      apiAccess: true,
      customDashboard: true,
      satelliteData: true,
      carbonTracking: true,
      regulatoryCompliance: true,
      scenarioTesting: true,
      executiveReporting: true
    },
    performance: {
      accuracy: 91.3,
      esgCorrelation: 0.89,
      climateAccuracy: 0.87,
      dataFreshness: "24h",
      coverageGlobal: "95%",
      regulatoryCompliance: "100%"
    },
    dataRequirements: [
      "Portfolio Holdings (ISIN/Ticker)",
      "ESG Reports & Filings",
      "Climate Data & Emissions",
      "Satellite Imagery",
      "Social Media Sentiment",
      "News & Media Coverage",
      "Regulatory Filings",
      "Financial Statements"
    ],
    supportedRegions: ["Global", "EU", "US", "Asia-Pacific", "Emerging Markets"],
    complianceFrameworks: ["EU Taxonomy", "SFDR", "TCFD", "SASB", "GRI", "CDP", "UN SDG"],
    minInvestment: "50000.00",
    isFeatured: true,
    isActive: true,
    createdAt: "2024-07-20T09:15:00Z",
    lastUpdated: "2025-08-17T10:35:00Z",
    technicalSpecs: {
      modelTypes: ["ESG Scoring Model", "Climate Risk Model", "Carbon Footprint Analysis", "Sentiment Analysis"],
      dataSources: ["MSCI ESG", "Sustainalytics", "CDP Climate", "Satellite Data", "Regulatory Filings"],
      aiTechniques: ["Natural Language Processing", "Computer Vision", "Time Series Analysis", "Geospatial Analysis"],
      esgComponents: {
        environmental: "Carbon Emissions, Water Usage, Waste Management, Biodiversity Impact",
        social: "Labor Practices, Human Rights, Community Impact, Product Safety",
        governance: "Board Composition, Executive Compensation, Anti-Corruption, Transparency"
      },
      climateRiskTypes: [
        "Physical Risk (Floods, Droughts, Extreme Weather)",
        "Transition Risk (Carbon Tax, Stranded Assets)",
        "Regulatory Risk (Policy Changes)",
        "Reputational Risk (ESG Controversies)"
      ],
      scenarioModeling: [
        "1.5°C Pathway (Paris Agreement)",
        "2°C Warming Scenario",
        "Business as Usual (3°C+)",
        "Net Zero by 2050",
        "Delayed Transition Scenario"
      ],
      alternativeDataSources: [
        "Satellite Imagery (Deforestation, Emissions)",
        "Social Media Sentiment Analysis",
        "Supply Chain Mapping",
        "Carbon Intensity Monitoring",
        "Water Stress Analysis",
        "Biodiversity Impact Assessment"
      ],
      outputFormats: ["Executive Reports", "Regulatory Filings", "Portfolio Analytics", "Risk Dashboards"]
    },
    uiComponents: {
      inputPanel: [
        "ESG Report Upload Interface",
        "API Connector Configuration (MSCI, CDP)",
        "Portfolio Holdings Input",
        "Sector/Region Filters",
        "Model Selection (ESG vs Climate)"
      ],
      mainDashboard: [
        "Portfolio ESG Score Gauge (AAA-CCC)",
        "Climate Risk Heatmap (Global/Regional)",
        "Alternative Data Visualizations",
        "Satellite Imagery Integration",
        "Scenario Stress Testing Interface",
        "Carbon Footprint Tracking"
      ],
      insightsPanel: [
        "Company-Level ESG Breakdown Table",
        "Top ESG Risk Drivers Chart",
        "Sector & Geographic Exposure",
        "Regulatory Compliance Dashboard",
        "Carbon Neutrality Progress",
        "ESG Controversy Alerts"
      ],
      executiveReporting: [
        "AI-Generated ESG Reports",
        "Executive Summary Dashboards",
        "Regulatory Compliance Reports",
        "Sustainability Goal Tracking",
        "Board-Ready Presentations"
      ]
    },
    sustainabilityMetrics: {
      carbonIntensity: "tCO2e per $M invested",
      waterFootprint: "Liters per $1000 invested",
      wasteGeneration: "Tons per $M revenue",
      biodiversityImpact: "Species threat score",
      socialImpact: "Community benefit index",
      governanceScore: "Transparency rating (0-100)"
    },
    regulatoryAlignment: {
      euTaxonomy: "Article 6, 8, 9 Classification",
      sfdr: "Principal Adverse Impact Indicators",
      tcfd: "Climate-related Financial Disclosures",
      sasb: "Sustainability Accounting Standards",
      unsdg: "UN Sustainable Development Goals"
    },
    useCases: [
      "Portfolio ESG Assessment",
      "Climate Risk Stress Testing",
      "Regulatory Compliance Reporting",
      "Sustainable Investment Screening",
      "Carbon Footprint Monitoring",
      "ESG Controversy Detection",
      "Supply Chain Risk Analysis",
      "Green Taxonomy Alignment",
      "Executive ESG Reporting",
      "Sustainability Goal Tracking"
    ]
  },
  {
    id: 8,
    name: "NLP Models in Finance (BERT/FinBERT adaptation)",
    description: "Advanced natural language processing models specifically adapted for financial text analysis, featuring real-time sentiment analysis, entity extraction, and document processing with BERT and FinBERT architectures.",
    category: "Natural Language Processing",
    subcategory: "Financial Text Analysis",
    creator: "FinNLP Research Labs",
    rating: 4.6,
    totalRatings: 203,
    price: "449.99",
    monthlySubscribers: 678,
    accuracy: 89.7,
    riskLevel: "Medium",
    aiTechnique: "BERT/FinBERT + Transformer Models",
    targetUserType: "Financial Analysts",
    financialInstrument: "Text & Documents",
    tags: ["Sentiment Analysis", "NLP", "BERT", "FinBERT", "Entity Extraction", "Document Analysis"],
    features: {
      realTimeAnalysis: true,
      backtesting: false,
      alertSystem: true,
      apiAccess: true,
      customDashboard: true,
      documentProcessing: true,
      sentimentTracking: true,
      entityExtraction: true,
      multilanguageSupport: true,
      explainableAI: true
    },
    performance: {
      accuracy: 89.7,
      sentimentAccuracy: 0.92,
      entityF1Score: 0.88,
      processingSpeed: "1000 docs/min",
      languageSupport: "12 languages",
      responseTime: "< 500ms"
    },
    dataRequirements: [
      "Financial Documents (PDF, DOCX, TXT)",
      "News Articles & Press Releases",
      "SEC Filings & Regulatory Documents",
      "Social Media Posts",
      "Earnings Call Transcripts",
      "Research Reports",
      "Market Commentary",
      "Financial Forums & Discussions"
    ],
    supportedRegions: ["Global", "US", "EU", "Asia-Pacific", "Latin America"],
    complianceFrameworks: ["GDPR", "SOX", "MiFID II", "Data Privacy Laws"],
    minInvestment: "15000.00",
    isFeatured: true,
    isActive: true,
    createdAt: "2024-05-10T16:20:00Z",
    lastUpdated: "2025-08-17T10:40:00Z",
    technicalSpecs: {
      modelArchitectures: ["BERT-Base", "BERT-Large", "FinBERT", "RoBERTa", "DistilBERT"],
      nlpCapabilities: ["Sentiment Analysis", "Named Entity Recognition", "Topic Classification", "Document Summarization"],
      textProcessingFeatures: [
        "Multi-document Analysis",
        "Real-time Sentiment Tracking",
        "Cross-document Entity Linking",
        "Financial Term Recognition",
        "Risk Signal Detection",
        "Opportunity Identification"
      ],
      sentimentGranularity: [
        "Document-level Sentiment",
        "Paragraph-level Analysis", 
        "Sentence-level Scoring",
        "Entity-specific Sentiment",
        "Time-series Sentiment Tracking"
      ],
      entityTypes: [
        "Company Names & Tickers",
        "Person Names & Executives",
        "Financial Instruments",
        "Economic Indicators",
        "Geographic Locations",
        "Regulatory Bodies"
      ],
      dataConnectors: ["Bloomberg Terminal", "Reuters", "SEC EDGAR", "Yahoo Finance", "Twitter API"],
      outputFormats: ["JSON", "CSV", "Annotated PDF", "Executive Reports", "API Responses"]
    },
    uiComponents: {
      inputPanel: [
        "Document Upload Interface (PDF, DOCX, TXT)",
        "Text Paste & Edit Area",
        "API News Feed Connectors",
        "Model Selection (BERT/FinBERT)",
        "Analysis Scope Configuration",
        "Language Detection & Selection"
      ],
      mainDashboard: [
        "Color-coded Sentiment Highlighting",
        "Real-time Sentiment Visualization",
        "Entity & Keyword Extraction Table",
        "Financial Term Frequency Analysis",
        "Sentiment Trend Charts",
        "Comparative Analysis Interface"
      ],
      insightsPanel: [
        "Risk & Opportunity Flag Detection",
        "Word Importance Visualization", 
        "Attention Heatmap Display",
        "Custom Financial Taxonomy Mapping",
        "Entity Relationship Networks",
        "Sentiment Confidence Scores"
      ],
      exportReporting: [
        "Annotated Document Downloads",
        "Executive Summary Generation",
        "Sentiment Score Exports",
        "Entity Analysis Reports",
        "API Integration Endpoints"
      ]
    },
    nlpAnalysisTypes: {
      sentimentAnalysis: {
        types: ["Positive", "Negative", "Neutral", "Mixed"],
        confidence: "0.0 - 1.0 scale",
        granularity: "Document, Paragraph, Sentence level"
      },
      entityRecognition: {
        financialEntities: "Companies, Executives, Instruments",
        geographicEntities: "Countries, Cities, Markets",
        temporalEntities: "Dates, Time periods, Events"
      },
      topicClassification: {
        categories: ["Earnings", "M&A", "Regulation", "Market Trends", "Risk Factors"],
        confidence: "Multi-label classification with scores"
      },
      documentSummarization: {
        types: ["Extractive", "Abstractive", "Key Points"],
        length: "Configurable (50-500 words)"
      }
    },
    riskOpportunitySignals: {
      riskFlags: [
        "Bankruptcy mentions",
        "Lawsuit references", 
        "Credit downgrades",
        "Regulatory violations",
        "Executive departures",
        "Earnings misses"
      ],
      opportunitySignals: [
        "Strong earnings reports",
        "Credit upgrades",
        "M&A activity",
        "New product launches",
        "Strategic partnerships",
        "Market expansion"
      ]
    },
    useCases: [
      "Financial News Sentiment Analysis",
      "Earnings Call Transcript Analysis",
      "SEC Filing Risk Assessment",
      "Market Commentary Processing",
      "Social Media Sentiment Tracking",
      "Research Report Summarization",
      "Regulatory Document Analysis",
      "Company Mention Monitoring",
      "Investment Thesis Validation",
      "ESG Report Text Mining"
    ]
  },
  {
    id: 3,
    name: "Real-Time Risk Analyzer",
    description: "AI-powered real-time risk assessment and monitoring system that identifies potential portfolio risks and provides proactive alerts to minimize losses.",
    category: "Risk Assessment",
    subcategory: "Real-Time Risk",
    creator: "RiskGuard AI",
    rating: 4.9,
    totalRatings: 224,
    price: "399.99",
    monthlySubscribers: 800,
    accuracy: 95,
    riskLevel: "Low",
    aiTechnique: "Deep Learning",
    targetUserType: "Risk Managers",
    financialInstrument: "Multi-Asset",
    tags: ["Risk Management", "Real-Time Analysis", "Loss Prevention", "Monitoring"],
    features: {
      realTimeAnalysis: true,
      backtesting: true,
      alertSystem: true,
      apiAccess: true,
      customDashboard: true
    },
    performance: {
      accuracy: 95,
      uptime: 99.9,
      lossReduction: 15.0,
      alertLatency: 0.5,
      riskDetection: 98.5
    },
    dataRequirements: ["Real-Time Market Data", "Risk Metrics", "Portfolio Holdings"],
    supportedRegions: ["US", "EU", "Asia-Pacific"],
    complianceFrameworks: ["BASEL III", "MiFID II", "GDPR"],
    minInvestment: "15000.00",
    isFeatured: true,
    isActive: true,
    createdAt: "2024-08-10T11:20:00Z",
    lastUpdated: "2025-07-08T14:15:00Z"
  },
  {
    id: 9,
    name: "Portfolio Optimization & HRP (AI-Enhanced)",
    description: "Advanced portfolio optimization using Hierarchical Risk Parity with AI adjustments. Balances quant insights with executive clarity through intelligent asset allocation and risk decomposition.",
    category: "Portfolio Management",
    subcategory: "Asset Allocation",
    creator: "QuantAllocation AI",
    rating: 4.8,
    totalRatings: 312,
    price: "549.99",
    monthlySubscribers: 1456,
    accuracy: 93.2,
    riskLevel: "Medium",
    aiTechnique: "Hierarchical Risk Parity + Machine Learning",
    targetUserType: "Portfolio Managers",
    financialInstrument: "Multi-Asset",
    tags: ["Portfolio Optimization", "HRP", "Risk Parity", "AI Allocation", "Asset Management"],
    features: {
      hierarchicalRiskParity: true,
      aiAdjustments: true,
      correlationAnalysis: true,
      scenarioSimulation: true,
      riskDecomposition: true,
      factorExposure: true,
      monteCarlo: true,
      exportReporting: true
    },
    performance: {
      accuracy: 93.2,
      sharpeRatio: 2.3,
      maxDrawdown: 6.8,
      annualReturn: 16.4,
      informationRatio: 1.9,
      calmarRatio: 2.4
    },
    dataRequirements: ["Portfolio Holdings", "Asset Returns", "Volatility Data", "Correlation Matrices", "Macro Factors"],
    supportedRegions: ["US", "EU", "Asia-Pacific", "Global"],
    complianceFrameworks: ["MiFID II", "UCITS", "ERISA", "GDPR"],
    minInvestment: "50000.00",
    isFeatured: true,
    isActive: true,
    createdAt: "2024-11-20T14:30:00Z",
    lastUpdated: "2025-08-17T12:00:00Z",
    hrpSpecifications: {
      clusteringMethods: ["Ward linkage", "Complete linkage", "Average linkage"],
      distanceMetrics: ["Euclidean", "Correlation-based", "Custom risk distance"],
      allocationMethods: ["Equal risk contribution", "Inverse variance", "AI-adjusted weights"],
      riskBudgeting: {
        assetLevel: "Individual asset risk contributions",
        sectorLevel: "Sector-based risk allocation",
        factorLevel: "Factor exposure risk budgets"
      }
    },
    aiAdjustmentFeatures: {
      macroFactors: ["Inflation expectations", "Interest rate changes", "GDP growth", "Currency movements"],
      sentimentFactors: ["Market sentiment", "VIX levels", "Credit spreads", "Momentum signals"],
      esgIntegration: ["ESG scores", "Climate risk", "Sustainability metrics", "Regulatory ESG requirements"],
      marketRegimes: ["Bull market", "Bear market", "High volatility", "Low volatility", "Recession", "Recovery"]
    },
    optimizationConstraints: {
      weightConstraints: {
        minWeight: "Configurable minimum allocation per asset",
        maxWeight: "Configurable maximum allocation per asset",
        sectorLimits: "Sector-based allocation limits"
      },
      riskConstraints: {
        maxVaR: "Maximum Value at Risk threshold",
        maxTracking: "Maximum tracking error vs benchmark",
        concentrationLimits: "Maximum concentration in single positions"
      },
      liquidityConstraints: {
        minimumLiquidity: "Required daily trading volume",
        maxIlliquid: "Maximum allocation to illiquid assets"
      }
    },
    visualizationFeatures: {
      allocationCharts: ["Sunburst chart", "Treemap", "Pie charts", "Waterfall charts"],
      riskVisualization: ["Dendrogram", "Correlation heatmap", "Risk contribution charts", "Factor exposure plots"],
      performanceCharts: ["Efficient frontier", "Return attribution", "Drawdown analysis", "Rolling performance"],
      scenarioAnalysis: ["Monte Carlo fan charts", "Stress test results", "What-if scenarios", "Regime analysis"]
    },
    reportingCapabilities: {
      portfolioReports: ["Allocation summary", "Risk analysis", "Performance attribution", "Compliance check"],
      clientReporting: ["Executive summary", "Risk-return analysis", "Benchmark comparison", "ESG reporting"],
      regulatoryReports: ["Risk disclosures", "Concentration reports", "Liquidity assessments", "Stress test results"],
      customReports: ["API-generated reports", "Automated scheduling", "Multi-format export", "Branded templates"]
    },
    integrationCapabilities: {
      dataProviders: ["Bloomberg", "Refinitiv", "MSCI", "FactSet", "Yahoo Finance", "Alpha Vantage"],
      portfolioSystems: ["Charles River", "SimCorp", "Aladdin", "Eagle PACE", "Geneva"],
      riskSystems: ["RiskMetrics", "Barra", "MSCI RiskManager", "Axioma"],
      tradingSystems: ["OMS integration", "EMS connectivity", "FIX protocol", "API endpoints"]
    },
    useCases: [
      "Institutional Portfolio Optimization",
      "Pension Fund Asset Allocation",
      "Multi-Asset Portfolio Management", 
      "Risk Budgeting and Control",
      "Factor-Based Investing",
      "ESG-Integrated Portfolios",
      "Liability-Driven Investing",
      "Multi-Manager Portfolio Construction",
      "Dynamic Asset Allocation",
      "Tail Risk Hedging"
    ]
  },
  {
    id: 12,
    name: "Market Regime Detector (Ensemble)",
    description: "Detects market regime shifts using an ensemble of LSTM, Transformer and gradient-boosted models to adapt positioning and risk sizing in multi-asset portfolios.",
    category: "Market Forecasting",
    subcategory: "Regime Detection",
    creator: "RegimeSense AI",
    rating: 4.7,
    totalRatings: 156,
    price: "299.99",
    monthlySubscribers: 420,
    accuracy: 91.2,
    riskLevel: "Medium",
    aiTechnique: "Ensemble (LSTM + Transformer + XGBoost)",
    targetUserType: "Portfolio Managers",
    financialInstrument: "Multi-Asset",
    tags: ["Market Regimes", "Ensemble", "LSTM", "Transformer", "Trend Detection", "Risk Management"],
    features: {
      realTimeAnalysis: true,
      backtesting: true,
      alertSystem: true,
      apiAccess: true,
      customDashboard: true,
      explainableAI: true,
      stressTesting: true,
      portfolioAnalysis: true
    },
    performance: {
      accuracy: 91.2,
      auc: 0.89,
      sharpeRatio: 1.8,
      maxDrawdown: 6.5,
      precision: 0.86,
      recall: 0.88,
      f1Score: 0.87,
      responseTime: "< 750ms"
    },
    dataRequirements: [
      "Price Time Series (tick/ohlc)",
      "Volatility & Implied Volatility",
      "Macro Indicators",
      "Liquidity Metrics",
      "Sentiment Signals"
    ],
    supportedRegions: ["Global", "US", "EU", "Asia-Pacific"],
    complianceFrameworks: ["GDPR", "MiFID II"],
    minInvestment: "20000.00",
    isFeatured: false,
    isActive: true,
    createdAt: "2025-08-17T09:00:00Z",
    lastUpdated: "2025-08-17T12:00:00Z",
    technicalSpecs: {
      modelTypes: ["LSTM", "Transformer", "Gradient Boosting"],
      inputWindow: "30d",
      forecastHorizon: ["1d", "3d", "7d"],
      visualizations: ["Regime Heatmap", "Probability Time Series", "Position Suggestion Overlays"],
      exportFormats: ["CSV", "JSON", "PDF"]
    }
  },
  {
    id: 19,
    name: "Advanced Fraud Detection & Anti-Money Laundering (AML) Suite",
    description: "Comprehensive AI-powered fraud detection and AML compliance system featuring real-time transaction monitoring, behavioral analysis, and regulatory reporting with advanced machine learning algorithms.",
    category: "Risk Management", 
    subcategory: "Fraud Detection",
    creator: "SecureFinance Labs",
    rating: 4.8,
    totalRatings: 342,
    price: "899.99",
    monthlySubscribers: 567,
    accuracy: 94.2,
    riskLevel: "High",
    aiTechnique: "Ensemble ML + Deep Learning",
    targetUserType: "Risk Officers",
    financialInstrument: "All Transaction Types",
    tags: ["Fraud Detection", "AML", "Transaction Monitoring", "Behavioral Analysis", "Regulatory Compliance", "Real-time"],
    features: {
      realTimeAnalysis: true,
      backtesting: true,
      alertSystem: true,
      apiAccess: true,
      customDashboard: true,
      behavioralProfiling: true,
      regulatoryReporting: true,
      networkAnalysis: true,
      caseMagagement: true,
      investigationTools: true
    },
    performance: {
      accuracy: 94.2,
      falsePositiveRate: 2.1,
      detectionSpeed: "< 100ms",
      throughput: "1M+ transactions/hour",
      precision: 0.93,
      recall: 0.89,
      f1Score: 0.91
    },
    dataRequirements: [
      "Transaction Data",
      "Customer Information", 
      "Account History",
      "External Watchlists",
      "Sanctions Lists",
      "Geographic Data",
      "Device & Session Information",
      "Behavioral Patterns"
    ],
    supportedRegions: ["Global", "US", "EU", "Asia-Pacific", "MENA"],
    complianceFrameworks: ["BSA/AML", "EU 5AMLD", "FATF", "FinCEN", "FCA", "AUSTRAC", "FINTRAC"],
    minInvestment: "100000.00",
    isFeatured: true,
    isActive: true,
    createdAt: "2024-09-15T08:00:00Z",
    lastUpdated: "2025-08-18T12:30:00Z",
    technicalSpecs: {
      detectionTypes: ["Identity Fraud", "Payment Fraud", "Money Laundering", "Terrorist Financing", "Sanctions Evasion"],
      mlTechniques: ["Random Forest", "XGBoost", "Neural Networks", "Anomaly Detection", "Graph Analysis"],
      monitoringCapabilities: [
        "Real-time Transaction Screening",
        "Customer Due Diligence (CDD)",
        "Enhanced Due Diligence (EDD)", 
        "Ongoing Monitoring",
        "Suspicious Activity Detection",
        "Typology-based Detection"
      ],
      alertCategories: [
        "High-Risk Transactions",
        "Unusual Customer Behavior",
        "Sanctions Matches",
        "Politically Exposed Persons (PEP)",
        "Cross-border Transfers",
        "Cash Intensive Businesses"
      ],
      investigationFeatures: [
        "Case Management System",
        "Timeline Reconstruction", 
        "Network Visualization",
        "Document Management",
        "Evidence Collection",
        "Regulatory Filing Automation"
      ]
    },
    regulatoryFeatures: {
      sarReporting: "Automated SAR/STR generation and filing",
      ctrReporting: "Currency Transaction Report automation", 
      regulatoryUpdates: "Real-time regulatory rule updates",
      auditTrails: "Complete audit trail and documentation",
      riskAssessment: "Customer and geographic risk scoring",
      watchlistManagement: "Dynamic watchlist updates and matching"
    },
    useCases: [
      "Banking Transaction Monitoring",
      "Credit Card Fraud Detection", 
      "Wire Transfer Screening",
      "Digital Payment Fraud Prevention",
      "Cryptocurrency AML Compliance",
      "Trade Finance Monitoring",
      "Insurance Fraud Detection",
      "Regulatory Compliance Reporting",
      "Customer Risk Profiling",
      "Sanctions Screening"
    ]
  },
  // AI-Powered Yield Optimization & Portfolio Management (DynaSets)
  {
    id: 20,
    name: "AI-Powered DynaSet Growth Portfolio",
    description: "Intelligent crypto portfolio management system that autonomously rebalances between BTC, ETH, and top altcoins using advanced ML algorithms. Features dynamic allocation based on market conditions, momentum signals, and correlation analysis.",
    category: "Portfolio Management",
    subcategory: "AI Yield Optimization",
    creator: "SingularityAI Labs",
    rating: 4.9,
    totalRatings: 456,
    price: "399.99",
    monthlySubscribers: 1240,
    accuracy: 91.8,
    riskLevel: "Medium",
    aiTechnique: "Deep Reinforcement Learning + Portfolio Theory",
    targetUserType: "DeFi Investors",
    financialInstrument: "Crypto Portfolios",
    tags: ["Portfolio Management", "DynaSet", "Auto-Rebalancing", "Growth Strategy", "AI Allocation", "Yield Optimization"],
    features: {
      realTimeAnalysis: true,
      backtesting: true,
      alertSystem: true,
      apiAccess: true,
      customDashboard: true,
      aiRebalancing: true,
      riskConstraints: true,
      scenarioTesting: true,
      explainableAI: true,
      socialCopy: true
    },
    performance: {
      accuracy: 91.8,
      sharpeRatio: 2.4,
      maxDrawdown: 15.2,
      annualReturn: 47.3,
      winRate: 73.5,
      volatility: 18.7,
      sortinoRatio: 3.1
    },
    dataRequirements: [
      "Token Prices & Volume",
      "Market Correlation Data",
      "DeFi Protocol Yields",
      "Liquidity Metrics",
      "Sentiment Indicators",
      "Macro Economic Data"
    ],
    supportedRegions: ["Global"],
    supportedChains: ["Ethereum", "Polygon", "Arbitrum", "Optimism", "BSC"],
    complianceFrameworks: ["DeFi Best Practices", "Portfolio Management Standards"],
    minInvestment: "5000.00",
    isFeatured: true,
    isActive: true,
    createdAt: "2024-10-01T10:00:00Z",
    lastUpdated: "2025-08-20T14:30:00Z",
    technicalSpecs: {
      allocationStrategies: ["Mean Reversion", "Momentum", "Risk Parity", "Black-Litterman", "Kelly Criterion"],
      rebalancingFrequency: ["Daily", "Weekly", "Dynamic (Event-Driven)"],
      riskConstraints: {
        maxAssetWeight: "40%",
        maxDrawdown: "20%",
        volatilityTarget: "15-25%",
        correlationLimits: "0.8 max"
      },
      aiFeatures: [
        "Dynamic Asset Allocation",
        "Regime Detection",
        "Risk Budgeting",
        "Factor Exposure Control",
        "Momentum Signal Integration",
        "Mean Reversion Detection"
      ]
    }
  },
  {
    id: 21,
    name: "AI-Powered DeFi Yield Optimizer",
    description: "Advanced yield optimization system that automatically allocates capital across DeFi protocols to maximize APY while managing smart contract risks. Features cross-chain yield farming with automated harvesting and compounding.",
    category: "Portfolio Management",
    subcategory: "AI Yield Optimization",
    creator: "YieldMax Protocol",
    rating: 4.7,
    totalRatings: 298,
    price: "299.99",
    monthlySubscribers: 890,
    accuracy: 94.2,
    riskLevel: "Medium",
    aiTechnique: "Multi-Agent Reinforcement Learning",
    targetUserType: "DeFi Yield Farmers",
    financialInstrument: "DeFi Protocols",
    tags: ["DeFi", "Yield Farming", "Auto-Compound", "Cross-Chain", "Risk Management", "Protocol Analysis"],
    features: {
      realTimeAnalysis: true,
      backtesting: true,
      alertSystem: true,
      apiAccess: true,
      customDashboard: true,
      autoCompounding: true,
      riskScoring: true,
      protocolMonitoring: true,
      gasOptimization: true,
      yieldForecasting: true
    },
    performance: {
      accuracy: 94.2,
      sharpeRatio: 2.8,
      maxDrawdown: 8.5,
      annualReturn: 28.4,
      winRate: 87.2,
      volatility: 9.8,
      avgAPY: 24.7
    },
    dataRequirements: [
      "DeFi Protocol APYs",
      "Smart Contract Security Scores",
      "Liquidity Pool Data",
      "Gas Price Forecasts",
      "Protocol TVL & Volume",
      "Governance Token Prices"
    ],
    supportedRegions: ["Global"],
    supportedChains: ["Ethereum", "Polygon", "Avalanche", "Fantom", "Arbitrum", "Optimism"],
    complianceFrameworks: ["DeFi Security Standards"],
    minInvestment: "2500.00",
    isFeatured: true,
    isActive: true,
    createdAt: "2024-11-15T12:00:00Z",
    lastUpdated: "2025-08-20T16:00:00Z",
    technicalSpecs: {
      protocols: ["Aave", "Compound", "Curve", "Convex", "Yearn", "Lido", "Rocket Pool"],
      strategies: [
        "Single Asset Yield Farming",
        "LP Token Farming",
        "Stablecoin Optimization",
        "Leveraged Yield Strategies",
        "Cross-Chain Arbitrage"
      ],
      riskManagement: {
        protocolRiskScoring: true,
        impermanentLossTracking: true,
        liquidationRiskMonitoring: true,
        smartContractAudits: true
      }
    }
  },
  {
    id: 22,
    name: "AI-Powered Defensive Portfolio Manager",
    description: "Conservative AI portfolio manager focused on capital preservation with steady returns. Automatically allocates between stablecoins, treasuries, and low-volatility assets with downside protection strategies.",
    category: "Portfolio Management", 
    subcategory: "AI Yield Optimization",
    creator: "SafeHaven AI",
    rating: 4.8,
    totalRatings: 367,
    price: "199.99",
    monthlySubscribers: 1450,
    accuracy: 96.1,
    riskLevel: "Low",
    aiTechnique: "Bayesian Optimization + Risk Parity",
    targetUserType: "Conservative Investors",
    financialInstrument: "Stablecoins & Fixed Income",
    tags: ["Conservative", "Capital Preservation", "Stablecoins", "Risk Parity", "Downside Protection", "Steady Yield"],
    features: {
      realTimeAnalysis: true,
      backtesting: true,
      alertSystem: true,
      apiAccess: true,
      customDashboard: true,
      capitalProtection: true,
      yieldOptimization: true,
      downsideHedging: true,
      stressTestiing: true,
      liquidityManagement: true
    },
    performance: {
      accuracy: 96.1,
      sharpeRatio: 1.9,
      maxDrawdown: 3.2,
      annualReturn: 8.7,
      winRate: 94.3,
      volatility: 4.1,
      calmarRatio: 2.7
    },
    dataRequirements: [
      "Stablecoin Yields",
      "Treasury Rates",
      "Credit Spreads", 
      "Volatility Indicators",
      "Liquidity Metrics",
      "Macro Indicators"
    ],
    supportedRegions: ["US", "EU", "Global"],
    supportedChains: ["Ethereum", "Polygon", "Arbitrum"],
    complianceFrameworks: ["Conservative Investment Standards", "Capital Preservation Guidelines"],
    minInvestment: "1000.00",
    isFeatured: true,
    isActive: true,
    createdAt: "2024-12-01T09:30:00Z",
    lastUpdated: "2025-08-20T11:00:00Z",
    technicalSpecs: {
      assetClasses: ["Stablecoins", "Treasury Bills", "Money Market Funds", "Conservative DeFi"],
      protectionStrategies: [
        "Capital Preservation Focus",
        "Downside Risk Hedging", 
        "Volatility Targeting",
        "Liquidity Management",
        "Credit Risk Assessment"
      ],
      allocationConstraints: {
        maxRiskAssets: "20%",
        minStablecoins: "60%",
        maxSingleAsset: "25%",
        volatilityLimit: "5%"
      }
    }
  },
  {
    id: 23,
    name: "AI-Powered Multi-Asset Momentum Strategy",
    description: "Advanced momentum-based portfolio system that dynamically allocates across crypto, stocks, commodities, and bonds. Uses ML to identify trend changes and optimize entry/exit timing across multiple asset classes.",
    category: "Portfolio Management",
    subcategory: "AI Yield Optimization", 
    creator: "MomentumAI Capital",
    rating: 4.6,
    totalRatings: 234,
    price: "599.99",
    monthlySubscribers: 567,
    accuracy: 89.4,
    riskLevel: "High",
    aiTechnique: "LSTM + Transformer Networks",
    targetUserType: "Active Traders",
    financialInstrument: "Multi-Asset",
    tags: ["Momentum", "Multi-Asset", "Trend Following", "Cross-Asset", "Dynamic Allocation", "Machine Learning"],
    features: {
      realTimeAnalysis: true,
      backtesting: true,
      alertSystem: true,
      apiAccess: true,
      customDashboard: true,
      momentumDetection: true,
      crossAssetAnalysis: true,
      regimeDetection: true,
      trendFiltering: true,
      riskSizing: true
    },
    performance: {
      accuracy: 89.4,
      sharpeRatio: 2.1,
      maxDrawdown: 22.8,
      annualReturn: 52.6,
      winRate: 68.9,
      volatility: 24.3,
      informationRatio: 1.8
    },
    dataRequirements: [
      "Multi-Asset Price Data",
      "Volume & Momentum Indicators", 
      "Cross-Asset Correlations",
      "Macro Economic Data",
      "Sentiment Indicators",
      "Interest Rate Data"
    ],
    supportedRegions: ["Global", "US", "EU", "Asia-Pacific"],
    supportedChains: ["Ethereum", "Bitcoin", "Traditional Markets"],
    complianceFrameworks: ["MiFID II", "SEC", "Multi-Asset Investment Guidelines"],
    minInvestment: "25000.00",
    isFeatured: false,
    isActive: true,
    createdAt: "2025-01-10T11:00:00Z",
    lastUpdated: "2025-08-20T13:45:00Z",
    technicalSpecs: {
      assetUniverse: ["Cryptocurrencies", "Equities", "Commodities", "Fixed Income", "FX", "REITs"],
      momentumIndicators: [
        "Price Momentum (1-12M)",
        "Risk-Adjusted Momentum", 
        "Cross-Sectional Momentum",
        "Time Series Momentum",
        "Volatility-Adjusted Returns"
      ],
      allocationMethods: [
        "Equal Risk Contribution", 
        "Inverse Volatility Weighting",
        "Risk Budgeting",
        "Kelly Criterion Sizing"
      ]
    }
  },
  {
    id: 24,
    name: "AI-Powered ESG Portfolio Optimizer",
    description: "Sustainable investment AI that builds ESG-compliant portfolios while optimizing for both financial returns and environmental/social impact. Features ESG scoring, impact measurement, and sustainable yield strategies.",
    category: "Portfolio Management",
    subcategory: "AI Yield Optimization",
    creator: "GreenFinance AI",
    rating: 4.7,
    totalRatings: 189,
    price: "349.99", 
    monthlySubscribers: 425,
    accuracy: 92.3,
    riskLevel: "Medium",
    aiTechnique: "Multi-Objective Optimization + ESG ML",
    targetUserType: "ESG Investors",
    financialInstrument: "ESG Assets",
    tags: ["ESG", "Sustainable Finance", "Impact Investing", "Green Bonds", "ESG Scoring", "Responsible AI"],
    features: {
      realTimeAnalysis: true,
      backtesting: true,
      alertSystem: true,
      apiAccess: true,
      customDashboard: true,
      esgScoring: true,
      impactMeasurement: true,
      sustainabilityTracking: true,
      greenBondAnalysis: true,
      carbonFootprinting: true
    },
    performance: {
      accuracy: 92.3,
      sharpeRatio: 2.0,
      maxDrawdown: 11.4,
      annualReturn: 19.8,
      winRate: 76.8,
      esgScore: 8.7,
      impactScore: 9.2
    },
    dataRequirements: [
      "ESG Ratings & Scores",
      "Carbon Emissions Data",
      "Impact Metrics",
      "Green Asset Universe",
      "Sustainability Reports", 
      "Regulatory ESG Data"
    ],
    supportedRegions: ["Global", "US", "EU", "ESG Focused Markets"],
    supportedChains: ["Ethereum (ESG Tokens)", "Polygon (Carbon Credits)"],
    complianceFrameworks: ["EU Taxonomy", "SFDR", "TCFD", "UN PRI", "ESG Disclosure Standards"],
    minInvestment: "5000.00",
    isFeatured: true,
    isActive: true,
    createdAt: "2025-02-14T10:15:00Z",
    lastUpdated: "2025-08-20T15:20:00Z",
    technicalSpecs: {
      esgFactors: ["Environmental", "Social", "Governance", "Climate Risk", "Impact Alignment"],
      sustainableAssets: [
        "Green Bonds",
        "ESG ETFs",
        "Renewable Energy Tokens",
        "Carbon Credits",
        "Sustainable DeFi Protocols"
      ],
      optimizationObjectives: [
        "Financial Return Maximization",
        "ESG Score Maximization", 
        "Carbon Footprint Minimization",
        "Impact Measurement",
        "Risk-Adjusted Sustainability"
      ]
    }
  },
  // On-Chain Anomaly Detection & Security Intelligence
  {
    id: 25,
    name: "Real-Time DeFi Fraud Detection System",
    description: "Advanced on-chain anomaly detection system that monitors DeFi protocols in real-time to identify fraud, rug pulls, flash loan attacks, and wash trading. Features network analysis, threat intelligence, and automated alert systems.",
    category: "Security Intelligence",
    subcategory: "Fraud Detection",
    creator: "ChainSecure Labs",
    rating: 4.9,
    totalRatings: 542,
    price: "799.99",
    monthlySubscribers: 678,
    accuracy: 96.8,
    riskLevel: "Low",
    aiTechnique: "Graph Neural Networks + Anomaly Detection",
    targetUserType: "Security Teams",
    financialInstrument: "DeFi Protocols",
    tags: ["Fraud Detection", "Real-time Monitoring", "Anomaly Detection", "DeFi Security", "Graph Analysis", "Threat Intelligence"],
    features: {
      realTimeAnalysis: true,
      backtesting: false,
      alertSystem: true,
      apiAccess: true,
      customDashboard: true,
      networkMapping: true,
      threatIntelligence: true,
      automaticBlacklisting: true,
      complianceReporting: true,
      investigationTools: true
    },
    performance: {
      accuracy: 96.8,
      falsePositiveRate: 1.8,
      detectionSpeed: "< 50ms",
      throughput: "10M+ transactions/hour",
      precision: 0.94,
      recall: 0.97,
      f1Score: 0.95
    },
    dataRequirements: [
      "On-Chain Transaction Data",
      "Mempool Monitoring",
      "DEX Liquidity Data", 
      "Bridge Transaction Logs",
      "Oracle Feed Data",
      "Known Threat Actor Database",
      "Protocol Risk Scores",
      "Wallet Clustering Data"
    ],
    supportedRegions: ["Global"],
    supportedChains: ["Ethereum", "Polygon", "BSC", "Avalanche", "Arbitrum", "Optimism", "Solana"],
    complianceFrameworks: ["MiCA", "FATF", "SEC DeFi Guidelines", "AML Standards"],
    minInvestment: "50000.00",
    isFeatured: true,
    isActive: true,
    createdAt: "2024-11-01T09:00:00Z",
    lastUpdated: "2025-08-20T17:00:00Z",
    technicalSpecs: {
      detectionTypes: ["Rug Pull", "Flash Loan Attack", "Wash Trading", "Bridge Exploit", "Sybil Ring", "MEV Attack"],
      monitoringCapabilities: [
        "Real-time Transaction Screening",
        "Mempool Analysis",
        "Liquidity Pool Monitoring",
        "Cross-Chain Bridge Surveillance",
        "Oracle Feed Anomalies",
        "Whale Wallet Tracking"
      ],
      alertCategories: [
        "Critical Security Breach",
        "Suspicious Transaction Pattern",
        "Abnormal Liquidity Movement", 
        "Potential Rug Pull",
        "Flash Loan Exploit",
        "Cross-Chain Attack Vector"
      ],
      visualizations: [
        "Network Topology Graph",
        "Risk Heatmap Dashboard",
        "Attack Timeline Visualization",
        "Transaction Flow Diagrams",
        "Threat Actor Network Maps"
      ]
    }
  },
  {
    id: 26,
    name: "Rug Pull Prediction Engine",
    description: "Specialized AI system that analyzes token projects and liquidity patterns to predict potential rug pulls before they happen. Uses behavioral analysis, code auditing, and social sentiment to assess project legitimacy.",
    category: "Security Intelligence",
    subcategory: "Rug Pull Detection",
    creator: "RugWatch AI",
    rating: 4.7,
    totalRatings: 389,
    price: "449.99",
    monthlySubscribers: 892,
    accuracy: 94.3,
    riskLevel: "Medium",
    aiTechnique: "Ensemble ML + Social Network Analysis",
    targetUserType: "DeFi Investors",
    financialInstrument: "DeFi Tokens",
    tags: ["Rug Pull", "Project Analysis", "Token Security", "Social Sentiment", "Code Auditing", "Risk Assessment"],
    features: {
      realTimeAnalysis: true,
      backtesting: true,
      alertSystem: true,
      apiAccess: true,
      customDashboard: true,
      projectScoring: true,
      socialAnalysis: true,
      codeAuditing: true,
      liquidityTracking: true,
      developerProfiling: true
    },
    performance: {
      accuracy: 94.3,
      earlyDetectionRate: 89.7,
      falsePositiveRate: 4.2,
      avgWarningTime: "48 hours",
      precision: 0.91,
      recall: 0.89,
      f1Score: 0.90
    },
    dataRequirements: [
      "Token Contract Code",
      "Liquidity Pool Data",
      "Developer Wallet History",
      "Social Media Sentiment",
      "Discord/Telegram Activity", 
      "Website & Documentation Analysis",
      "Token Distribution Patterns",
      "Trading Volume Analysis"
    ],
    supportedRegions: ["Global"],
    supportedChains: ["Ethereum", "BSC", "Polygon", "Avalanche"],
    complianceFrameworks: ["Investor Protection Standards", "Token Security Guidelines"],
    minInvestment: "2500.00",
    isFeatured: true,
    isActive: true,
    createdAt: "2024-12-15T14:30:00Z",
    lastUpdated: "2025-08-20T12:15:00Z",
    technicalSpecs: {
      riskFactors: [
        "Locked Liquidity Analysis",
        "Team Wallet Concentration", 
        "Code Vulnerability Scanning",
        "Social Media Authenticity",
        "Website Quality Assessment",
        "Tokenomics Red Flags"
      ],
      predictionMethods: [
        "Behavioral Pattern Recognition",
        "Statistical Anomaly Detection",
        "Natural Language Processing",
        "Network Graph Analysis",
        "Time Series Analysis"
      ]
    }
  },
  {
    id: 27,
    name: "Flash Loan Attack Detector",
    description: "Real-time monitoring system that identifies and analyzes flash loan attacks across DeFi protocols. Provides instant alerts, attack vector analysis, and mitigation strategies for protocol security teams.",
    category: "Security Intelligence", 
    subcategory: "Flash Loan Security",
    creator: "FlashGuard Protocol",
    rating: 4.8,
    totalRatings: 278,
    price: "599.99",
    monthlySubscribers: 445,
    accuracy: 97.2,
    riskLevel: "Low",
    aiTechnique: "Sequence Analysis + Pattern Matching",
    targetUserType: "Protocol Developers",
    financialInstrument: "Flash Loans",
    tags: ["Flash Loan", "Attack Detection", "Protocol Security", "Real-time Monitoring", "Attack Vector Analysis", "MEV"],
    features: {
      realTimeAnalysis: true,
      backtesting: true,
      alertSystem: true,
      apiAccess: true,
      customDashboard: true,
      attackVectorMapping: true,
      instantAlerts: true,
      mitigationStrategies: true,
      protocolIntegration: true,
      forensicAnalysis: true
    },
    performance: {
      accuracy: 97.2,
      detectionSpeed: "< 10ms",
      falsePositiveRate: 1.1,
      attackPrevention: "85%",
      precision: 0.96,
      recall: 0.94,
      f1Score: 0.95
    },
    dataRequirements: [
      "Flash Loan Transaction Data",
      "DEX Price Oracle Data",
      "Protocol State Changes",
      "Arbitrage Opportunity Data",
      "Mempool Transaction Sequences",
      "Known Attack Patterns",
      "Protocol Vulnerability Database"
    ],
    supportedRegions: ["Global"],
    supportedChains: ["Ethereum", "Polygon", "Avalanche", "Arbitrum", "Optimism"],
    complianceFrameworks: ["DeFi Security Standards", "Flash Loan Best Practices"],
    minInvestment: "15000.00",
    isFeatured: true,
    isActive: true,
    createdAt: "2025-01-20T11:45:00Z",
    lastUpdated: "2025-08-20T14:20:00Z",
    technicalSpecs: {
      attackTypes: [
        "Oracle Manipulation",
        "Arbitrage Exploitation", 
        "Liquidation Attacks",
        "Governance Attacks",
        "Cross-Protocol MEV",
        "Sandwich Attacks"
      ],
      detectionFeatures: [
        "Transaction Sequence Analysis",
        "Price Impact Calculation",
        "Multi-Hop Path Detection",
        "Slippage Anomaly Detection",
        "Gas Price Analysis",
        "Timing Attack Patterns"
      ]
    }
  },
  {
    id: 28,
    name: "Wash Trading Detection System",
    description: "Advanced AI system that identifies wash trading and market manipulation schemes in DeFi and CEX markets. Uses transaction pattern analysis and wallet clustering to detect coordinated trading activities.",
    category: "Security Intelligence",
    subcategory: "Market Manipulation",
    creator: "TradeSurveillance AI",
    rating: 4.6,
    totalRatings: 312,
    price: "399.99",
    monthlySubscribers: 567,
    accuracy: 92.8,
    riskLevel: "Medium",
    aiTechnique: "Clustering Analysis + Behavioral ML",
    targetUserType: "Compliance Teams",
    financialInstrument: "All Trading Pairs", 
    tags: ["Wash Trading", "Market Manipulation", "Trading Surveillance", "Compliance", "Behavioral Analysis", "Pattern Detection"],
    features: {
      realTimeAnalysis: true,
      backtesting: true,
      alertSystem: true,
      apiAccess: true,
      customDashboard: true,
      walletClustering: true,
      behaviorProfiling: true,
      complianceReporting: true,
      investigationTools: true,
      regulatoryExports: true
    },
    performance: {
      accuracy: 92.8,
      detectionRate: 88.5,
      falsePositiveRate: 5.3,
      investigationTime: "60% reduction",
      precision: 0.89,
      recall: 0.91,
      f1Score: 0.90
    },
    dataRequirements: [
      "Trading Transaction Data",
      "Wallet Address Mappings",
      "Order Book Data",
      "Trading Volume Patterns",
      "Time-based Trading Analysis",
      "Cross-Exchange Data",
      "Behavioral Patterns Database"
    ],
    supportedRegions: ["Global"],
    supportedChains: ["Ethereum", "BSC", "Polygon", "Solana", "CEX Data"],
    complianceFrameworks: ["Market Abuse Regulation", "SEC Trading Rules", "MiFID II", "CFTC Guidelines"],
    minInvestment: "8000.00",
    isFeatured: false,
    isActive: true,
    createdAt: "2025-02-10T16:00:00Z",
    lastUpdated: "2025-08-20T10:30:00Z",
    technicalSpecs: {
      manipulationTypes: [
        "Wash Trading",
        "Pump and Dump Schemes",
        "Spoofing",
        "Layering", 
        "Quote Stuffing",
        "Coordinated Trading"
      ],
      analysisFeatures: [
        "Transaction Pattern Clustering",
        "Temporal Analysis",
        "Volume Spike Detection",
        "Cross-Chain Correlation",
        "Entity Resolution",
        "Behavioral Fingerprinting"
      ]
    }
  },
  {
    id: 29,
    name: "Bridge Security Monitor",
    description: "Comprehensive security monitoring system for cross-chain bridges that detects exploits, validates transactions, and monitors bridge health. Provides early warning for bridge attacks and suspicious cross-chain activities.",
    category: "Security Intelligence",
    subcategory: "Bridge Security",
    creator: "BridgeGuard Systems",
    rating: 4.8,
    totalRatings: 234,
    price: "899.99",
    monthlySubscribers: 378,
    accuracy: 95.4,
    riskLevel: "Low",
    aiTechnique: "Cross-Chain Analysis + State Verification",
    targetUserType: "Bridge Operators", 
    financialInstrument: "Cross-Chain Bridges",
    tags: ["Bridge Security", "Cross-Chain", "Exploit Detection", "State Verification", "Transaction Validation", "Multi-Chain"],
    features: {
      realTimeAnalysis: true,
      backtesting: false,
      alertSystem: true,
      apiAccess: true,
      customDashboard: true,
      stateVerification: true,
      crossChainMonitoring: true,
      exploitDetection: true,
      bridgeHealthScore: true,
      emergencyShutdown: true
    },
    performance: {
      accuracy: 95.4,
      responseTime: "< 30ms",
      exploitDetection: "92%",
      falsePositiveRate: 2.1,
      precision: 0.93,
      recall: 0.96,
      f1Score: 0.94
    },
    dataRequirements: [
      "Cross-Chain Transaction Data",
      "Bridge State Information",
      "Validator Node Data",
      "Lock/Mint Transaction Pairs",
      "Oracle Price Feeds",
      "Bridge TVL Tracking",
      "Known Exploit Patterns"
    ],
    supportedRegions: ["Global"],
    supportedChains: ["Ethereum", "Polygon", "Avalanche", "BSC", "Arbitrum", "Optimism", "Solana", "Cosmos"],
    complianceFrameworks: ["Cross-Chain Security Standards", "Bridge Audit Guidelines"],
    minInvestment: "25000.00",
    isFeatured: true,
    isActive: true,
    createdAt: "2025-03-05T13:20:00Z",
    lastUpdated: "2025-08-20T16:45:00Z",
    technicalSpecs: {
      bridgeTypes: [
        "Token Bridges",
        "Liquidity Bridges",
        "Messaging Bridges",
        "Validator Bridges",
        "Hybrid Bridges"
      ],
      securityChecks: [
        "Double Spending Prevention",
        "Transaction Hash Verification",
        "State Consensus Monitoring",
        "Validator Behavior Analysis",
        "Economic Security Assessment",
        "Smart Contract Integrity"
      ],
      monitoringFeatures: [
        "Real-time Bridge Health Score",
        "Cross-Chain State Synchronization",
        "Suspicious Transaction Flagging",
        "Validator Performance Tracking",
        "Economic Attack Detection",
        "Emergency Circuit Breakers"
      ]
    }
  },
  {
    id: 30,
    name: "Sybil Ring Detection Network",
    description: "Advanced graph-based AI system that identifies Sybil attacks and coordinated bot networks in DeFi. Uses network analysis and behavioral patterns to detect fake account clusters and manipulation campaigns.",
    category: "Security Intelligence",
    subcategory: "Sybil Detection",
    creator: "NetworkSec AI",
    rating: 4.7,
    totalRatings: 189,
    price: "549.99",
    monthlySubscribers: 423,
    accuracy: 91.6,
    riskLevel: "Medium",
    aiTechnique: "Graph Neural Networks + Community Detection",
    targetUserType: "DeFi Protocols",
    financialInstrument: "DeFi Governance",
    tags: ["Sybil Attack", "Bot Detection", "Network Analysis", "Governance Security", "Identity Verification", "Graph Analysis"],
    features: {
      realTimeAnalysis: true,
      backtesting: true,
      alertSystem: true,
      apiAccess: true,
      customDashboard: true,
      networkMapping: true,
      communityDetection: true,
      behaviorAnalysis: true,
      identityScoring: true,
      governanceProtection: true
    },
    performance: {
      accuracy: 91.6,
      sybilDetectionRate: 87.3,
      falsePositiveRate: 6.8,
      networkAnalysisSpeed: "< 2 seconds",
      precision: 0.88,
      recall: 0.86,
      f1Score: 0.87
    },
    dataRequirements: [
      "Wallet Transaction Graphs",
      "Governance Voting Patterns", 
      "Token Distribution Data",
      "Interaction Network Data",
      "Timing Pattern Analysis",
      "IP Geolocation Data",
      "Behavioral Fingerprints"
    ],
    supportedRegions: ["Global"],
    supportedChains: ["Ethereum", "Polygon", "Avalanche", "Arbitrum"],
    complianceFrameworks: ["DAO Governance Standards", "Identity Verification Guidelines"],
    minInvestment: "12000.00",
    isFeatured: false,
    isActive: true,
    createdAt: "2025-04-12T10:10:00Z",
    lastUpdated: "2025-08-20T09:15:00Z",
    technicalSpecs: {
      detectionMethods: [
        "Graph Clustering Analysis",
        "Behavioral Pattern Matching",
        "Transaction Timing Analysis",
        "Network Topology Mapping", 
        "Community Structure Detection",
        "Anomalous Voting Detection"
      ],
      networkFeatures: [
        "Account Similarity Scoring",
        "Interaction Graph Construction",
        "Temporal Pattern Analysis",
        "Geographic Clustering",
        "Voting Behavior Correlation",
        "Asset Flow Tracking"
      ]
    }
  }
];