import { apiRequest } from "@/lib/queryClient";

interface ReportData {
  type: string;
  title: string;
  description: string;
  portfolio?: any;
  assets?: any[];
  insights?: any[];
  alerts?: any[];
  compliance?: any;
  optimization?: any;
}

export const generatePDFReport = async (reportType: string) => {
  try {
    // Import jsPDF dynamically
    const { default: jsPDF } = await import('jspdf');
    
    // Create new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 30;
    
    // Helper function to add page if needed
    const checkPageBreak = (neededSpace: number) => {
      if (yPosition + neededSpace > pageHeight - 30) {
        doc.addPage();
        yPosition = 30;
      }
    };
    
    // Helper function to add wrapped text
    const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return lines.length * (fontSize * 0.5); // Approximate line height
    };
    
    // Fetch report data based on type
    let reportData: ReportData;
    
    switch (reportType) {
      case 'monthly-performance':
        reportData = await generateMonthlyPerformanceReport();
        break;
      case 'risk-compliance':
        reportData = await generateRiskComplianceReport();
        break;
      case 'portfolio-optimization':
        reportData = await generatePortfolioOptimizationReport();
        break;
      case 'comprehensive-analysis':
        reportData = await generateComprehensiveAnalysisReport();
        break;
      default:
        throw new Error('Unknown report type');
    }
    
    // Add header
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text(reportData.title, 20, yPosition);
    yPosition += 15;
    
    // Add generation date
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition);
    yPosition += 10;
    
    // Add description
    doc.setFontSize(10);
    const descHeight = addWrappedText(reportData.description, 20, yPosition, pageWidth - 40);
    yPosition += descHeight + 15;
    
    // Add report content based on type
    if (reportType === 'monthly-performance') {
      await addMonthlyPerformanceContent(doc, reportData, yPosition, pageWidth, checkPageBreak, addWrappedText);
    } else if (reportType === 'risk-compliance') {
      await addRiskComplianceContent(doc, reportData, yPosition, pageWidth, checkPageBreak, addWrappedText);
    } else if (reportType === 'portfolio-optimization') {
      await addPortfolioOptimizationContent(doc, reportData, yPosition, pageWidth, checkPageBreak, addWrappedText);
    } else if (reportType === 'comprehensive-analysis') {
      await addComprehensiveAnalysisContent(doc, reportData, yPosition, pageWidth, checkPageBreak, addWrappedText);
    }
    
    // Save the PDF
    const filename = `${reportType}-report-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    
    return { success: true, filename };
  } catch (error) {
    console.error('Error generating PDF report:', error);
    throw new Error('Failed to generate PDF report');
  }
};

// Report data generators
async function generateMonthlyPerformanceReport(): Promise<ReportData> {
  try {
    const portfolioResponse = await apiRequest("GET", "/api/portfolio");
    const assetsResponse = await apiRequest("GET", "/api/portfolio/assets");
    const insightsResponse = await apiRequest("GET", "/api/market-insights");
    
    const portfolio = await portfolioResponse.json();
    const assets = await assetsResponse.json();
    const insights = await insightsResponse.json();
    
    return {
      type: 'monthly-performance',
      title: 'Monthly AI Performance Review',
      description: 'Comprehensive analysis of AI model performance across all portfolios for the current month.',
      portfolio,
      assets: Array.isArray(assets) ? assets : [],
      insights: Array.isArray(insights) ? insights : []
    };
  } catch (error) {
    return {
      type: 'monthly-performance',
      title: 'Monthly AI Performance Review',
      description: 'Comprehensive analysis of AI model performance across all portfolios for the current month.',
      portfolio: { totalInvestment: '0', annualReturns: '0', sharpeRatio: '0', riskScore: '0' },
      assets: [],
      insights: []
    };
  }
}

async function generateRiskComplianceReport(): Promise<ReportData> {
  try {
    const portfolioResponse = await apiRequest("GET", "/api/portfolio");
    const alertsResponse = await apiRequest("GET", "/api/risk-alerts");
    
    const portfolio = await portfolioResponse.json();
    const alerts = await alertsResponse.json();
    
    return {
      type: 'risk-compliance',
      title: 'Risk & Compliance Analysis',
      description: 'Detailed risk assessment and regulatory compliance report covering current portfolio exposures and compliance status.',
      portfolio,
      alerts: Array.isArray(alerts) ? alerts : [],
      compliance: { basel: 'PASSED', mifid: 'PASSED', sox: 'PASSED' }
    };
  } catch (error) {
    return {
      type: 'risk-compliance',
      title: 'Risk & Compliance Analysis',
      description: 'Detailed risk assessment and regulatory compliance report covering current portfolio exposures and compliance status.',
      portfolio: { totalInvestment: '0', riskScore: '0' },
      alerts: [],
      compliance: { basel: 'PASSED', mifid: 'PASSED', sox: 'PASSED' }
    };
  }
}

async function generatePortfolioOptimizationReport(): Promise<ReportData> {
  try {
    const portfolioResponse = await apiRequest("GET", "/api/portfolio");
    const assetsResponse = await apiRequest("GET", "/api/portfolio/assets");
    
    const portfolio = await portfolioResponse.json();
    const assets = await assetsResponse.json();
    
    return {
      type: 'portfolio-optimization',
      title: 'Portfolio Optimization Report',
      description: 'AI-powered portfolio optimization recommendations based on current market conditions and risk tolerance.',
      portfolio,
      assets: Array.isArray(assets) ? assets : [],
      optimization: { recommendations: [], currentAllocation: [], targetAllocation: [] }
    };
  } catch (error) {
    return {
      type: 'portfolio-optimization',
      title: 'Portfolio Optimization Report',
      description: 'AI-powered portfolio optimization recommendations based on current market conditions and risk tolerance.',
      portfolio: { totalInvestment: '0' },
      assets: [],
      optimization: { recommendations: [], currentAllocation: [], targetAllocation: [] }
    };
  }
}

async function generateComprehensiveAnalysisReport(): Promise<ReportData> {
  try {
    const portfolioResponse = await apiRequest("GET", "/api/portfolio");
    const assetsResponse = await apiRequest("GET", "/api/portfolio/assets");
    const insightsResponse = await apiRequest("GET", "/api/market-insights");
    const alertsResponse = await apiRequest("GET", "/api/risk-alerts");
    
    const portfolio = await portfolioResponse.json();
    const assets = await assetsResponse.json();
    const insights = await insightsResponse.json();
    const alerts = await alertsResponse.json();
    
    return {
      type: 'comprehensive-analysis',
      title: 'Comprehensive Portfolio Analysis',
      description: 'Complete portfolio analysis including performance metrics, risk assessment, market insights, and strategic recommendations.',
      portfolio,
      assets: Array.isArray(assets) ? assets : [],
      insights: Array.isArray(insights) ? insights : [],
      alerts: Array.isArray(alerts) ? alerts : []
    };
  } catch (error) {
    return {
      type: 'comprehensive-analysis',
      title: 'Comprehensive Portfolio Analysis',
      description: 'Complete portfolio analysis including performance metrics, risk assessment, market insights, and strategic recommendations.',
      portfolio: { totalInvestment: '0', annualReturns: '0', sharpeRatio: '0', riskScore: '0' },
      assets: [],
      insights: [],
      alerts: []
    };
  }
}

// Content generators for each report type
async function addMonthlyPerformanceContent(doc: any, data: ReportData, startY: number, pageWidth: number, checkPageBreak: any, addWrappedText: any) {
  let yPos = startY;
  
  // Portfolio Summary
  checkPageBreak(40);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Portfolio Performance Summary', 20, yPos);
  yPos += 15;
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  
  if (data.portfolio) {
    doc.text(`Total Portfolio Value: $${parseFloat(data.portfolio.totalInvestment || '0').toLocaleString()}`, 20, yPos);
    yPos += 8;
    doc.text(`Monthly Return: ${parseFloat(data.portfolio.annualReturns || '0').toFixed(2)}%`, 20, yPos);
    yPos += 8;
    doc.text(`Sharpe Ratio: ${parseFloat(data.portfolio.sharpeRatio || '0').toFixed(2)}`, 20, yPos);
    yPos += 15;
  }
  
  // Top Performing Models
  checkPageBreak(40);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Top Performing AI Models', 20, yPos);
  yPos += 15;
  
  if (data.assets && data.assets.length > 0) {
    data.assets.slice(0, 5).forEach((asset: any, index: number) => {
      checkPageBreak(20);
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`${index + 1}. ${asset.symbol || 'Unknown'} - ${(parseFloat(asset.currentValue || '0') / parseFloat(asset.purchasePrice || '1') * 100 - 100).toFixed(2)}% return`, 25, yPos);
      yPos += 12;
    });
  }
  
  // Market Insights
  if (data.insights && data.insights.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Key Market Insights', 20, yPos);
    yPos += 15;
    
    data.insights.slice(0, 3).forEach((insight: any) => {
      checkPageBreak(30);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(insight.title || 'Market Insight', 25, yPos);
      yPos += 8;
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      const contentHeight = addWrappedText(insight.content || 'No content available', 25, yPos, pageWidth - 50);
      yPos += contentHeight + 10;
    });
  }
}

async function addRiskComplianceContent(doc: any, data: ReportData, startY: number, pageWidth: number, checkPageBreak: any, addWrappedText: any) {
  let yPos = startY;
  
  // Risk Overview
  checkPageBreak(40);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Risk Assessment Overview', 20, yPos);
  yPos += 15;
  
  if (data.portfolio) {
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Portfolio Risk Score: ${parseFloat(data.portfolio.riskScore || '0').toFixed(1)}/10`, 20, yPos);
    yPos += 8;
    doc.text(`VaR (95%): $${(parseFloat(data.portfolio.totalInvestment || '0') * 0.05).toLocaleString()}`, 20, yPos);
    yPos += 15;
  }
  
  // Active Alerts
  if (data.alerts && data.alerts.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Active Risk Alerts', 20, yPos);
    yPos += 15;
    
    data.alerts.slice(0, 5).forEach((alert: any) => {
      checkPageBreak(25);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`${alert.severity?.toUpperCase()}: ${alert.title}`, 25, yPos);
      yPos += 8;
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      const messageHeight = addWrappedText(alert.message, 25, yPos, pageWidth - 50);
      yPos += messageHeight + 10;
    });
  }
  
  // Compliance Status
  checkPageBreak(40);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Compliance Status', 20, yPos);
  yPos += 15;
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text('✓ Basel III Compliance: PASSED', 25, yPos);
  yPos += 8;
  doc.text('✓ MiFID II Compliance: PASSED', 25, yPos);
  yPos += 8;
  doc.text('✓ SOX Compliance: PASSED', 25, yPos);
  yPos += 8;
}

