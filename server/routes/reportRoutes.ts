import type { Express } from "express";
import path from 'path';
import fs from 'fs/promises';
import { processReportJob } from '../workers/reportGenerator';
import { nanoid } from 'nanoid';
import reportStore from '../models/reportStore';

// Check if Redis/queue is available
let reportQueue: any = null;
try {
  reportQueue = require('../workers/reportQueue').default;
} catch (err) {
  console.warn('Report queue not available, using direct processing');
}

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
      const now = new Date().toISOString();
      
      // Enhanced data with user information
      const enhancedData = {
        ...data,
        reportName: title,
        generatedAt: new Date().toLocaleDateString(),
        dateRange: data.dateRange || {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          end: new Date().toLocaleDateString()
        },
        user: req.user || {}
      };

      if (reportQueue) {
        // Queue-based processing
        const metadata = {
          id: reportId,
          ownerId: req.user?.id || null,
          templateId,
          status: 'pending' as const,
          createdAt: now,
          updatedAt: now,
          progress: 0,
          error: null,
          s3Key: null,
          signedUrl: null,
          pdfPath: null
        };

        await reportStore.createReport(metadata);

        await reportQueue.enqueueReport({
          reportId,
          templateId,
          data: enhancedData,
          options
        });

        res.status(202).json({
          reportId,
          status: 'pending',
          statusUrl: `/api/reports/${reportId}/status`,
          downloadUrl: `/api/reports/${reportId}/download`,
          message: 'Report generation queued'
        });
      } else {
        // Direct processing fallback
        const result = await processReportJob({
          reportId,
          templateId,
          data: enhancedData,
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
      const reportsDir = path.join(process.cwd(), 'storage', 'reports');
      const pdfPath = path.join(reportsDir, `report-${reportId}.pdf`);
      
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

  // Get report status - enhanced for queue support
  app.get("/api/reports/:reportId/status", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { reportId } = req.params;

      if (reportQueue) {
        // Check metadata store first
        const metadata = await reportStore.getReport(reportId);
        if (metadata) {
          return res.json({
            reportId,
            status: metadata.status,
            progress: metadata.progress,
            downloadUrl: metadata.status === 'completed' 
              ? (metadata.signedUrl || `/api/reports/${reportId}/download`) 
              : null,
            error: metadata.error
          });
        }
      }

      // Fallback: check if file exists locally
      const reportsDir = path.join(process.cwd(), 'storage', 'reports');
      const pdfPath = path.join(reportsDir, `report-${reportId}.pdf`);
      
      try {
        await fs.access(pdfPath);
        res.json({
          reportId,
          status: 'completed',
          progress: 100,
          downloadUrl: `/api/reports/${reportId}/download`
        });
      } catch {
        res.json({
          reportId,
          status: 'not_found',
          progress: 0
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