import path from 'path';
import fs from 'fs/promises';
import puppeteer from 'puppeteer';
import Mustache from 'mustache';
import { db } from '../db';
import { reports } from '@shared/schema';
import { eq } from 'drizzle-orm';

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
 * - Save PDF and update the DB record
 */
export async function processReportJob(job: ReportJobPayload) {
  const { reportId, templateId, data, options = {} } = job;
  console.log(`Starting report generation for ${reportId}`);
  
  try {
    // Load template file
    const templatePath = path.join(__dirname, '..', 'templates', `${templateId}.html`);
    const templateHtml = await fs.readFile(templatePath, 'utf8');

    // Render HTML using Mustache (data should include base64 chart images and HTML table)
    const renderedHtml = Mustache.render(templateHtml, data);

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

    // Save PDF to local storage (can be extended to S3 later)
    const pdfPath = path.join(tmpDir, `report-${reportId}.pdf`);
    await fs.writeFile(pdfPath, pdfBuffer);
    
    const pdfUrl = `/api/reports/${reportId}/download`;

    console.log(`Report generation completed for ${reportId}`);
    return { success: true, pdfUrl, pdfPath };
  } catch (err) {
    console.error('Report generation failed:', (err as Error).message);
    return { success: false, error: String(err) };
  }
}