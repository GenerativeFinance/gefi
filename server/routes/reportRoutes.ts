import { Router } from "express";
import { isAuthenticated } from "../multiAuth";

const router = Router();

// Report data structure
interface ReportData {
  id: string;
  name: string;
  type: string;
  status: 'generating' | 'ready' | 'failed';
  createdAt: string;
  lastUpdated: string;
  downloadCount: number;
  visualizations: string[];
  layout: 'portrait' | 'landscape';
  period: string;
  content: {
    includeCharts: boolean;
    includeTables: boolean;
    includeRecommendations: boolean;
    customSections?: string;
  };
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  defaultVisualizations: string[];
  sections: string[];
  sampleData: any;
}

// Sample report templates
const reportTemplates: ReportTemplate[] = [
  {
    id: "monthly-performance",
    name: "Monthly AI Performance Review",
    description: "AI-driven investment performance metrics and analysis",
    type: "performance",
    defaultVisualizations: ["line-chart", "bar-chart", "table"],
    sections: ["executive-summary", "performance-metrics", "ai-insights", "recommendations"],
    sampleData: {
      totalReturn: 12.5,
      accuracy: 85.3,
      sharpeRatio: 1.45,
      maxDrawdown: -8.2,
      monthlyReturns: [2.1, 1.8, -0.5, 3.2, 2.7, 1.9],
      topPerformers: ["AAPL", "MSFT", "GOOGL"],
      aiPredictions: {
        nextMonthReturn: 2.8,
        confidence: 78.5,
        riskLevel: "Medium"
      }
    }
  },
  {
    id: "risk-compliance",
    name: "Risk & Compliance Analysis",
    description: "Risk assessments, compliance status, and mitigation strategies",
    type: "risk",
    defaultVisualizations: ["heatmap", "bar-chart", "table"],
    sections: ["risk-overview", "compliance-status", "mitigation-strategies", "recommendations"],
    sampleData: {
      overallRiskScore: 6.2,
      complianceRate: 98.5,
      riskCategories: {
        market: 7.1,
        credit: 5.8,
        operational: 4.9,
        liquidity: 6.5
      },
      complianceChecks: {
        passed: 127,
        failed: 2,
        pending: 5
      },
      mitigationActions: [
        "Diversify portfolio allocation",
        "Implement stop-loss orders",
        "Review credit exposure"
      ]
    }
  },
  {
    id: "portfolio-optimization",
    name: "Portfolio Optimization",
    description: "Asset allocation recommendations and rebalancing strategies",
    type: "portfolio",
    defaultVisualizations: ["pie-chart", "scatter-plot", "table"],
    sections: ["current-allocation", "recommended-changes", "expected-outcomes", "implementation"],
    sampleData: {
      currentAllocation: {
        stocks: 65,
        bonds: 25,
        crypto: 8,
        cash: 2
      },
      recommendedAllocation: {
        stocks: 70,
        bonds: 20,
        crypto: 7,
        cash: 3
      },
      expectedImprovement: {
        returnIncrease: 1.8,
        riskReduction: 0.5,
        sharpeImprovement: 0.12
      },
      rebalancingCost: 125.50
    }
  }
];

// Sample generated reports
let generatedReports: ReportData[] = [
  {
    id: "report-1",
    name: "Monthly AI Performance Review",
    type: "performance",
    status: "ready",
    createdAt: "2025-01-15T00:00:00Z",
    lastUpdated: "2025-01-15T00:00:00Z",
    downloadCount: 1250,
    visualizations: ["line-chart", "bar-chart", "table"],
    layout: "portrait",
    period: "monthly",
    content: {
      includeCharts: true,
      includeTables: true,
      includeRecommendations: true
    }
  },
  {
    id: "report-2",
    name: "Risk & Compliance Analysis",
    type: "risk",
    status: "ready",
    createdAt: "2025-01-14T00:00:00Z",
    lastUpdated: "2025-01-14T00:00:00Z",
    downloadCount: 890,
    visualizations: ["heatmap", "bar-chart", "table"],
    layout: "landscape",
    period: "daily",
    content: {
      includeCharts: true,
      includeTables: true,
      includeRecommendations: true
    }
  }
];

// Get all available reports
router.get("/reports", isAuthenticated, (req, res) => {
  try {
    res.json({
      success: true,
      data: generatedReports
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch reports"
    });
  }
});

// Get report templates
router.get("/reports/templates", isAuthenticated, (req, res) => {
  try {
    res.json({
      success: true,
      data: reportTemplates
    });
  } catch (error) {
    console.error("Error fetching report templates:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch report templates"
    });
  }
});

// Get specific report details
router.get("/reports/:reportId", isAuthenticated, (req, res) => {
  try {
    const { reportId } = req.params;
    const report = generatedReports.find(r => r.id === reportId);
    
    if (!report) {
      return res.status(404).json({
        success: false,
        error: "Report not found"
      });
    }

    // Get template data for additional context
    const template = reportTemplates.find(t => t.type === report.type);
    
    res.json({
      success: true,
      data: {
        ...report,
        templateData: template?.sampleData || {}
      }
    });
  } catch (error) {
    console.error("Error fetching report details:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch report details"
    });
  }
});

