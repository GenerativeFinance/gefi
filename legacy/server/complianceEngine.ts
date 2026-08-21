import { Portfolio, PortfolioAsset, RiskLimit, ComplianceCheck, AuditTrail } from "@shared/schema";

// Institutional-grade compliance and regulatory reporting engine
export class ComplianceEngine {
  
  // BASEL III Risk Assessment Framework
  static calculateBaselIIIMetrics(portfolio: Portfolio, assets: PortfolioAsset[]): {
    tier1CapitalRatio: number;
    leverageRatio: number;
    liquidityCoverageRatio: number;
    riskWeightedAssets: number;
    status: 'compliant' | 'warning' | 'violation';
  } {
    const totalAssetValue = assets.reduce((sum, asset) => sum + parseFloat(asset.currentValue), 0);
    
    // Calculate risk-weighted assets based on asset types
    const riskWeightedAssets = assets.reduce((sum, asset) => {
      const value = parseFloat(asset.currentValue);
      let riskWeight = 1.0; // Default 100% risk weight
      
      switch (asset.assetType.toLowerCase()) {
        case 'government_bond':
          riskWeight = 0.0; // 0% for government securities
          break;
        case 'corporate_bond':
          riskWeight = 0.2; // 20% for high-grade corporates
          break;
        case 'stock':
          riskWeight = 1.0; // 100% for equities
          break;
        case 'crypto':
          riskWeight = 12.5; // 1250% for crypto (Basel proposal)
          break;
        case 'real_estate':
          riskWeight = 0.35; // 35% for real estate
          break;
      }
      
      return sum + (value * riskWeight);
    }, 0);
    
    // Simulate capital calculations (would be from actual capital data)
    const tier1Capital = totalAssetValue * 0.12; // Assume 12% Tier 1 capital
    const tier1CapitalRatio = tier1Capital / riskWeightedAssets;
    const leverageRatio = tier1Capital / totalAssetValue;
    
    // Liquidity Coverage Ratio (simplified)
    const liquidAssets = assets
      .filter(asset => ['government_bond', 'cash'].includes(asset.assetType.toLowerCase()))
      .reduce((sum, asset) => sum + parseFloat(asset.currentValue), 0);
    const liquidityCoverageRatio = liquidAssets / (totalAssetValue * 0.03); // 30-day stress scenario
    
    // Determine compliance status
    let status: 'compliant' | 'warning' | 'violation' = 'compliant';
    if (tier1CapitalRatio < 0.06 || leverageRatio < 0.03 || liquidityCoverageRatio < 1.0) {
      status = 'violation';
    } else if (tier1CapitalRatio < 0.08 || leverageRatio < 0.04 || liquidityCoverageRatio < 1.2) {
      status = 'warning';
    }
    
    return {
      tier1CapitalRatio: tier1CapitalRatio * 100,
      leverageRatio: leverageRatio * 100,
      liquidityCoverageRatio: liquidityCoverageRatio * 100,
      riskWeightedAssets,
      status
    };
  }
  
