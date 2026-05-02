import { Portfolio, PortfolioAsset, AiModel } from "@shared/schema";

// Helper function to safely parse decimal values
function parseDecimal(value: string): number {
  return parseFloat(value) || 0;
}

// Modern Portfolio Theory Implementation
export class PortfolioOptimizer {
  
  // Calculate expected return for a portfolio
  static calculateExpectedReturn(assets: PortfolioAsset[]): number {
    if (assets.length === 0) return 0;
    
    const totalValue = assets.reduce((sum, asset) => sum + parseDecimal(asset.currentValue), 0);
    if (totalValue === 0) return 0;
    
    return assets.reduce((sum, asset) => {
      const weight = parseDecimal(asset.currentValue) / totalValue;
      const expectedReturn = this.calculateAssetExpectedReturn(asset);
      return sum + (weight * expectedReturn);
    }, 0);
  }
  
  // Calculate portfolio risk (standard deviation)
  static calculatePortfolioRisk(assets: PortfolioAsset[]): number {
    if (assets.length === 0) return 0;
    
    const totalValue = assets.reduce((sum, asset) => sum + parseDecimal(asset.currentValue), 0);
    if (totalValue === 0) return 0;
    
    // Simplified risk calculation using asset volatility
    const weightedRisk = assets.reduce((sum, asset) => {
      const weight = parseDecimal(asset.currentValue) / totalValue;
      const assetRisk = this.calculateAssetRisk(asset);
      return sum + (weight * weight * assetRisk * assetRisk);
    }, 0);
    
    return Math.sqrt(weightedRisk);
  }
  
  // Calculate Sharpe ratio
  static calculateSharpeRatio(expectedReturn: number, risk: number, riskFreeRate: number = 0.02): number {
    if (risk === 0) return 0;
    return (expectedReturn - riskFreeRate) / risk;
  }
  
  // Calculate Value at Risk (VaR) at 95% confidence level
  static calculateVaR(portfolioValue: number, expectedReturn: number, risk: number, confidenceLevel: number = 0.95): number {
    // Using normal distribution approximation
    const zScore = confidenceLevel === 0.95 ? 1.645 : 2.33; // 95% or 99%
    const dailyReturn = expectedReturn / 252; // Assuming 252 trading days
    const dailyRisk = risk / Math.sqrt(252);
    
    return portfolioValue * (dailyReturn - zScore * dailyRisk);
  }
  
  // Generate portfolio optimization recommendations
  static generateOptimizationRecommendations(assets: PortfolioAsset[]): {
    recommendations: string[];
    score: number;
    riskLevel: 'Low' | 'Medium' | 'High';
    suggestedActions: Array<{
      action: string;
      asset: string;
      reason: string;
      impact: string;
    }>;
  } {
    const recommendations: string[] = [];
    const suggestedActions: Array<{
      action: string;
      asset: string;
      reason: string;
      impact: string;
    }> = [];
    
    const totalValue = assets.reduce((sum, asset) => sum + parseDecimal(asset.currentValue), 0);
    const expectedReturn = this.calculateExpectedReturn(assets);
    const risk = this.calculatePortfolioRisk(assets);
    const sharpeRatio = this.calculateSharpeRatio(expectedReturn, risk);
    
    // Diversification analysis
    const assetTypes = new Set(assets.map(asset => asset.assetType));
    if (assetTypes.size < 3) {
      recommendations.push("Increase diversification across asset types");
      suggestedActions.push({
        action: "Add",
        asset: "Bonds or REITs",
        reason: "Low diversification detected",
        impact: "Reduce portfolio risk by 15-25%"
      });
    }
    
    // Concentration risk analysis
    assets.forEach(asset => {
      const weight = parseDecimal(asset.currentValue) / totalValue;
      if (weight > 0.3) {
        recommendations.push(`Reduce concentration in ${asset.symbol} (${(weight * 100).toFixed(1)}%)`);
        suggestedActions.push({
          action: "Reduce",
          asset: asset.symbol,
          reason: `High concentration risk (${(weight * 100).toFixed(1)}%)`,
          impact: "Improve risk-adjusted returns"
        });
      }
    });
    
    // Risk-return optimization
    if (sharpeRatio < 0.5) {
      recommendations.push("Consider rebalancing for better risk-adjusted returns");
    }
    
    // Determine risk level
    let riskLevel: 'Low' | 'Medium' | 'High' = 'Medium';
    if (risk < 0.1) riskLevel = 'Low';
    else if (risk > 0.2) riskLevel = 'High';
    
    // Calculate overall score (0-100)
    const diversificationScore = Math.min(assetTypes.size * 20, 60);
    const concentrationScore = assets.every(asset => (parseDecimal(asset.currentValue) / totalValue) < 0.3) ? 20 : 10;
    const returnScore = Math.min(expectedReturn * 100, 20);
    const score = diversificationScore + concentrationScore + returnScore;
    
    return {
      recommendations,
      score: Math.round(score),
      riskLevel,
      suggestedActions
    };
  }
  
