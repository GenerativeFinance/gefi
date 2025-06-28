import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { AiModel } from '@shared/schema';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface ExportData {
  models: AiModel[];
  portfolioData?: any;
  reportData?: any;
}

export const exportToCSV = (data: ExportData, filename: string = 'gefi_export') => {
  const { models, portfolioData, reportData } = data;
  
  // Prepare CSV data
  const csvData = models.map(model => ({
    'Model Name': model.name,
    'Description': model.description,
    'Category': model.categoryId, // This could be enhanced to show category name
    'Price': `$${model.price}`,
    'Risk Level': model.riskLevel,
    'AI Technique': model.aiTechnique,
    'Target User Type': model.targetUserType,
    'Financial Instrument': model.financialInstrument,
    'Accuracy Score': `${model.accuracyScore}%`,
    'Backtesting Period': model.backtestingPeriod,
    'Model Size': model.modelSize,
    'Created Date': new Date(model.createdAt).toLocaleDateString(),
    'Updated Date': new Date(model.updatedAt).toLocaleDateString()
  }));

  // Include portfolio data if available
  if (portfolioData) {
    csvData.forEach((row, index) => {
      if (portfolioData[index]) {
        row['Portfolio Value'] = portfolioData[index].value || 'N/A';
        row['Portfolio Weight'] = portfolioData[index].weight || 'N/A';
      }
    });
  }

  // Convert to CSV
  const csv = Papa.unparse(csvData);
  
  // Download CSV file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportToPDF = (data: ExportData, filename: string = 'gefi_report') => {
  const { models, portfolioData, reportData } = data;
  
  // Create new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('GeFi Platform Export Report', 20, 20);
  
  // Add generation date
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
  
  // Add summary statistics
  let yPosition = 50;
  doc.setFontSize(14);
  doc.text('Summary Statistics', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.text(`Total Models: ${models.length}`, 20, yPosition);
  yPosition += 8;
  
  const avgPrice = models.reduce((sum, model) => sum + model.price, 0) / models.length;
  doc.text(`Average Model Price: $${avgPrice.toFixed(2)}`, 20, yPosition);
  yPosition += 8;
  
  const avgAccuracy = models.reduce((sum, model) => sum + model.accuracyScore, 0) / models.length;
  doc.text(`Average Accuracy Score: ${avgAccuracy.toFixed(1)}%`, 20, yPosition);
  yPosition += 15;
  
  // Prepare table data
  const tableData = models.map(model => [
    model.name,
    model.riskLevel,
    `$${model.price}`,
    `${model.accuracyScore}%`,
    model.aiTechnique,
    new Date(model.createdAt).toLocaleDateString()
  ]);
  
  // Add table
  doc.autoTable({
    head: [['Model Name', 'Risk Level', 'Price', 'Accuracy', 'AI Technique', 'Created']],
    body: tableData,
    startY: yPosition,
    styles: {
      fontSize: 8,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [63, 81, 181], // Primary color
      textColor: 255
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    }
  });
  
  // Add portfolio data if available
  if (portfolioData && portfolioData.length > 0) {
    const finalY = doc.lastAutoTable?.finalY || yPosition + 100;
    
    doc.setFontSize(14);
    doc.text('Portfolio Performance', 20, finalY + 20);
    
    doc.autoTable({
      head: [['Metric', 'Value']],
      body: [
        ['Total Investment', `$${portfolioData.totalInvestment || 'N/A'}`],
        ['Current Value', `$${portfolioData.currentValue || 'N/A'}`],
        ['Total Return', `${portfolioData.totalReturn || 'N/A'}%`],
        ['Risk Score', portfolioData.riskScore || 'N/A'],
        ['Last Updated', new Date().toLocaleDateString()]
      ],
      startY: finalY + 30,
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [63, 81, 181],
        textColor: 255
      }
    });
  }
  
  // Save the PDF
  doc.save(`${filename}.pdf`);
};

// Generate sample data for demonstration
export const generateSampleExportData = (models: AiModel[]): ExportData => {
  const portfolioData = models.map((model, index) => ({
    value: Math.floor(Math.random() * 50000) + 10000,
    weight: Math.floor(Math.random() * 30) + 5,
    performance: (Math.random() * 20 - 10).toFixed(2) // -10% to +10%
  }));
  
  const reportData = {
    totalInvestment: 250000,
    currentValue: 267500,
    totalReturn: 7.0,
    riskScore: 6.2,
    topPerformer: models[0]?.name || 'N/A',
    recommendations: [
      'Consider diversifying AI model allocation',
      'Monitor risk exposure in volatile markets',
      'Regular rebalancing recommended'
    ]
  };
  
  return {
    models,
    portfolioData,
    reportData
  };
};