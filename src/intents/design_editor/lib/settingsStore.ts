import { DEFAULT_LANGUAGE_CODE } from "./languages";

const LANGUAGE_KEY = "canva_translator_target_language";

export const settingsStore = {
  getLanguageCode(): string {
    return localStorage.getItem(LANGUAGE_KEY) ?? DEFAULT_LANGUAGE_CODE;
  },
  setLanguageCode(code: string): void {
    localStorage.setItem(LANGUAGE_KEY, code);
  },
};
