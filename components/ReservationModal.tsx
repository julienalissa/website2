"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { restaurantInfo } from "@/lib/data";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  isDateValidForReservation, 
  isDateTimeValidForReservation,
  getAvailableTimeSlots,
  OPENING_HOURS
} from "@/lib/openingHours";
import { supabase } from "@/lib/supabase";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReservationModal({ isOpen, onClose }: ReservationModalProps) {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    notes: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [dateError, setDateError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [availableSlots, setAvailableSlots] = useState<Array<{ hour: number; minute: number; label: string }>>([]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSubmitted(false);
      setDateError("");
      setTimeError("");
      setAvailableSlots([]);
      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        guests: "2",
        notes: ""
      });
    }
  }, [isOpen]);

  // Update available time slots when date changes
  useEffect(() => {
    if (formData.date) {
      const selectedDate = new Date(formData.date);
      const slots = getAvailableTimeSlots(selectedDate);
      setAvailableSlots(slots);
      
      // Reset time if current selection is invalid
      if (formData.time) {
        const [hour, minute] = formData.time.split(':').map(Number);
        const isValid = isDateTimeValidForReservation(selectedDate, hour, minute);
        if (!isValid) {
          setFormData(prev => ({ ...prev, time: "" }));
          setTimeError("");
        }
      }

      // Check if date is valid
      if (!isDateValidForReservation(selectedDate)) {
        setDateError(t.reservationErrors.closedOnTuesdays);
      } else {
        setDateError("");
      }
    } else {
      setAvailableSlots([]);
      setDateError("");
    }
  }, [formData.date]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation
    if (formData.date && formData.time) {
      const selectedDate = new Date(formData.date);
      const [hour, minute] = formData.time.split(':').map(Number);
      
      if (!isDateTimeValidForReservation(selectedDate, hour, minute)) {
        setTimeError(t.reservationErrors.selectValidTime);
        return;
      }
    }

    if (formData.date && !isDateValidForReservation(new Date(formData.date))) {
      setDateError(t.reservationErrors.closedOnTuesdays);
      return;
    }

    try {
      // Envoyer la réservation à Supabase
      const reservationData = {
        customer_name: formData.name,
        customer_phone: formData.phone || null,
        customer_email: formData.email || null,
        number_of_people: parseInt(formData.guests),
        reservation_date: formData.date,
        reservation_time: formData.time,
        status: 'confirmed' as const,
        notes: formData.notes || null,
      };

      console.log('Envoi de la réservation à Supabase:', reservationData);
      
      const { data, error } = await supabase
        .from('reservations')
        .insert(reservationData)
        .select();

      if (error) {
        console.error('Erreur lors de l\'envoi de la réservation:', error);
        alert('Erreur lors de l\'envoi de la réservation: ' + error.message);
        return;
      }

      console.log('Réservation créée avec succès:', data);

      // Succès
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setDateError("");
        setTimeError("");
        setAvailableSlots([]);
        setFormData({
          name: "",
          email: "",
          phone: "",
          date: "",
          time: "",
          guests: "2",
          notes: ""
        });
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'envoi de la réservation. Veuillez réessayer.');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });

    // Validate time when both date and time are selected
    if (name === "time" && formData.date) {
      const selectedDate = new Date(formData.date);
      const [hour, minute] = value.split(':').map(Number);
      
      if (value && !isDateTimeValidForReservation(selectedDate, hour, minute)) {
        setTimeError(t.reservationErrors.thisTimeNotAvailable);
      } else {
        setTimeError("");
      }
    }
  };

  // Check if a date should be disabled (Tuesdays and past dates)
  const isDateDisabled = (dateString: string): boolean => {
    const date = new Date(dateString);
    return !isDateValidForReservation(date);
  };

  const getGuestLabel = (num: number) => {
    if (language === "fr") {
      return num === 1 ? "Personne" : "Personnes";
    } else if (language === "de") {
      return num === 1 ? "Person" : "Personen";
    } else {
      return num === 1 ? "Guest" : "Guests";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-serif font-medium text-text-dark tracking-tight">
                    {t.reservation.title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-text-light hover:text-text-dark transition-colors duration-300"
                    aria-label={t.common.required}
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-center p-12"
                  >
                    <div className="text-5xl mb-4">✓</div>
                    <h3 className="text-2xl font-serif font-medium text-text-dark mb-2">
                      {t.reservation.received}
                    </h3>
                    <p className="text-text-body">
                      {t.reservation.receivedText}
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <p className="text-lg text-text-body mb-8 leading-relaxed">
                      {t.reservation.description}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="modal-name" className="block text-sm font-medium text-text-dark mb-2">
                          {t.reservation.fullName} {t.common.required}
                        </label>
                        <input
                          type="text"
                          id="modal-name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-parchment-300 rounded-md bg-parchment-50 text-text-dark focus:ring-2 focus:ring-charleston-green focus:border-charleston-green transition-all duration-300"
                        />
                      </div>

                      <div>
                        <label htmlFor="modal-email" className="block text-sm font-medium text-text-dark mb-2">
                          {t.reservation.email} {t.common.required}
                        </label>
                        <input
                          type="email"
                          id="modal-email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-parchment-300 rounded-md bg-parchment-50 text-text-dark focus:ring-2 focus:ring-charleston-green focus:border-charleston-green transition-all duration-300"
                        />
                      </div>

                      <div>
                        <label htmlFor="modal-phone" className="block text-sm font-medium text-text-dark mb-2">
                          {t.reservation.phone} {t.common.required}
                        </label>
                        <input
                          type="tel"
                          id="modal-phone"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-parchment-300 rounded-md bg-parchment-50 text-text-dark focus:ring-2 focus:ring-charleston-green focus:border-charleston-green transition-all duration-300"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="modal-date" className="block text-sm font-medium text-text-dark mb-2">
                            {t.reservation.date} {t.common.required}
                          </label>
                          <input
                            type="date"
                            id="modal-date"
                            name="date"
                            required
                            value={formData.date}
                            onChange={handleChange}
                            min={new Date().toISOString().split("T")[0]}
                            className={`w-full px-4 py-3 border rounded-md bg-parchment-50 text-text-dark focus:ring-2 focus:ring-charleston-green focus:border-charleston-green transition-all duration-300 ${
                              dateError ? 'border-red-300' : 'border-parchment-300'
                            }`}
                          />
                          {dateError && (
                            <p className="mt-1 text-sm text-red-600">{dateError}</p>
                          )}
                          {formData.date && !dateError && (
                            <p className="mt-1 text-xs text-text-light">
                              {availableSlots.length > 0 
                                ? `${availableSlots.length} ${t.reservationErrors.timeSlotsAvailable}`
                                : t.reservationErrors.noAvailability}
                            </p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="modal-time" className="block text-sm font-medium text-text-dark mb-2">
                            {t.reservation.time} {t.common.required}
                          </label>
                          {availableSlots.length > 0 ? (
                            <select
                              id="modal-time"
                              name="time"
                              required
                              value={formData.time}
                              onChange={handleChange}
                              className={`w-full px-4 py-3 border rounded-md bg-parchment-50 text-text-dark focus:ring-2 focus:ring-charleston-green focus:border-charleston-green transition-all duration-300 ${
                                timeError ? 'border-red-300' : 'border-parchment-300'
                              }`}
                            >
                              <option value="">{t.reservationErrors.selectTime}</option>
                              {availableSlots.map((slot) => (
                                <option key={slot.label} value={slot.label}>
                                  {slot.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="time"
                              id="modal-time"
                              name="time"
                              required
                              value={formData.time}
                              onChange={handleChange}
                              disabled={!formData.date || availableSlots.length === 0}
                              className={`w-full px-4 py-3 border rounded-md bg-parchment-50 text-text-dark focus:ring-2 focus:ring-charleston-green focus:border-charleston-green transition-all duration-300 ${
                                timeError ? 'border-red-300' : 'border-parchment-300'
                              } ${!formData.date || availableSlots.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                          )}
                          {timeError && (
                            <p className="mt-1 text-sm text-red-600">{timeError}</p>
                          )}
                          {formData.date && availableSlots.length === 0 && !dateError && (
                            <p className="mt-1 text-xs text-text-light">{t.reservationErrors.closedOnThisDay}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="modal-guests" className="block text-sm font-medium text-text-dark mb-2">
                          {t.reservation.guests} {t.common.required}
                        </label>
                        <select
                          id="modal-guests"
                          name="guests"
                          required
                          value={formData.guests}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-parchment-300 rounded-md bg-parchment-50 text-text-dark focus:ring-2 focus:ring-charleston-green focus:border-charleston-green transition-all duration-300"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>
                              {num} {getGuestLabel(num)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="modal-notes" className="block text-sm font-medium text-text-dark mb-2">
                          {t.reservation.specialRequests}
                        </label>
                        <textarea
                          id="modal-notes"
                          name="notes"
                          rows={4}
                          value={formData.notes}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-parchment-300 rounded-md bg-parchment-50 text-text-dark focus:ring-2 focus:ring-charleston-green focus:border-charleston-green transition-all duration-300"
                          placeholder={t.reservation.specialRequestsPlaceholder}
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button type="submit" className="btn-primary flex-1">
                          {t.reservation.submit}
                        </button>
                        <button
                          type="button"
                          onClick={onClose}
                          className="btn-secondary flex-1"
                        >
                          {t.reservation.cancel}
                        </button>
                      </div>
                    </form>

                    <div className="mt-8 p-6 bg-parchment-100 rounded-lg border border-parchment-300">
                      <h3 className="text-lg font-serif font-medium text-text-dark mb-2">
                        {t.reservation.needHelp}
                      </h3>
                      <p className="text-text-body mb-2">
                        {t.reservation.callUs}{" "}
                        <a href={`tel:${restaurantInfo.phone}`} className="text-charleston-green hover:underline transition-colors duration-300">
                          {restaurantInfo.phone}
                        </a>
                      </p>
                      <p className="text-sm text-text-light">
                        {t.reservation.needHelpText}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