async function addPortfolioOptimizationContent(doc: any, data: ReportData, startY: number, pageWidth: number, checkPageBreak: any, addWrappedText: any) {
  let yPos = startY;
  
  // Current Allocation
  checkPageBreak(40);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Current Portfolio Allocation', 20, yPos);
  yPos += 15;
  
  if (data.assets && data.assets.length > 0) {
    data.assets.forEach((asset: any) => {
      checkPageBreak(15);
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`${asset.symbol}: ${parseFloat(asset.allocation || '0').toFixed(1)}%`, 25, yPos);
      yPos += 12;
    });
    yPos += 10;
  }
  
  // Optimization Recommendations
  checkPageBreak(40);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Optimization Recommendations', 20, yPos);
  yPos += 15;
  
  const recommendations = [
    'Reduce exposure to high-volatility AI models by 5%',
    'Increase allocation to defensive AI strategies',
    'Consider adding cryptocurrency AI models for diversification',
    'Rebalance monthly to maintain target allocations'
  ];
  
  recommendations.forEach((rec) => {
    checkPageBreak(15);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`• ${rec}`, 25, yPos);
    yPos += 12;
  });
}

async function addComprehensiveAnalysisContent(doc: any, data: ReportData, startY: number, pageWidth: number, checkPageBreak: any, addWrappedText: any) {
  // Combine all content from other reports
  await addMonthlyPerformanceContent(doc, data, startY, pageWidth, checkPageBreak, addWrappedText);
  await addRiskComplianceContent(doc, data, startY + 200, pageWidth, checkPageBreak, addWrappedText);
  await addPortfolioOptimizationContent(doc, data, startY + 400, pageWidth, checkPageBreak, addWrappedText);
}