"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { MenuItem, DrinkItem, GalleryImage } from "@/lib/data";
import {
  getMenuItems,
  getDrinkItems,
  getGalleryImages,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  createDrinkItem,
  updateDrinkItem,
  deleteDrinkItem,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  uploadImage
} from "@/lib/supabase-admin";

// Mot de passe admin - Peut être défini via NEXT_PUBLIC_ADMIN_PASSWORD ou utiliser la valeur par défaut
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "Papaz123123";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"menu" | "drinks" | "gallery">("menu");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [drinkItems, setDrinkItems] = useState<DrinkItem[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | DrinkItem | GalleryImage | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [rebuildStatus, setRebuildStatus] = useState<"idle" | "rebuilding" | "success" | "error">("idle");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà authentifié
    const auth = localStorage.getItem("admin_authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem("admin_authenticated", "true");
      loadData();
    } else {
      alert("Mot de passe incorrect");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_authenticated");
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [menu, drinks, gallery] = await Promise.all([
        getMenuItems(),
        getDrinkItems(),
        getGalleryImages()
      ]);
      setMenuItems(menu);
      setDrinkItems(drinks);
      setGalleryImages(gallery);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
      alert("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMenuItem = async (item: Partial<MenuItem>) => {
    try {
      if (isNew && editingItem) {
        await createMenuItem(item as MenuItem);
      } else if (editingItem) {
        await updateMenuItem(editingItem.id, item);
      }
      await loadData();
      setEditingItem(null);
      setIsNew(false);
      showNotification("Élément sauvegardé ! Mise à jour du site en cours...", "success");
      // Déclencher le rebuild automatiquement
      await triggerRebuild();
    } catch (error) {
      console.error("Erreur:", error);
      showNotification("Erreur lors de la sauvegarde", "error");
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
      showNotification("Erreur lors de la suppression", "error");
    }
  };

  const handleSaveDrinkItem = async (item: Partial<DrinkItem>) => {
    try {
      if (isNew && editingItem) {
        await createDrinkItem(item as DrinkItem);
      } else if (editingItem) {
        await updateDrinkItem(editingItem.id, item);
      }
      await loadData();
      setEditingItem(null);
      setIsNew(false);
      showNotification("Boisson sauvegardée ! Mise à jour du site en cours...", "success");
      await triggerRebuild();
    } catch (error) {
      console.error("Erreur:", error);
      showNotification("Erreur lors de la sauvegarde", "error");
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

  const handleSaveGalleryImage = async (item: Partial<GalleryImage>) => {
    try {
      if (isNew && editingItem) {
        await createGalleryImage(item as GalleryImage);
      } else if (editingItem) {
        await updateGalleryImage(editingItem.id, item);
      }
      await loadData();
      setEditingItem(null);
      setIsNew(false);
      showNotification("Image sauvegardée ! Mise à jour du site en cours...", "success");
      await triggerRebuild();
    } catch (error) {
      console.error("Erreur:", error);
      showNotification("Erreur lors de la sauvegarde", "error");
    }
  };

  const handleDeleteGalleryImage = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) return;
    try {
      await deleteGalleryImage(id);
      await loadData();
      showNotification("Image supprimée ! Mise à jour du site en cours...", "success");
      await triggerRebuild();
    } catch (error) {
      console.error("Erreur:", error);
      showNotification("Erreur lors de la suppression", "error");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const path = `gallery/${Date.now()}_${file.name}`;
      const url = await uploadImage(file, path);
      if (editingItem) {
        await handleSaveGalleryImage({ ...editingItem, src: url });
      } else {
        // Si on n'est pas en mode édition, créer un nouvel élément
        await handleSaveGalleryImage({ src: url, alt: file.name });
      }
      showNotification("Image uploadée avec succès !", "success");
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      showNotification(`Erreur lors de l'upload: ${error instanceof Error ? error.message : 'Erreur inconnue'}`, "error");
    } finally {
      setLoading(false);
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
          <h1 className="text-2xl font-bold mb-6 text-center">Administration</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Se connecter
            </button>
          </form>
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
          <button
            onClick={() => setActiveTab("gallery")}
            className={`px-4 py-2 ${activeTab === "gallery" ? "border-b-2 border-blue-600 font-semibold" : ""}`}
          >
            Galerie
          </button>
        </div>

        {/* Menu Items */}
        {activeTab === "menu" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Éléments du Menu</h2>
              <button
                onClick={() => {
                  setEditingItem({ id: "", name: "", description: "", price: 0, category: "", tags: [] } as MenuItem);
                  setIsNew(true);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                + Ajouter
              </button>
            </div>
            <div className="grid gap-4">
              {menuItems.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.category} - {item.price} CHF</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setIsNew(false);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteMenuItem(item.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Drink Items */}
        {activeTab === "drinks" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Boissons</h2>
              <button
                onClick={() => {
                  setEditingItem({ id: "", name: "", description: "", price: 0, category: "cocktail" } as DrinkItem);
                  setIsNew(true);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                + Ajouter
              </button>
            </div>
            <div className="grid gap-4">
              {drinkItems.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.category} - {item.price} CHF</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setIsNew(false);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteDrinkItem(item.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery Images */}
        {activeTab === "gallery" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Images de la Galerie</h2>
              <button
                onClick={() => {
                  setEditingItem({ id: "", src: "", alt: "" } as GalleryImage);
                  setIsNew(true);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                + Ajouter
              </button>
            </div>
            <div className="grid gap-4">
              {galleryImages.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{item.alt}</h3>
                    <p className="text-sm text-gray-600 truncate max-w-md">{item.src}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setIsNew(false);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteGalleryImage(item.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {isNew ? "Ajouter" : "Modifier"} {activeTab === "menu" ? "un élément du menu" : activeTab === "drinks" ? "une boisson" : "une image"}
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
                      <input
                        type="text"
                        name="category"
                        defaultValue={editingItem.category}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                      />
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
                        defaultValue={editingItem.category}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                      >
                        <option value="cocktail">Cocktail</option>
                        <option value="wine">Vin</option>
                        <option value="beer">Bière</option>
                        <option value="non-alcoholic">Sans alcool</option>
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

              {activeTab === "gallery" && "src" in editingItem && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleSaveGalleryImage({
                      src: formData.get("src") as string,
                      alt: formData.get("alt") as string
                    });
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium mb-1">URL de l'image</label>
                    <input
                      type="text"
                      name="src"
                      defaultValue={editingItem.src}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Ou uploader une image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description (alt)</label>
                    <input
                      type="text"
                      name="alt"
                      defaultValue={editingItem.alt}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
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
