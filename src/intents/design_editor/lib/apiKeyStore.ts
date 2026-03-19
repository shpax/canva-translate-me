const STORAGE_KEY = "canva_ua_translator_anthropic_key";

export const apiKeyStore = {
  get(): string {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  },
  set(key: string): void {
    localStorage.setItem(STORAGE_KEY, key.trim());
  },
  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
  isSet(): boolean {
    return !!localStorage.getItem(STORAGE_KEY);
  },
};
