import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import Mustache from 'mustache';
import { v4 as uuidv4 } from 'uuid';
import { uploadReportPDF } from '../services/s3.js';
import { db } from '../db.js';
import { reports } from '@shared/schema';
import { eq } from 'drizzle-orm';

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

/**
 * Process a report job:
 * - Render the HTML template with provided data
 * - Launch Puppeteer and render PDF
 * - Upload to S3 and update the metadata store
 */
export async function processReportJob(job: ReportJobPayload): Promise<{
  success: boolean;
  pdfUrl?: string;
  pdfPath?: string;
  s3Key?: string;
  signedUrl?: string;
  error?: string;
}> {
  const { reportId, templateId, data, options = {} } = job;
  console.log(`Starting report generation for ${reportId}`);
  
  try {
    // Load template file
    const templatePath = path.join(__dirname, '..', 'templates', `${templateId}.html`);
    const templateHtml = await fs.readFile(templatePath, 'utf8');

    // Ensure data has safe defaults to prevent template errors
    const safeData = {
      ...data,
      user: data.user || {},
      reportName: data.reportName || 'Financial Report',
      generatedAt: data.generatedAt || new Date().toLocaleDateString(),
      dateRange: data.dateRange || {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        end: new Date().toLocaleDateString()
      }
    };

    // Ensure user object has safe defaults
    if (safeData.user) {
      safeData.user = {
        profileImageUrl: '',
        firstName: 'User',
        lastName: '',
        email: '',
        ...safeData.user
      };
    }

    // Render HTML using Mustache with safe data
    const renderedHtml = Mustache.render(templateHtml, safeData);

    // Create tmp directory if it doesn't exist
    const tmpDir = '/tmp';
    try {
      await fs.access(tmpDir);
    } catch {
      await fs.mkdir(tmpDir, { recursive: true });
    }

    // Write to a temp HTML file
    const tmpHtmlPath = path.join(tmpDir, `report-${reportId}.html`);
    await fs.writeFile(tmpHtmlPath, renderedHtml, 'utf8');

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      headless: true
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

    // Try to upload to S3 first (production), fallback to local storage (development)
    const isProduction = process.env.NODE_ENV === 'production';
    let s3Key: string | undefined;
    let signedUrl: string | undefined;
    let pdfPath: string | undefined;

    if (isProduction && process.env.S3_BUCKET) {
      console.log(`Uploading report ${reportId} to S3...`);
      const uploadResult = await uploadReportPDF(reportId, pdfBuffer);
      
      if (uploadResult.success) {
        s3Key = uploadResult.s3Key;
        signedUrl = uploadResult.signedUrl;
        console.log(`Report ${reportId} uploaded to S3: ${s3Key}`);
      } else {
        console.warn(`S3 upload failed for ${reportId}, falling back to local storage:`, uploadResult.error);
        // Fallback to local storage
        pdfPath = path.join(tmpDir, `report-${reportId}.pdf`);
        await fs.writeFile(pdfPath, pdfBuffer);
      }
    } else {
      // Development mode or S3 not configured - save locally
      pdfPath = path.join(tmpDir, `report-${reportId}.pdf`);
      await fs.writeFile(pdfPath, pdfBuffer);
      console.log(`Report ${reportId} saved locally: ${pdfPath}`);
    }
    
    const pdfUrl = `/api/reports/${reportId}/download`;

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