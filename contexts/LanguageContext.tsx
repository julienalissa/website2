"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, getTranslations, getLanguageFromStorage, setLanguageInStorage, Translations } from "@/lib/i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load language from storage on mount
    const storedLang = getLanguageFromStorage();
    setLanguageState(storedLang);
    setMounted(true);
    // Update HTML lang attribute on mount
    if (typeof document !== "undefined") {
      document.documentElement.lang = storedLang;
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setLanguageInStorage(lang);
    // Update HTML lang attribute
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  };

  // Always provide the context, even during initial mount
  // Use default language "fr" until we load from storage
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: getTranslations(language) }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

