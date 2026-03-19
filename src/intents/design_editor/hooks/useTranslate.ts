import { useState, useCallback } from "react";
import {
  translateImageWithClaude,
  AnthropicClientConfig,
} from "../lib/anthropicClient";
import { TranslationEntry, AppError } from "../lib/types";

export interface UseTranslateResult {
  translate: (base64Image: string) => Promise<TranslationEntry[] | null>;
  isLoading: boolean;
  error: AppError | null;
}

export function useTranslate(config: AnthropicClientConfig): UseTranslateResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const translate = useCallback(
    async (base64Image: string): Promise<TranslationEntry[] | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const entries = await translateImageWithClaude(base64Image, config);
        return entries;
      } catch (err) {
        setError(err as AppError);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [config],
  );

  return { translate, isLoading, error };
}
