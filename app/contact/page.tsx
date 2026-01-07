"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { restaurantInfo } from "@/lib/data";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAllFormattedHours } from "@/lib/openingHours";

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

export default function ContactPage() {
  const { t } = useLanguage();
  const formattedHours = getAllFormattedHours();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
            {t.contact.title}
          </motion.h1>
        </div>
      </section>

      {/* Contact Content */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="section-padding texture-overlay warm-light relative"
      >
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div variants={itemVariants}>
              <div className="divider-elegant mb-8" />
              <h2 className="text-3xl font-serif font-medium text-text-dark mb-6 tracking-tight" style={{ letterSpacing: '0.02em' }}>
                {t.contact.getInTouch}
              </h2>
              <p className="text-lg text-text-body mb-8 leading-relaxed">
                {t.contact.getInTouchDescription}
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-text-dark mb-2">{t.contact.address}</h3>
                  <p className="text-text-body">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurantInfo.address + ", Switzerland")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-charleston-green hover:underline transition-colors duration-300"
                    >
                      {restaurantInfo.address}
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-text-dark mb-2">{t.contact.phone}</h3>
                  <p className="text-text-body">
                    <a href={`tel:${restaurantInfo.phone}`} className="text-charleston-green hover:underline transition-colors duration-300">
                      {restaurantInfo.phone}
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-text-dark mb-2">{t.contact.email}</h3>
                  <p className="text-text-body">
                    <a href={`mailto:${restaurantInfo.email}`} className="text-charleston-green hover:underline transition-colors duration-300">
                      {restaurantInfo.email}
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-text-dark mb-2">{t.contact.hours}</h3>
                  <div className="text-text-body space-y-1">
                    <p>{t.common.monday}: {formattedHours.monday}</p>
                    <p>{t.common.tuesday}: {formattedHours.tuesday}</p>
                    <p>{t.common.wednesday}: {formattedHours.wednesday}</p>
                    <p>{t.common.thursday}: {formattedHours.thursday}</p>
                    <p>{t.common.friday}: {formattedHours.friday}</p>
                    <p>{t.common.saturday}: {formattedHours.saturday}</p>
                    <p>{t.common.sunday}: {formattedHours.sunday}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <div className="divider-elegant mb-8" />
              <h2 className="text-3xl font-serif font-medium text-text-dark mb-6 tracking-tight" style={{ letterSpacing: '0.02em' }}>
                {t.contact.sendMessage}
              </h2>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 bg-olive-100 rounded-lg border-2 border-olive-300 texture-overlay warm-light relative"
                >
                  <p className="text-olive-700">{t.contact.thankYouText}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg border border-parchment-300 texture-overlay warm-light relative">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-text-dark mb-2">
                      {t.contact.name} {t.common.required}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-parchment-300 rounded-md bg-parchment-50 text-text-dark focus:ring-2 focus:ring-charleston-green focus:border-charleston-green transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-dark mb-2">
                      {t.contact.email} {t.common.required}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-parchment-300 rounded-md bg-parchment-50 text-text-dark focus:ring-2 focus:ring-charleston-green focus:border-charleston-green transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-text-dark mb-2">
                      {t.contact.subject} {t.common.required}
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-parchment-300 rounded-md bg-parchment-50 text-text-dark focus:ring-2 focus:ring-charleston-green focus:border-charleston-green transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-text-dark mb-2">
                      {t.contact.message} {t.common.required}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-parchment-300 rounded-md bg-parchment-50 text-text-dark focus:ring-2 focus:ring-charleston-green focus:border-charleston-green transition-all duration-300"
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full">
                    {t.contact.send}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Google Maps Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="section-padding bg-white texture-overlay relative"
      >
        <div className="container relative z-10">
          <motion.div variants={itemVariants} className="max-w-6xl mx-auto">
            <div className="divider-elegant mb-8" />
            <h2 
              className="text-3xl md:text-4xl font-serif font-medium text-text-dark mb-8 tracking-tight text-center"
              style={{ letterSpacing: '0.02em' }}
            >
              {t.contact.address}
            </h2>
            <div className="relative w-full h-[500px] md:h-[600px] rounded-lg overflow-hidden border border-parchment-300 shadow-lg">
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(restaurantInfo.address + ", Switzerland")}&output=embed&hl=fr&z=15`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
                title={`Le Savoré - ${restaurantInfo.address}`}
              />
            </div>
            <div className="mt-6 text-center">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Rue+Sous-le-Pré+19A,+2014+Bôle,+Switzerland"
                target="_blank"
                rel="noopener noreferrer"
                className="text-charleston-green hover:underline transition-colors duration-300 inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Ouvrir dans Google Maps
              </a>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