// Test endpoint without auth for debugging
router.post("/reports/test-generate", (req, res) => {
  try {
    const {
      name,
      type,
      visualizations = [],
      layout = "portrait",
      period = "monthly",
      includeCharts = true,
      includeTables = true,
      includeRecommendations = true,
      customSections = ""
    } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        error: "Report name and type are required"
      });
    }

    const newReport = {
      id: `report-test-${Date.now()}`,
      name,
      type,
      status: "ready",
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      downloadCount: 0,
      visualizations,
      layout,
      period,
      content: {
        includeCharts,
        includeTables,
        includeRecommendations,
        customSections
      }
    };

    res.json({
      success: true,
      data: newReport,
      message: "Test report generated successfully"
    });
  } catch (error) {
    console.error("Error generating test report:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate test report"
    });
  }
});

// Generate new report
router.post("/reports/generate", isAuthenticated, (req, res) => {
  try {
    const {
      name,
      type,
      visualizations = [],
      layout = "portrait",
      period = "monthly",
      includeCharts = true,
      includeTables = true,
      includeRecommendations = true,
      customSections = ""
    } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        error: "Report name and type are required"
      });
    }

    const newReport: ReportData = {
      id: `report-${Date.now()}`,
      name,
      type,
      status: "generating",
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      downloadCount: 0,
      visualizations,
      layout,
      period,
      content: {
        includeCharts,
        includeTables,
        includeRecommendations,
        customSections
      }
    };

    generatedReports.push(newReport);

    // Simulate report generation (in reality, this would trigger a background job)
    setTimeout(() => {
      const reportIndex = generatedReports.findIndex(r => r.id === newReport.id);
      if (reportIndex !== -1) {
        generatedReports[reportIndex].status = "ready";
        generatedReports[reportIndex].lastUpdated = new Date().toISOString();
      }
    }, 3000);

    res.json({
      success: true,
      data: newReport,
      message: "Report generation started"
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate report"
    });
  }
});

// Download report (simulate PDF generation)
router.get("/reports/:reportId/download", isAuthenticated, (req, res) => {
  try {
    const { reportId } = req.params;
    const { format = "pdf" } = req.query;
    
    const report = generatedReports.find(r => r.id === reportId);
    
    if (!report) {
      return res.status(404).json({
        success: false,
        error: "Report not found"
      });
    }

    if (report.status !== "ready") {
      return res.status(400).json({
        success: false,
        error: "Report is not ready for download"
      });
    }

    // Increment download count
    report.downloadCount += 1;

    // In a real implementation, this would generate and return the actual file
    res.json({
      success: true,
      data: {
        downloadUrl: `/api/reports/${reportId}/file?format=${format}`,
        filename: `${report.name.replace(/\s+/g, '_')}.${format}`,
        size: "2.4 MB",
        format: format as string
      },
      message: "Report download prepared"
    });
  } catch (error) {
    console.error("Error downloading report:", error);
    res.status(500).json({
      success: false,
      error: "Failed to download report"
    });
  }
});

// Preview report data
router.get("/reports/:reportId/preview", isAuthenticated, (req, res) => {
  try {
    const { reportId } = req.params;
    const report = generatedReports.find(r => r.id === reportId);
    
    if (!report) {
      return res.status(404).json({
        success: false,
        error: "Report not found"
      });
    }

    const template = reportTemplates.find(t => t.type === report.type);
    
    res.json({
      success: true,
      data: {
        report,
        previewData: template?.sampleData || {},
        sections: template?.sections || []
      }
    });
  } catch (error) {
    console.error("Error previewing report:", error);
    res.status(500).json({
      success: false,
      error: "Failed to preview report"
    });
  }
});

// Delete report
router.delete("/reports/:reportId", isAuthenticated, (req, res) => {
  try {
    const { reportId } = req.params;
    const reportIndex = generatedReports.findIndex(r => r.id === reportId);
    
    if (reportIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Report not found"
      });
    }

    generatedReports.splice(reportIndex, 1);

    res.json({
      success: true,
      message: "Report deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete report"
    });
  }
});

// Get report statistics
router.get("/reports/stats/overview", isAuthenticated, (req, res) => {
  try {
    const totalReports = generatedReports.length;
    const totalDownloads = generatedReports.reduce((sum, report) => sum + report.downloadCount, 0);
    const readyReports = generatedReports.filter(r => r.status === "ready").length;
    const generatingReports = generatedReports.filter(r => r.status === "generating").length;

    const typeStats = generatedReports.reduce((stats, report) => {
      stats[report.type] = (stats[report.type] || 0) + 1;
      return stats;
    }, {} as Record<string, number>);

    res.json({
      success: true,
      data: {
        totalReports,
        totalDownloads,
        readyReports,
        generatingReports,
        typeDistribution: typeStats,
        averageDownloads: totalReports > 0 ? Math.round(totalDownloads / totalReports) : 0
      }
    });
  } catch (error) {
    console.error("Error fetching report statistics:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch report statistics"
    });
  }
});

export default router;