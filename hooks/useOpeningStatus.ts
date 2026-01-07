"use client";

import { useState, useEffect } from "react";

// Opening date: February 1st, 2025
const OPENING_DATE = new Date("2025-02-01T00:00:00");

export function useOpeningStatus() {
  const [isBeforeOpening, setIsBeforeOpening] = useState(true);
  const [isOpeningDay, setIsOpeningDay] = useState(false);
  const [isAfterOpening, setIsAfterOpening] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const openingDate = new Date(OPENING_DATE);
      
      const isTodayOpening = 
        now.getFullYear() === openingDate.getFullYear() &&
        now.getMonth() === openingDate.getMonth() &&
        now.getDate() === openingDate.getDate();
      
      const isAfter = now > OPENING_DATE;

      setIsOpeningDay(isTodayOpening);
      setIsAfterOpening(isAfter && !isTodayOpening);
      setIsBeforeOpening(!isAfter && !isTodayOpening);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return {
    isBeforeOpening,
    isOpeningDay,
    isAfterOpening,
    openingDate: OPENING_DATE
  };
}

