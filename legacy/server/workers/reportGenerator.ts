import path from "path";
import fs from "fs/promises";
import puppeteer from "puppeteer";
import { uploadBufferToS3, getSignedUrlForKey, isS3Configured } from "../services/s3";

const OUTPUT_DIR = path.join(process.cwd(), "storage", "reports");

type JobPayload = {
  reportId: string;
  templateId?: string;
  params?: any;
  ownerId?: string | null;
};

export async function processReportJob(payload: JobPayload, onProgress?: (percent: number) => void) {
  const reportId = payload.reportId;
  const tmpDir = OUTPUT_DIR;
  await fs.mkdir(tmpDir, { recursive: true });

  try {
    // Assemble data for template
    const data = {
      reportName: payload.templateId || "standard-report",
      params: payload.params || {},
      user: payload.params?.user || {}, // guard user to avoid template runtime errors
      generatedAt: new Date().toISOString(),
    };

    // Render HTML using existing templating approach
    const templatePath = path.join(process.cwd(), "server", "templates", `${data.reportName}.html`);
    const fallbackTemplatePath = path.join(process.cwd(), "server", "templates", "standard-report.html");
    
    let templateToLoad: string;
    try {
      await fs.access(templatePath);
      templateToLoad = templatePath;
    } catch {
      templateToLoad = fallbackTemplatePath;
    }

    let templateHtml = await fs.readFile(templateToLoad, "utf8");
    
    // Simple template replacement (extend this with a proper template engine)
    templateHtml = templateHtml.replace(/\{\{reportName\}\}/g, data.reportName || "");
    templateHtml = templateHtml.replace(/\{\{generatedAt\}\}/g, data.generatedAt || "");
    
    // Replace user data safely
    if (data.user) {
      templateHtml = templateHtml.replace(/\{\{user\.firstName\}\}/g, data.user.firstName || "");
      templateHtml = templateHtml.replace(/\{\{user\.lastName\}\}/g, data.user.lastName || "");
      templateHtml = templateHtml.replace(/\{\{user\.email\}\}/g, data.user.email || "");
      templateHtml = templateHtml.replace(/\{\{user\.profileImageUrl\}\}/g, data.user.profileImageUrl || "");
    }

    // Write to temporary HTML file
    const tmpHtmlPath = path.join(tmpDir, `report-${reportId}.html`);
    await fs.writeFile(tmpHtmlPath, templateHtml, "utf8");

    onProgress && onProgress(20);

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
      headless: true,
      executablePath: '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium'
    });

    const page = await browser.newPage();
    await page.goto(`file://${tmpHtmlPath}`, { waitUntil: "networkidle0", timeout: 120000 });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", right: "12mm", bottom: "20mm", left: "12mm" },
    });

    await browser.close();

    onProgress && onProgress(80);

    // Choose storage strategy based on S3 configuration
    let pdfPath: string | undefined;
    let s3Key: string | undefined;
    let signedUrl: string | undefined;

    if (isS3Configured()) {
      try {
        // Upload to S3
        s3Key = `reports/${reportId}/${Date.now()}-report.pdf`;
        await uploadBufferToS3(s3Key, pdfBuffer);
        signedUrl = await getSignedUrlForKey(s3Key, 3600); // 1 hour expiry
        console.log(`Report ${reportId} uploaded to S3: ${s3Key}`);
      } catch (s3Error) {
        console.warn(`S3 upload failed for ${reportId}, falling back to local storage:`, s3Error);
        // Fallback to local storage
        pdfPath = path.join(tmpDir, `report-${reportId}.pdf`);
        await fs.writeFile(pdfPath, pdfBuffer);
      }
    } else {
      // Local storage
      pdfPath = path.join(tmpDir, `report-${reportId}.pdf`);
      await fs.writeFile(pdfPath, pdfBuffer);
    }

    onProgress && onProgress(100);

    console.log(`Report generation completed for ${reportId}`);
    return {
      success: true,
      pdfUrl: signedUrl || `/api/reports/${reportId}/download`,
      pdfPath,
      s3Key,
      signedUrl,
    };
  } catch (err) {
    console.error("Report generation failed:", (err as Error).message);
    return { success: false, error: String(err) };
  }
}