  // MiFID II Best Execution and Risk Assessment
  static assessMiFIDIICompliance(portfolio: Portfolio, assets: PortfolioAsset[]): {
    concentrationRisk: number;
    diversificationScore: number;
    liquidityRisk: number;
    bestExecutionScore: number;
    status: 'compliant' | 'warning' | 'violation';
    recommendations: string[];
  } {
    const totalValue = assets.reduce((sum, asset) => sum + parseFloat(asset.currentValue), 0);
    const recommendations: string[] = [];
    
    // Concentration Risk Assessment
    const maxSingleAssetExposure = Math.max(...assets.map(asset => 
      parseFloat(asset.currentValue) / totalValue
    ));
    const concentrationRisk = maxSingleAssetExposure * 100;
    
    // Diversification Score (Herfindahl-Hirschman Index)
    const hhi = assets.reduce((sum, asset) => {
      const weight = parseFloat(asset.currentValue) / totalValue;
      return sum + (weight * weight);
    }, 0);
    const diversificationScore = (1 - hhi) * 100;
    
    // Liquidity Risk Assessment
    const liquidityScores = assets.map(asset => {
      switch (asset.assetType.toLowerCase()) {
        case 'cash': return 1.0;
        case 'government_bond': return 0.9;
        case 'stock': return 0.7;
        case 'corporate_bond': return 0.6;
        case 'real_estate': return 0.3;
        case 'crypto': return 0.5;
        default: return 0.4;
      }
    });
    const weightedLiquidityScore = assets.reduce((sum, asset, index) => {
      const weight = parseFloat(asset.currentValue) / totalValue;
      return sum + (weight * liquidityScores[index]);
    }, 0);
    const liquidityRisk = (1 - weightedLiquidityScore) * 100;
    
    // Best Execution Score (simplified assessment)
    const bestExecutionScore = 85; // Would be calculated from actual execution data
    
    // Generate recommendations
    if (concentrationRisk > 25) {
      recommendations.push("Reduce concentration risk - single asset exposure exceeds 25%");
    }
    if (diversificationScore < 60) {
      recommendations.push("Improve portfolio diversification across asset classes and sectors");
    }
    if (liquidityRisk > 40) {
      recommendations.push("Increase allocation to liquid assets to meet potential redemption requirements");
    }
    
    // Determine status
    let status: 'compliant' | 'warning' | 'violation' = 'compliant';
    if (concentrationRisk > 30 || diversificationScore < 50 || liquidityRisk > 50) {
      status = 'violation';
    } else if (concentrationRisk > 20 || diversificationScore < 70 || liquidityRisk > 30) {
      status = 'warning';
    }
    
    return {
      concentrationRisk,
      diversificationScore,
      liquidityRisk,
      bestExecutionScore,
      status,
      recommendations
    };
  }
  
  // SOX (Sarbanes-Oxley) Internal Controls Assessment
  static assessSOXCompliance(auditTrail: AuditTrail[]): {
    controlsScore: number;
    auditTrailCompleteness: number;
    segregationOfDuties: number;
    dataIntegrity: number;
    status: 'compliant' | 'warning' | 'violation';
    findings: string[];
  } {
    const findings: string[] = [];
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentActivities = auditTrail.filter(entry => 
      new Date(entry.timestamp) > last30Days
    );
    
    // Audit Trail Completeness
    const criticalActions = ['trade', 'portfolio_update', 'risk_override'];
    const loggedCriticalActions = recentActivities.filter(entry =>
      criticalActions.includes(entry.action)
    );
    const auditTrailCompleteness = loggedCriticalActions.length > 0 ? 100 : 0;
    
    // Segregation of Duties Analysis
    const userActions = new Map<string, Set<string>>();
    recentActivities.forEach(entry => {
      if (!userActions.has(entry.userId)) {
        userActions.set(entry.userId, new Set());
      }
      userActions.get(entry.userId)!.add(entry.action);
    });
    
    const conflictingActions = ['create', 'approve'];
    let segregationViolations = 0;
    userActions.forEach(actions => {
      if (conflictingActions.every(action => actions.has(action))) {
        segregationViolations++;
      }
    });
    const segregationOfDuties = Math.max(0, 100 - (segregationViolations * 20));
    
    // Data Integrity Score
    const entriesWithChanges = recentActivities.filter(entry => 
      entry.oldValues && entry.newValues
    );
    const dataIntegrity = entriesWithChanges.length > 0 ? 100 : 85;
    
    // Overall Controls Score
    const controlsScore = (auditTrailCompleteness + segregationOfDuties + dataIntegrity) / 3;
    
    // Generate findings
    if (auditTrailCompleteness < 100) {
      findings.push("Incomplete audit trail for critical portfolio operations");
    }
    if (segregationViolations > 0) {
      findings.push(`${segregationViolations} segregation of duties violations detected`);
    }
    if (dataIntegrity < 95) {
      findings.push("Data integrity controls need improvement");
    }
    
    // Determine status
    let status: 'compliant' | 'warning' | 'violation' = 'compliant';
    if (controlsScore < 70) {
      status = 'violation';
    } else if (controlsScore < 85) {
      status = 'warning';
    }
    
    return {
      controlsScore,
      auditTrailCompleteness,
      segregationOfDuties,
      dataIntegrity,
      status,
      findings
    };
  }
  
