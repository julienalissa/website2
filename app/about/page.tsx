"use client";

import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { motion } from "framer-motion";
import { restaurantInfo } from "@/lib/data";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAboutData } from "@/hooks/useAboutData";

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
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

const imageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

export default function AboutPage() {
  const { t } = useLanguage();
  const { aboutData, loading } = useAboutData();
  
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
      <section className="relative h-[400px] overflow-hidden texture-overlay">
        {/* Warm light accent */}
        <div 
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'radial-gradient(ellipse at 25% 50%, rgba(212, 150, 83, 0.12) 0%, transparent 50%)'
          }}
        />
        <div className="absolute inset-0">
          <ImagePlaceholder
            alt="Restaurant interior"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/80 to-transparent" />
        </div>
        <div className="container relative h-full flex items-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-5xl md:text-6xl font-serif font-medium text-white tracking-tight"
          >
            {aboutData.pageTitle}
          </motion.h1>
        </div>
      </section>

      {/* Story Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="section-padding warm-light relative"
      >
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg mx-auto">
              <div className="divider-elegant mb-8" />
              <motion.h2
                variants={itemVariants}
                className="text-3xl font-serif font-medium text-text-dark mb-6 tracking-tight"
                style={{ letterSpacing: '0.02em' }}
              >
                {aboutData.legacyTitle}
              </motion.h2>
              {aboutData.legacyText1 && (
                <motion.div
                  variants={itemVariants}
                  className="text-lg text-text-body mb-6 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: aboutData.legacyText1 }}
                />
              )}
              {aboutData.legacyText2 && (
                <motion.div
                  variants={itemVariants}
                  className="text-lg text-text-body mb-6 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: aboutData.legacyText2 }}
                />
              )}
              {aboutData.legacyText3 && (
                <motion.div
                  variants={itemVariants}
                  className="text-lg text-text-body mb-6 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: aboutData.legacyText3 }}
                />
              )}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Philosophy Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="section-padding bg-white texture-overlay relative"
      >
        <div className="container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={imageVariants}
              className="relative h-[500px] rounded-lg overflow-hidden image-organic vignette"
              style={{ marginLeft: '-1rem' }}
            >
              <ImagePlaceholder
                alt="Le Savoré - Notre Philosophie"
                fill
                className="object-cover"
              />
              {/* Subtle warm light overlay */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at 50% 40%, rgba(212, 150, 83, 0.1) 0%, transparent 60%)'
                }}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="divider-elegant mb-6" />
              <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-4xl font-serif font-medium text-text-dark mb-6 tracking-tight"
                style={{ letterSpacing: '0.02em' }}
              >
                {aboutData.philosophyTitle}
              </motion.h2>
              <div className="space-y-4 text-lg text-text-body">
                {aboutData.swissQuality && (
                  <motion.div
                    variants={itemVariants}
                    dangerouslySetInnerHTML={{ __html: aboutData.swissQuality }}
                  />
                )}
                {aboutData.seasonalCuisine && (
                  <motion.div
                    variants={itemVariants}
                    dangerouslySetInnerHTML={{ __html: aboutData.seasonalCuisine }}
                  />
                )}
                {aboutData.culinaryCraftsmanship && (
                  <motion.div
                    variants={itemVariants}
                    dangerouslySetInnerHTML={{ __html: aboutData.culinaryCraftsmanship }}
                  />
                )}
                {aboutData.warmHospitality && (
                  <motion.div
                    variants={itemVariants}
                    dangerouslySetInnerHTML={{ __html: aboutData.warmHospitality }}
                  />
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
