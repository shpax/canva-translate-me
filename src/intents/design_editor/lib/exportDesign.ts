import { requestExport } from "@canva/design";
import { AppError } from "./types";

// Injectable fetch function so tests can mock HTTP without patching globals
export type FetchFn = typeof fetch;

export async function exportCurrentPageAsBase64(
  fetchFn: FetchFn = fetch,
): Promise<string> {
  // zipped: "never" ensures each page is a separate blob (not a ZIP).
  // We always take only the first blob — multi-page export is not supported.
  const response = await requestExport({
    acceptedFileTypes: [{ type: "png", zipped: "never" }],
  });

  if (response.status === "aborted") {
    throw buildError("export_failed", "Export was cancelled.");
  }

  const blob = response.exportBlobs[0];
  if (!blob) {
    throw buildError("export_failed", "Export returned no files.");
  }

  return downloadImageAsBase64(blob.url, fetchFn);
}

export async function downloadImageAsBase64(
  url: string,
  fetchFn: FetchFn = fetch,
): Promise<string> {
  const res = await fetchFn(url);
  if (!res.ok) {
    throw buildError("export_failed", `Could not download export image: ${res.status}`);
  }
  const buffer = await res.arrayBuffer();
  return arrayBufferToBase64(buffer);
}

// Pure utility — easily unit-tested without any I/O
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i] ?? 0);
  }
  return btoa(binary);
}

function buildError(code: AppError["code"], message: string): AppError {
  return { code, message };
}
