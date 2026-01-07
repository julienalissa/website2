"use client";

import Link from "next/link";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { motion } from "framer-motion";
import { restaurantInfo } from "@/lib/data";
import { useReservation } from "./ReservationProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { OpeningExperience } from "./OpeningExperience";
import { useOpeningStatus } from "@/hooks/useOpeningStatus";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
      staggerChildren: 0.15,
      delayChildren: 0.2
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

export function Hero() {
  const { openReservation } = useReservation();
  const { t } = useLanguage();
  const { isBeforeOpening, isOpeningDay } = useOpeningStatus();

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden texture-overlay">
      {/* Background Image - Dark, atmospheric restaurant interior */}
      <div className="absolute inset-0">
        <ImagePlaceholder
          alt="Le Savoré Restaurant"
          fill
          className="object-cover"
        />
        {/* Dark overlay with warm light zones */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/75" />
        {/* Warm ambient light from center-right */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20" 
             style={{
               background: 'radial-gradient(ellipse at 70% 50%, rgba(212, 150, 83, 0.15) 0%, transparent 50%)'
             }} />
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/10"
             style={{
               background: 'radial-gradient(ellipse at center, transparent 0%, transparent 60%, rgba(0, 0, 0, 0.15) 100%)'
             }} />
      </div>

      {/* Content - Centered, minimal, elegant */}
      <div className="container relative h-full flex items-center justify-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl px-4"
        >
          {/* Restaurant Name - Large, elegant serif */}
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-7xl lg:text-8xl font-serif font-medium mb-6 text-white tracking-tight relative z-10"
            style={{ 
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.2)',
              letterSpacing: '0.02em'
            }}
          >
            {restaurantInfo.name}
          </motion.h1>
          
          {/* Opening Experience - Elegant countdown or opening message */}
          <motion.div variants={itemVariants} className="relative z-10 mb-4">
            <OpeningExperience />
          </motion.div>

          {/* Tagline - Poetic, minimal */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl mb-4 text-white/90 font-light tracking-wide relative z-10"
            style={{ 
              textShadow: '0 1px 10px rgba(0, 0, 0, 0.2)',
              letterSpacing: '0.05em'
            }}
          >
            {t.hero.tagline}
          </motion.p>
          
          {/* Short description - Refined */}
          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg mb-12 text-white/80 max-w-2xl mx-auto leading-relaxed font-light"
          >
            {t.hero.description}
          </motion.p>

          {/* CTAs - Clear, elegant buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/menu" className="btn-primary min-w-[180px]">
              {t.hero.viewMenu}
            </Link>
            <button 
              onClick={openReservation} 
              className={`btn-primary min-w-[180px] ${(isBeforeOpening || isOpeningDay) ? 'bg-persian-orange/90 hover:bg-persian-orange border-persian-orange' : 'bg-white/10 border-white/30 hover:bg-white/15'} text-white`}
            >
              {(isBeforeOpening || isOpeningDay) ? t.opening.reserveForOpening : t.hero.reserveTable}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
