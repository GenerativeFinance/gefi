import { apiRequest } from "@/lib/queryClient";

export type GenerateOptions = {
  template: "performance" | "risk" | "compliance";
  input: {
    title?: string;
    period?: string;
    generatedBy?: string;
    summary?: string;
    metrics?: Array<{ label: string; value: string }>;
    sections?: Array<{ heading: string; body: string }>;
  };
};

export async function generateReport(opts: GenerateOptions) {
  return apiRequest("POST", "/api/reports/generate", opts);
}

export async function exportAndDownload(opts: GenerateOptions) {
  const result: any = await generateReport(opts);
  const url = result?.downloadUrl;
  if (url) {
    window.open(url, "_blank");
  }
  return result;
}