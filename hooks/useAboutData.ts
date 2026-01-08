"use client";

import { useState, useEffect } from "react";
import { getPageContent } from "@/lib/cms-admin";
import { useLanguage } from "@/contexts/LanguageContext";

interface AboutData {
  pageTitle: string;
  legacyTitle: string;
  legacyText1: string;
  legacyText2: string;
  legacyText3: string;
  philosophyTitle: string;
  swissQuality: string;
  seasonalCuisine: string;
  culinaryCraftsmanship: string;
  warmHospitality: string;
}

export function useAboutData() {
  const { t } = useLanguage();
  const [aboutData, setAboutData] = useState<AboutData>({
    pageTitle: t.about.title,
    legacyTitle: t.about.legacy,
    legacyText1: t.about.legacyText1,
    legacyText2: t.about.legacyText2,
    legacyText3: t.about.legacyText3,
    philosophyTitle: t.about.philosophy,
    swissQuality: `${t.about.swissQuality} : ${t.about.swissQualityText}`,
    seasonalCuisine: `${t.about.seasonalCuisine} : ${t.about.seasonalCuisineText}`,
    culinaryCraftsmanship: `${t.about.culinaryCraftsmanship} : ${t.about.culinaryCraftsmanshipText}`,
    warmHospitality: `${t.about.warmHospitality} : ${t.about.warmHospitalityText}`
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const pageContent = await getPageContent("about");
        
        // Convertir les données de Supabase en format AboutData
        const contentMap: Record<string, string> = {};
        pageContent.forEach(item => {
          contentMap[item.section_key] = item.content_value || "";
        });

        // Utiliser les données de Supabase si disponibles, sinon les traductions par défaut
        setAboutData(prev => ({
          pageTitle: contentMap["page-title"] || prev.pageTitle,
          legacyTitle: contentMap["legacy-title"] || prev.legacyTitle,
          legacyText1: contentMap["legacy-text-1"] || prev.legacyText1,
          legacyText2: contentMap["legacy-text-2"] || prev.legacyText2,
          legacyText3: contentMap["legacy-text-3"] || prev.legacyText3,
          philosophyTitle: contentMap["philosophy-title"] || prev.philosophyTitle,
          swissQuality: contentMap["swiss-quality"] || prev.swissQuality,
          seasonalCuisine: contentMap["seasonal-cuisine"] || prev.seasonalCuisine,
          culinaryCraftsmanship: contentMap["culinary-craftsmanship"] || prev.culinaryCraftsmanship,
          warmHospitality: contentMap["warm-hospitality"] || prev.warmHospitality
        }));
      } catch (error) {
        console.error("Erreur lors du chargement des données About:", error);
        // En cas d'erreur, on garde les données par défaut
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return {
    aboutData,
    loading
  };
}
