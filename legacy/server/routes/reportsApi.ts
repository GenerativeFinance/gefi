import type { Express, Request, Response } from "express";
import path from "path";
import fs from "fs";
import { generateReportPDF, getReportById, listReportMetadata, deleteReport } from "../services/reportGenerator";
import { listFilesRecursive, getFileById, deleteFile } from "../services/storage";
import { getTemplateFields } from "../templates/reportTemplates";
import type { ReportTemplateKey, ReportInput } from "../templates/reportTemplates";

interface AuthenticatedRequest extends Request {
  user?: { id: string; email?: string; firstName?: string; lastName?: string };
}

export default function registerReportsApi(app: Express) {
  const base = "/api/reports";

  // Generate report synchronously
  app.post(`${base}/generate`, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { template, input }: { template: ReportTemplateKey; input: ReportInput } = req.body || {};
      
      if (!template) {
        return res.status(400).json({ error: "template is required" });
      }

      if (!["performance", "risk", "compliance", "custom"].includes(template)) {
        return res.status(400).json({ error: "invalid template type" });
      }

      // Add user context if available
      const userId = req.user?.id;
      const userName = req.user?.firstName && req.user?.lastName 
        ? `${req.user.firstName} ${req.user.lastName}`
        : req.user?.email || "Unknown User";

      const enhancedInput = {
        ...input,
        generatedBy: userName
      };

      const metadata = await generateReportPDF(template, enhancedInput, userId);
      
      return res.json({
        success: true,
        id: metadata.id,
        status: metadata.status,
        title: metadata.title,
        downloadUrl: `${base}/${metadata.id}/download`,
        metadata
      });
      
    } catch (err: any) {
      console.error("Report generation failed:", err);
      res.status(500).json({ 
        success: false,
        error: "Failed to generate report", 
        details: String(err?.message || err) 
      });
    }
  });

  // List all generated reports
  app.get(base, async (_req, res) => {
    try {
      const reports = await listReportMetadata();
      res.json(reports);
    } catch (error) {
      console.error("Failed to list reports:", error);
      res.status(500).json({ error: "Failed to list reports" });
    }
  });

  // Get report status and metadata
  app.get(`${base}/:id/status`, async (req, res) => {
    try {
      const metadata = await getReportById(req.params.id);
      if (!metadata) {
        return res.status(404).json({ error: "Report not found" });
      }
      res.json({ 
        id: metadata.id, 
        status: metadata.status, 
        metadata 
      });
    } catch (error) {
      console.error("Failed to get report status:", error);
      res.status(500).json({ error: "Failed to get report status" });
    }
  });

  // Download a PDF
  app.get(`${base}/:id/download`, async (req, res) => {
    try {
      const metadata = await getReportById(req.params.id);
      if (!metadata) {
        return res.status(404).json({ error: "Report not found" });
      }

      if (metadata.status !== "completed") {
        return res.status(422).json({ 
          error: "Report not ready", 
          status: metadata.status 
        });
      }

      if (!fs.existsSync(metadata.absolutePath)) {
        return res.status(404).json({ error: "Report file not found" });
      }

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${metadata.filename}"`);
      res.setHeader("Content-Length", metadata.size);
      
      const stream = fs.createReadStream(metadata.absolutePath);
      stream.pipe(res);
      
    } catch (error) {
      console.error("Failed to download report:", error);
      res.status(500).json({ error: "Failed to download report" });
    }
  });

  // Delete a report
  app.delete(`${base}/:id`, async (req, res) => {
    try {
      const success = await deleteReport(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Report not found" });
      }
      res.json({ success: true, message: "Report deleted successfully" });
    } catch (error) {
      console.error("Failed to delete report:", error);
      res.status(500).json({ error: "Failed to delete report" });
    }
  });

  // Get template information and required fields
  app.get(`${base}/templates`, (_req, res) => {
    const templates = [
      {
        key: "performance",
        name: "Performance Report",
        description: "Portfolio performance analysis and metrics",
        fields: getTemplateFields("performance")
      },
      {
        key: "risk",
        name: "Risk Assessment Report", 
        description: "Risk analysis and compliance monitoring",
        fields: getTemplateFields("risk")
      },
      {
        key: "compliance",
        name: "Compliance Report",
        description: "Regulatory compliance and audit findings",
        fields: getTemplateFields("compliance")
      },
      {
        key: "custom",
        name: "Custom Report",
        description: "Build a custom report with flexible content",
        fields: getTemplateFields("custom")
      }
    ];
    res.json(templates);
  });

  // Storage Management API - List all files including reports
  app.get("/api/storage/files", async (_req, res) => {
    try {
      const files = await listFilesRecursive();
      res.json(files);
    } catch (error) {
      console.error("Failed to list storage files:", error);
      res.status(500).json({ error: "Failed to list files" });
    }
  });

  // Get specific file information
  app.get("/api/storage/files/:id", async (req, res) => {
    try {
      const file = await getFileById(req.params.id);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      res.json(file);
    } catch (error) {
      console.error("Failed to get file:", error);
      res.status(500).json({ error: "Failed to get file" });
    }
  });

  // Delete a storage file
  app.delete("/api/storage/files/:id", async (req, res) => {
    try {
      const file = await getFileById(req.params.id);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      const success = await deleteFile(file.path);
      if (!success) {
        return res.status(500).json({ error: "Failed to delete file" });
      }

      res.json({ success: true, message: "File deleted successfully" });
    } catch (error) {
      console.error("Failed to delete file:", error);
      res.status(500).json({ error: "Failed to delete file" });
    }
  });
}