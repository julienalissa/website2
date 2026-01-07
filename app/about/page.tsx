"use client";

import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { motion } from "framer-motion";
import { restaurantInfo } from "@/lib/data";
import { useLanguage } from "@/contexts/LanguageContext";

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
            {t.about.title}
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
                {t.about.legacy}
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-lg text-text-body mb-6 leading-relaxed"
              >
                {t.about.legacyText1}
              </motion.p>
              <motion.p
                variants={itemVariants}
                className="text-lg text-text-body mb-6 leading-relaxed"
              >
                {t.about.legacyText2}
              </motion.p>
              <motion.p
                variants={itemVariants}
                className="text-lg text-text-body mb-6 leading-relaxed"
              >
                {t.about.legacyText3}
              </motion.p>
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
                {t.about.philosophy}
              </motion.h2>
              <div className="space-y-4 text-lg text-text-body">
                <motion.p variants={itemVariants}>
                  <strong className="text-charleston-green">{t.about.swissQuality} :</strong> {t.about.swissQualityText}
                </motion.p>
                <motion.p variants={itemVariants}>
                  <strong className="text-charleston-green">{t.about.seasonalCuisine} :</strong> {t.about.seasonalCuisineText}
                </motion.p>
                <motion.p variants={itemVariants}>
                  <strong className="text-charleston-green">{t.about.culinaryCraftsmanship} :</strong> {t.about.culinaryCraftsmanshipText}
                </motion.p>
                <motion.p variants={itemVariants}>
                  <strong className="text-charleston-green">{t.about.warmHospitality} :</strong> {t.about.warmHospitalityText}
                </motion.p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
