"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReservation } from "./ReservationProvider";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Opening Experience Component
 * 
 * TEMPORARY COMPONENT - Can be removed after opening period
 * 
 * Displays:
 * - Before Feb 1st: "Opening February 1st" with elegant countdown
 * - On Feb 1st: "We are now open" with subtle celebration
 * - After Feb 1st: Hidden (badge shown in header instead)
 * 
 * Opening date: February 1st, 2025
 */
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

function isOpeningDay(): boolean {
  const now = new Date();
  const openingDate = new Date(OPENING_DATE);
  
  return (
    now.getFullYear() === openingDate.getFullYear() &&
    now.getMonth() === openingDate.getMonth() &&
    now.getDate() === openingDate.getDate()
  );
}

function isAfterOpening(): boolean {
  return new Date() > OPENING_DATE;
}

export function OpeningExperience() {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [isOpeningDayState, setIsOpeningDayState] = useState(false);
  const [isAfterOpeningState, setIsAfterOpeningState] = useState(false);
  const { openReservation } = useReservation();
  const { t } = useLanguage();

  useEffect(() => {
    // Initial check
    const checkStatus = () => {
      if (isOpeningDay()) {
        setIsOpeningDayState(true);
        setIsAfterOpeningState(false);
        setTimeRemaining(null);
      } else if (isAfterOpening()) {
        setIsAfterOpeningState(true);
        setIsOpeningDayState(false);
        setTimeRemaining(null);
      } else {
        setIsAfterOpeningState(false);
        setIsOpeningDayState(false);
        setTimeRemaining(calculateTimeRemaining());
      }
    };

    checkStatus();

    // Update every second
    const interval = setInterval(() => {
      checkStatus();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Don't show anything if it's after opening day (we'll use a subtle badge instead)
  if (isAfterOpeningState && !isOpeningDayState) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {isOpeningDayState ? (
        // Opening Day - Subtle celebratory message
        <motion.div
          key="opening-day"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-8"
        >
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-2xl md:text-3xl font-serif font-medium text-white mb-4 tracking-wide"
            style={{ 
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.4)',
              letterSpacing: '0.05em'
            }}
          >
            {t.opening.weAreNowOpen}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-base md:text-lg text-white/85 font-light"
            style={{ textShadow: '0 1px 10px rgba(0, 0, 0, 0.3)' }}
          >
            {t.opening.welcomeBookTable}
          </motion.p>
        </motion.div>
      ) : timeRemaining ? (
        // Before Opening - Countdown
        <motion.div
          key="countdown"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-8"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl font-serif font-light text-white/90 mb-6 tracking-wide"
            style={{ 
              textShadow: '0 1px 15px rgba(0, 0, 0, 0.3)',
              letterSpacing: '0.05em'
            }}
          >
            {t.opening.openingFebruary1st}
          </motion.p>
          
          {/* Elegant Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center justify-center gap-4 md:gap-6 mb-6"
          >
            {[
              { label: t.opening.days, value: timeRemaining.days },
              { label: t.opening.hours, value: timeRemaining.hours },
              { label: t.opening.minutes, value: timeRemaining.minutes },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="text-center"
              >
                <div
                  className="text-3xl md:text-4xl font-serif font-medium text-white mb-1"
                  style={{ 
                    textShadow: '0 2px 15px rgba(0, 0, 0, 0.4)',
                    letterSpacing: '0.02em'
                  }}
                >
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className="text-xs md:text-sm text-white/70 font-light uppercase tracking-wider">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            onClick={openReservation}
            className="inline-flex items-center justify-center rounded-md bg-persian-orange/90 hover:bg-persian-orange border border-persian-orange px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 mt-4 min-w-[200px]"
            style={{ letterSpacing: '0.05em' }}
          >
            {t.opening.reserveForOpeningNight}
          </motion.button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

// Subtle badge for header (after opening)
export function OpeningBadge() {
  const [isAfterOpeningState, setIsAfterOpeningState] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const checkStatus = () => {
      setIsAfterOpeningState(isAfterOpening());
    };
    checkStatus();
    const interval = setInterval(checkStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  if (!isAfterOpeningState) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-persian-orange/10 border border-persian-orange/20"
    >
      <div className="w-2 h-2 rounded-full bg-persian-orange animate-pulse" />
      <span className="text-xs font-medium text-persian-orange uppercase tracking-wider">
        {t.openingStatus.nowOpen}
      </span>
    </motion.div>
  );
}

