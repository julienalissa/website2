"use client";

import { useState, useEffect } from "react";
import type { MenuItem, DrinkItem } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import {
  getMenuItems,
  getDrinkItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  createDrinkItem,
  updateDrinkItem,
  deleteDrinkItem
} from "@/lib/supabase-admin";
import { SimpleRichTextEditor } from "@/components/SimpleRichTextEditor";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  upsertPageContent,
  getRestaurantInfo,
  updateRestaurantInfo,
  getAllGalleryImages
} from "@/lib/cms-admin";

// Catégories de menu
const MENU_CATEGORIES = [
  "Entrées",
  "Plats",
  "Suppléments",
  "Suppléments Sauces",
  "Fondue",
  "Menu Enfants",
  "Desserts"
];

// Catégories de boissons (mapping vers les valeurs de la base de données)
const DRINK_CATEGORIES = [
  { label: "Cocktails", value: "cocktail" },
  { label: "Boissons Non Alcoolisées", value: "non-alcoholic" },
  { label: "Sélection de Vins", value: "wine" },
  { label: "Sélection de Bières", value: "beer" }
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loginStep, setLoginStep] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"menu" | "drinks" | "home" | "about" | "contact" | "events" | "gallery" | "restaurant">("menu");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [drinkItems, setDrinkItems] = useState<DrinkItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | DrinkItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [rebuildStatus, setRebuildStatus] = useState<"idle" | "rebuilding" | "success" | "error">("idle");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  
  // États pour le CMS
  const [pageContent, setPageContent] = useState<Record<string, any>>({});
  const [restaurantInfo, setRestaurantInfo] = useState<any>(null);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [editingBlock, setEditingBlock] = useState<any>(null);
  
  // États pour les formulaires de chaque page
  const [homeData, setHomeData] = useState({
    heroTitle: "Le Savoré",
    tagline: "Fine Dining en Suisse",
    description: "Découvrez une cuisine méditerranéenne de saison, élaborée avec la qualité suisse et le souci du détail dans une atmosphère élégante et accueillante.",
    seasonalTitle: "Excellence de Saison",
    seasonalDescription: "Chez Le Savoré, nous célébrons une cuisine méditerranéenne de saison avec la précision et la qualité suisses. Chaque plat reflète notre engagement envers l'approvisionnement local, l'artisanat culinaire et une expérience de restauration élégante et accessible."
  });
  
  const [aboutData, setAboutData] = useState({
    pageTitle: "Notre Histoire",
    legacyTitle: "Notre Héritage",
    legacyText1: "",
    legacyText2: "",
    legacyText3: "",
    philosophyTitle: "Notre Philosophie",
    swissQuality: "",
    seasonalCuisine: "",
    culinaryCraftsmanship: "",
    warmHospitality: ""
  });
  
  const [contactData, setContactData] = useState({
    pageTitle: "Contact",
    getInTouchTitle: "Prendre Contact",
    getInTouchDescription: "",
    address: "",
    phone: "",
    email: "",
    sendMessageTitle: "Envoyer un Message",
    hours_monday: "",
    hours_tuesday: "",
    hours_wednesday: "",
    hours_thursday: "",
    hours_friday: "",
    hours_saturday: "",
    hours_sunday: ""
  });
  
  const [eventsData, setEventsData] = useState({
    pageTitle: "Événements Privés & Célébrations",
    subtitle: "Créez des moments inoubliables",
    eventTypesTitle: "Types d'Événements",
    eventTypesDescription: "",
    smallWeddingTitle: "Petit Mariage",
    smallWeddingDescription: "",
    baptismBirthdayTitle: "Baptême / Anniversaire",
    baptismBirthdayDescription: "",
    corporateMealTitle: "Repas d'Entreprise",
    corporateMealDescription: "",
    afterCeremonyMealTitle: "Repas après Cérémonie",
    afterCeremonyMealDescription: "",
    customMenusTitle: "Menus Personnalisés",
    customMenusDescription: "",
    dedicatedServiceTitle: "Service Dédié",
    dedicatedServiceDescription: "",
    elegantAtmosphereTitle: "Atmosphère Élégante",
    elegantAtmosphereDescription: "",
    swissQualityTitle: "Qualité Suisse",
    swissQualityDescription: ""
  });
  
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  // Grouper les éléments par catégorie
  const menuItemsByCategory = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const drinkItemsByCategory = drinkItems.reduce((acc, item) => {
    const categoryLabel = DRINK_CATEGORIES.find(c => c.value === item.category)?.label || item.category;
    if (!acc[categoryLabel]) {
      acc[categoryLabel] = [];
    }
    acc[categoryLabel].push(item);
    return acc;
  }, {} as Record<string, DrinkItem[]>);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  useEffect(() => {
    // Vérifier la session Supabase au chargement
    checkSession();
    
    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
      loadData();
    }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
      setIsAuthenticated(true);
      loadData();
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de la session:", error);
    }
  };

  // Ouvrir toutes les catégories par défaut quand les données sont chargées
  useEffect(() => {
    if (menuItems.length > 0 || drinkItems.length > 0) {
      const allCategories = [
        ...MENU_CATEGORIES,
        ...DRINK_CATEGORIES.map(c => c.label)
      ];
      setExpandedCategories(new Set(allCategories));
    }
  }, [menuItems.length, drinkItems.length]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: false, // Ne pas créer d'utilisateur, seulement envoyer le code
          emailRedirectTo: undefined, // Pas de redirection, on veut juste le code
        }
      });

      if (error) {
        console.error("Erreur lors de l'envoi du code:", error);
        showNotification("Erreur : cet email n'est pas autorisé ou n'existe pas", "error");
        setLoginLoading(false);
        return;
      }

      // Code envoyé avec succès
      setLoginStep("code");
      showNotification("Code de vérification envoyé par email !", "success");
    } catch (error) {
      console.error("Erreur:", error);
      showNotification("Une erreur est survenue", "error");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otpCode.trim(),
        type: 'email'
      });

      if (error) {
        console.error("Erreur de vérification:", error);
        showNotification("Code incorrect ou expiré", "error");
        setLoginLoading(false);
        return;
      }

      if (data.session) {
        setIsAuthenticated(true);
        setEmail("");
        setOtpCode("");
        setLoginStep("email");
        showNotification("Connexion réussie !", "success");
        await loadData();
      }
    } catch (error) {
      console.error("Erreur:", error);
      showNotification("Une erreur est survenue lors de la vérification", "error");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    setIsAuthenticated(false);
      setMenuItems([]);
      setDrinkItems([]);
      showNotification("Déconnexion réussie", "success");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      showNotification("Erreur lors de la déconnexion", "error");
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [menu, drinks] = await Promise.all([
        getMenuItems(),
        getDrinkItems()
      ]);
      setMenuItems(menu);
      setDrinkItems(drinks);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
      alert("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMenuItem = async (item: Partial<MenuItem>) => {
    try {
      // Vérifier que tous les champs requis sont présents
      if (!item.name || !item.category || item.price === undefined) {
        throw new Error("Veuillez remplir tous les champs obligatoires (Nom, Catégorie, Prix)");
      }

      if (isNew && editingItem) {
        await createMenuItem({
          name: item.name,
          description: item.description || "",
          price: item.price,
          category: item.category,
          tags: item.tags || []
        });
      } else if (editingItem) {
        await updateMenuItem(editingItem.id, {
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          tags: item.tags
        });
      }
      await loadData();
      setEditingItem(null);
      setIsNew(false);
      setSelectedCategory("");
      showNotification("Élément sauvegardé ! Mise à jour du site en cours...", "success");
      // Déclencher le rebuild automatiquement
      await triggerRebuild();
    } catch (error) {
      console.error("Erreur:", error);
      
      // Logs détaillés pour le débogage
      const { data: { session } } = await supabase.auth.getSession();
      console.error("=== DÉTAILS DE L'ERREUR ===");
      console.error("Erreur complète:", error);
      console.error("Session email:", session?.user?.email);
      console.error("Session expires_at:", session?.expires_at);
      console.error("Session valide:", !!session);
      
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la sauvegarde";
      showNotification(`Erreur: ${errorMessage}`, "error");
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) return;
    try {
      await deleteMenuItem(id);
      await loadData();
      showNotification("Élément supprimé ! Mise à jour du site en cours...", "success");
      await triggerRebuild();
    } catch (error) {
      console.error("Erreur:", error);
      
      // Logs détaillés pour le débogage
      const { data: { session } } = await supabase.auth.getSession();
      console.error("=== DÉTAILS DE L'ERREUR (SUPPRESSION) ===");
      console.error("Erreur complète:", error);
      console.error("Session email:", session?.user?.email);
      console.error("Session expires_at:", session?.expires_at);
      console.error("Session valide:", !!session);
      
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la suppression";
      showNotification(`Erreur: ${errorMessage}`, "error");
    }
  };

  const handleSaveDrinkItem = async (item: Partial<DrinkItem>) => {
    try {
      // Vérifier que tous les champs requis sont présents
      if (!item.name || !item.category || item.price === undefined) {
        throw new Error("Veuillez remplir tous les champs obligatoires (Nom, Catégorie, Prix)");
      }

      if (isNew && editingItem) {
        await createDrinkItem({
          name: item.name,
          description: item.description || "",
          price: item.price,
          category: item.category as "cocktail" | "wine" | "beer" | "non-alcoholic"
        });
      } else if (editingItem) {
        await updateDrinkItem(editingItem.id, {
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category as "cocktail" | "wine" | "beer" | "non-alcoholic"
        });
      }
      await loadData();
      setEditingItem(null);
      setIsNew(false);
      setSelectedCategory("");
      showNotification("Boisson sauvegardée ! Mise à jour du site en cours...", "success");
      await triggerRebuild();
    } catch (error) {
      console.error("Erreur:", error);
      
      // Logs détaillés pour le débogage
      const { data: { session } } = await supabase.auth.getSession();
      console.error("=== DÉTAILS DE L'ERREUR (BOISSON) ===");
      console.error("Erreur complète:", error);
      console.error("Session email:", session?.user?.email);
      console.error("Session expires_at:", session?.expires_at);
      console.error("Session valide:", !!session);
      
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la sauvegarde";
      showNotification(`Erreur: ${errorMessage}`, "error");
    }
  };

  const handleDeleteDrinkItem = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) return;
    try {
      await deleteDrinkItem(id);
      await loadData();
      showNotification("Boisson supprimée ! Mise à jour du site en cours...", "success");
      await triggerRebuild();
    } catch (error) {
      console.error("Erreur:", error);
      showNotification("Erreur lors de la suppression", "error");
    }
  };

  // Fonction de sauvegarde générique pour les pages
  const handleSavePageContent = async (pageSlug: string, sections: Record<string, string>) => {
    setSaving(prev => ({ ...prev, [pageSlug]: true }));
    try {
      const promises = Object.entries(sections).map(([key, value]) =>
        upsertPageContent({
          page_slug: pageSlug,
          section_key: key,
          content_type: key.includes('Description') || key.includes('Text') ? 'html' : 'text',
          content_value: value
        })
      );
      await Promise.all(promises);
      showNotification(`Modifications de la page "${pageSlug}" sauvegardées avec succès !`, "success");
      await triggerRebuild();
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde:", error);
      showNotification(`Erreur lors de la sauvegarde: ${error.message}`, "error");
    } finally {
      setSaving(prev => ({ ...prev, [pageSlug]: false }));
    }
  };
  
  // Sauvegarder la page d'accueil
  const handleSaveHome = async () => {
    await handleSavePageContent("home", {
      "hero-title": homeData.heroTitle,
      "tagline": homeData.tagline,
      "description": homeData.description,
      "seasonal-title": homeData.seasonalTitle,
      "seasonal-description": homeData.seasonalDescription
    });
  };
  
  // Sauvegarder la page About
  const handleSaveAbout = async () => {
    await handleSavePageContent("about", {
      "page-title": aboutData.pageTitle,
      "legacy-title": aboutData.legacyTitle,
      "legacy-text-1": aboutData.legacyText1,
      "legacy-text-2": aboutData.legacyText2,
      "legacy-text-3": aboutData.legacyText3,
      "philosophy-title": aboutData.philosophyTitle,
      "swiss-quality": aboutData.swissQuality,
      "seasonal-cuisine": aboutData.seasonalCuisine,
      "culinary-craftsmanship": aboutData.culinaryCraftsmanship,
      "warm-hospitality": aboutData.warmHospitality
    });
  };
  
  // Sauvegarder la page Contact
  const handleSaveContact = async () => {
    try {
      setSaving(prev => ({ ...prev, contact: true }));
      
      // Sauvegarder le contenu de la page
      await handleSavePageContent("contact", {
        "page-title": contactData.pageTitle,
        "get-in-touch-title": contactData.getInTouchTitle,
        "get-in-touch-description": contactData.getInTouchDescription,
        "send-message-title": contactData.sendMessageTitle
      });
      
      // Sauvegarder les informations du restaurant
      await updateRestaurantInfo({
        address: contactData.address,
        phone: contactData.phone,
        email: contactData.email,
        hours_monday: contactData.hours_monday,
        hours_tuesday: contactData.hours_tuesday,
        hours_wednesday: contactData.hours_wednesday,
        hours_thursday: contactData.hours_thursday,
        hours_friday: contactData.hours_friday,
        hours_saturday: contactData.hours_saturday,
        hours_sunday: contactData.hours_sunday
      });
      
      showNotification("Modifications de la page Contact sauvegardées avec succès !", "success");
      await triggerRebuild();
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde:", error);
      showNotification(`Erreur lors de la sauvegarde: ${error.message}`, "error");
    } finally {
      setSaving(prev => ({ ...prev, contact: false }));
    }
  };
  
  // Sauvegarder la page Events
  const handleSaveEvents = async () => {
    await handleSavePageContent("events", {
      "page-title": eventsData.pageTitle,
      "subtitle": eventsData.subtitle,
      "event-types-title": eventsData.eventTypesTitle,
      "event-types-description": eventsData.eventTypesDescription,
      "small-wedding-title": eventsData.smallWeddingTitle,
      "small-wedding-description": eventsData.smallWeddingDescription,
      "baptism-birthday-title": eventsData.baptismBirthdayTitle,
      "baptism-birthday-description": eventsData.baptismBirthdayDescription,
      "corporate-meal-title": eventsData.corporateMealTitle,
      "corporate-meal-description": eventsData.corporateMealDescription,
      "after-ceremony-meal-title": eventsData.afterCeremonyMealTitle,
      "after-ceremony-meal-description": eventsData.afterCeremonyMealDescription,
      "custom-menus-title": eventsData.customMenusTitle,
      "custom-menus-description": eventsData.customMenusDescription,
      "dedicated-service-title": eventsData.dedicatedServiceTitle,
      "dedicated-service-description": eventsData.dedicatedServiceDescription,
      "elegant-atmosphere-title": eventsData.elegantAtmosphereTitle,
      "elegant-atmosphere-description": eventsData.elegantAtmosphereDescription,
      "swiss-quality-title": eventsData.swissQualityTitle,
      "swiss-quality-description": eventsData.swissQualityDescription
    });
  };
  
  // Sauvegarder les informations du restaurant
  const handleSaveRestaurant = async () => {
    try {
      setSaving(prev => ({ ...prev, restaurant: true }));
      
      await updateRestaurantInfo({
        name: restaurantInfo?.name || "Le Savoré",
        tagline: restaurantInfo?.tagline || "Fine Dining en Suisse",
        description: restaurantInfo?.description || "",
        address: restaurantInfo?.address || "",
        phone: restaurantInfo?.phone || "",
        email: restaurantInfo?.email || "",
        hours_monday: restaurantInfo?.hours_monday || "",
        hours_tuesday: restaurantInfo?.hours_tuesday || "",
        hours_wednesday: restaurantInfo?.hours_wednesday || "",
        hours_thursday: restaurantInfo?.hours_thursday || "",
        hours_friday: restaurantInfo?.hours_friday || "",
        hours_saturday: restaurantInfo?.hours_saturday || "",
        hours_sunday: restaurantInfo?.hours_sunday || ""
      });
      
      showNotification("Informations du restaurant sauvegardées avec succès !", "success");
      await triggerRebuild();
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde:", error);
      showNotification(`Erreur lors de la sauvegarde: ${error.message}`, "error");
    } finally {
      setSaving(prev => ({ ...prev, restaurant: false }));
    }
  };


  // Fonction pour déclencher le rebuild Vercel via Deploy Hook
  const triggerRebuild = async () => {
    setRebuildStatus("rebuilding");
    try {
      // Utiliser directement le Vercel Deploy Hook
      // Cette URL doit être configurée dans Vercel > Settings > Git > Deploy Hooks
      const vercelHookUrl = process.env.NEXT_PUBLIC_VERCEL_DEPLOY_HOOK_URL;
      
      if (!vercelHookUrl) {
        throw new Error("URL du webhook Vercel non configurée. Veuillez configurer NEXT_PUBLIC_VERCEL_DEPLOY_HOOK_URL dans les variables d'environnement.");
      }

      const response = await fetch(vercelHookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erreur lors du déclenchement du rebuild");
      }

      setRebuildStatus("success");
      showNotification("Le site est en cours de mise à jour. Les changements seront visibles dans 2-3 minutes.", "success");
      
      // Réinitialiser le statut après 5 secondes
      setTimeout(() => setRebuildStatus("idle"), 5000);
    } catch (error) {
      console.error("Erreur rebuild:", error);
      setRebuildStatus("error");
      showNotification(`Erreur lors du rebuild: ${error instanceof Error ? error.message : "Erreur inconnue"}`, "error");
      setTimeout(() => setRebuildStatus("idle"), 5000);
    }
  };

  // Fonction pour afficher des notifications
  const showNotification = (message: string, type: "success" | "error" | "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Fonction améliorée pour sauvegarder avec rebuild automatique
  const saveAndRebuild = async (saveFunction: () => Promise<void>) => {
    try {
      await saveFunction();
      // Déclencher le rebuild automatiquement après la sauvegarde
      await triggerRebuild();
    } catch (error) {
      console.error("Erreur:", error);
      showNotification("Erreur lors de la sauvegarde", "error");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">Administration - Le Savoré</h1>
          
          {loginStep === "email" ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
              <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                  placeholder="votre-email@exemple.com"
                required
                  disabled={loginLoading}
              />
                <p className="text-xs text-gray-500 mt-1">
                  Un code de vérification sera envoyé à cet email
                </p>
            </div>
            <button
              type="submit"
                disabled={loginLoading}
                className={`w-full py-2 rounded-lg text-white ${
                  loginLoading 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loginLoading ? "Envoi en cours..." : "Envoyer le code"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("");
                  setOtpCode("");
                }}
                className="w-full py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Réinitialiser
            </button>
          </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Code de vérification</label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                  disabled={loginLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Entrez le code à 6 chiffres reçu par email à <strong>{email}</strong>
                </p>
              </div>
              <button
                type="submit"
                disabled={loginLoading || otpCode.length !== 6}
                className={`w-full py-2 rounded-lg text-white ${
                  loginLoading || otpCode.length !== 6
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loginLoading ? "Vérification..." : "Vérifier le code"}
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoginStep("email");
                    setOtpCode("");
                  }}
                  className="flex-1 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  ← Retour
                </button>
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={loginLoading}
                  className="flex-1 py-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Renvoyer le code
                </button>
              </div>
            </form>
          )}
          
          {notification && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${
              notification.type === "error" 
                ? "bg-red-100 text-red-700" 
                : notification.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}>
              {notification.message}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Header moderne et coloré */}
      <header className="bg-white shadow-xl border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">LS</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
                <p className="text-sm text-gray-600 mt-1">Le Savoré - Gestion du contenu</p>
              </div>
            </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={triggerRebuild}
              disabled={rebuildStatus === "rebuilding"}
                className={`px-5 py-2.5 rounded-lg font-semibold transition-all shadow-lg ${
                rebuildStatus === "rebuilding"
                    ? "bg-gray-400 text-white cursor-not-allowed"
                  : rebuildStatus === "success"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl"
                }`}
              >
                {rebuildStatus === "rebuilding" ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Mise à jour...
                  </span>
                ) : rebuildStatus === "success" ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Site mis à jour !
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Mettre à jour le site
                  </span>
                )}
            </button>
            <button
              onClick={handleLogout}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              Déconnexion
            </button>
          </div>
        </div>
      </div>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg text-white ${
              notification.type === "success"
                ? "bg-green-600"
                : notification.type === "error"
                ? "bg-red-600"
                : "bg-blue-600"
            }`}
          >
            {notification.message}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs modernes - Navigation complète */}
        <div className="mb-8 bg-white p-2 rounded-xl shadow-lg border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={() => setActiveTab("home")}
              className={`px-4 py-3 rounded-lg font-semibold transition-all text-sm ${
                activeTab === "home"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Accueil
              </span>
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`px-4 py-3 rounded-lg font-semibold transition-all text-sm ${
                activeTab === "about"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Notre Histoire
              </span>
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`px-4 py-3 rounded-lg font-semibold transition-all text-sm ${
                activeTab === "contact"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact
              </span>
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`px-4 py-3 rounded-lg font-semibold transition-all text-sm ${
                activeTab === "events"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Événements
              </span>
            </button>
          <button
            onClick={() => setActiveTab("menu")}
              className={`px-4 py-3 rounded-lg font-semibold transition-all text-sm ${
                activeTab === "menu"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Menu
              </span>
          </button>
          <button
            onClick={() => setActiveTab("drinks")}
              className={`px-4 py-3 rounded-lg font-semibold transition-all text-sm ${
                activeTab === "drinks"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            Boissons
              </span>
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
              className={`px-4 py-3 rounded-lg font-semibold transition-all text-sm ${
                activeTab === "gallery"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            Galerie
              </span>
            </button>
            <button
              onClick={() => setActiveTab("restaurant")}
              className={`px-4 py-3 rounded-lg font-semibold transition-all text-sm ${
                activeTab === "restaurant"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Restaurant
              </span>
          </button>
          </div>
        </div>

        {/* Menu Items */}
        {activeTab === "menu" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Éléments du Menu</h2>
            </div>
            <div className="space-y-4">
              {MENU_CATEGORIES.map((category) => {
                const items = menuItemsByCategory[category] || [];
                const isExpanded = expandedCategories.has(category);
                return (
                  <div key={category} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div
                      className="flex justify-between items-center p-5 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all"
                      onClick={() => toggleCategory(category)}
                    >
                      <h3 className="text-xl font-bold text-gray-800">{category}</h3>
                      <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                          {items.length} élément{items.length > 1 ? 's' : ''}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCategory(category);
                            setEditingItem({ id: "", name: "", description: "", price: 0, category: category, tags: [] } as MenuItem);
                            setIsNew(true);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Ajouter
                        </button>
                        <span className="text-gray-400 text-xl">{isExpanded ? '▼' : '▶'}</span>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="border-t bg-gray-50 p-5 space-y-3">
                        {items.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <p className="text-sm">Aucun élément dans cette catégorie</p>
              <button
                onClick={() => {
                                setSelectedCategory(category);
                                setEditingItem({ id: "", name: "", description: "", price: 0, category: category, tags: [] } as MenuItem);
                  setIsNew(true);
                }}
                              className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold"
              >
                              Ajouter le premier élément
              </button>
            </div>
                        ) : (
                          items.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                              <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                  <h4 className="font-bold text-gray-900 text-lg mb-1">{item.name}</h4>
                                  {item.description && (
                                    <div 
                                      className="text-sm text-gray-600 mt-2 line-clamp-2"
                                      dangerouslySetInnerHTML={{ __html: item.description }}
                                    />
                                  )}
                                  <p className="text-lg font-bold text-blue-600 mt-2">{item.price.toFixed(2)} CHF</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setIsNew(false);
                      }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                    >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteMenuItem(item.id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                    >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                      Supprimer
                    </button>
                  </div>
                </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Drink Items */}
        {activeTab === "drinks" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Boissons</h2>
            </div>
            <div className="space-y-4">
              {DRINK_CATEGORIES.map((categoryInfo) => {
                const categoryLabel = categoryInfo.label;
                const items = drinkItemsByCategory[categoryLabel] || [];
                const isExpanded = expandedCategories.has(categoryLabel);
                return (
                  <div key={categoryLabel} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div
                      className="flex justify-between items-center p-5 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all"
                      onClick={() => toggleCategory(categoryLabel)}
                    >
                      <h3 className="text-xl font-bold text-gray-800">{categoryLabel}</h3>
                      <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                          {items.length} élément{items.length > 1 ? 's' : ''}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCategory(categoryInfo.value);
                            setEditingItem({ id: "", name: "", description: "", price: 0, category: categoryInfo.value } as DrinkItem);
                            setIsNew(true);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Ajouter
                        </button>
                        <span className="text-gray-400 text-xl">{isExpanded ? '▼' : '▶'}</span>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="border-t bg-gray-50 p-5 space-y-3">
                        {items.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <p className="text-sm">Aucun élément dans cette catégorie</p>
              <button
                onClick={() => {
                                setSelectedCategory(categoryInfo.value);
                                setEditingItem({ id: "", name: "", description: "", price: 0, category: categoryInfo.value } as DrinkItem);
                  setIsNew(true);
                }}
                              className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold"
              >
                              Ajouter la première boisson
              </button>
            </div>
                        ) : (
                          items.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                              <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                  <h4 className="font-bold text-gray-900 text-lg mb-1">{item.name}</h4>
                                  {item.description && (
                                    <div 
                                      className="text-sm text-gray-600 mt-2 line-clamp-2"
                                      dangerouslySetInnerHTML={{ __html: item.description }}
                                    />
                                  )}
                                  <p className="text-lg font-bold text-blue-600 mt-2">{item.price.toFixed(2)} CHF</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setIsNew(false);
                      }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                    >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteDrinkItem(item.id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                    >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                      Supprimer
                    </button>
                  </div>
                </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Page d'Accueil */}
        {activeTab === "home" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Modifier la Page d'Accueil</h2>
              <p className="text-gray-600 mb-6">Modifiez tous les textes de la page d'accueil</p>
              
              <div className="space-y-6">
          <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Titre Principal (Hero)
                  </label>
                  <input
                    type="text"
                    value={homeData.heroTitle}
                    onChange={(e) => setHomeData({ ...homeData, heroTitle: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    placeholder="Titre principal"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Slogan
                  </label>
                  <input
                    type="text"
                    value={homeData.tagline}
                    onChange={(e) => setHomeData({ ...homeData, tagline: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    placeholder="Slogan"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Description Principale
                  </label>
                  <SimpleRichTextEditor
                    value={homeData.description}
                    onChange={(value) => setHomeData({ ...homeData, description: value })}
                    placeholder="Description de votre restaurant..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Section "Excellence de Saison" - Titre
                  </label>
                  <input
                    type="text"
                    value={homeData.seasonalTitle}
                    onChange={(e) => setHomeData({ ...homeData, seasonalTitle: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Section "Excellence de Saison" - Description
                  </label>
                  <SimpleRichTextEditor
                    value={homeData.seasonalDescription}
                    onChange={(value) => setHomeData({ ...homeData, seasonalDescription: value })}
                    placeholder="Description..."
                  />
                </div>
                
              <button
                  onClick={handleSaveAbout}
                  disabled={saving.about}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving.about ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sauvegarde en cours...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Sauvegarder les modifications
                    </>
                  )}
              </button>
            </div>
            </div>
          </div>
        )}

        {/* Page Notre Histoire */}
        {activeTab === "about" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Modifier la Page "Notre Histoire"</h2>
              <p className="text-gray-600 mb-6">Modifiez tous les textes de la page Notre Histoire</p>
              
              <div className="space-y-6">
                  <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Titre de la Page
                  </label>
                  <input
                    type="text"
                    value={aboutData.pageTitle}
                    onChange={(e) => setAboutData({ ...aboutData, pageTitle: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                  </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Section "Héritage" - Titre
                  </label>
                  <input
                    type="text"
                    value={aboutData.legacyTitle}
                    onChange={(e) => setAboutData({ ...aboutData, legacyTitle: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Section "Héritage" - Paragraphe 1
                  </label>
                  <SimpleRichTextEditor
                    value={aboutData.legacyText1}
                    onChange={(value) => setAboutData({ ...aboutData, legacyText1: value })}
                    placeholder="Premier paragraphe de l'histoire..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Section "Héritage" - Paragraphe 2
                  </label>
                  <SimpleRichTextEditor
                    value={aboutData.legacyText2}
                    onChange={(value) => setAboutData({ ...aboutData, legacyText2: value })}
                    placeholder="Deuxième paragraphe..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Section "Héritage" - Paragraphe 3
                  </label>
                  <SimpleRichTextEditor
                    value={aboutData.legacyText3}
                    onChange={(value) => setAboutData({ ...aboutData, legacyText3: value })}
                    placeholder="Troisième paragraphe..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Section "Philosophie" - Titre
                  </label>
                  <input
                    type="text"
                    value={aboutData.philosophyTitle}
                    onChange={(e) => setAboutData({ ...aboutData, philosophyTitle: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Qualité Suisse - Description
                    </label>
                  <SimpleRichTextEditor
                    value={aboutData.swissQuality}
                    onChange={(value) => setAboutData({ ...aboutData, swissQuality: value })}
                    placeholder="Description de la qualité suisse..."
                  />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Cuisine de Saison - Description
                    </label>
                  <SimpleRichTextEditor
                    value={aboutData.seasonalCuisine}
                    onChange={(value) => setAboutData({ ...aboutData, seasonalCuisine: value })}
                    placeholder="Description de la cuisine de saison..."
                  />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Artisanat Culinaire - Description
                    </label>
                  <SimpleRichTextEditor
                    value={aboutData.culinaryCraftsmanship}
                    onChange={(value) => setAboutData({ ...aboutData, culinaryCraftsmanship: value })}
                    placeholder="Description de l'artisanat culinaire..."
                  />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Hospitalité - Description
                    </label>
                  <SimpleRichTextEditor
                    value={aboutData.warmHospitality}
                    onChange={(value) => setAboutData({ ...aboutData, warmHospitality: value })}
                    placeholder="Description de l'hospitalité..."
                  />
                  </div>
                </div>
                
                    <button
                  onClick={handleSaveContact}
                  disabled={saving.contact}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving.contact ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sauvegarde en cours...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Sauvegarder les modifications
                    </>
                  )}
                    </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Contact */}
        {activeTab === "contact" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Modifier la Page Contact</h2>
              <p className="text-gray-600 mb-6">Modifiez les informations de contact et les textes</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Titre de la Page
                  </label>
                  <input
                    type="text"
                    value={contactData.pageTitle}
                    onChange={(e) => setContactData({ ...contactData, pageTitle: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Section "Prendre Contact" - Titre
                  </label>
                  <input
                    type="text"
                    value={contactData.getInTouchTitle}
                    onChange={(e) => setContactData({ ...contactData, getInTouchTitle: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Section "Prendre Contact" - Description
                  </label>
                  <SimpleRichTextEditor
                    value={contactData.getInTouchDescription}
                    onChange={(value) => setContactData({ ...contactData, getInTouchDescription: value })}
                    placeholder="Description de la section contact..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Adresse
                    </label>
                    <input
                      type="text"
                      defaultValue={restaurantInfo?.address || "Rue Sous-le-Pré 19A, 2014 Bôle"}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Téléphone
                    </label>
                    <input
                      type="text"
                      defaultValue={restaurantInfo?.phone || "+41 76 630 73 10"}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue={restaurantInfo?.email || "info@lesavore.ch"}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Section "Envoyer un Message" - Titre
                    </label>
                    <input
                      type="text"
                      value={contactData.sendMessageTitle}
                      onChange={(e) => setContactData({ ...contactData, sendMessageTitle: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Lundi</label>
                    <input
                      type="text"
                      value={contactData.hours_monday}
                      onChange={(e) => setContactData({ ...contactData, hours_monday: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Mardi</label>
                    <input
                      type="text"
                      value={contactData.hours_tuesday}
                      onChange={(e) => setContactData({ ...contactData, hours_tuesday: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Mercredi</label>
                    <input
                      type="text"
                      value={contactData.hours_wednesday}
                      onChange={(e) => setContactData({ ...contactData, hours_wednesday: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Jeudi</label>
                    <input
                      type="text"
                      value={contactData.hours_thursday}
                      onChange={(e) => setContactData({ ...contactData, hours_thursday: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Vendredi</label>
                    <input
                      type="text"
                      value={contactData.hours_friday}
                      onChange={(e) => setContactData({ ...contactData, hours_friday: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Samedi</label>
                    <input
                      type="text"
                      value={contactData.hours_saturday}
                      onChange={(e) => setContactData({ ...contactData, hours_saturday: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Dimanche</label>
                    <input
                      type="text"
                      value={contactData.hours_sunday}
                      onChange={(e) => setContactData({ ...contactData, hours_sunday: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm"
                    />
                  </div>
                </div>
                
                    <button
                  onClick={handleSaveContact}
                  disabled={saving.contact}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving.contact ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sauvegarde en cours...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Sauvegarder les modifications
                    </>
                  )}
                    </button>
                  </div>
            </div>
          </div>
        )}

        {/* Page Événements */}
        {activeTab === "events" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Modifier la Page Événements</h2>
              <p className="text-gray-600 mb-6">Modifiez tous les textes de la page Événements</p>
              
              <div className="space-y-6">
                  <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Titre de la Page
                  </label>
                    <input
                      type="text"
                    value={eventsData.pageTitle}
                    onChange={(e) => setEventsData({ ...eventsData, pageTitle: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>
                
                  <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Sous-titre
                  </label>
                  <input
                    type="text"
                    value={eventsData.subtitle}
                    onChange={(e) => setEventsData({ ...eventsData, subtitle: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Section "Types d'Événements" - Titre
                  </label>
                  <input
                    type="text"
                    value={eventsData.eventTypesTitle}
                    onChange={(e) => setEventsData({ ...eventsData, eventTypesTitle: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Section "Types d'Événements" - Description
                  </label>
                  <SimpleRichTextEditor
                    value={eventsData.eventTypesDescription}
                    onChange={(value) => setEventsData({ ...eventsData, eventTypesDescription: value })}
                    placeholder="Description des types d'événements..."
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800">Types d'Événements</h3>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Petit Mariage - Titre
                    </label>
                    <input
                      type="text"
                      value={eventsData.smallWeddingTitle}
                      onChange={(e) => setEventsData({ ...eventsData, smallWeddingTitle: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all mb-3"
                    />
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Petit Mariage - Description
                    </label>
                    <SimpleRichTextEditor
                      value={eventsData.smallWeddingDescription}
                      onChange={(value) => setEventsData({ ...eventsData, smallWeddingDescription: value })}
                      placeholder="Description du petit mariage..."
                    />
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Baptême / Anniversaire - Titre
                    </label>
                    <input
                      type="text"
                      value={eventsData.baptismBirthdayTitle}
                      onChange={(e) => setEventsData({ ...eventsData, baptismBirthdayTitle: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all mb-3"
                    />
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Baptême / Anniversaire - Description
                    </label>
                    <SimpleRichTextEditor
                      value={eventsData.baptismBirthdayDescription}
                      onChange={(value) => setEventsData({ ...eventsData, baptismBirthdayDescription: value })}
                      placeholder="Description..."
                    />
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Repas d'Entreprise - Titre
                    </label>
                    <input
                      type="text"
                      value={eventsData.corporateMealTitle}
                      onChange={(e) => setEventsData({ ...eventsData, corporateMealTitle: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all mb-3"
                    />
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Repas d'Entreprise - Description
                    </label>
                    <SimpleRichTextEditor
                      value={eventsData.corporateMealDescription}
                      onChange={(value) => setEventsData({ ...eventsData, corporateMealDescription: value })}
                      placeholder="Description..."
                    />
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Repas après Cérémonie - Titre
                    </label>
                    <input
                      type="text"
                      value={eventsData.afterCeremonyMealTitle}
                      onChange={(e) => setEventsData({ ...eventsData, afterCeremonyMealTitle: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all mb-3"
                    />
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Repas après Cérémonie - Description
                    </label>
                    <SimpleRichTextEditor
                      value={eventsData.afterCeremonyMealDescription}
                      onChange={(value) => setEventsData({ ...eventsData, afterCeremonyMealDescription: value })}
                      placeholder="Description..."
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800">Services</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {["Menus Personnalisés", "Service Dédié", "Atmosphère Élégante", "Qualité Suisse"].map((service) => (
                      <div key={service} className="border border-gray-200 rounded-lg p-4">
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                          {service} - Titre
                        </label>
                        <input
                          type="text"
                          defaultValue={service}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all mb-3"
                        />
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                          {service} - Description
                        </label>
                    <textarea
                      rows={3}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                          placeholder="Description..."
                    />
                  </div>
                    ))}
                  </div>
                </div>
                
                <button 
                  onClick={handleSaveEvents}
                  disabled={saving.events}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving.events ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sauvegarde en cours...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Sauvegarder les modifications
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Galerie */}
        {activeTab === "gallery" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Galerie Photos</h2>
                  <p className="text-gray-600">Gérez toutes les images de la galerie</p>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Ajouter une Image
                </button>
              </div>
              
              {galleryImages.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg mb-4">Aucune image dans la galerie</p>
                  <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
                    Ajouter la première image
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {galleryImages.map((image) => (
                    <div key={image.id} className="relative group border border-gray-200 rounded-lg overflow-hidden">
                      <div className="aspect-square bg-gray-100">
                        <img
                          src={image.image_url || image.src || ""}
                          alt={image.alt_text || image.alt || ""}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                          Modifier
                        </button>
                        <button className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm">
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Informations Restaurant */}
        {activeTab === "restaurant" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Informations du Restaurant</h2>
              <p className="text-gray-600 mb-6">Modifiez les informations générales du restaurant</p>
              
              <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Nom du Restaurant <span className="text-red-500">*</span>
                    </label>
                      <input
                      type="text"
                      value={restaurantInfo?.name || "Le Savoré"}
                      onChange={(e) => setRestaurantInfo({ ...restaurantInfo, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                    </div>
                  
                    <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Slogan <span className="text-red-500">*</span>
                    </label>
                      <input
                        type="text"
                      value={restaurantInfo?.tagline || "Fine Dining en Suisse"}
                      onChange={(e) => setRestaurantInfo({ ...restaurantInfo, tagline: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                    </div>
                  </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <SimpleRichTextEditor
                    value={restaurantInfo?.description || ""}
                    onChange={(value) => setRestaurantInfo({ ...restaurantInfo, description: value })}
                    placeholder="Description du restaurant..."
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Adresse <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={restaurantInfo?.address || "Rue Sous-le-Pré 19A, 2014 Bôle"}
                      onChange={(e) => setRestaurantInfo({ ...restaurantInfo, address: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Téléphone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={restaurantInfo?.phone || "+41 76 630 73 10"}
                      onChange={(e) => setRestaurantInfo({ ...restaurantInfo, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={restaurantInfo?.email || "info@lesavore.ch"}
                      onChange={(e) => setRestaurantInfo({ ...restaurantInfo, email: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-4 text-gray-700">
                    Horaires d'Ouverture
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {[
                      { day: "Lundi", key: "hours_monday" },
                      { day: "Mardi", key: "hours_tuesday" },
                      { day: "Mercredi", key: "hours_wednesday" },
                      { day: "Jeudi", key: "hours_thursday" },
                      { day: "Vendredi", key: "hours_friday" },
                      { day: "Samedi", key: "hours_saturday" },
                      { day: "Dimanche", key: "hours_sunday" }
                    ].map(({ day, key }) => (
                      <div key={key}>
                        <label className="block text-xs font-semibold mb-1 text-gray-600">{day}</label>
                        <input
                          type="text"
                          value={restaurantInfo?.[key] || ""}
                          onChange={(e) => setRestaurantInfo({ ...restaurantInfo, [key]: e.target.value })}
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm"
                          placeholder="Ex: 10h-22h"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                    <button
                  onClick={handleSaveRestaurant}
                  disabled={saving.restaurant}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving.restaurant ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sauvegarde en cours...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Sauvegarder les modifications
                    </>
                  )}
                    </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal - Version améliorée */}
        {editingItem && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">
                    {isNew ? (
                      <span className="flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Ajouter {activeTab === "menu" ? "un élément du menu" : "une boisson"}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Modifier {activeTab === "menu" ? "l'élément du menu" : "la boisson"}
                      </span>
                    )}
                  </h2>
                    <button
                      onClick={() => {
                        setEditingItem(null);
                        setIsNew(false);
                      }}
                    className="text-white hover:text-gray-200 transition-colors"
                    >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    </button>
                  </div>
              </div>
              <div className="p-6">

              {activeTab === "menu" && "name" in editingItem && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleSaveMenuItem({
                      name: formData.get("name") as string,
                      description: editingItem.description || "",
                      price: parseFloat(formData.get("price") as string),
                      category: formData.get("category") as string,
                      tags: []
                    });
                  }}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editingItem.name}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      name="description"
                      defaultValue={editingItem.description}
                      className="w-full px-4 py-2 border rounded-lg"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Prix (CHF) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">CHF</span>
                      <input
                        type="number"
                        name="price"
                        step="0.01"
                          min="0"
                        defaultValue={editingItem.price}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                          placeholder="0.00"
                        required
                      />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Catégorie <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        defaultValue={editingItem.category || selectedCategory}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                        required
                      >
                        {MENU_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Sauvegarder
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(null);
                        setIsNew(false);
                      }}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-all"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              )}

              {activeTab === "drinks" && "name" in editingItem && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleSaveDrinkItem({
                      name: formData.get("name") as string,
                      description: editingItem.description || "",
                      price: parseFloat(formData.get("price") as string),
                      category: formData.get("category") as "cocktail" | "wine" | "beer" | "non-alcoholic"
                    });
                  }}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Nom de la boisson <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editingItem.name}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      placeholder="Ex: Cocktail Signature"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Description
                      <span className="text-xs text-gray-500 ml-2 font-normal">(Utilisez les boutons pour formater le texte)</span>
                    </label>
                    <SimpleRichTextEditor
                      value={editingItem.description || ""}
                      onChange={(value) => {
                        if (editingItem) {
                          setEditingItem({ ...editingItem, description: value });
                        }
                      }}
                      placeholder="Décrivez votre boisson... (vous pouvez utiliser le gras, l'italique, les listes, etc.)"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Prix (CHF) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">CHF</span>
                    <input
                          type="number"
                          name="price"
                          step="0.01"
                          min="0"
                          defaultValue={editingItem.price}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                          placeholder="0.00"
                      required
                    />
                  </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Catégorie <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        defaultValue={editingItem.category || selectedCategory}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                        required
                      >
                        {DRINK_CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Sauvegarder
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(null);
                        setIsNew(false);
                      }}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-all"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              )}

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
