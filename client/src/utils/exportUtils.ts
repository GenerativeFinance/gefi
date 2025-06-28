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
  
  // Prepare CSV data with proper null checks
  const csvData = models.map(model => ({
    'Model Name': model.name,
    'Description': model.description || 'N/A',
    'Category': model.category || 'N/A',
    'Price': `$${model.price || '0'}`,
    'Rating': model.rating ? `${model.rating}/5` : 'Not rated',
    'Total Ratings': model.totalRatings || 0,
    'Creator': model.creator || 'Unknown',
    'Risk Level': model.riskLevel || 'Not specified',
    'AI Technique': model.aiTechnique || 'Not specified',
    'Target User Type': model.targetUserType || 'Not specified',
    'Financial Instrument': model.financialInstrument || 'Not specified',
    'Min Investment': model.minInvestment ? `$${model.minInvestment}` : 'Not specified',
    'Is Featured': model.isFeatured ? 'Yes' : 'No',
    'Created Date': model.createdAt ? new Date(model.createdAt).toLocaleDateString() : 'N/A',
    'Updated Date': model.updatedAt ? new Date(model.updatedAt).toLocaleDateString() : 'N/A'
  }));

  // Include portfolio data if available  
  if (portfolioData) {
    csvData.forEach((row: any, index) => {
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

export const exportToPDF = async (data: ExportData, filename: string = 'gefi_report') => {
  const { models, portfolioData, reportData } = data;
  
  try {
    // Import jsPDF dynamically
    const { default: jsPDF } = await import('jspdf');
    
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
    
    const avgPrice = models.reduce((sum, model) => sum + parseFloat(model.price || '0'), 0) / models.length;
    doc.text(`Average Model Price: $${avgPrice.toFixed(2)}`, 20, yPosition);
    yPosition += 8;
    
    const avgRating = models.reduce((sum, model) => sum + parseFloat(model.rating || '0'), 0) / models.length;
    doc.text(`Average Rating: ${avgRating.toFixed(1)}/5`, 20, yPosition);
    yPosition += 15;
    
    // Add model details - simplified table without autoTable dependency
    doc.setFontSize(14);
    doc.text('Model Details', 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(10);
    models.slice(0, 10).forEach((model, index) => { // Limit to 10 models for PDF space
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }
      
      doc.text(`${index + 1}. ${model.name}`, 20, yPosition);
      yPosition += 8;
      doc.text(`   Risk Level: ${model.riskLevel || 'N/A'} | Price: $${model.price || '0'} | Rating: ${model.rating || 'N/A'}/5`, 25, yPosition);
      yPosition += 8;
      doc.text(`   AI Technique: ${model.aiTechnique || 'N/A'}`, 25, yPosition);
      yPosition += 12;
    });
    
    if (models.length > 10) {
      doc.text(`... and ${models.length - 10} more models`, 20, yPosition);
    }
    
    // Save the PDF
    doc.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
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