import { promises as fs } from "fs";
import path from "path";
import { BlobNotFoundError, get, put } from "@vercel/blob";

const dataDirectory = path.join(process.cwd(), "data");

function hasBlobStorage() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      (process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID),
  );
}

function isVercelRuntime() {
  return Boolean(process.env.VERCEL || process.env.VERCEL_ENV);
}

function assertWritableStorage() {
  if (isVercelRuntime() && !hasBlobStorage()) {
    throw new Error("Vercel Blob is not configured. Connect a Blob store to this Vercel project so admin changes can be saved.");
  }
}

async function readStream(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
  }

  return result + decoder.decode();
}

async function readLocalJson<T>(fileName: string) {
  try {
    const file = await fs.readFile(path.join(dataDirectory, fileName), "utf8");
    return JSON.parse(file) as T;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;

    if (code !== "ENOENT") {
      throw error;
    }

    return null;
  }
}

export async function readJsonFile<T>(fileName: string, fallback: T): Promise<T> {
  if (hasBlobStorage()) {
    try {
      const result = await get(`data/${fileName}`, { access: "private" });

      if (result?.statusCode === 200) {
        return JSON.parse(await readStream(result.stream)) as T;
      }
    } catch (error) {
      if (!(error instanceof BlobNotFoundError)) {
        throw error;
      }
    }

    const seedValue = (await readLocalJson<T>(fileName)) ?? fallback;
    await writeJsonFile(fileName, seedValue);
    return seedValue;
  }

  const localValue = await readLocalJson<T>(fileName);
  if (localValue !== null) return localValue;

  await writeJsonFile(fileName, fallback);
  return fallback;
}

export async function writeJsonFile<T>(fileName: string, value: T) {
  const content = JSON.stringify(value, null, 2);

  if (hasBlobStorage()) {
    await put(`data/${fileName}`, content, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60,
      contentType: "application/json",
    });
    return;
  }

  assertWritableStorage();
  await fs.mkdir(dataDirectory, { recursive: true });
  await fs.writeFile(path.join(dataDirectory, fileName), content, "utf8");
}
