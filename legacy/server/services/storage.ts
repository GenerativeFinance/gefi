import fs from "fs";
import fsp from "fs/promises";
import path from "path";

export const STORAGE_ROOT = process.env.STORAGE_ROOT || path.resolve(process.cwd(), "storage");
export const REPORTS_DIR = process.env.REPORTS_STORAGE_DIR || path.join(STORAGE_ROOT, "reports");
export const REPORTS_META_DIR = path.join(REPORTS_DIR, "metadata");

export async function ensureDirs() {
  await fsp.mkdir(STORAGE_ROOT, { recursive: true });
  await fsp.mkdir(REPORTS_DIR, { recursive: true });
  await fsp.mkdir(REPORTS_META_DIR, { recursive: true });
}

export async function saveBufferFile(outPath: string, data: Buffer) {
  await fsp.mkdir(path.dirname(outPath), { recursive: true });
  await fsp.writeFile(outPath, data);
  return outPath;
}

export async function writeJSON(outPath: string, data: any) {
  await fsp.mkdir(path.dirname(outPath), { recursive: true });
  await fsp.writeFile(outPath, JSON.stringify(data, null, 2), "utf-8");
}

export type StorageFile = {
  id: string;
  name: string;
  path: string;
  relativePath: string;
  size: number;
  modifiedAt: string;
  ext: string;
  type: "Report" | "Dataset" | "AI Model" | "Document" | "Other";
  isGenerated?: boolean;
};

function classifyByExt(ext: string): StorageFile["type"] {
  const e = ext.toLowerCase();
  if (e === ".pdf") return "Report";
  if ([".csv", ".parquet", ".json", ".xlsx"].includes(e)) return "Dataset";
  if ([".pkl", ".h5", ".pt", ".onnx", ".joblib", ".model"].includes(e)) return "AI Model";
  if ([".txt", ".md", ".doc", ".docx"].includes(e)) return "Document";
  return "Other";
}

function generateFileId(filePath: string): string {
  return Buffer.from(filePath).toString('base64url').slice(0, 12);
}

export async function listFilesRecursive(dir = STORAGE_ROOT): Promise<StorageFile[]> {
  const results: StorageFile[] = [];
  
  const walk = async (d: string) => {
    if (!fs.existsSync(d)) return;
    
    const entries = await fsp.readdir(d, { withFileTypes: true });
    
    for (const ent of entries) {
      const fullPath = path.join(d, ent.name);
      
      if (ent.isDirectory()) {
        // Skip metadata directories from listing
        if (ent.name === "metadata") continue;
        await walk(fullPath);
      } else {
        try {
          const stat = await fsp.stat(fullPath);
          const ext = path.extname(ent.name);
          const relativePath = path.relative(STORAGE_ROOT, fullPath);
          const isGenerated = fullPath.startsWith(REPORTS_DIR) && !fullPath.includes("metadata");
          
          results.push({
            id: generateFileId(fullPath),
            name: ent.name,
            path: fullPath,
            relativePath,
            size: stat.size,
            modifiedAt: stat.mtime.toISOString(),
            ext,
            type: classifyByExt(ext),
            isGenerated
          });
        } catch (error) {
          console.warn(`Failed to stat file ${fullPath}:`, error);
        }
      }
    }
  };
  
  await walk(dir);
  
  // Sort by modification date (newest first)
  return results.sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime());
}

export async function getFileById(id: string): Promise<StorageFile | null> {
  const files = await listFilesRecursive();
  return files.find(f => f.id === id) || null;
}

export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    await fsp.unlink(filePath);
    
    // If it's a generated report, also delete metadata
    if (filePath.startsWith(REPORTS_DIR)) {
      const basename = path.basename(filePath, path.extname(filePath));
      const metaPath = path.join(REPORTS_META_DIR, `${basename.replace('report-', '')}.json`);
      
      if (fs.existsSync(metaPath)) {
        await fsp.unlink(metaPath);
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Failed to delete file ${filePath}:`, error);
    return false;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}