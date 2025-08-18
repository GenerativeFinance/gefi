import type { Express } from "express";
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { enqueueReport, getJobStatus } from '../workers/reportQueue.js';
import { createReport, getReport, updateReport } from '../models/reportStore.js';
import { getSignedDownloadUrl } from '../services/s3.js';

export function registerReportRoutes(app: Express): void {
  console.log("📄 Registering Report APIs...");

  // Generate a new report - async job queue
  app.post("/api/reports/generate", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { type, title, data, templateId = 'executive-report', options = {} } = req.body;
      
      if (!type || !title) {
        return res.status(400).json({ 
          success: false,
          error: "Report name and type are required" 
        });
      }

      const reportId = uuidv4();
      const userId = (req.user as any)?.id || 'anonymous';
      
      // Create report record with pending status
      await createReport({
        reportId,
        userId,
        type,
        title,
        status: 'pending',
      });

      // Enqueue the report generation job
      await enqueueReport({
        reportId,
        templateId,
        data: {
          ...data,
          reportName: title,
          generatedAt: new Date().toLocaleDateString(),
          dateRange: data?.dateRange || {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            end: new Date().toLocaleDateString()
          }
        },
        options
      });

      res.json({
        reportId,
        statusUrl: `/api/reports/${reportId}/status`,
        message: 'Report generation job enqueued successfully'
      });
    } catch (error) {
      console.error('Report generation request failed:', error);
      res.status(500).json({ 
        success: false,
        error: 'Internal server error'
      });
    }
  });

  // Download a generated report - supports S3 or local files
  app.get("/api/reports/:reportId/download", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { reportId } = req.params;
      
      // Get report metadata
      const report = await getReport(reportId);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }

      // Check if user owns this report
      const userId = (req.user as any)?.id || 'anonymous';
      if (report.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // Check if report is completed
      if (report.status !== 'completed') {
        return res.status(202).json({ 
          message: "Report not ready", 
          status: report.status 
        });
      }

      // If S3 URL available, redirect to signed URL
      if (report.s3Key && process.env.S3_BUCKET) {
        const urlResult = await getSignedDownloadUrl(report.s3Key, 900); // 15 minutes
        if (urlResult.success && urlResult.signedUrl) {
          return res.redirect(urlResult.signedUrl);
        }
      }

      // Fallback to local file streaming
      const pdfPath = report.pdfPath || path.join('/tmp', `report-${reportId}.pdf`);
      
      try {
        await fs.access(pdfPath);
        
        // Set headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="report-${reportId}.pdf"`);
        
        // Stream the file
        const fileBuffer = await fs.readFile(pdfPath);
        res.send(fileBuffer);
      } catch {
        return res.status(404).json({ message: "Report file not found" });
      }
    } catch (error) {
      console.error('Report download failed:', error);
      res.status(500).json({ 
        message: 'Failed to download report',
        error: (error as Error).message 
      });
    }
  });

  // Get report status - async polling endpoint
  app.get("/api/reports/:reportId/status", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { reportId } = req.params;
      
      // Get report metadata from store
      const report = await getReport(reportId);
      if (!report) {
        return res.status(404).json({ 
          reportId,
          status: 'not_found',
          error: 'Report not found'
        });
      }

      // Check if user owns this report
      const userId = (req.user as any)?.id || 'anonymous';
      if (report.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // Get job status from queue if still processing
      let finalStatus = report.status;
      let progress = report.progress;

      if (report.status === 'pending' || report.status === 'processing') {
        const jobStatus = await getJobStatus(reportId);
        finalStatus = jobStatus.status;
        progress = jobStatus.progress;
        
        // Update stored status if it changed
        if (finalStatus !== report.status) {
          await updateReport(reportId, { 
            status: finalStatus,
            progress,
            error: jobStatus.error 
          });
        }
      }

      const response: any = {
        reportId,
        status: finalStatus,
      };

      if (progress !== undefined) {
        response.progress = progress;
      }

      if (finalStatus === 'completed') {
        response.downloadUrl = `/api/reports/${reportId}/download`;
      }

      if (finalStatus === 'failed') {
        response.error = report.error || 'Unknown error';
      }

      res.json(response);
    } catch (error) {
      console.error('Report status check failed:', error);
      res.status(500).json({ 
        message: 'Failed to check report status',
        error: (error as Error).message 
      });
    }
  });
}