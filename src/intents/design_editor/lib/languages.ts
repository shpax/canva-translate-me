export interface Language {
  code: string;
  label: string;   // English name shown in the dropdown
  native: string;  // Native name used in the system prompt
}

export const LANGUAGES: Language[] = [
  { code: "en", label: "English", native: "English" },
  { code: "uk", label: "Ukrainian", native: "Ukrainian" },
  { code: "pl", label: "Polish", native: "Polish" },
  { code: "de", label: "German", native: "German" },
  { code: "fr", label: "French", native: "French" },
  { code: "es", label: "Spanish", native: "Spanish" },
  { code: "it", label: "Italian", native: "Italian" },
  { code: "pt", label: "Portuguese", native: "Portuguese" },
  { code: "nl", label: "Dutch", native: "Dutch" },
  { code: "sv", label: "Swedish", native: "Swedish" },
  { code: "no", label: "Norwegian", native: "Norwegian" },
  { code: "da", label: "Danish", native: "Danish" },
  { code: "fi", label: "Finnish", native: "Finnish" },
  { code: "cs", label: "Czech", native: "Czech" },
  { code: "sk", label: "Slovak", native: "Slovak" },
  { code: "ro", label: "Romanian", native: "Romanian" },
  { code: "hu", label: "Hungarian", native: "Hungarian" },
  { code: "bg", label: "Bulgarian", native: "Bulgarian" },
  { code: "hr", label: "Croatian", native: "Croatian" },
  { code: "el", label: "Greek", native: "Greek" },
  { code: "tr", label: "Turkish", native: "Turkish" },
  { code: "ar", label: "Arabic", native: "Arabic" },
  { code: "ja", label: "Japanese", native: "Japanese" },
  { code: "ko", label: "Korean", native: "Korean" },
  { code: "zh-CN", label: "Chinese (Simplified)", native: "Simplified Chinese" },
  { code: "zh-TW", label: "Chinese (Traditional)", native: "Traditional Chinese" },
];

export const DEFAULT_LANGUAGE_CODE = "en";

export function findLanguage(code: string): Language {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0]!;
}
