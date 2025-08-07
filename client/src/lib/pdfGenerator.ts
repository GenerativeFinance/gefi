import jsPDF from "jspdf";
import "jspdf-autotable";

// Extend jsPDF type to include autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface ReportData {
  id: string;
  name: string;
  type: string;
  status: string;
  lastUpdated: string;
  description?: string;
  data?: any;
}

export interface PDFCustomizations {
  layout?: 'portrait' | 'landscape';
  includeCharts?: boolean;
  includeTables?: boolean;
  includeRecommendations?: boolean;
  visualizations?: string[];
  period?: string;
  customSections?: string;
}

export class PDFReportGenerator {
  private doc: jsPDF;
  private yPosition: number = 70;
  private readonly margin = 20;
  private readonly pageWidth: number;
  private readonly pageHeight: number;

  constructor(orientation: 'portrait' | 'landscape' = 'portrait') {
    this.doc = new jsPDF(orientation);
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
  }

  public generateReport(report: ReportData, customizations: PDFCustomizations = {}): jsPDF {
    this.addHeader(report);
    this.addExecutiveSummary(report);
    
    if (customizations.includeTables !== false) {
      this.addKeyMetrics(report);
    }
    
    this.addPerformanceAnalysis(report);
    
    if (customizations.includeRecommendations !== false) {
      this.addRecommendations(report);
    }
    
    if (customizations.customSections) {
      this.addCustomSection(customizations.customSections);
    }
    
    this.addFooter(report);
    
    return this.doc;
  }