  // Generate comprehensive compliance report
  static generateComplianceReport(
    portfolio: Portfolio, 
    assets: PortfolioAsset[], 
    auditTrail: AuditTrail[]
  ): {
    baselIII: ReturnType<typeof ComplianceEngine.calculateBaselIIIMetrics>;
    mifidII: ReturnType<typeof ComplianceEngine.assessMiFIDIICompliance>;
    sox: ReturnType<typeof ComplianceEngine.assessSOXCompliance>;
    overallScore: number;
    overallStatus: 'compliant' | 'warning' | 'violation';
    executiveSummary: string;
    actionItems: string[];
  } {
    const baselIII = this.calculateBaselIIIMetrics(portfolio, assets);
    const mifidII = this.assessMiFIDIICompliance(portfolio, assets);
    const sox = this.assessSOXCompliance(auditTrail);
    
    // Calculate overall compliance score
    const scores = [
      baselIII.status === 'compliant' ? 100 : baselIII.status === 'warning' ? 75 : 25,
      mifidII.status === 'compliant' ? 100 : mifidII.status === 'warning' ? 75 : 25,
      sox.status === 'compliant' ? 100 : sox.status === 'warning' ? 75 : 25
    ];
    const overallScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    // Determine overall status
    let overallStatus: 'compliant' | 'warning' | 'violation' = 'compliant';
    if (overallScore < 60) {
      overallStatus = 'violation';
    } else if (overallScore < 80) {
      overallStatus = 'warning';
    }
    
    // Generate executive summary
    const violations = [baselIII, mifidII, sox].filter(result => result.status === 'violation').length;
    const warnings = [baselIII, mifidII, sox].filter(result => result.status === 'warning').length;
    
    let executiveSummary = `Portfolio compliance assessment completed. Overall score: ${overallScore.toFixed(1)}%. `;
    if (violations > 0) {
      executiveSummary += `${violations} regulatory violation(s) identified requiring immediate attention. `;
    }
    if (warnings > 0) {
      executiveSummary += `${warnings} warning(s) noted for management review. `;
    }
    if (violations === 0 && warnings === 0) {
      executiveSummary += "All regulatory frameworks show compliant status.";
    }
    
    // Compile action items
    const actionItems: string[] = [
      ...mifidII.recommendations,
      ...sox.findings
    ];
    
    if (baselIII.status !== 'compliant') {
      actionItems.push("Review capital adequacy and risk-weighted asset calculations");
    }
    
    return {
      baselIII,
      mifidII,
      sox,
      overallScore,
      overallStatus,
      executiveSummary,
      actionItems
    };
  }
  
