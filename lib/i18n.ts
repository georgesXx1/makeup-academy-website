export type Language = "en" | "fr" | "ar";

export const DEFAULT_LANGUAGE: Language = "en";

export const LANGUAGES: Array<{ value: Language; label: string }> = [
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
  { value: "ar", label: "العربية" },
];

export function isLanguage(value: string | null | undefined): value is Language {
  return value === "en" || value === "fr" || value === "ar";
}
