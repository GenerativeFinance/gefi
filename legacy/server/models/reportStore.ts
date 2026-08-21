import fs from "fs/promises";
import path from "path";

const META_DIR = path.join(process.cwd(), "storage", "reports", "metadata");

interface ReportMetadata {
  id: string;
  ownerId: string | null;
  templateId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
  updatedAt: string;
  error: string | null;
  s3Key: string | null;
  signedUrl: string | null;
  pdfPath: string | null;
}

async function ensureDir() {
  await fs.mkdir(META_DIR, { recursive: true });
}

async function getPath(id: string) {
  await ensureDir();
  return path.join(META_DIR, `${id}.json`);
}

async function createReport(metadata: ReportMetadata) {
  const p = await getPath(metadata.id);
  await fs.writeFile(p, JSON.stringify(metadata, null, 2), "utf8");
  return metadata;
}

async function updateReport(id: string, delta: Partial<ReportMetadata>) {
  const p = await getPath(id);
  try {
    const raw = await fs.readFile(p, "utf8");
    const data = JSON.parse(raw);
    const merged = { ...data, ...delta };
    await fs.writeFile(p, JSON.stringify(merged, null, 2), "utf8");
    return merged;
  } catch (err) {
    throw err;
  }
}

async function getReport(id: string): Promise<ReportMetadata | null> {
  const p = await getPath(id);
  try {
    const raw = await fs.readFile(p, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

export default { createReport, updateReport, getReport };
export type { ReportMetadata };