  // Risk Limit Monitoring System
  static checkRiskLimits(
    portfolio: Portfolio, 
    assets: PortfolioAsset[], 
    limits: RiskLimit[]
  ): ComplianceCheck[] {
    const checks: ComplianceCheck[] = [];
    const totalValue = assets.reduce((sum, asset) => sum + parseFloat(asset.currentValue), 0);
    
    limits.forEach(limit => {
      let currentValue = 0;
      let status: 'compliant' | 'warning' | 'violation' = 'compliant';
      let details = '';
      
      switch (limit.limitType) {
        case 'concentration':
          // Check maximum single asset concentration
          const maxConcentration = Math.max(...assets.map(asset => 
            parseFloat(asset.currentValue) / totalValue
          )) * 100;
          currentValue = maxConcentration;
          
          if (currentValue > parseFloat(limit.limitValue)) {
            status = 'violation';
            details = `Maximum single asset concentration ${currentValue.toFixed(2)}% exceeds limit of ${limit.limitValue}%`;
          } else if (currentValue > parseFloat(limit.limitValue) * 0.8) {
            status = 'warning';
            details = `Concentration approaching limit: ${currentValue.toFixed(2)}% of ${limit.limitValue}%`;
          } else {
            details = `Concentration within limits: ${currentValue.toFixed(2)}% of ${limit.limitValue}%`;
          }
          break;
          
        case 'sector':
          // Check sector concentration
          const sectorExposure = this.calculateSectorExposure(assets);
          const maxSectorExposure = Math.max(...Object.values(sectorExposure));
          currentValue = maxSectorExposure;
          
          if (currentValue > parseFloat(limit.limitValue)) {
            status = 'violation';
            details = `Maximum sector exposure ${currentValue.toFixed(2)}% exceeds limit of ${limit.limitValue}%`;
          } else if (currentValue > parseFloat(limit.limitValue) * 0.8) {
            status = 'warning';
            details = `Sector exposure approaching limit: ${currentValue.toFixed(2)}% of ${limit.limitValue}%`;
          } else {
            details = `Sector exposure within limits: ${currentValue.toFixed(2)}% of ${limit.limitValue}%`;
          }
          break;
          
        case 'var':
          // Value at Risk check
          const portfolioVaR = this.calculatePortfolioVaR(assets, totalValue);
          currentValue = portfolioVaR;
          
          if (currentValue > parseFloat(limit.limitValue)) {
            status = 'violation';
            details = `Portfolio VaR ${currentValue.toFixed(2)} exceeds limit of ${limit.limitValue}`;
          } else if (currentValue > parseFloat(limit.limitValue) * 0.8) {
            status = 'warning';
            details = `VaR approaching limit: ${currentValue.toFixed(2)} of ${limit.limitValue}`;
          } else {
            details = `VaR within limits: ${currentValue.toFixed(2)} of ${limit.limitValue}`;
          }
          break;
      }
      
      checks.push({
        id: 0, // Will be set by database
        frameworkId: 1, // Default framework
        userId: portfolio.userId,
        portfolioId: portfolio.id,
        checkType: limit.limitType,
        status,
        details,
        threshold: limit.limitValue,
        currentValue: currentValue.toString(),
        lastChecked: new Date(),
        nextCheckDue: new Date(Date.now() + 24 * 60 * 60 * 1000) // Next day
      });
    });
    
    return checks;
  }
  
  private static calculateSectorExposure(assets: PortfolioAsset[]): Record<string, number> {
    const totalValue = assets.reduce((sum, asset) => sum + parseFloat(asset.currentValue), 0);
    const sectorMap: Record<string, number> = {};
    
    assets.forEach(asset => {
      const sector = this.mapAssetToSector(asset);
      const value = parseFloat(asset.currentValue);
      const percentage = (value / totalValue) * 100;
      
      sectorMap[sector] = (sectorMap[sector] || 0) + percentage;
    });
    
    return sectorMap;
  }
  
  private static mapAssetToSector(asset: PortfolioAsset): string {
    // Simplified sector mapping based on symbol patterns
    const symbol = asset.symbol.toUpperCase();
    
    if (['AAPL', 'MSFT', 'GOOGL', 'AMZN'].includes(symbol)) return 'Technology';
    if (['JPM', 'BAC', 'WFC', 'GS'].includes(symbol)) return 'Financial Services';
    if (['JNJ', 'PFE', 'UNH', 'ABBV'].includes(symbol)) return 'Healthcare';
    if (['XOM', 'CVX', 'COP', 'SLB'].includes(symbol)) return 'Energy';
    if (asset.assetType === 'Crypto') return 'Cryptocurrency';
    if (asset.assetType === 'Bond') return 'Fixed Income';
    
    return 'Other';
  }
  
  private static calculatePortfolioVaR(assets: PortfolioAsset[], totalValue: number): number {
    // Simplified VaR calculation (1-day, 95% confidence)
    const volatilities = assets.map(asset => {
      switch (asset.assetType.toLowerCase()) {
        case 'stock': return 0.02; // 2% daily volatility
        case 'crypto': return 0.05; // 5% daily volatility
        case 'bond': return 0.005; // 0.5% daily volatility
        default: return 0.015; // 1.5% default
      }
    });
    
    const weights = assets.map(asset => parseFloat(asset.currentValue) / totalValue);
    const portfolioVolatility = Math.sqrt(
      weights.reduce((sum, weight, i) => sum + (weight * weight * volatilities[i] * volatilities[i]), 0)
    );
    
    // 95% confidence VaR (1.645 standard deviations)
    return totalValue * portfolioVolatility * 1.645;
  }
}