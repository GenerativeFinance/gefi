import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

// Fix for ES modules - __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the storage directory
const STORAGE_DIR = path.join(__dirname, '..', '..', 'storage', 'reports', 'metadata');

export interface ReportMetadata {
  reportId: string;
  userId: string;
  type: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  error?: string;
  s3Key?: string;
  signedUrl?: string;
  pdfPath?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  metadata?: any;
}

/**
 * Initialize storage directory
 */
async function ensureStorageDir(): Promise<void> {
  try {
    await fs.access(STORAGE_DIR);
  } catch {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
  }
}

/**
 * Get report metadata file path
 */
function getReportPath(reportId: string): string {
  return path.join(STORAGE_DIR, `${reportId}.json`);
}

/**
 * Create a new report record
 */
export async function createReport(reportData: Omit<ReportMetadata, 'createdAt' | 'updatedAt'>): Promise<ReportMetadata> {
  await ensureStorageDir();
  
  const now = new Date().toISOString();
  const report: ReportMetadata = {
    ...reportData,
    createdAt: now,
    updatedAt: now,
  };

  const filePath = getReportPath(report.reportId);
  await fs.writeFile(filePath, JSON.stringify(report, null, 2), 'utf8');
  
  return report;
}

/**
 * Get report metadata by ID
 */
export async function getReport(reportId: string): Promise<ReportMetadata | null> {
  try {
    const filePath = getReportPath(reportId);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data) as ReportMetadata;
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      return null; // Report not found
    }
    throw error;
  }
}

/**
 * Update report metadata
 */
export async function updateReport(
  reportId: string, 
  updates: Partial<Omit<ReportMetadata, 'reportId' | 'createdAt'>>
): Promise<ReportMetadata | null> {
  const existing = await getReport(reportId);
  if (!existing) {
    return null;
  }

  const updated: ReportMetadata = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const filePath = getReportPath(reportId);
  await fs.writeFile(filePath, JSON.stringify(updated, null, 2), 'utf8');
  
  return updated;
}

/**
 * Get all reports for a user
 */
export async function getUserReports(userId: string): Promise<ReportMetadata[]> {
  await ensureStorageDir();
  
  try {
    const files = await fs.readdir(STORAGE_DIR);
    const reports: ReportMetadata[] = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const data = await fs.readFile(path.join(STORAGE_DIR, file), 'utf8');
          const report = JSON.parse(data) as ReportMetadata;
          if (report.userId === userId) {
            reports.push(report);
          }
        } catch (error) {
          console.warn(`Failed to read report file ${file}:`, error);
        }
      }
    }
    
    // Sort by creation date, newest first
    return reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Failed to get user reports:', error);
    return [];
  }
}

/**
 * Delete a report record
 */
export async function deleteReport(reportId: string): Promise<boolean> {
  try {
    const filePath = getReportPath(reportId);
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      return true; // Already deleted
    }
    throw error;
  }
}