"use client";

import { motion } from "framer-motion";
import { useContentData } from "@/hooks/useContentData";
import { useLanguage } from "@/contexts/LanguageContext";
import { getMenuCategoryTranslation, getTagTranslation } from "@/lib/menuTranslations";

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

export default function MenuPage() {
  const { t, language } = useLanguage();
  const { menuItems, loading } = useContentData();
  const categories = Array.from(new Set(menuItems.map((item) => item.category)));

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
        {/* Warm light accent */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 30% 50%, rgba(212, 150, 83, 0.1) 0%, transparent 50%)'
          }}
        />
        <div className="container relative h-full flex items-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-5xl md:text-6xl font-serif font-medium text-white tracking-tight"
          >
            {t.menu.title}
          </motion.h1>
        </div>
      </section>

      {/* Menu Content - Editorial, readable layout */}
      <section className="section-padding warm-light relative">
        <div className="container relative z-10">
          <div className="max-w-5xl mx-auto">
            {categories.map((category, index) => {
              const items = menuItems.filter((item) => item.category === category);
              return (
                <motion.div
                  key={category}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={sectionVariants}
                  className="mb-20 last:mb-0"
                >
                  {index > 0 && <div className="divider-elegant mb-8" />}
                  <motion.h2
                    variants={titleVariants}
                    className="text-3xl md:text-4xl font-serif font-medium text-text-dark mb-10 pb-3 border-b border-parchment-400 tracking-tight relative"
                    style={{ letterSpacing: '0.02em' }}
                  >
                    <span className="relative">
                      {getMenuCategoryTranslation(category, language)}
                      <span 
                        className="absolute -right-8 top-1/2 -translate-y-1/2 text-persian-orange/20"
                        style={{ fontSize: '0.4em' }}
                      >
                        ◆
                      </span>
                    </span>
                  </motion.h2>
                  <div className="space-y-8">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-8 border-b border-parchment-300/50 last:border-0"
                      >
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-2">
                            <h3 className="text-xl font-serif font-medium text-text-dark">
                              {item.name}
                            </h3>
                            {item.tags && item.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {item.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-xs px-2 py-0.5 rounded bg-parchment-300 text-text-body uppercase tracking-wide"
                                  >
                                    {getTagTranslation(tag, language)}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <p className="text-text-body leading-relaxed">{item.description}</p>
                        </div>
                        <div className="text-lg font-medium text-text-dark whitespace-nowrap sm:ml-6">
                          {item.price % 1 === 0 
                            ? `${item.price.toFixed(0)}.–` 
                            : `${item.price.toFixed(2)}`}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Legal Information */}
      <section className="section-padding bg-parchment-300 border-t border-parchment-400">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-sm text-text-body space-y-4"
            >
              <h3 className="text-lg font-serif font-medium text-text-dark mb-4">
                {t.legal.originsTitle}
              </h3>
              <div className="space-y-2">
                <p><strong>{t.legal.beef}</strong></p>
                <p><strong>{t.legal.veal}</strong></p>
                <p><strong>{t.legal.chicken}</strong></p>
                <p><strong>{t.legal.fish}</strong></p>
              </div>
              <p className="mt-6 italic">
                {t.legal.allergensNote}
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
