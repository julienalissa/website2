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
        // Essayer de charger depuis Supabase
        const [menu, drinks, gallery] = await Promise.all([
          getMenuItems(),
          getDrinkItems(),
          getGalleryImages()
        ]);

        // Si on a des données depuis Supabase, les utiliser
        if (menu.length > 0) setMenuItemsData(menu);
        if (drinks.length > 0) setDrinkItemsData(drinks);
        if (gallery.length > 0) setGalleryImagesData(gallery);
      } catch (error) {
        console.error("Erreur lors du chargement depuis Supabase, utilisation des données par défaut:", error);
        // En cas d'erreur, on garde les données par défaut de lib/data.ts
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
