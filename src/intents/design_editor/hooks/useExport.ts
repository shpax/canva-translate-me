import { useState, useCallback } from "react";
import { exportCurrentPageAsBase64 } from "../lib/exportDesign";
import { AppError } from "../lib/types";

export type ExportPhase = "idle" | "exporting" | "done";

export interface UseExportResult {
  phase: ExportPhase;
  run: () => Promise<string | null>;
  error: AppError | null;
}

export function useExport(): UseExportResult {
  const [phase, setPhase] = useState<ExportPhase>("idle");
  const [error, setError] = useState<AppError | null>(null);

  const run = useCallback(async (): Promise<string | null> => {
    setError(null);
    setPhase("exporting");
    try {
      const base64 = await exportCurrentPageAsBase64();
      setPhase("done");
      return base64;
    } catch (err) {
      setError(err as AppError);
      setPhase("idle");
      return null;
    }
  }, []);

  return { phase, run, error };
}
