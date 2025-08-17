import type { Express } from "express";
import path from 'path';
import fs from 'fs/promises';
import { processReportJob } from '../workers/reportGenerator';
import { nanoid } from 'nanoid';

export function registerReportRoutes(app: Express): void {
  console.log("📄 Registering Report APIs...");

  // Generate a new report
  app.post("/api/reports/generate", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { type, title, data, templateId = 'executive-report', options = {} } = req.body;
      
      if (!type || !title || !data) {
        return res.status(400).json({ 
          message: "Missing required fields: type, title, data" 
        });
      }

      const reportId = nanoid();
      
      // Process the report in the background
      const result = await processReportJob({
        reportId,
        templateId,
        data: {
          ...data,
          reportName: title,
          generatedAt: new Date().toLocaleDateString(),
          dateRange: data.dateRange || {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            end: new Date().toLocaleDateString()
          }
        },
        options
      });

      if (result.success) {
        res.json({
          reportId,
          status: 'completed',
          pdfUrl: result.pdfUrl,
          message: 'Report generated successfully'
        });
      } else {
        res.status(500).json({
          reportId,
          status: 'failed',
          error: result.error,
          message: 'Report generation failed'
        });
      }
    } catch (error) {
      console.error('Report generation request failed:', error);
      res.status(500).json({ 
        message: 'Internal server error',
        error: (error as Error).message 
      });
    }
  });

  // Download a generated report
  app.get("/api/reports/:reportId/download", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { reportId } = req.params;
      const pdfPath = path.join('/tmp', `report-${reportId}.pdf`);
      
      // Check if file exists
      try {
        await fs.access(pdfPath);
      } catch {
        return res.status(404).json({ message: "Report not found" });
      }

      // Set headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="report-${reportId}.pdf"`);
      
      // Stream the file
      const fileBuffer = await fs.readFile(pdfPath);
      res.send(fileBuffer);
    } catch (error) {
      console.error('Report download failed:', error);
      res.status(500).json({ 
        message: 'Failed to download report',
        error: (error as Error).message 
      });
    }
  });

  // Get report status
  app.get("/api/reports/:reportId/status", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { reportId } = req.params;
      const pdfPath = path.join('/tmp', `report-${reportId}.pdf`);
      
      // Check if file exists
      try {
        await fs.access(pdfPath);
        res.json({
          reportId,
          status: 'completed',
          pdfUrl: `/api/reports/${reportId}/download`
        });
      } catch {
        res.json({
          reportId,
          status: 'not_found'
        });
      }
    } catch (error) {
      console.error('Report status check failed:', error);
      res.status(500).json({ 
        message: 'Failed to check report status',
        error: (error as Error).message 
      });
    }
  });
}