  private addHeader(report: ReportData): void {
    // Company Logo Area (placeholder)
    this.doc.setFillColor(59, 130, 246);
    this.doc.rect(this.margin, 15, 30, 10, 'F');
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(8);
    this.doc.text('GeFi', this.margin + 2, 22);
    
    // Report Title
    this.doc.setFontSize(24);
    this.doc.setTextColor(59, 130, 246);
    this.doc.text(report.name, this.margin, 40);
    
    // Date and Status
    this.doc.setFontSize(11);
    this.doc.setTextColor(100, 100, 100);
    this.doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`, this.margin, 50);
    
    this.doc.setFontSize(10);
    this.doc.setTextColor(34, 197, 94);
    this.doc.text(`Status: ${report.status.toUpperCase()}`, this.margin, 58);
    
    // Add a horizontal line
    this.doc.setDrawColor(230, 230, 230);
    this.doc.line(this.margin, 65, this.pageWidth - this.margin, 65);
    
    this.yPosition = 80;
  }

  private addExecutiveSummary(report: ReportData): void {
    this.addSectionHeader('Executive Summary');
    
    const summaryText = this.getExecutiveSummary(report);
    this.addWrappedText(summaryText, 10);
    this.yPosition += 15;
  }

  private addKeyMetrics(report: ReportData): void {
    this.checkPageBreak(80);
    this.addSectionHeader('Key Performance Metrics');
    
    const tableData = this.getMetricsData(report);
    
    try {
      this.doc.autoTable({
        head: [tableData.headers],
        body: tableData.rows,
        startY: this.yPosition,
        theme: 'striped',
        headStyles: { 
          fillColor: [59, 130, 246],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        styles: { 
          fontSize: 9,
          cellPadding: 3
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        margin: { left: this.margin, right: this.margin }
      });
      
      this.yPosition = (this.doc as any).lastAutoTable.finalY + 15;
    } catch (error) {
      console.warn('AutoTable not available, using basic table');
      this.addBasicTable(tableData);
    }
  }

  private addPerformanceAnalysis(report: ReportData): void {
    this.checkPageBreak(60);
    this.addSectionHeader('Performance Analysis');
    
    const analysisText = this.getPerformanceAnalysis(report);
    this.addWrappedText(analysisText, 10);
    this.yPosition += 15;
  }

  private addRecommendations(report: ReportData): void {
    this.checkPageBreak(60);
    this.addSectionHeader('AI-Powered Recommendations');
    
    const recommendations = this.getRecommendations(report);
    recommendations.forEach((rec, index) => {
      this.checkPageBreak(15);
      this.doc.setFontSize(10);
      this.doc.setTextColor(59, 130, 246);
      this.doc.text(`${index + 1}.`, this.margin, this.yPosition);
      
      this.doc.setTextColor(60, 60, 60);
      const wrappedRec = this.doc.splitTextToSize(rec, this.pageWidth - this.margin - 30);
      this.doc.text(wrappedRec, this.margin + 10, this.yPosition);
      this.yPosition += wrappedRec.length * 5 + 3;
    });
    
    this.yPosition += 10;
  }

  private addCustomSection(content: string): void {
    this.checkPageBreak(40);
    this.addSectionHeader('Additional Analysis');
    this.addWrappedText(content, 10);
    this.yPosition += 15;
  }

  private addFooter(report: ReportData): void {
    // Add footer on last page
    this.doc.setFontSize(8);
    this.doc.setTextColor(150, 150, 150);
    
    const footerY = this.pageHeight - 25;
    this.doc.text('Generated by GeFi AI Financial Platform', this.margin, footerY);
    this.doc.text(`Report ID: ${report.id}`, this.margin, footerY + 8);
    this.doc.text('Confidential - For authorized use only', this.margin, footerY + 16);
    
    // Add page number
    const pageNumber = `Page ${this.doc.getNumberOfPages()}`;
    const textWidth = this.doc.getTextWidth(pageNumber);
    this.doc.text(pageNumber, this.pageWidth - this.margin - textWidth, footerY);
  }

  private addSectionHeader(title: string): void {
    this.doc.setFontSize(16);
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(title, this.margin, this.yPosition);
    this.doc.setFont("helvetica", "normal");
    this.yPosition += 20;
  }

  private addWrappedText(text: string, fontSize: number): void {
    this.doc.setFontSize(fontSize);
    this.doc.setTextColor(60, 60, 60);
    const wrappedText = this.doc.splitTextToSize(text, this.pageWidth - (this.margin * 2));
    this.doc.text(wrappedText, this.margin, this.yPosition);
    this.yPosition += wrappedText.length * (fontSize * 0.6) + 5;
  }

  private checkPageBreak(requiredSpace: number): void {
    if (this.yPosition + requiredSpace > this.pageHeight - 40) {
      this.doc.addPage();
      this.yPosition = 30;
    }
  }

  private addBasicTable(tableData: { headers: string[], rows: string[][] }): void {
    this.doc.setFontSize(9);
    this.doc.setTextColor(0, 0, 0);
    
    // Headers
    let xPos = this.margin;
    const colWidth = (this.pageWidth - (this.margin * 2)) / tableData.headers.length;
    
    tableData.headers.forEach(header => {
      this.doc.text(header, xPos, this.yPosition);
      xPos += colWidth;
    });
    
    this.yPosition += 15;
    
    // Rows
    tableData.rows.forEach(row => {
      xPos = this.margin;
      row.forEach(cell => {
        this.doc.text(cell, xPos, this.yPosition);
        xPos += colWidth;
      });
      this.yPosition += 12;
    });
    
    this.yPosition += 10;
  }

  private getExecutiveSummary(report: ReportData): string {
    return `This ${report.name.toLowerCase()} provides comprehensive insights into your investment performance, risk metrics, and strategic recommendations based on AI-powered analysis. The report covers key performance indicators, market trends, and actionable recommendations to optimize your portfolio allocation and risk management strategy.`;
  }

  private getMetricsData(report: ReportData): { headers: string[], rows: string[][] } {
    return {
      headers: ['Metric', 'Current Value', 'Previous Period', 'Change'],
      rows: [
        ['Total Return', '12.5%', '10.2%', '+2.3%'],
        ['AI Prediction Accuracy', '85.3%', '84.1%', '+1.2%'],
        ['Sharpe Ratio', '1.45', '1.30', '+0.15'],
        ['Maximum Drawdown', '-8.2%', '-8.7%', '+0.5%'],
        ['Portfolio Beta', '0.92', '0.95', '-0.03'],
        ['Information Ratio', '1.23', '1.18', '+0.05']
      ]
    };
  }

  private getPerformanceAnalysis(report: ReportData): string {
    return `Your portfolio has demonstrated strong performance this period with AI-driven strategies contributing to above-market returns. The artificial intelligence models have maintained high prediction accuracy while effectively managing risk exposure. Key highlights include improved Sharpe ratio indicating better risk-adjusted returns, reduced maximum drawdown showing enhanced downside protection, and consistent outperformance across multiple asset classes. The portfolio's beta coefficient suggests appropriate market exposure aligned with your risk tolerance.`;
  }

  private getRecommendations(report: ReportData): string[] {
    return [
      'Consider increasing allocation to technology sector based on AI sentiment analysis showing positive momentum',
      'Implement dynamic hedging strategy to protect against identified tail risks in emerging markets',
      'Rebalance fixed income allocation to take advantage of interest rate volatility predictions',
      'Explore ESG-focused investments showing strong AI-predicted performance correlation',
      'Monitor cryptocurrency exposure as models indicate potential volatility increase'
    ];
  }
}

export function generatePDFReport(report: ReportData, customizations: PDFCustomizations = {}): jsPDF {
  const generator = new PDFReportGenerator(customizations.layout);
  return generator.generateReport(report, customizations);
}