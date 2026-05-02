import { apiRequest } from "./queryClient";

export type ReportTemplate = "performance" | "risk" | "compliance" | "custom";

export interface ReportInput {
  title?: string;
  period?: string;
  summary?: string;
  metrics?: Array<{ label: string; value: string; color?: string }>;
  sections?: Array<{ heading: string; body: string }>;
  charts?: Array<{ title: string; type: string; data: any }>;
}

export interface ReportMetadata {
  id: string;
  template: ReportTemplate;
  title: string;
  filename: string;
  size: number;
  createdAt: string;
  createdBy?: string;
  status: "processing" | "completed" | "failed";
  error?: string;
}

export interface GenerateReportResponse {
  success: boolean;
  id: string;
  status: string;
  title: string;
  downloadUrl: string;
  metadata: ReportMetadata;
  error?: string;
  details?: string;
}

/**
 * Generate a report PDF from template and input data
 */
export async function generateReport(
  template: ReportTemplate,
  input: ReportInput
): Promise<GenerateReportResponse> {
  const response = await apiRequest("POST", "/api/reports/generate", {
    template,
    input
  }) as GenerateReportResponse;

  if (!response.success) {
    throw new Error(response.error || "Failed to generate report");
  }

  return response;
}

/**
 * Get report status and metadata
 */
export async function getReportStatus(id: string): Promise<{ id: string; status: string; metadata: ReportMetadata }> {
  return await apiRequest("GET", `/api/reports/${id}/status`) as { id: string; status: string; metadata: ReportMetadata };
}

/**
 * Get download URL for a completed report
 */
export function getReportDownloadUrl(id: string): string {
  return `/api/reports/${id}/download`;
}

/**
 * List all generated reports
 */
export async function listReports(): Promise<ReportMetadata[]> {
  return await apiRequest("GET", "/api/reports") as ReportMetadata[];
}

/**
 * Delete a report
 */
export async function deleteReport(id: string): Promise<{ success: boolean; message: string }> {
  return await apiRequest("DELETE", `/api/reports/${id}`) as { success: boolean; message: string };
}

/**
 * Get available report templates with their required fields
 */
export async function getReportTemplates() {
  return await apiRequest("GET", "/api/reports/templates") as any;
}

/**
 * Trigger download of a completed report
 */
export function downloadReport(id: string, filename?: string) {
  const url = getReportDownloadUrl(id);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || `report-${id}.pdf`;
  link.click();
}

/**
 * Helper to extract report data from different page types
 */
export class ReportDataExtractor {
  
  static extractPerformanceData(pageData: any): ReportInput {
    return {
      title: "Portfolio Performance Report",
      period: pageData.period || "Last 30 Days",
      summary: "Comprehensive analysis of portfolio performance, returns, and key metrics.",
      metrics: [
        { label: "Total Portfolio Value", value: pageData.totalValue || "$0", color: "good" },
        { label: "Total Return", value: pageData.totalReturn || "0%", color: pageData.totalReturn?.includes("+") ? "good" : "bad" },
        { label: "Monthly Return", value: pageData.monthlyReturn || "0%", color: pageData.monthlyReturn?.includes("+") ? "good" : "bad" },
        { label: "Benchmark Comparison", value: pageData.benchmark || "0%", color: pageData.benchmark?.includes("+") ? "good" : "bad" }
      ],
      sections: [
        {
          heading: "Performance Overview",
          body: "Portfolio demonstrates consistent growth with diversified asset allocation and risk-adjusted returns."
        },
        {
          heading: "Key Holdings",
          body: pageData.holdings || "Top performing assets contributing to overall portfolio growth."
        }
      ]
    };
  }

  static extractRiskData(pageData: any): ReportInput {
    return {
      title: "Risk Assessment Report",
      period: pageData.period || "Current Assessment",
      summary: "Detailed risk analysis covering portfolio exposure, stress testing, and compliance metrics.",
      metrics: [
        { label: "Portfolio VaR", value: pageData.var || "$0", color: "warn" },
        { label: "Risk Score", value: pageData.riskScore || "0/100", color: pageData.riskScore > 70 ? "good" : "warn" },
        { label: "Critical Issues", value: pageData.critical || "0", color: pageData.critical > 0 ? "bad" : "good" },
        { label: "Total Risk Reports", value: pageData.totalReports || "0", color: "good" }
      ],
      sections: [
        {
          heading: "Risk Assessment Summary",
          body: "Comprehensive evaluation of portfolio risk factors and exposure levels across all asset classes."
        },
        {
          heading: "Stress Test Results",
          body: pageData.stressTest || "Portfolio shows resilience under adverse market conditions."
        }
      ]
    };
  }

  static extractComplianceData(pageData: any): ReportInput {
    return {
      title: "Compliance Report",
      period: pageData.period || "Current Status",
      summary: "Regulatory compliance assessment covering all operational requirements and audit findings.",
      metrics: [
        { label: "Compliance Rate", value: pageData.complianceRate || "0%", color: pageData.complianceRate > 80 ? "good" : "warn" },
        { label: "Total Reports", value: pageData.totalReports || "0", color: "good" },
        { label: "Violations", value: pageData.violations || "0", color: pageData.violations > 0 ? "bad" : "good" },
        { label: "Warnings", value: pageData.warnings || "0", color: pageData.warnings > 0 ? "warn" : "good" }
      ],
      sections: [
        {
          heading: "Compliance Overview",
          body: "Assessment of adherence to regulatory requirements and internal policies."
        },
        {
          heading: "Audit Findings",
          body: pageData.auditFindings || "No significant issues identified in current assessment period."
        }
      ]
    };
  }
}