  // Private helper methods
  private static calculateAssetExpectedReturn(asset: PortfolioAsset): number {
    // Simplified expected return calculation based on asset type and recent performance
    const baseReturns: Record<string, number> = {
      'Stock': 0.08,
      'Bond': 0.04,
      'ETF': 0.07,
      'Crypto': 0.15,
      'REIT': 0.06,
      'Commodity': 0.05
    };
    
    const baseReturn = baseReturns[asset.assetType] || 0.06;
    
    // Adjust based on recent performance
    const currentValue = parseDecimal(asset.currentValue);
    const purchasePrice = parseDecimal(asset.purchasePrice);
    
    if (currentValue > purchasePrice) {
      const gain = (currentValue - purchasePrice) / purchasePrice;
      return baseReturn + (gain * 0.1); // Momentum factor
    } else {
      const loss = (purchasePrice - currentValue) / purchasePrice;
      return baseReturn - (loss * 0.05); // Mean reversion factor
    }
  }
  
  private static calculateAssetRisk(asset: PortfolioAsset): number {
    // Simplified risk calculation based on asset type
    const baseRisks: Record<string, number> = {
      'Stock': 0.20,
      'Bond': 0.05,
      'ETF': 0.15,
      'Crypto': 0.50,
      'REIT': 0.18,
      'Commodity': 0.25
    };
    
    return baseRisks[asset.assetType] || 0.15;
  }
}

// Risk Assessment Engine
export class RiskAssessment {
  
  // Calculate overall portfolio risk score (0-100)
  static calculateRiskScore(portfolio: Portfolio, assets: PortfolioAsset[]): {
    overallScore: number;
    factors: Array<{
      factor: string;
      score: number;
      impact: 'Low' | 'Medium' | 'High';
      description: string;
    }>;
  } {
    const factors: Array<{
      factor: string;
      score: number;
      impact: 'Low' | 'Medium' | 'High';
      description: string;
    }> = [];
    
    // Diversification risk
    const assetTypes = new Set(assets.map(asset => asset.assetType));
    const diversificationScore = Math.min(assetTypes.size * 15, 75);
    factors.push({
      factor: 'Diversification',
      score: diversificationScore,
      impact: diversificationScore < 50 ? 'High' : diversificationScore < 70 ? 'Medium' : 'Low',
      description: `Portfolio spread across ${assetTypes.size} asset types`
    });
    
    // Concentration risk
    const totalValue = assets.reduce((sum, asset) => sum + parseDecimal(asset.currentValue), 0);
    const maxConcentration = totalValue > 0 ? Math.max(...assets.map(asset => parseDecimal(asset.currentValue) / totalValue)) : 0;
    const concentrationScore = Math.max(0, 100 - (maxConcentration * 200));
    factors.push({
      factor: 'Concentration',
      score: concentrationScore,
      impact: concentrationScore < 50 ? 'High' : concentrationScore < 70 ? 'Medium' : 'Low',
      description: `Largest holding: ${(maxConcentration * 100).toFixed(1)}%`
    });
    
    // Volatility risk
    const portfolioRisk = PortfolioOptimizer.calculatePortfolioRisk(assets);
    const volatilityScore = Math.max(0, 100 - (portfolioRisk * 400));
    factors.push({
      factor: 'Volatility',
      score: volatilityScore,
      impact: volatilityScore < 50 ? 'High' : volatilityScore < 70 ? 'Medium' : 'Low',
      description: `Portfolio volatility: ${(portfolioRisk * 100).toFixed(1)}%`
    });
    
    // Liquidity risk
    const liquidityScore = this.calculateLiquidityScore(assets);
    factors.push({
      factor: 'Liquidity',
      score: liquidityScore,
      impact: liquidityScore < 50 ? 'High' : liquidityScore < 70 ? 'Medium' : 'Low',
      description: 'Based on asset liquidity characteristics'
    });
    
    const overallScore = factors.reduce((sum, factor) => sum + factor.score, 0) / factors.length;
    
    return {
      overallScore: Math.round(overallScore),
      factors
    };
  }
  
  // Generate risk alerts
  static generateRiskAlerts(portfolio: Portfolio, assets: PortfolioAsset[]): Array<{
    type: 'warning' | 'critical' | 'info';
    title: string;
    description: string;
    recommendation: string;
  }> {
    const alerts: Array<{
      type: 'warning' | 'critical' | 'info';
      title: string;
      description: string;
      recommendation: string;
    }> = [];
    
    const totalValue = assets.reduce((sum, asset) => sum + parseDecimal(asset.currentValue), 0);
    const VaR = PortfolioOptimizer.calculateVaR(
      totalValue,
      PortfolioOptimizer.calculateExpectedReturn(assets),
      PortfolioOptimizer.calculatePortfolioRisk(assets)
    );
    
    // High concentration alert
    assets.forEach(asset => {
      const concentration = totalValue > 0 ? parseDecimal(asset.currentValue) / totalValue : 0;
      if (concentration > 0.25) {
        alerts.push({
          type: concentration > 0.4 ? 'critical' : 'warning',
          title: 'High Concentration Risk',
          description: `${asset.symbol} represents ${(concentration * 100).toFixed(1)}% of portfolio`,
          recommendation: 'Consider reducing position size and diversifying'
        });
      }
    });
    
    // VaR alert
    if (Math.abs(VaR) > totalValue * 0.05) {
      alerts.push({
        type: 'warning',
        title: 'High Value at Risk',
        description: `Potential daily loss of $${Math.abs(VaR).toLocaleString()} (95% confidence)`,
        recommendation: 'Review risk tolerance and consider hedging strategies'
      });
    }
    
    // Low diversification alert
    const assetTypes = new Set(assets.map(asset => asset.assetType));
    if (assetTypes.size < 3) {
      alerts.push({
        type: 'warning',
        title: 'Low Diversification',
        description: `Portfolio concentrated in ${assetTypes.size} asset type(s)`,
        recommendation: 'Add exposure to different asset classes'
      });
    }
    
    return alerts;
  }
  
