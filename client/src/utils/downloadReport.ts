/**
 * Utility for downloading PDF reports from the server
 * Handles blob downloads and triggers browser file save
 */
export async function downloadReport(reportId: string, { signal }: { signal?: AbortSignal } = {}) {
  const url = `/api/reports/${encodeURIComponent(reportId)}/download`;
  const res = await fetch(url, { method: "GET", signal });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to download report: ${res.status} ${text}`);
  }

  const blob = await res.blob();
  const filenameHeader = res.headers.get("content-disposition");
  let filename = `report-${reportId}.pdf`;
  if (filenameHeader) {
    const match = filenameHeader.match(/filename="?(.+?)"?($|;)/);
    if (match) filename = match[1];
  }

  const blobUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(blobUrl);
}

/**
 * Generate a new report and return the reportId for download
 */
export async function generateReport(reportData: {
  type: string;
  title: string;
  data: any;
  templateId?: string;
  options?: any;
}, { signal }: { signal?: AbortSignal } = {}) {
  const response = await fetch("/api/reports/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reportData),
    signal,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Generation failed" }));
    throw new Error(error.message || "Failed to generate report");
  }

  const result = await response.json();
  return result;
}

export interface ReportStatus {
  reportId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  downloadUrl?: string;
  error?: string;
}

/**
 * Poll for report status with exponential backoff
 */
export async function pollReportStatus(
  reportId: string,
  onProgress?: (status: ReportStatus) => void
): Promise<ReportStatus> {
  const maxAttempts = 30; // Max 5 minutes with exponential backoff
  let attempt = 0;
  
  while (attempt < maxAttempts) {
    try {
      const response = await fetch(`/api/reports/${reportId}/status`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const status: ReportStatus = await response.json();
      
      onProgress && onProgress(status);
      
      if (status.status === 'completed' || status.status === 'failed') {
        return status;
      }
      
      // Exponential backoff: 1s, 2s, 4s, 8s, max 16s
      const delay = Math.min(1000 * Math.pow(2, attempt), 16000);
      await new Promise(resolve => setTimeout(resolve, delay));
      
    } catch (error) {
      console.warn(`Status check attempt ${attempt + 1} failed:`, error);
    }
    
    attempt++;
  }
  
  throw new Error('Report generation timed out');
}