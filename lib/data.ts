// Données du restaurant - Le Savoré - Fine Dining Suisse

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags?: string[];
}

export interface DrinkItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "cocktail" | "wine" | "beer" | "non-alcoholic";
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

export const restaurantInfo = {
  name: "Le Savoré",
  tagline: "Fine Dining en Suisse",
  description: "Découvrez une cuisine méditerranéenne de saison, élaborée avec la qualité suisse et le souci du détail dans une atmosphère élégante et accueillante.",
  address: "Rue Sous-le-Pré 19A, 2014 Bôle",
  phone: "+41 76 630 73 10",
  email: "info@lesavore.ch",
  hours: {
    monday: "Fermé",
    tuesday: "10h00–14h00, 18h00–22h00",
    wednesday: "10h00–14h00, 18h00–22h00",
    thursday: "10h00–14h00, 18h00–22h00",
    friday: "11h30–13h30, 18h00–21h30",
    saturday: "18h00–23h00",
    sunday: "Fermé"
  }
};

export const menuItems: MenuItem[] = [
  // ENTRÉES
  {
    id: "salade-verte",
    name: "Salade verte",
    description: "Sélection de jeunes pousses tendres, fines herbes et vinaigrette maison à l'huile d'olive et vinaigre balsamique",
    price: 6.00,
    category: "Entrées",
    tags: []
  },
  {
    id: "salade-melee",
    name: "Salade mêlée",
    description: "Mélange de jeunes pousses, légumes frais de saison et vinaigrette maison",
    price: 7.00,
    category: "Entrées",
    tags: []
  },
  {
    id: "salade-chevre-chaud",
    name: "Salade de chèvre chaud",
    description: "Toasts de fromage de chèvre gratiné, jeunes pousses et vinaigrette maison au miel",
    price: 13.60,
    category: "Entrées",
    tags: []
  },
  {
    id: "soupe-tomates-basilic",
    name: "Soupe froide de tomates & basilic",
    description: "Velouté de tomates fraîches, parfumé au basilic",
    price: 8.90,
    category: "Entrées",
    tags: []
  },
  {
    id: "tartare-boeuf-italienne-120",
    name: "Tartare de bœuf à l'italienne — 120 g",
    description: "Assaisonné à l'huile d'olive, tomates séchées, basilic et copeaux de parmesan — servi avec toast",
    price: 20.50,
    category: "Entrées",
    tags: []
  },
  {
    id: "tartare-boeuf-italienne-200",
    name: "Tartare de bœuf à l'italienne — 200 g",
    description: "Assaisonné à l'huile d'olive, tomates séchées, basilic et copeaux de parmesan — servi avec toast",
    price: 29.80,
    category: "Entrées",
    tags: []
  },
  {
    id: "tartare-thon-wasabi-120",
    name: "Tartare de thon au wasabi — 120 g",
    description: "Thon mariné, wasabi doux, mayonnaise légère et huile d'olive, avec graines de sésame",
    price: 19.20,
    category: "Entrées",
    tags: []
  },
  {
    id: "tartare-thon-wasabi-200",
    name: "Tartare de thon au wasabi — 200 g",
    description: "Thon mariné, wasabi doux, mayonnaise légère et huile d'olive, avec graines de sésame",
    price: 29.80,
    category: "Entrées",
    tags: []
  },
  // PLATS
  {
    id: "risotto-riviera",
    name: "Risotto Riviera",
    description: "Risotto Carnaroli crémeux au parmesan, petites crevettes sautées à l'huile d'olive, tomates confites, basilic frais et zeste de citron",
    price: 22.50,
    category: "Plats",
    tags: []
  },
  {
    id: "tagliatelles-saumon",
    name: "Tagliatelles au saumon",
    description: "Sauce crème fraîche, saumon et asperges parfumées aux herbes",
    price: 24.90,
    category: "Plats",
    tags: []
  },
  {
    id: "filet-dorade-mediterraneenne",
    name: "Filet de dorade méditerranéenne",
    description: "Filet de dorade poêlé, légumes glacés aux herbes aromatiques et pommes grenailles",
    price: 27.50,
    category: "Plats",
    tags: []
  },
  {
    id: "filets-perches-meuniere",
    name: "Filets de perches meunière",
    description: "Filets de perches poêlés, sauce citronnée au beurre persillé — servis avec frites",
    price: 36.00,
    category: "Plats",
    tags: []
  },
  {
    id: "mijotee-veau-zurichoise",
    name: "Mijotée de veau zurichoise",
    description: "Émincé de veau, sauce à la crème et champignons — servi avec rösti",
    price: 29.90,
    category: "Plats",
    tags: []
  },
  {
    id: "entrecote-boeuf-suisse",
    name: "Entrecôte de bœuf suisse poêlée",
    description: "300 g — Entrecôte de bœuf suisse poêlée, glace au vin blanc — au choix : frites ou légumes glacés",
    price: 39.00,
    category: "Plats",
    tags: []
  },
  {
    id: "burger-riviera",
    name: "Burger Riviera",
    description: "Steak de bœuf maison aux épices méditerranéennes, fromage, salade, frites fondantes, tomates cerises marinées, oignons rouges poêlés, sauce maison filet au paprika fumé — Servi avec frites",
    price: 22.50,
    category: "Plats",
    tags: []
  },
  // SUPPLÉMENTS
  {
    id: "supplement-frites",
    name: "Frites",
    description: "",
    price: 6.50,
    category: "Suppléments",
    tags: []
  },
  {
    id: "supplement-legumes-glaces",
    name: "Légumes glacés",
    description: "",
    price: 6.50,
    category: "Suppléments",
    tags: []
  },
  // SUPPLÉMENTS SAUCES
  {
    id: "sauce-citron-beurre-persille",
    name: "Sauce citron au beurre persillé",
    description: "",
    price: 5.90,
    category: "Suppléments Sauces",
    tags: []
  },
  {
    id: "sauce-forestiere",
    name: "Sauce forestière",
    description: "",
    price: 5.90,
    category: "Suppléments Sauces",
    tags: []
  },
  {
    id: "sauce-poivre",
    name: "Sauce au poivre",
    description: "",
    price: 5.90,
    category: "Suppléments Sauces",
    tags: []
  },
  {
    id: "sauce-tartare",
    name: "Sauce tartare",
    description: "",
    price: 5.90,
    category: "Suppléments Sauces",
    tags: []
  },
  // FONDUE
  {
    id: "fondue-traditionnelle",
    name: "Fondue traditionnelle suisse au mélange de fromages",
    description: "Gruyère & Vacherin fribourgeois, vin blanc, ail et kirsch — servie avec pain frais (250 g) — min. 2 personnes",
    price: 29.90,
    category: "Fondue",
    tags: []
  },
  // MENU ENFANTS
  {
    id: "burger-petit-loup",
    name: "Burger du Petit Loup",
    description: "Steak haché de bœuf, fromage, salade, tomate et oignon, sauce cocktail — servi avec frites ou légumes glacés",
    price: 14.90,
    category: "Menu Enfants",
    tags: []
  },
  {
    id: "fish-chips",
    name: "Fish & Chips",
    description: "Filet de poisson en beignet croustillant, servi avec frites et sauce tartare",
    price: 13.90,
    category: "Menu Enfants",
    tags: []
  },
  // DESSERTS
  {
    id: "creme-brulee-vanille",
    name: "Crème brûlée vanille",
    description: "",
    price: 9.90,
    category: "Desserts",
    tags: []
  },
  {
    id: "tiramisu",
    name: "Tiramisu",
    description: "",
    price: 9.90,
    category: "Desserts",
    tags: []
  },
  {
    id: "mousse-chocolat",
    name: "Mousse au chocolat",
    description: "",
    price: 9.90,
    category: "Desserts",
    tags: []
  },
  {
    id: "tarte-citron-meringuee",
    name: "Tarte au citron meringuée",
    description: "",
    price: 9.90,
    category: "Desserts",
    tags: []
  }
];

