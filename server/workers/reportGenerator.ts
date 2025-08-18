import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import Mustache from 'mustache';
import { uploadBufferToS3, getSignedUrlForKey, isS3Configured } from '../services/s3';

// Fix for ES modules - __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface ReportJobPayload {
  reportId: string;
  templateId: string;
  data: any;
  options?: {
    pageSize?: 'A4' | 'Letter';
    margin?: { top: string; right: string; bottom: string; left: string };
  };
}

export interface ReportResult {
  success: boolean;
  pdfUrl?: string;
  pdfPath?: string;
  s3Key?: string;
  signedUrl?: string;
  error?: string;
}

/**
 * Process a report job:
 * - Render the HTML template with provided data
 * - Launch Puppeteer and render PDF
 * - Save PDF locally or upload to S3
 */
export async function processReportJob(
  job: ReportJobPayload, 
  onProgress?: (progress: number) => void
): Promise<ReportResult> {
  const { reportId, templateId, data, options = {} } = job;
  console.log(`Starting report generation for ${reportId}`);
  
  try {
    // Load template file
    const templatePath = path.join(__dirname, '..', 'templates', `${templateId}.html`);
    const templateHtml = await fs.readFile(templatePath, 'utf8');

    // Render HTML using Mustache (data should include base64 chart images and HTML table)
    const renderedHtml = Mustache.render(templateHtml, data);

    // Create storage directory if it doesn't exist
    const reportsDir = path.join(process.cwd(), 'storage', 'reports');
    try {
      await fs.access(reportsDir);
    } catch {
      await fs.mkdir(reportsDir, { recursive: true });
    }

    // Write to a temp HTML file
    const tmpHtmlPath = path.join(reportsDir, `report-${reportId}.html`);
    await fs.writeFile(tmpHtmlPath, renderedHtml, 'utf8');

    onProgress && onProgress(20);

    // Launch Puppeteer with explicit Chrome path
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      headless: true,
      executablePath: '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium'
    });
    const page = await browser.newPage();

    // Enable larger timeout and wait for network idle so images load
    await page.goto(`file://${tmpHtmlPath}`, { 
      waitUntil: 'networkidle0', 
      timeout: 60000 
    });

    const pdfBuffer = await page.pdf({
      format: options.pageSize || 'A4',
      printBackground: true,
      margin: options.margin || { 
        top: '20mm', 
        right: '12mm', 
        bottom: '20mm', 
        left: '12mm' 
      },
    });

    await browser.close();

    onProgress && onProgress(80);

    // Choose storage strategy based on S3 configuration
    let pdfPath: string | undefined;
    let s3Key: string | undefined;
    let signedUrl: string | undefined;
    let pdfUrl: string;

    if (isS3Configured()) {
      try {
        // Upload to S3
        s3Key = `reports/${reportId}/${Date.now()}-report.pdf`;
        await uploadBufferToS3(s3Key, pdfBuffer);
        signedUrl = await getSignedUrlForKey(s3Key, 3600); // 1 hour expiry
        pdfUrl = signedUrl;
        console.log(`Report ${reportId} uploaded to S3: ${s3Key}`);
      } catch (s3Error) {
        console.warn(`S3 upload failed for ${reportId}, falling back to local storage:`, s3Error);
        // Fallback to local storage
        pdfPath = path.join(reportsDir, `report-${reportId}.pdf`);
        await fs.writeFile(pdfPath, pdfBuffer);
        pdfUrl = `/api/reports/${reportId}/download`;
      }
    } else {
      // Local storage
      pdfPath = path.join(reportsDir, `report-${reportId}.pdf`);
      await fs.writeFile(pdfPath, pdfBuffer);
      pdfUrl = `/api/reports/${reportId}/download`;
    }

    onProgress && onProgress(100);

    console.log(`Report generation completed for ${reportId}`);
    return { 
      success: true, 
      pdfUrl, 
      pdfPath, 
      s3Key, 
      signedUrl 
    };
  } catch (err) {
    console.error('Report generation failed:', (err as Error).message);
    return { success: false, error: String(err) };
  }
}