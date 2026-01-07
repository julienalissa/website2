"use client";

import { useState } from "react";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { useContentData } from "@/hooks/useContentData";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const imageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
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

export default function GalleryPage() {
  const { t } = useLanguage();
  const { galleryImages, loading } = useContentData();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
      <section className="relative h-[300px] overflow-hidden bg-charleston-green texture-overlay warm-light vignette">
        <div className="container relative h-full flex items-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-5xl md:text-6xl font-serif font-medium text-white tracking-tight"
            style={{ letterSpacing: '0.02em' }}
          >
            {t.gallery.title}
          </motion.h1>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding texture-overlay warm-light relative">
        <div className="container relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="mb-12 text-center"
          >
            <div className="divider-elegant mb-8" />
            <motion.h2
              variants={titleVariants}
              className="text-3xl md:text-4xl font-serif font-medium text-text-dark mb-4 tracking-tight"
              style={{ letterSpacing: '0.02em' }}
            >
              {t.gallery.experience}
            </motion.h2>
            <motion.p
              variants={titleVariants}
              className="text-lg text-text-body max-w-2xl mx-auto"
            >
              {t.gallery.experienceDescription}
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: index * 0.1
                }}
                className="relative h-64 md:h-80 rounded-lg overflow-hidden cursor-pointer group image-organic vignette"
                onClick={() => setSelectedImage(image.id)}
              >
                <ImagePlaceholder
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-all duration-300 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative max-w-5xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {galleryImages.find((img) => img.id === selectedImage) && (
                <ImagePlaceholder
                  src={galleryImages.find((img) => img.id === selectedImage)!.src}
                  alt={galleryImages.find((img) => img.id === selectedImage)!.alt}
                  width={1200}
                  height={800}
                  className="rounded-lg object-contain max-h-[90vh] w-auto"
                />
              )}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-all duration-300"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
