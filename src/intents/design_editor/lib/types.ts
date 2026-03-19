// Represents a single translatable text element with 3 variants
export interface TranslationEntry {
  original: string;
  a: string;
  b: string;
  c: string;
  appliedVariant?: "a" | "b" | "c";
  applyError?: boolean;
  existsInDesign?: boolean;
}

// Discriminated union makes state transitions explicit and exhaustive
export type AppStatus =
  | "idle"
  | "settings"
  | "exporting"
  | "translating"
  | "reviewing"
  | "done"
  | "error";

export type ErrorCode =
  | "export_failed"
  | "claude_failed"
  | "no_text"
  | "parse_error"
  | "timeout";

export interface AppError {
  code: ErrorCode;
  message: string;
}

// Raw shape returned by Claude — validated before use
export interface RawTranslationEntry {
  original: unknown;
  a: unknown;
  b: unknown;
  c: unknown;
}

export type TranslationVariant = "a" | "b" | "c";
