import React, { useCallback, useState } from "react";
import * as styles from "styles/components.css";
import { AppError, AppStatus, TranslationEntry, TranslationVariant } from "./lib/types";
import { apiKeyStore } from "./lib/apiKeyStore";
import { settingsStore } from "./lib/settingsStore";
import { isDummyKey } from "./lib/mockTranslation";
import { applyAllTranslations, applyTranslation, checkTextsExist } from "./lib/applyTranslation";
import { useExport } from "./hooks/useExport";
import { useTranslate } from "./hooks/useTranslate";
import { KeySetupScreen } from "./components/KeySetupScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { IdleScreen } from "./components/IdleScreen";
import { LoadingScreen } from "./components/LoadingScreen";
import { ReviewTable } from "./components/ReviewTable";
import { DoneScreen } from "./components/DoneScreen";
import { ErrorScreen } from "./components/ErrorScreen";

export function App() {
  const [apiKey, setApiKey] = useState(() => apiKeyStore.get());
  const [status, setStatus] = useState<AppStatus>("idle");
  const [entries, setEntries] = useState<TranslationEntry[]>([]);
  const [error, setError] = useState<AppError | null>(null);

  const { run: runExport } = useExport();
  const { translate } = useTranslate({
    apiKey,
    targetLanguageCode: settingsStore.getLanguageCode(),
  });

  const handleKeySaved = useCallback(() => {
    setApiKey(apiKeyStore.get());
  }, []);

  const handleAnalyze = useCallback(async () => {
    setError(null);
    setStatus("exporting");

    const base64Image = await runExport();
    if (!base64Image) {
      setStatus("error");
      setError({ code: "export_failed", message: "Couldn't export the design." });
      return;
    }

    setStatus("translating");
    const result = await translate(base64Image);
    if (!result) {
      setStatus("error");
      setError({ code: "claude_failed", message: "Translation service unavailable." });
      return;
    }

    if (isDummyKey(apiKey)) {
      setEntries(result.map((e) => ({ ...e, existsInDesign: true })));
    } else {
      const found = await checkTextsExist(result.map((e) => e.original));
      setEntries(result.map((e) => ({ ...e, existsInDesign: found.has(e.original.trim()) })));
    }
    setStatus("reviewing");
  }, [runExport, translate]);

  const handleApply = useCallback(
    async (index: number, variant: TranslationVariant) => {
      const entry = entries[index];
      if (!entry) return;

      try {
        const { matched } = await applyTranslation(entry.original, entry[variant]);
        setEntries((prev) =>
          prev.map((e, i) =>
            i === index
              ? { ...e, appliedVariant: variant, applyError: !matched }
              : e,
          ),
        );
      } catch {
        setEntries((prev) =>
          prev.map((e, i) => (i === index ? { ...e, applyError: true } : e)),
        );
      }
    },
    [entries],
  );

  const handleApplyAll = useCallback(async (variant: TranslationVariant) => {
    const unapplied = entries
      .map((e, i) => ({ entry: e, index: i }))
      .filter(({ entry }) => !entry.appliedVariant);

    if (unapplied.length === 0) return;

    const pairs = unapplied.map(({ entry }) => ({
      original: entry.original,
      translated: entry[variant],
    }));

    try {
      const results = await applyAllTranslations(pairs);
      setEntries((prev) =>
        prev.map((e, i) => {
          const wasUnapplied = unapplied.some(({ index }) => index === i);
          if (!wasUnapplied) return e;
          const matched = results.get(e.original) ?? false;
          return { ...e, appliedVariant: variant, applyError: !matched };
        }),
      );
    } catch {
      setEntries((prev) =>
        prev.map((e, i) => {
          const wasUnapplied = unapplied.some(({ index }) => index === i);
          return wasUnapplied ? { ...e, applyError: true } : e;
        }),
      );
    }
  }, [entries]);

  const handleFinish = useCallback(() => {
    setStatus("done");
  }, []);

  const handleReset = useCallback(() => {
    setStatus("idle");
    setEntries([]);
    setError(null);
  }, []);

  const handleKeyCleared = useCallback(() => {
    apiKeyStore.clear();
    setApiKey("");
  }, []);

  // Show setup screen until the user saves an API key
  if (!apiKey) {
    return (
      <div className={styles.scrollContainer}>
        <KeySetupScreen onSaved={handleKeySaved} />
      </div>
    );
  }

  if (status === "settings") {
    return (
      <div className={styles.scrollContainer}>
        <SettingsScreen
          onBack={() => setStatus("idle")}
          onKeyCleared={handleKeyCleared}
        />
      </div>
    );
  }

  const appliedCount = entries.filter((e) => e.appliedVariant).length;

  return (
    <div className={styles.scrollContainer}>
      {status === "idle" && (
        <IdleScreen
          onAnalyze={handleAnalyze}
          onSettings={() => setStatus("settings")}
        />
      )}

      {(status === "exporting" || status === "translating") && (
        <LoadingScreen status={status} />
      )}

      {status === "reviewing" && (
        <ReviewTable
          entries={entries}
          onApply={handleApply}
          onApplyAll={handleApplyAll}
          onFinish={handleFinish}
          onReset={handleReset}
        />
      )}

      {status === "done" && (
        <DoneScreen count={appliedCount} onReset={handleReset} />
      )}

      {status === "error" && error && (
        <ErrorScreen error={error} onRetry={handleReset} />
      )}
    </div>
  );
}
