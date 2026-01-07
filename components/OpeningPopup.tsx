"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReservation } from "./ReservationProvider";
import { useLanguage } from "@/contexts/LanguageContext";

const OPENING_DATE = new Date("2025-02-01T00:00:00");

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeRemaining(): TimeRemaining | null {
  const now = new Date();
  const difference = OPENING_DATE.getTime() - now.getTime();

  if (difference <= 0) {
    return null; // Opening day or after
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
  };
}

function isAfterOpening(): boolean {
  return new Date() >= OPENING_DATE;
}

/**
 * Premium Opening Popup Component
 * Displays elegant popup announcing official opening on February 1st
 * Includes dynamic countdown and reservation CTA
 */
export function OpeningPopup() {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { openReservation } = useReservation();
  const { t } = useLanguage();

  useEffect(() => {
    // Check if popup was dismissed
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem("opening-popup-dismissed");
      if (dismissed === "true") {
        setIsDismissed(true);
        return;
      }
    }

    // Check if we're after opening date
    if (isAfterOpening()) {
      return;
    }

    // Initial check
    const checkStatus = () => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);
      
      if (remaining && !isDismissed) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    checkStatus();

    // Update every second for countdown
    const interval = setInterval(() => {
      checkStatus();
    }, 1000);

    return () => clearInterval(interval);
  }, [isDismissed]);

  const handleClose = () => {
    setIsVisible(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("opening-popup-dismissed", "true");
    }
    setIsDismissed(true);
  };

  const handleReserve = () => {
    openReservation();
    handleClose();
  };

  if (!isVisible || !timeRemaining || isDismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
            onClick={handleClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-gradient-to-br from-amber-50 via-ivory-50 to-amber-50 rounded-2xl shadow-2xl border border-amber-200/50 max-w-md w-full p-8 pointer-events-auto relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100/20 via-transparent to-amber-100/20 pointer-events-none" />
              
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-amber-700/60 hover:text-amber-700 transition-colors duration-300 z-10"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="relative z-10">
                {/* Main heading */}
                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-2xl md:text-3xl font-serif font-medium text-amber-900 mb-2 text-center"
                  style={{ letterSpacing: '0.02em' }}
                >
                  {t.opening.officialOpening}
                </motion.h2>

                {/* Subtext */}
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-sm text-amber-700/80 text-center mb-6"
                >
                  {t.opening.officialOpeningSubtext}
                </motion.p>

                {/* Countdown */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="grid grid-cols-4 gap-3 mb-6"
                >
                  {[
                    { label: t.opening.days, value: timeRemaining.days },
                    { label: t.opening.hours, value: timeRemaining.hours },
                    { label: t.opening.minutes, value: timeRemaining.minutes },
                    { label: t.opening.seconds, value: timeRemaining.seconds },
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      className="text-center"
                    >
                      <motion.div
                        key={item.value}
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/80 rounded-lg px-3 py-4 mb-1 shadow-sm border border-amber-200/30"
                      >
                        <span className="text-2xl md:text-3xl font-serif font-medium text-amber-900">
                          {String(item.value).padStart(2, '0')}
                        </span>
                      </motion.div>
                      <span className="text-xs text-amber-700/70 uppercase tracking-wider font-medium">
                        {item.label}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="space-y-3"
                >
                  <motion.button
                    onClick={handleReserve}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium py-3.5 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                  >
                    <span className="relative z-10">{t.opening.reserveTable}</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                  </motion.button>

                  {/* Don't show again */}
                  <button
                    onClick={handleClose}
                    className="w-full text-xs text-amber-700/60 hover:text-amber-700 transition-colors duration-300"
                  >
                    {t.opening.doNotShowAgain}
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

