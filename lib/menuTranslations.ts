// Traductions des catégories de menu

import { Language } from "./i18n";

export const getMenuCategoryTranslation = (category: string, lang: Language): string => {
  const translations: Record<string, Record<Language, string>> = {
    "Entrées": {
      fr: "Entrées",
      en: "Starters",
      de: "Vorspeisen"
    },
    "Plats": {
      fr: "Plats",
      en: "Main Courses",
      de: "Hauptgerichte"
    },
    "Plats Principaux": {
      fr: "Plats Principaux",
      en: "Main Courses",
      de: "Hauptgerichte"
    },
    "Suppléments": {
      fr: "Suppléments",
      en: "Sides",
      de: "Beilagen"
    },
    "Suppléments Sauces": {
      fr: "Suppléments Sauces",
      en: "Sauce Supplements",
      de: "Saucen-Beilagen"
    },
    "Fondue": {
      fr: "Fondue",
      en: "Fondue",
      de: "Fondue"
    },
    "Fondue Suisse (Minimum 2 Personnes)": {
      fr: "Fondue Suisse (Minimum 2 Personnes)",
      en: "Swiss Fondue (Minimum 2 People)",
      de: "Schweizer Fondue (Minimum 2 Personen)"
    },
    "Menu Enfants": {
      fr: "Menu Enfants",
      en: "Kids Menu",
      de: "Kindermenü"
    },
    "Desserts": {
      fr: "Desserts",
      en: "Desserts",
      de: "Desserts"
    }
  };

  return translations[category]?.[lang] || category;
};

export const getTagTranslation = (tag: string, lang: Language): string => {
  const translations: Record<string, Record<Language, string>> = {};

  return translations[tag]?.[lang] || tag;
};





