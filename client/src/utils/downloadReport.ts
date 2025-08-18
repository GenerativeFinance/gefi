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