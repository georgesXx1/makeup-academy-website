"use client";

import { useRouter } from "next/navigation";
import type { Language } from "@/lib/i18n";

const languages: Array<{ value: Language; label: string }> = [
  { value: "en", label: "English" },
  { value: "ar", label: "العربية" },
  { value: "fr", label: "Francais" },
];

export function LanguageSwitcher({ currentLanguage }: { currentLanguage: Language }) {
  const router = useRouter();

  function setLanguage(language: Language) {
    document.cookie = `eb-language=${language}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  }

  return (
    <div className="flex items-center rounded-full border border-[#151313]/10 bg-white/70 p-1" aria-label="Language selector">
      {languages.map((language) => (
        <button
          key={language.value}
          type="button"
          onClick={() => setLanguage(language.value)}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            currentLanguage === language.value ? "bg-[#151313] text-[#f6ead7]" : "text-[#51433f] hover:bg-[#fbf7f1]"
          }`}
          aria-pressed={currentLanguage === language.value}
        >
          {language.label}
        </button>
      ))}
    </div>
  );
}
