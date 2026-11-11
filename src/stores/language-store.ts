"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { uzTranslations, TranslationSchema } from "@/locales/uz";
import { enTranslations } from "@/locales/en";

export type SupportedLanguage = "uz" | "en";

interface LanguageState {
  language: SupportedLanguage;
  isHydrated: boolean;
  setLanguage: (lang: SupportedLanguage) => void;
  toggleLanguage: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      // Default to Uzbek as requested by user
      language: "uz",
      isHydrated: false,

      setLanguage: (lang) => {
        set({ language: lang });
        if (typeof document !== "undefined") {
          document.documentElement.lang = lang;
        }
      },

      toggleLanguage: () => {
        const next = get().language === "uz" ? "en" : "uz";
        get().setLanguage(next);
      },

      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: "xasan_language_storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
        if (state?.language && typeof document !== "undefined") {
          document.documentElement.lang = state.language;
        }
      },
    }
  )
);

/**
 * Access the translation dictionary for the active language.
 */
export function getTranslations(lang: SupportedLanguage = "uz"): TranslationSchema {
  return lang === "uz" ? uzTranslations : enTranslations;
}

/**
 * Universal React hook for reactive i18n throughout components.
 */
export function useTranslation() {
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const toggleLanguage = useLanguageStore((s) => s.toggleLanguage);
  const isHydrated = useLanguageStore((s) => s.isHydrated);

  // During SSR or before hydration, use default "uz"
  const activeLang = isHydrated ? language : "uz";
  const dict = getTranslations(activeLang);

  /**
   * Safe nested key getter: t("nav.tasks") or t("dashboard.stats.completed_tasks")
   */
  const t = (path: string, fallback?: string): any => {
    const segments = path.split(".");
    let current: any = dict;

    for (const segment of segments) {
      if (current && typeof current === "object" && segment in current) {
        current = current[segment];
      } else {
        // Fallback to English dictionary if key missing in Uzbek
        let enCurrent: any = enTranslations;
        for (const enSegment of segments) {
          if (enCurrent && typeof enCurrent === "object" && enSegment in enCurrent) {
            enCurrent = enCurrent[enSegment];
          } else {
            return fallback || path;
          }
        }
        return enCurrent ?? fallback ?? path;
      }
    }

    return current ?? fallback ?? path;
  };

  return {
    t,
    dict,
    language: activeLang,
    setLanguage,
    toggleLanguage,
    isUz: activeLang === "uz",
    isHydrated,
  };
}
