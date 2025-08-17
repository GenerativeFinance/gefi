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
  }
];