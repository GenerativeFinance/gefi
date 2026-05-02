import express from "express";
import { nanoid } from 'nanoid';
import reportStore from '../models/reportStore';

// Check if Redis/queue is available
let reportQueue: any = null;
try {
  reportQueue = require('../workers/reportQueue').default;
} catch (err) {
  console.warn('Report queue not available, using direct processing');
}

// Authentication middleware for reports
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

const router = express.Router();

// Create/generate a report (enqueue)
router.post("/generate", requireAuth, async (req, res) => {
  try {
    const user = (req as any).user || {}; // adapt to your auth middleware
    const { type, title, data, templateId = 'executive-report', options = {} } = req.body || {};

    if (!type || !title || !data) {
      return res.status(400).json({ 
        success: false,
        error: "Missing required fields: type, title, data" 
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
      user: user || {}
    };

    if (reportQueue) {
      // Queue-based processing
      const metadata = {
        id: reportId,
        ownerId: user.id || null,
        templateId: templateId || type,
        status: "pending" as const,
        createdAt: now,
        updatedAt: now,
        progress: 0,
        error: null,
        pdfPath: null,
        s3Key: null,
        signedUrl: null
      };

      await reportStore.createReport(metadata);

      // enqueue job
      await reportQueue.enqueueReport({
        reportId,
        ownerId: metadata.ownerId,
        templateId: metadata.templateId,
        params: enhancedData,
      });

      return res.status(202).json({
        success: true,
        reportId,
        statusUrl: `/api/reports/${reportId}/status`,
        downloadUrl: `/api/reports/${reportId}/download`
      });
    } else {
      // Direct processing fallback
      const { processReportJob } = await import('../workers/reportGenerator');
      
      const result = await processReportJob({
        reportId,
        templateId,
        params: enhancedData,
      });

      if (result.success) {
        return res.json({
          success: true,
          reportId,
          status: 'completed',
          pdfUrl: result.pdfUrl,
          message: 'Report generated successfully'
        });
      } else {
        return res.status(500).json({
          success: false,
          reportId,
          status: 'failed',
          error: result.error,
          message: 'Report generation failed'
        });
      }
    }
  } catch (err) {
    console.error("POST /api/reports/generate error:", err);
    return res.status(500).json({ success: false, error: String(err) });
  }
});

// Status polling
router.get("/:id/status", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const metadata = await reportStore.getReport(id);
    if (!metadata) return res.status(404).json({ success: false, error: "Report not found" });

    return res.status(200).json({
      success: true,
      reportId: id,
      status: metadata.status,
      progress: metadata.progress,
      downloadUrl: metadata.status === "completed" ? (metadata.signedUrl || `/api/reports/${id}/download`) : null,
      error: metadata.error || null
    });
  } catch (err) {
    console.error("GET /api/reports/:id/status error:", err);
    return res.status(500).json({ success: false, error: String(err) });
  }
});

// Secure download endpoint (redirects to signed S3 URL or streams local file)
router.get("/:id/download", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const metadata = await reportStore.getReport(id);
    if (!metadata) return res.status(404).json({ success: false, error: "Report not found" });

    if (metadata.status !== "completed") {
      return res.status(202).json({ success: false, error: "Report not ready", status: metadata.status });
    }

    if (metadata.signedUrl) {
      // redirect to signed url (S3)
      return res.redirect(metadata.signedUrl);
    }

    // Fallback: stream local file (pdfPath stored in metadata)
    if (metadata.pdfPath) {
      return res.sendFile(metadata.pdfPath);
    }

    return res.status(500).json({ success: false, error: "No PDF available" });
  } catch (err) {
    console.error("GET /api/reports/:id/download error:", err);
    return res.status(500).json({ success: false, error: String(err) });
  }
});

export default router;