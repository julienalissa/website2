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
  const [activeTab, setActiveTab] = useState<"menu" | "drinks">("menu");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [drinkItems, setDrinkItems] = useState<DrinkItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | DrinkItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [rebuildStatus, setRebuildStatus] = useState<"idle" | "rebuilding" | "success" | "error">("idle");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

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
        {/* Tabs modernes */}
        <div className="flex gap-2 mb-8 bg-white p-2 rounded-xl shadow-lg border border-gray-200">
          <button
            onClick={() => setActiveTab("menu")}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "menu"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Menu
            </span>
          </button>
          <button
            onClick={() => setActiveTab("drinks")}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "drinks"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Boissons
            </span>
          </button>
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
