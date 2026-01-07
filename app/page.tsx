"use client";

import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import Link from "next/link";
import { motion } from "framer-motion";
import { Hero } from "@/components/Hero";
import { restaurantInfo } from "@/lib/data";
import { useReservation } from "@/components/ReservationProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOpeningStatus } from "@/hooks/useOpeningStatus";

// Animation variants for scroll reveals
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

export default function HomePage() {
  const { openReservation } = useReservation();
  const { t } = useLanguage();
  const { isBeforeOpening, isOpeningDay } = useOpeningStatus();

  return (
    <>
      <Hero />

      {/* Story Section - Warm, breathing layout */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="section-padding bg-parchment-200 texture-overlay warm-light relative"
      >
        <div className="container relative z-10">
          <motion.div variants={itemVariants} className="max-w-4xl mx-auto text-center mb-16">
            <div className="divider-elegant mb-8" />
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-serif font-medium text-text-dark mb-6 tracking-tight"
              style={{ letterSpacing: '0.02em' }}
            >
              {t.home.seasonalExcellence}
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-text-body leading-relaxed max-w-2xl mx-auto"
            >
              {t.home.seasonalDescription}
            </motion.p>
          </motion.div>

          {/* Image and Text Block */}
          <div className="max-w-6xl mx-auto">
            <motion.div
              variants={imageVariants}
              className="relative h-[500px] md:h-[600px] rounded-lg overflow-hidden image-organic vignette"
              style={{ marginTop: '2rem', marginBottom: '2rem' }}
            >
              <ImagePlaceholder
                alt="Le Savoré - Excellence de Saison"
                fill
                className="object-cover"
              />
              {/* Subtle warm light overlay */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at 40% 50%, rgba(212, 150, 83, 0.1) 0%, transparent 60%)'
                }}
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Signature Dishes Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="section-padding bg-white texture-overlay relative"
      >
        <div className="container relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <motion.div variants={itemVariants}>
                <div className="divider-elegant mb-6" />
                <motion.h2
                  variants={itemVariants}
                  className="text-4xl md:text-5xl font-serif font-medium text-text-dark mb-6 tracking-tight"
                  style={{ letterSpacing: '0.02em' }}
                >
                  {t.home.seasonalExcellence}.
                  <br />
                  {t.home.swissCraftsmanship}.
                </motion.h2>
                <motion.p
                  variants={itemVariants}
                  className="text-lg text-text-body mb-6 leading-relaxed"
                >
                  {t.home.craftsmanshipDescription}
                </motion.p>
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link href="/menu" className="btn-primary">
                    {t.home.viewFullMenu}
                  </Link>
                  <button onClick={openReservation} className="btn-secondary">
                    {t.nav.reserveTable}
                  </button>
                </motion.div>
              </motion.div>
              <motion.div
                variants={imageVariants}
                className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden image-organic vignette"
                style={{ marginLeft: '-1rem', marginRight: '1rem' }}
              >
                <ImagePlaceholder
                  alt="Le Savoré - Salle du restaurant"
                  fill
                  className="object-cover"
                />
                {/* Subtle warm light overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at 60% 50%, rgba(212, 150, 83, 0.08) 0%, transparent 60%)'
                  }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section - Elegant, not flashy */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="section-padding bg-parchment-300 texture-overlay warm-light relative"
      >
        <div className="container relative z-10">
          <motion.div variants={itemVariants} className="max-w-3xl mx-auto text-center">
            <div className="divider-elegant mb-8" />
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-serif font-medium text-text-dark mb-6 tracking-tight"
              style={{ letterSpacing: '0.02em' }}
            >
              {t.home.readyToDiscover}
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg text-text-body mb-10 leading-relaxed"
            >
              {t.home.reserveDescription}
            </motion.p>
            <motion.div variants={itemVariants}>
              <button 
                onClick={openReservation} 
                className={`btn-primary ${(isBeforeOpening || isOpeningDay) ? 'bg-persian-orange/90 hover:bg-persian-orange border-persian-orange' : ''}`}
              >
                {(isBeforeOpening || isOpeningDay) ? t.opening.reserveForOpening : t.home.makeReservation}
              </button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}
