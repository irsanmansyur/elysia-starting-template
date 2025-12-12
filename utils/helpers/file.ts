import fs from "node:fs";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE_PATH = path.join(process.cwd(), "storage");

/**
 * Helper untuk memastikan direktori ada
 */
async function ensureDir(filePath: string) {
  const dir = path.dirname(filePath);
  await mkdir(dir, { recursive: true });
}

/**
 * Hapus file (untuk soft delete opsional).
 */
async function remove(relativePath: string): Promise<boolean> {
  try {
    const fullPath = path.join(BASE_PATH, relativePath);
    await unlink(fullPath);
    return true;
  } catch (err: unknown) {
    if (err instanceof Error && (err as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw err;
  }
}

/**
 * Membaca file dari storage.
 * Return buffer atau null jika tidak ditemukan.
 */
async function read(relativePath: string): Promise<Buffer | null> {
  try {
    const fullPath = path.join(BASE_PATH, relativePath);
    return await readFile(fullPath);
  } catch (err: unknown) {
    if (err instanceof Error && (err as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw err;
  }
}

const uploadDir = path.join(process.cwd(), "storage");
export const fileHelpers = {
  async saveFile(file: File, filePathString: string) {
    const filePath = path.join(BASE_PATH, filePathString);
    await fileHelpers.folderPathCreate(filePath);
    // Convert File → Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    // Simpan ke disk
    await writeFile(filePath, buffer);
    return filePathString;
  },

  async saveBufferFile(buffer: Buffer, filePathString: string) {
    const filePath = path.join(BASE_PATH, filePathString);
    await ensureDir(filePath);
    await writeFile(filePath, buffer);
  },

  async newfilePath(filePathString: string) {
    const filePath = path.join(BASE_PATH, filePathString);
    await fileHelpers.folderPathCreate(filePath);
    return filePath;
  },

  async folderPathCreate(filePathString: string) {
    const dir = path.dirname(filePathString);
    await mkdir(dir, { recursive: true });
  },

  fileExists(filePathString: string) {
    const filePath = path.join(BASE_PATH, filePathString);
    const fileExists = fs.existsSync(filePath);
    return fileExists ? filePath : null;
  },

  isMp3File(buffer: Buffer) {
    const magicNumber = buffer.toString("utf8", 0, 3);
    if (magicNumber !== "ID3") {
      return false;
    }
    return true;
  },

  deleteFile(filePathString: string) {
    const filePath = path.join(uploadDir, filePathString);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  },
  read,
  remove,
};

export function formatFileSize(bytes: number) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;

  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }

  return `${bytes.toFixed(bytes >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

export function isFileLike(value: unknown): boolean {
  // Browser File/Blob
  if (typeof File !== "undefined" && value instanceof File) return true;
  if (typeof Blob !== "undefined" && value instanceof Blob) return true;

  // Node Buffer
  if (isBuffer(value)) return true;

  // ArrayBuffer
  if (value instanceof ArrayBuffer) return true;

  // stream/other object from multer/express-fileupload, dsb.
  if (value && typeof value === "object") {
    const v = value as Record<string, string>;
    const fileProps = ["originalname", "mimetype", "buffer", "path", "filename", "size"];
    return fileProps.some((p) => p in v);
  }

  return false;
}

function isBuffer(value: unknown): value is Buffer {
  return typeof Buffer !== "undefined" && Buffer.isBuffer(value as unknown);
}
