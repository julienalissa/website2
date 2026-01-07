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
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Administration - Le Savoré</h1>
          <div className="flex gap-3 items-center">
            <button
              onClick={triggerRebuild}
              disabled={rebuildStatus === "rebuilding"}
              className={`px-4 py-2 rounded-lg text-white ${
                rebuildStatus === "rebuilding"
                  ? "bg-gray-400 cursor-not-allowed"
                  : rebuildStatus === "success"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {rebuildStatus === "rebuilding" ? "Mise à jour..." : "Mettre à jour le site"}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>

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

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab("menu")}
            className={`px-4 py-2 ${activeTab === "menu" ? "border-b-2 border-blue-600 font-semibold" : ""}`}
          >
            Menu
          </button>
          <button
            onClick={() => setActiveTab("drinks")}
            className={`px-4 py-2 ${activeTab === "drinks" ? "border-b-2 border-blue-600 font-semibold" : ""}`}
          >
            Boissons
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
                  <div key={category} className="bg-white rounded-lg shadow">
                    <div
                      className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleCategory(category)}
                    >
                      <h3 className="text-lg font-semibold">{category}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">{items.length} élément{items.length > 1 ? 's' : ''}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCategory(category);
                            setEditingItem({ id: "", name: "", description: "", price: 0, category: category, tags: [] } as MenuItem);
                            setIsNew(true);
                          }}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                        >
                          + Ajouter
                        </button>
                        <span className="text-gray-400">{isExpanded ? '▼' : '▶'}</span>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="border-t p-4 space-y-2">
                        {items.length === 0 ? (
                          <p className="text-gray-500 text-sm">Aucun élément dans cette catégorie</p>
                        ) : (
                          items.map((item) => (
                            <div key={item.id} className="bg-gray-50 p-3 rounded flex justify-between items-center">
                              <div className="flex-1">
                                <h4 className="font-semibold">{item.name}</h4>
                                {item.description && (
                                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                )}
                                <p className="text-sm font-medium text-blue-600 mt-1">{item.price} CHF</p>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <button
                                  onClick={() => {
                                    setEditingItem(item);
                                    setIsNew(false);
                                  }}
                                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                >
                                  Modifier
                                </button>
                                <button
                                  onClick={() => handleDeleteMenuItem(item.id)}
                                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                >
                                  Supprimer
                                </button>
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
                  <div key={categoryLabel} className="bg-white rounded-lg shadow">
                    <div
                      className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleCategory(categoryLabel)}
                    >
                      <h3 className="text-lg font-semibold">{categoryLabel}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">{items.length} élément{items.length > 1 ? 's' : ''}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCategory(categoryInfo.value);
                            setEditingItem({ id: "", name: "", description: "", price: 0, category: categoryInfo.value } as DrinkItem);
                            setIsNew(true);
                          }}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                        >
                          + Ajouter
                        </button>
                        <span className="text-gray-400">{isExpanded ? '▼' : '▶'}</span>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="border-t p-4 space-y-2">
                        {items.length === 0 ? (
                          <p className="text-gray-500 text-sm">Aucun élément dans cette catégorie</p>
                        ) : (
                          items.map((item) => (
                            <div key={item.id} className="bg-gray-50 p-3 rounded flex justify-between items-center">
                              <div className="flex-1">
                                <h4 className="font-semibold">{item.name}</h4>
                                {item.description && (
                                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                )}
                                <p className="text-sm font-medium text-blue-600 mt-1">{item.price} CHF</p>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <button
                                  onClick={() => {
                                    setEditingItem(item);
                                    setIsNew(false);
                                  }}
                                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                >
                                  Modifier
                                </button>
                                <button
                                  onClick={() => handleDeleteDrinkItem(item.id)}
                                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                >
                                  Supprimer
                                </button>
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

        {/* Edit Modal */}
        {editingItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {isNew ? "Ajouter" : "Modifier"} {activeTab === "menu" ? "un élément du menu" : "une boisson"}
              </h2>
              
              {activeTab === "menu" && "name" in editingItem && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleSaveMenuItem({
                      name: formData.get("name") as string,
                      description: formData.get("description") as string,
                      price: parseFloat(formData.get("price") as string),
                      category: formData.get("category") as string,
                      tags: []
                    });
                  }}
                  className="space-y-4"
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
                      <label className="block text-sm font-medium mb-1">Prix (CHF)</label>
                      <input
                        type="number"
                        name="price"
                        step="0.01"
                        defaultValue={editingItem.price}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Catégorie</label>
                      <select
                        name="category"
                        defaultValue={editingItem.category || selectedCategory}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                      >
                        {MENU_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Sauvegarder
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(null);
                        setIsNew(false);
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
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
                      description: formData.get("description") as string,
                      price: parseFloat(formData.get("price") as string),
                      category: formData.get("category") as "cocktail" | "wine" | "beer" | "non-alcoholic"
                    });
                  }}
                  className="space-y-4"
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
                      <label className="block text-sm font-medium mb-1">Prix (CHF)</label>
                      <input
                        type="number"
                        name="price"
                        step="0.01"
                        defaultValue={editingItem.price}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Catégorie</label>
                      <select
                        name="category"
                        defaultValue={editingItem.category || selectedCategory}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                      >
                        {DRINK_CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Sauvegarder
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(null);
                        setIsNew(false);
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
