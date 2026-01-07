"use client";

import { motion } from "framer-motion";
import { useContentData } from "@/hooks/useContentData";
import { useLanguage } from "@/contexts/LanguageContext";

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

export default function DrinksPage() {
  const { t } = useLanguage();
  const { drinkItems, loading } = useContentData();
  const categories = {
    cocktail: drinkItems.filter((d) => d.category === "cocktail"),
    "non-alcoholic": drinkItems.filter((d) => d.category === "non-alcoholic"),
    wine: drinkItems.filter((d) => d.category === "wine"),
    beer: drinkItems.filter((d) => d.category === "beer")
  };

  if (loading) {
    return (
      <div className="bg-parchment-200 min-h-screen texture-overlay flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="bg-parchment-200 min-h-screen texture-overlay">
      {/* Hero Section */}
      <section className="relative h-[300px] overflow-hidden bg-charleston-green texture-overlay">
        <div className="container relative h-full flex items-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-5xl md:text-6xl font-serif font-medium text-white tracking-tight"
          >
            {t.drinks.title}
          </motion.h1>
        </div>
      </section>

      {/* Drinks Content */}
      <section className="section-padding warm-light relative">
        <div className="container relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Cocktails */}
            {categories.cocktail.length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={sectionVariants}
                className="mb-16"
              >
                <div className="divider-elegant mb-8" />
                <motion.h2
                  variants={titleVariants}
                  className="text-3xl md:text-4xl font-serif font-medium text-text-dark mb-8 border-b-2 border-parchment-400 pb-2 tracking-tight"
                  style={{ letterSpacing: '0.02em' }}
                >
                  {t.drinks.cocktails}
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categories.cocktail.map((drink) => (
                    <motion.div
                      key={drink.id}
                      variants={itemVariants}
                      className="border border-parchment-300 rounded-lg p-6 bg-white hover:shadow-soft transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-serif font-medium text-text-dark">
                          {drink.name}
                        </h3>
                        <span className="text-lg font-medium text-charleston-green">
                          {drink.price.toFixed(2)} CHF
                        </span>
                      </div>
                      <p className="text-text-body">{drink.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Non-Alcoholic */}
            {categories["non-alcoholic"].length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={sectionVariants}
                className="mb-16"
              >
                <div className="divider-elegant mb-8" />
                <motion.h2
                  variants={titleVariants}
                  className="text-3xl md:text-4xl font-serif font-medium text-text-dark mb-8 border-b-2 border-parchment-400 pb-2 tracking-tight"
                  style={{ letterSpacing: '0.02em' }}
                >
                  {t.drinks.nonAlcoholic}
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categories["non-alcoholic"].map((drink) => (
                    <motion.div
                      key={drink.id}
                      variants={itemVariants}
                      className="border border-parchment-300 rounded-lg p-6 bg-white hover:shadow-soft transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-serif font-medium text-text-dark">
                          {drink.name}
                        </h3>
                        <span className="text-lg font-medium text-charleston-green">
                          {drink.price.toFixed(2)} CHF
                        </span>
                      </div>
                      <p className="text-text-body">{drink.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Wine */}
            {categories.wine.length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={sectionVariants}
                className="mb-16"
              >
                <div className="divider-elegant mb-8" />
                <motion.h2
                  variants={titleVariants}
                  className="text-3xl md:text-4xl font-serif font-medium text-text-dark mb-8 border-b-2 border-parchment-400 pb-2 tracking-tight"
                  style={{ letterSpacing: '0.02em' }}
                >
                  {t.drinks.wine}
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categories.wine.map((drink) => (
                    <motion.div
                      key={drink.id}
                      variants={itemVariants}
                      className="border border-parchment-300 rounded-lg p-6 bg-white hover:shadow-soft transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-serif font-medium text-text-dark">
                          {drink.name}
                        </h3>
                        <span className="text-lg font-medium text-charleston-green">
                          {drink.price.toFixed(2)} CHF
                        </span>
                      </div>
                      <p className="text-text-body">{drink.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Beer */}
            {categories.beer.length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={sectionVariants}
                className="mb-16"
              >
                <div className="divider-elegant mb-8" />
                <motion.h2
                  variants={titleVariants}
                  className="text-3xl md:text-4xl font-serif font-medium text-text-dark mb-8 border-b-2 border-parchment-400 pb-2 tracking-tight"
                  style={{ letterSpacing: '0.02em' }}
                >
                  {t.drinks.beer}
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categories.beer.map((drink) => (
                    <motion.div
                      key={drink.id}
                      variants={itemVariants}
                      className="border border-parchment-300 rounded-lg p-6 bg-white hover:shadow-soft transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-serif font-medium text-text-dark">
                          {drink.name}
                        </h3>
                        <span className="text-lg font-medium text-charleston-green">
                          {drink.price.toFixed(2)} CHF
                        </span>
                      </div>
                      <p className="text-text-body">{drink.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
