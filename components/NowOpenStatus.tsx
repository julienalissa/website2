"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getRestaurantStatus } from "@/lib/openingHours";
import { useOpeningStatus } from "@/hooks/useOpeningStatus";
import { useLanguage } from "@/contexts/LanguageContext";

interface NowOpenStatusProps {
  variant?: "badge" | "text" | "full";
  className?: string;
}

/**
 * Check if restaurant opens within 30 minutes
 */
function opensWithin30Minutes(status: ReturnType<typeof getRestaurantStatus>, currentTime: Date): boolean {
  if (status.isOpen || !status.nextOpeningTime) {
    return false;
  }

  const [nextHour, nextMinute] = status.nextOpeningTime.split(':').map(Number);
  const nextOpening = new Date(currentTime);
  nextOpening.setHours(nextHour, nextMinute, 0, 0);

  // If next opening is tomorrow, adjust date
  if (nextOpening <= currentTime) {
    nextOpening.setDate(nextOpening.getDate() + 1);
  }

  const diffMinutes = (nextOpening.getTime() - currentTime.getTime()) / (1000 * 60);
  return diffMinutes > 0 && diffMinutes <= 30;
}

/**
 * Premium status badge component
 * Dynamic "Now Open" status indicator with color-coded badges
 * Updates in real-time based on current opening hours
 * Uses getRestaurantStatus() as single source of truth
 */
export function NowOpenStatus({ variant = "badge", className = "" }: NowOpenStatusProps) {
  const { language, t } = useLanguage();
  const [status, setStatus] = useState<ReturnType<typeof getRestaurantStatus>>(
    getRestaurantStatus(undefined, language)
  );
  const [opensSoon, setOpensSoon] = useState(false);
  const { isAfterOpening } = useOpeningStatus();

  useEffect(() => {
    // Only show status after restaurant opening date
    if (!isAfterOpening) {
      return;
    }

    const updateStatus = () => {
      const now = new Date();
      const newStatus = getRestaurantStatus(now, language);
      setStatus(newStatus);
      setOpensSoon(opensWithin30Minutes(newStatus, now));
    };

    // Immediate check on mount and when isAfterOpening changes
    updateStatus();

    // Update every minute for accuracy
    const interval = setInterval(updateStatus, 60000);

    return () => clearInterval(interval);
  }, [isAfterOpening, language]);

  // Don't show anything before restaurant opening
  if (!isAfterOpening) {
    return null;
  }

  // Determine badge color and style
  let badgeColor = "red";
  let badgeBg = "bg-red-50";
  let badgeBorder = "border-red-200";
  let badgeText = "text-red-700";
  let dotColor = "bg-red-500";
  let message = status.message;

  if (status.isOpen) {
    badgeColor = "green";
    badgeBg = "bg-green-50";
    badgeBorder = "border-green-200";
    badgeText = "text-green-700";
    dotColor = "bg-green-500";
  } else if (opensSoon) {
    badgeColor = "yellow";
    badgeBg = "bg-yellow-50";
    badgeBorder = "border-yellow-200";
    badgeText = "text-yellow-700";
    dotColor = "bg-yellow-500";
    message = t.openingStatus.opensIn30Min;
  }

  // Badge variant - Premium pill-shaped badge (only show when open or opens soon)
  if (variant === "badge") {
    // Show badge when open or opens within 30 minutes
    if (!status.isOpen && !opensSoon) {
      return null;
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={`${status.status}-${opensSoon}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${badgeBg} ${badgeBorder} border shadow-sm ${className}`}
        >
          <motion.div
            className={`w-2 h-2 rounded-full ${dotColor}`}
            animate={status.isOpen ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 2, repeat: status.isOpen ? Infinity : 0, ease: "easeInOut" }}
          />
          <span className={`text-xs font-medium ${badgeText} tracking-wide`}>
            {message}
          </span>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Text variant - Premium badge (always visible, shows all statuses)
  if (variant === "text") {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={`${status.status}-${opensSoon}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${badgeBg} ${badgeBorder} border shadow-sm ${className}`}
        >
          <motion.div
            className={`w-2 h-2 rounded-full ${dotColor}`}
            animate={status.isOpen ? { scale: [1, 1.2, 1] } : opensSoon ? { scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 2, repeat: (status.isOpen || opensSoon) ? Infinity : 0, ease: "easeInOut" }}
          />
          <span className={`text-xs font-medium ${badgeText} tracking-wide`}>
            {message}
          </span>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Full variant - Premium badge with colored dot (green = open, red = closed, yellow = opens soon)
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${status.status}-${opensSoon}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className={className}
      >
        <div className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full ${badgeBg} ${badgeBorder} border shadow-md`}>
          <motion.div
            className={`w-2.5 h-2.5 rounded-full ${dotColor}`}
            animate={status.isOpen ? { scale: [1, 1.3, 1] } : opensSoon ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 2, repeat: (status.isOpen || opensSoon) ? Infinity : 0, ease: "easeInOut" }}
          />
          <span className={`text-sm font-medium ${badgeText} tracking-wide`}>
            {message}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
