import { apiRequest } from "@/lib/queryClient";

export interface ReportGenerationRequest {
  type: string;
  title: string;
  data?: any;
  templateId?: string;
  options?: {
    pageSize?: 'A4' | 'Letter';
    margin?: { top: string; right: string; bottom: string; left: string };
  };
}

export interface ReportStatusResponse {
  reportId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  downloadUrl?: string;
  error?: string;
}

export interface ReportGenerationResponse {
  reportId: string;
  statusUrl: string;
  message: string;
}

/**
 * Start report generation and return job details
 */
export async function generateReport(request: ReportGenerationRequest): Promise<ReportGenerationResponse> {
  try {
    const response = await apiRequest("POST", "/api/reports/generate", request);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to start report generation');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Report generation request failed:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate report');
  }
}

/**
 * Check report generation status
 */
export async function checkReportStatus(reportId: string): Promise<ReportStatusResponse> {
  try {
    const response = await apiRequest("GET", `/api/reports/${reportId}/status`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Report status check failed:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to check report status');
  }
}

/**
 * Download report with exponential backoff polling
 */
export async function downloadReportWithPolling(
  request: ReportGenerationRequest,
  onProgress?: (status: ReportStatusResponse) => void,
  maxWaitTime: number = 300000 // 5 minutes max
): Promise<{ success: boolean; downloadUrl?: string; error?: string }> {
  try {
    // Start report generation
    const generation = await generateReport(request);
    const { reportId } = generation;
    
    // Poll for completion with exponential backoff
    const startTime = Date.now();
    let delay = 1000; // Start with 1 second
    const maxDelay = 10000; // Max 10 seconds between polls
    
    while (Date.now() - startTime < maxWaitTime) {
      try {
        const status = await checkReportStatus(reportId);
        
        // Call progress callback if provided
        if (onProgress) {
          onProgress(status);
        }
        
        if (status.status === 'completed' && status.downloadUrl) {
          return { success: true, downloadUrl: status.downloadUrl };
        }
        
        if (status.status === 'failed') {
          return { 
            success: false, 
            error: status.error || 'Report generation failed' 
          };
        }
        
        // Wait before next poll with exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(delay * 1.5, maxDelay);
        
      } catch (pollError) {
        console.warn('Polling attempt failed:', pollError);
        // Continue polling unless we've exceeded max time
        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(delay * 1.5, maxDelay);
      }
    }
    
    return { 
      success: false, 
      error: 'Report generation timed out' 
    };
    
  } catch (error) {
    console.error('Download with polling failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to download report' 
    };
  }
}

/**
 * Trigger browser download from a URL
 */
export function triggerDownload(url: string, filename?: string): void {
  const link = document.createElement('a');
  link.href = url;
  if (filename) {
    link.download = filename;
  }
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Complete flow: generate report, poll for completion, and download
 */
export async function generateAndDownloadReport(
  request: ReportGenerationRequest,
  onProgress?: (status: ReportStatusResponse) => void
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await downloadReportWithPolling(request, onProgress);
    
    if (result.success && result.downloadUrl) {
      // Trigger browser download
      const filename = `${request.type}-report-${new Date().toISOString().split('T')[0]}.pdf`;
      triggerDownload(result.downloadUrl, filename);
      return { success: true };
    }
    
    return result;
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate and download report' 
    };
  }
}