export const drinkItems: DrinkItem[] = [
  {
    id: "house-wine",
    name: "Sélection de Vins de la Maison",
    description: "Sélection de vins suisses et méditerranéens",
    price: 8.00,
    category: "wine"
  },
  {
    id: "swiss-beer",
    name: "Sélection de Bières Suisses",
    description: "Bières artisanales locales et brasseries suisses traditionnelles",
    price: 6.50,
    category: "beer"
  },
  {
    id: "signature-cocktail",
    name: "Cocktail Signature",
    description: "Cocktail maison élaboré avec des ingrédients suisses",
    price: 14.00,
    category: "cocktail"
  },
  {
    id: "sparkling-water",
    name: "Eau Pétillante",
    description: "Eau minérale suisse",
    price: 4.00,
    category: "non-alcoholic"
  }
];

export const galleryImages: GalleryImage[] = [
  {
    id: "1",
    src: "",
    alt: "Le Savoré - Restaurant"
  },
  {
    id: "2",
    src: "",
    alt: "Le Savoré - Ambiance"
  },
  {
    id: "3",
    src: "",
    alt: "Le Savoré - Intérieur"
  },
  {
    id: "4",
    src: "",
    alt: "Le Savoré - Cuisine méditerranéenne"
  },
  {
    id: "5",
    src: "",
    alt: "Le Savoré - Plats"
  },
  {
    id: "6",
    src: "",
    alt: "Le Savoré - Service"
  },
  {
    id: "7",
    src: "",
    alt: "Le Savoré - Expérience culinaire"
  }
];
