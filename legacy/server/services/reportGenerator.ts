import path from "path";
import { nanoid } from "nanoid";
import { buildReportHTML, ReportTemplateKey, ReportInput } from "../templates/reportTemplates";
import { ensureDirs, REPORTS_DIR, REPORTS_META_DIR, saveBufferFile, writeJSON } from "./storage";

// Lazy import puppeteer only when used to avoid startup issues
async function getPuppeteer() {
  try {
    const mod = await import("puppeteer");
    return mod.default || (mod as any);
  } catch (error) {
    throw new Error("Puppeteer not available. Report generation requires puppeteer to be installed.");
  }
}

export type ReportMetadata = {
  id: string;
  template: ReportTemplateKey;
  title: string;
  filename: string;
  absolutePath: string;
  size: number;
  createdAt: string;
  createdBy?: string;
  contentType: "application/pdf";
  status: "processing" | "completed" | "failed";
  error?: string;
};

export async function generateReportPDF(
  template: ReportTemplateKey, 
  input: ReportInput, 
  userId?: string
): Promise<ReportMetadata> {
  await ensureDirs();

  const id = nanoid(10);
  const title = input.title || getDefaultTitle(template);
  const filename = `report-${id}.pdf`;
  const outPath = path.join(REPORTS_DIR, filename);
  
  // Create initial metadata with processing status
  const metadata: ReportMetadata = {
    id,
    template,
    title,
    filename,
    absolutePath: outPath,
    size: 0,
    createdAt: new Date().toISOString(),
    createdBy: userId || input.generatedBy,
    contentType: "application/pdf",
    status: "processing"
  };

  await writeJSON(path.join(REPORTS_META_DIR, `${id}.json`), metadata);

  try {
    // Build HTML from template
    const html = buildReportHTML(template, {
      ...input,
      generatedAt: input.generatedAt || new Date().toISOString(),
      generatedBy: userId || input.generatedBy || "GeFi System"
    });

    // Generate PDF using Puppeteer
    const puppeteer = await getPuppeteer();
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox", 
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu"
      ],
    });

    try {
      const page = await browser.newPage();
      
      // Set content and wait for any async operations
      await page.setContent(html, { waitUntil: "networkidle0", timeout: 30000 });
      
      // Generate PDF
      const pdfBuffer = Buffer.from(await page.pdf({
        printBackground: true,
        preferCSSPageSize: true,
        format: "A4",
        margin: { 
          top: "16mm", 
          bottom: "16mm", 
          left: "14mm", 
          right: "14mm" 
        },
      }));
      
      await saveBufferFile(outPath, pdfBuffer);
      
    } finally {
      await browser.close();
    }

    // Update metadata with completion
    const stats = await (await import("fs/promises")).stat(outPath);
    metadata.size = stats.size;
    metadata.status = "completed";
    
    await writeJSON(path.join(REPORTS_META_DIR, `${id}.json`), metadata);
    
    return metadata;

  } catch (error) {
    console.error("Report generation failed:", error);
    
    // Update metadata with error
    metadata.status = "failed";
    metadata.error = String(error);
    await writeJSON(path.join(REPORTS_META_DIR, `${id}.json`), metadata);
    
    throw error;
  }
}

function getDefaultTitle(template: ReportTemplateKey): string {
  switch (template) {
    case "performance": return "Performance Report";
    case "risk": return "Risk Assessment Report";
    case "compliance": return "Compliance Report";
    case "custom": return "Custom Report";
    default: return "GeFi Report";
  }
}

export async function listReportMetadata(): Promise<ReportMetadata[]> {
  const fs = await import("fs/promises");
  const pathNode = await import("path");
  
  await ensureDirs();
  
  try {
    const entries = await fs.readdir(REPORTS_META_DIR);
    const list: ReportMetadata[] = [];
    
    for (const f of entries) {
      if (!f.endsWith(".json")) continue;
      
      const filePath = pathNode.join(REPORTS_META_DIR, f);
      try {
        const raw = await fs.readFile(filePath, "utf-8");
        const metadata = JSON.parse(raw) as ReportMetadata;
        list.push(metadata);
      } catch (parseError) {
        console.warn(`Failed to parse metadata file ${f}:`, parseError);
      }
    }
    
    // Sort by creation date (newest first)
    return list.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
  } catch (error) {
    console.warn("Failed to list report metadata:", error);
    return [];
  }
}

export async function getReportById(id: string): Promise<ReportMetadata | null> {
  const fs = await import("fs/promises");
  const pathNode = await import("path");
  
  const metaPath = pathNode.join(REPORTS_META_DIR, `${id}.json`);
  
  try {
    const raw = await fs.readFile(metaPath, "utf-8");
    return JSON.parse(raw) as ReportMetadata;
  } catch (error) {
    return null;
  }
}

export async function deleteReport(id: string): Promise<boolean> {
  const fs = await import("fs/promises");
  const pathNode = await import("path");
  
  try {
    const metadata = await getReportById(id);
    if (!metadata) return false;
    
    // Delete PDF file
    await fs.unlink(metadata.absolutePath);
    
    // Delete metadata
    const metaPath = pathNode.join(REPORTS_META_DIR, `${id}.json`);
    await fs.unlink(metaPath);
    
    return true;
  } catch (error) {
    console.error(`Failed to delete report ${id}:`, error);
    return false;
  }
}