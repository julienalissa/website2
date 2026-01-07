"use client";

import { useState, useEffect } from "react";
import { getMenuItems, getDrinkItems, getGalleryImages } from "@/lib/supabase-admin";
import { menuItems, drinkItems, galleryImages } from "@/lib/data";
import type { MenuItem, DrinkItem, GalleryImage } from "@/lib/data";

export function useContentData() {
  const [menuItemsData, setMenuItemsData] = useState<MenuItem[]>(menuItems);
  const [drinkItemsData, setDrinkItemsData] = useState<DrinkItem[]>(drinkItems);
  const [galleryImagesData, setGalleryImagesData] = useState<GalleryImage[]>(galleryImages);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // TOUJOURS charger depuis Supabase en priorité
        const [menu, drinks, gallery] = await Promise.all([
          getMenuItems(),
          getDrinkItems(),
          getGalleryImages()
        ]);

        // Utiliser les données de Supabase même si elles sont vides
        // Cela permet de voir les modifications en temps réel
        setMenuItemsData(menu);
        setDrinkItemsData(drinks);
        setGalleryImagesData(gallery);
      } catch (error) {
        console.error("Erreur lors du chargement depuis Supabase:", error);
        // En cas d'erreur, on garde les données par défaut de lib/data.ts
        // Mais on ne les utilise que si Supabase échoue vraiment
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return {
    menuItems: menuItemsData,
    drinkItems: drinkItemsData,
    galleryImages: galleryImagesData,
    loading
  };
}