  private static calculateLiquidityScore(assets: PortfolioAsset[]): number {
    // Simplified liquidity scoring based on asset types
    const liquidityScores: Record<string, number> = {
      'Stock': 90,
      'ETF': 85,
      'Bond': 70,
      'REIT': 75,
      'Crypto': 60,
      'Commodity': 50
    };
    
    const totalValue = assets.reduce((sum, asset) => sum + parseDecimal(asset.currentValue), 0);
    if (totalValue === 0) return 100;
    
    return assets.reduce((sum, asset) => {
      const weight = parseDecimal(asset.currentValue) / totalValue;
      const assetLiquidity = liquidityScores[asset.assetType] || 60;
      return sum + (weight * assetLiquidity);
    }, 0);
  }
}

// Market Analysis Engine
export class MarketAnalysis {
  
  // Generate market insights based on portfolio composition
  static generateMarketInsights(assets: PortfolioAsset[]): Array<{
    title: string;
    insight: string;
    impact: 'Positive' | 'Negative' | 'Neutral';
    confidence: number;
    actionable: boolean;
  }> {
    const insights: Array<{
      title: string;
      insight: string;
      impact: 'Positive' | 'Negative' | 'Neutral';
      confidence: number;
      actionable: boolean;
    }> = [];
    
    // Sector analysis
    const sectorExposure = this.analyzeSectorExposure(assets);
    Object.entries(sectorExposure).forEach(([sector, exposure]) => {
      if (exposure > 0.3) {
        insights.push({
          title: `High ${sector} Exposure`,
          insight: `${(exposure * 100).toFixed(1)}% allocation to ${sector} sector creates concentration risk`,
          impact: 'Negative',
          confidence: 85,
          actionable: true
        });
      }
    });
    
    // Performance analysis
    const performingAssets = assets.filter(asset => parseDecimal(asset.currentValue) > parseDecimal(asset.purchasePrice)).length;
    const underperformingAssets = assets.length - performingAssets;
    
    if (performingAssets > underperformingAssets * 2) {
      insights.push({
        title: 'Strong Portfolio Performance',
        insight: `${performingAssets} of ${assets.length} holdings are profitable`,
        impact: 'Positive',
        confidence: 90,
        actionable: false
      });
    }
    
    // Risk-return analysis
    const expectedReturn = PortfolioOptimizer.calculateExpectedReturn(assets);
    const risk = PortfolioOptimizer.calculatePortfolioRisk(assets);
    const sharpeRatio = PortfolioOptimizer.calculateSharpeRatio(expectedReturn, risk);
    
    if (sharpeRatio > 1.0) {
      insights.push({
        title: 'Excellent Risk-Adjusted Returns',
        insight: `Sharpe ratio of ${sharpeRatio.toFixed(2)} indicates strong risk-adjusted performance`,
        impact: 'Positive',
        confidence: 80,
        actionable: false
      });
    } else if (sharpeRatio < 0.5) {
      insights.push({
        title: 'Poor Risk-Adjusted Returns',
        insight: `Sharpe ratio of ${sharpeRatio.toFixed(2)} suggests portfolio could benefit from rebalancing`,
        impact: 'Negative',
        confidence: 75,
        actionable: true
      });
    }
    
    return insights;
  }
  
  private static analyzeSectorExposure(assets: PortfolioAsset[]): Record<string, number> {
    // Simplified sector mapping based on asset types
    const totalValue = assets.reduce((sum, asset) => sum + parseDecimal(asset.currentValue), 0);
    if (totalValue === 0) return {};
    
    const sectorExposure: Record<string, number> = {};
    
    assets.forEach(asset => {
      const sector = this.mapAssetToSector(asset);
      const weight = parseDecimal(asset.currentValue) / totalValue;
      sectorExposure[sector] = (sectorExposure[sector] || 0) + weight;
    });
    
    return sectorExposure;
  }
  
  private static mapAssetToSector(asset: PortfolioAsset): string {
    // Simplified sector mapping
    const sectorMap: Record<string, string> = {
      'Stock': 'Equity',
      'ETF': 'Diversified',
      'Bond': 'Fixed Income',
      'REIT': 'Real Estate',
      'Crypto': 'Digital Assets',
      'Commodity': 'Commodities'
    };
    
    return sectorMap[asset.assetType] || 'Other';
  }
}