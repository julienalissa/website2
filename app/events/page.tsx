"use client";

import { useState, useRef } from "react";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { motion } from "framer-motion";
import { restaurantInfo } from "@/lib/data";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";

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

export default function EventsPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    date: "",
    guests: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const formSectionRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Créer le message pour la demande spéciale
      const eventMessage = `
Type d'événement: ${formData.eventType}
Date préférée: ${formData.date || 'Non spécifiée'}
Nombre d'invités: ${formData.guests || 'Non spécifié'}
Téléphone: ${formData.phone}

Message:
${formData.message}
      `.trim();

      console.log('Envoi de l\'événement à Supabase:', {
        name: formData.name,
        email: formData.email,
        message: eventMessage,
      });

      // Envoyer l'événement à Supabase comme demande spéciale
      const { data, error } = await supabase
        .from('special_requests')
        .insert({
          name: formData.name,
          email: formData.email,
          message: eventMessage,
          status: 'new',
        })
        .select();

      if (error) {
        console.error('Erreur lors de l\'envoi de la demande:', error);
        alert('Erreur lors de l\'envoi de la demande: ' + error.message);
        return;
      }

      console.log('Événement créé avec succès:', data);

      // Succès
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          eventType: "",
          date: "",
          guests: "",
          message: ""
        });
        setShowForm(false);
      }, 3000);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'envoi de la demande. Veuillez réessayer.');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlanEvent = () => {
    setShowForm(true);
    setTimeout(() => {
      formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const eventTypes = [
    {
      title: t.events.smallWedding,
      description: t.events.smallWeddingDescription,
      image: ""
    },
    {
      title: t.events.baptismBirthday,
      description: t.events.baptismBirthdayDescription,
      image: ""
    },
    {
      title: t.events.corporateMeal,
      description: t.events.corporateMealDescription,
      image: ""
    },
    {
      title: t.events.afterCeremonyMeal,
      description: t.events.afterCeremonyMealDescription,
      image: ""
    }
  ];

  const services = [
    {
      title: t.events.customMenus,
      description: t.events.customMenusDescription
    },
    {
      title: t.events.dedicatedService,
      description: t.events.dedicatedServiceDescription
    },
    {
      title: t.events.elegantAtmosphere,
      description: t.events.elegantAtmosphereDescription
    },
    {
      title: t.events.swissQuality,
      description: t.events.swissQualityDescription
    }
  ];

  return (
    <div className="bg-parchment-200 min-h-screen texture-overlay">
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden texture-overlay">
        <div className="absolute inset-0">
          <ImagePlaceholder
            alt="Événements Privés & Célébrations"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/75" />
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 65% 50%, rgba(212, 150, 83, 0.15) 0%, transparent 50%)'
            }}
          />
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 0%, transparent 60%, rgba(0, 0, 0, 0.12) 100%)'
            }}
          />
        </div>
        <div className="container relative h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-3xl"
          >
            <h1 
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-medium text-white tracking-tight mb-6 relative z-10"
              style={{ 
                textShadow: '0 2px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.2)',
                letterSpacing: '0.02em'
              }}
            >
              {t.events.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light mb-8 leading-relaxed">
              {t.events.subtitle}
            </p>
            <button
              onClick={handlePlanEvent}
              className="btn-primary"
            >
              {t.events.planEvent}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Event Types Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="section-padding warm-light relative"
      >
        <div className="container relative z-10">
          <motion.div variants={itemVariants} className="max-w-4xl mx-auto text-center mb-16">
            <div className="divider-elegant mb-8" />
            <h2 
              className="text-4xl md:text-5xl font-serif font-medium text-text-dark mb-6 tracking-tight"
              style={{ letterSpacing: '0.02em' }}
            >
              {t.events.eventTypes}
            </h2>
            <p className="text-xl text-text-body leading-relaxed">
              {t.events.eventTypesDescription}
            </p>
          </motion.div>

          <div className="space-y-20">
            {eventTypes.map((event, index) => (
              <motion.div
                key={event.title}
                variants={itemVariants}
                className={`max-w-6xl mx-auto ${
                  index % 2 === 0
                    ? "grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                    : "grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                }`}
              >
                <div className={index % 2 === 1 ? "md:order-2" : ""}>
                  <div 
                    className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden image-organic vignette"
                    style={{ 
                      marginLeft: index % 2 === 0 ? '-1rem' : '1rem',
                      marginRight: index % 2 === 0 ? '1rem' : '-1rem'
                    }}
                  >
                    <ImagePlaceholder
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'radial-gradient(ellipse at 50% 50%, rgba(212, 150, 83, 0.08) 0%, transparent 60%)'
                      }}
                    />
                  </div>
                </div>
                <div className={index % 2 === 1 ? "md:order-1" : ""}>
                  <h3 
                    className="text-3xl md:text-4xl font-serif font-medium text-text-dark mb-6 tracking-tight"
                    style={{ letterSpacing: '0.02em' }}
                  >
                    {event.title}
                  </h3>
                  <p className="text-lg text-text-body leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Experience & Services Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="section-padding bg-white texture-overlay relative"
      >
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div variants={itemVariants} className="text-center mb-12">
              <div className="divider-elegant mb-8" />
              <h2 
                className="text-4xl md:text-5xl font-serif font-medium text-text-dark mb-6 tracking-tight"
                style={{ letterSpacing: '0.02em' }}
              >
                {t.events.experience}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service) => (
                <motion.div
                  key={service.title}
                  variants={itemVariants}
                  className="p-6"
                >
                  <h3 className="text-xl font-serif font-medium text-text-dark mb-3 tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-text-body leading-relaxed">
                    {service.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Event Inquiry CTA Section */}
      <motion.section
        ref={formSectionRef}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="section-padding bg-parchment-300 texture-overlay warm-light relative"
      >
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto">
            {!showForm ? (
              <motion.div variants={itemVariants} className="text-center">
                <div className="divider-elegant mb-8" />
                <h2 
                  className="text-4xl md:text-5xl font-serif font-medium text-text-dark mb-6 tracking-tight"
                  style={{ letterSpacing: '0.02em' }}
                >
                  {t.events.requestInfo}
                </h2>
                <p className="text-lg text-text-body mb-10 leading-relaxed">
                  {t.events.requestInfoDescription}
                </p>
                <button
                  onClick={handlePlanEvent}
                  className="btn-primary"
                >
                  {t.events.requestInfo}
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="bg-white rounded-lg p-8 border border-parchment-300 texture-overlay warm-light relative"
              >
                {submitted ? (
                  <div className="text-center p-12">
                    <div className="text-5xl mb-4">✓</div>
                    <h3 className="text-2xl font-serif font-medium text-text-dark mb-2">
                      {t.events.inquiryReceived}
                    </h3>
                    <p className="text-text-body">
                      {t.events.inquiryReceivedText}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-3xl font-serif font-medium text-text-dark tracking-tight">
                        {t.events.eventInquiry}
                      </h2>
                      <button
                        onClick={() => setShowForm(false)}
                        className="text-text-light hover:text-text-dark transition-colors duration-300"
                        aria-label={t.common.required}
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="event-name" className="block text-sm font-medium text-text-dark mb-2">
                          {t.events.name} {t.common.required}
                        </label>
                        <input
                          type="text"
                          id="event-name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-parchment-300 rounded-md bg-parchment-50 text-text-dark focus:ring-2 focus:ring-charleston-green focus:border-charleston-green transition-all duration-300"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="event-email" className="block text-sm font-medium text-text-dark mb-2">
                            {t.events.email} {t.common.required}
                          </label>
                          <input
                            type="email"
                            id="event-email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-parchment-300 rounded-md bg-parchment-50 text-text-dark focus:ring-2 focus:ring-charleston-green focus:border-charleston-green transition-all duration-300"
                          />
                        </div>

                        <div>
                          <label htmlFor="event-phone" className="block text-sm font-medium text-text-dark mb-2">
                            {t.events.phone} {t.common.required}
                          </label>
                          <input
                            type="tel"
                            id="event-phone"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-parchment-300 rounded-md bg-parchment-50 text-text-dark focus:ring-2 focus:ring-charleston-green focus:border-charleston-green transition-all duration-300"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="event-type" className="block text-sm font-medium text-text-dark mb-2">
                          {t.events.eventType} {t.common.required}
                        </label>
                        <select
                          id="event-type"
                          name="eventType"
                          required
                          value={formData.eventType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-parchment-300 rounded-md bg-parchment-50 text-text-dark focus:ring-2 focus:ring-charleston-green focus:border-charleston-green transition-all duration-300"
                        >
                          <option value="">{t.events.selectEventType}</option>
                          <option value="smallWedding">{t.events.smallWedding}</option>
                          <option value="baptismBirthday">{t.events.baptismBirthday}</option>
                          <option value="corporateMeal">{t.events.corporateMeal}</option>
                          <option value="afterCeremonyMeal">{t.events.afterCeremonyMeal}</option>
                          <option value="other">Autre</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="event-date" className="block text-sm font-medium text-text-dark mb-2">
                            {t.events.preferredDate}
                          </label>
                          <input
                            type="date"
                            id="event-date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full px-4 py-3 border border-parchment-300 rounded-md bg-parchment-50 text-text-dark focus:ring-2 focus:ring-charleston-green focus:border-charleston-green transition-all duration-300"
                          />
                        </div>

                        <div>
                          <label htmlFor="event-guests" className="block text-sm font-medium text-text-dark mb-2">
                            {t.events.numberOfGuests}
                          </label>
                          <input
                            type="number"
                            id="event-guests"
                            name="guests"
                            min="1"
                            value={formData.guests}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-parchment-300 rounded-md bg-parchment-50 text-text-dark focus:ring-2 focus:ring-charleston-green focus:border-charleston-green transition-all duration-300"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="event-message" className="block text-sm font-medium text-text-dark mb-2">
                          {t.events.message}
                        </label>
                        <textarea
                          id="event-message"
                          name="message"
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-parchment-300 rounded-md bg-parchment-50 text-text-dark focus:ring-2 focus:ring-charleston-green focus:border-charleston-green transition-all duration-300"
                          placeholder={t.events.messagePlaceholder}
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button type="submit" className="btn-primary flex-1">
                          {t.events.submitInquiry}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowForm(false)}
                          className="btn-secondary flex-1"
                        >
                          {t.events.cancel}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
