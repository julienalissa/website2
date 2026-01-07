/**
 * Opening Hours Configuration
 * 
 * Single source of truth for restaurant opening hours
 * Used across the entire website for consistency
 */

import type { Language } from "./i18n";

export interface TimeSlot {
  hour: number;
  minute: number;
  label: string;
}

export interface TimePoint {
  hour: number;
  minute: number;
}

export interface DayHours {
  isOpen: boolean;
  lunch?: { start: TimePoint; end: TimePoint };
  dinner?: { start: TimePoint; end: TimePoint };
}

export interface OpeningHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

// Official opening hours
export const OPENING_HOURS: OpeningHours = {
  monday: {
    isOpen: true,
    lunch: { start: { hour: 10, minute: 30 }, end: { hour: 14, minute: 30 } },
    dinner: { start: { hour: 18, minute: 30 }, end: { hour: 23, minute: 0 } }
  },
  tuesday: {
    isOpen: false
  },
  wednesday: {
    isOpen: true,
    lunch: { start: { hour: 10, minute: 30 }, end: { hour: 14, minute: 30 } },
    dinner: { start: { hour: 18, minute: 30 }, end: { hour: 23, minute: 0 } }
  },
  thursday: {
    isOpen: true,
    lunch: { start: { hour: 10, minute: 30 }, end: { hour: 14, minute: 30 } },
    dinner: { start: { hour: 18, minute: 30 }, end: { hour: 23, minute: 0 } }
  },
  friday: {
    isOpen: true,
    lunch: { start: { hour: 10, minute: 30 }, end: { hour: 14, minute: 30 } },
    dinner: { start: { hour: 18, minute: 30 }, end: { hour: 23, minute: 0 } }
  },
  saturday: {
    isOpen: true,
    lunch: { start: { hour: 10, minute: 30 }, end: { hour: 14, minute: 30 } },
    dinner: { start: { hour: 18, minute: 30 }, end: { hour: 23, minute: 0 } }
  },
  sunday: {
    isOpen: true,
    lunch: { start: { hour: 10, minute: 30 }, end: { hour: 14, minute: 30 } },
    dinner: { start: { hour: 18, minute: 30 }, end: { hour: 23, minute: 0 } }
  }
};

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
type DayName = typeof DAY_NAMES[number];

/**
 * Get day name from Date object
 */
function getDayName(date: Date): DayName {
  return DAY_NAMES[date.getDay()];
}

/**
 * Restaurant status types
 */
export type RestaurantStatus = 
  | "open"
  | "closed"
  | "opens_at_10_30"
  | "opens_at_18_30"
  | "closed_today"
  | "closed_after_23"
  | "closed_between_services";

export interface RestaurantStatusResult {
  status: RestaurantStatus;
  isOpen: boolean;
  message: string;
  nextOpeningTime?: string;
}

/**
 * Get current restaurant status with detailed information
 * This is the SINGLE SOURCE OF TRUTH for open/closed status
 * 
 * STRICT RULES:
 * - Open ONLY if: (time >= 10:30 AND time < 14:30) OR (time >= 18:30 AND time < 23:00)
 * - Tuesday: ALWAYS CLOSED
 * - All other days: follow time slots above
 */
export function getRestaurantStatus(currentDateTime?: Date, language: Language = "fr"): RestaurantStatusResult {
  const now = currentDateTime || new Date();
  const dayName = getDayName(now);
  const dayHours = OPENING_HOURS[dayName];

  // Convert current time to minutes since midnight (strict numeric comparison)
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeMinutes = currentHour * 60 + currentMinute;

  // Tuesday is ALWAYS closed
  if (!dayHours.isOpen) {
    // Find next open day
    for (let i = 1; i <= 7; i++) {
      const nextDate = new Date(now);
      nextDate.setDate(now.getDate() + i);
      const nextDayName = getDayName(nextDate);
      const nextDayHours = OPENING_HOURS[nextDayName];
      
      if (nextDayHours.isOpen && nextDayHours.lunch) {
        const hour = String(nextDayHours.lunch.start.hour).padStart(2, '0');
        const minute = String(nextDayHours.lunch.start.minute).padStart(2, '0');
        const dayTranslations: Record<Language, Record<string, string>> = {
          fr: { monday: "lundi", tuesday: "mardi", wednesday: "mercredi", thursday: "jeudi", friday: "vendredi", saturday: "samedi", sunday: "dimanche" },
          en: { monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday", friday: "Friday", saturday: "Saturday", sunday: "Sunday" },
          de: { monday: "Montag", tuesday: "Dienstag", wednesday: "Mittwoch", thursday: "Donnerstag", friday: "Freitag", saturday: "Samstag", sunday: "Sonntag" }
        };
        const dayNameTranslated = dayTranslations[language][nextDayName] || nextDayName;
        const closedTodayMsg: Record<Language, string> = {
          fr: "Fermé aujourd'hui",
          en: "Closed today",
          de: "Heute geschlossen"
        };
        return {
          status: "closed_today",
          isOpen: false,
          message: closedTodayMsg[language],
          nextOpeningTime: `${hour}:${minute}`
        };
      }
    }
    const closedTodayMsg: Record<Language, string> = {
      fr: "Fermé aujourd'hui",
      en: "Closed today",
      de: "Heute geschlossen"
    };
    return {
      status: "closed_today",
      isOpen: false,
      message: closedTodayMsg[language]
    };
  }

  // Restaurant is open on this day - check time slots
  // Define time boundaries in minutes since midnight
  const LUNCH_START = 10 * 60 + 30;  // 10:30 = 630 minutes
  const LUNCH_END = 14 * 60 + 30;    // 14:30 = 870 minutes
  const DINNER_START = 18 * 60 + 30; // 18:30 = 1110 minutes
  const DINNER_END = 23 * 60 + 0;    // 23:00 = 1380 minutes

  // STRICT CHECK: Is currently within lunch hours?
  // Open if: currentTime >= 10:30 AND currentTime < 14:30
  const isInLunchHours = currentTimeMinutes >= LUNCH_START && currentTimeMinutes < LUNCH_END;

  // STRICT CHECK: Is currently within dinner hours?
  // Open if: currentTime >= 18:30 AND currentTime < 23:00
  const isInDinnerHours = currentTimeMinutes >= DINNER_START && currentTimeMinutes < DINNER_END;

  // Restaurant is OPEN if in either time slot
  if (isInLunchHours || isInDinnerHours) {
    const nowOpenMsg: Record<Language, string> = {
      fr: "Maintenant Ouvert",
      en: "Now Open",
      de: "Jetzt geöffnet"
    };
    return {
      status: "open",
      isOpen: true,
      message: nowOpenMsg[language]
    };
  }

  // Restaurant is CLOSED - determine next opening time
  // Case 1: Before lunch (time < 10:30)
  if (currentTimeMinutes < LUNCH_START) {
    const opensAtMsg: Record<Language, string> = {
      fr: "Ouvre à 10:30",
      en: "Opens at 10:30",
      de: "Öffnet um 10:30"
    };
    return {
      status: "opens_at_10_30",
      isOpen: false,
      message: opensAtMsg[language],
      nextOpeningTime: "10:30"
    };
  }

  // Case 2: Between lunch and dinner (14:30 <= time < 18:30)
  // At 17:55, we are here: 17*60 + 55 = 1075 minutes
  // LUNCH_END = 870, DINNER_START = 1110
  // 1075 >= 870 && 1075 < 1110 → TRUE
  if (currentTimeMinutes >= LUNCH_END && currentTimeMinutes < DINNER_START) {
    const opensAtMsg: Record<Language, string> = {
      fr: "Ouvre à 18:30",
      en: "Opens at 18:30",
      de: "Öffnet um 18:30"
    };
    return {
      status: "opens_at_18_30",
      isOpen: false,
      message: opensAtMsg[language],
      nextOpeningTime: "18:30"
    };
  }

  // Case 3: After dinner (time >= 23:00)
  if (currentTimeMinutes >= DINNER_END) {
    // Find next open day
    for (let i = 1; i <= 7; i++) {
      const nextDate = new Date(now);
      nextDate.setDate(now.getDate() + i);
      const nextDayName = getDayName(nextDate);
      const nextDayHours = OPENING_HOURS[nextDayName];
      
      if (nextDayHours.isOpen && nextDayHours.lunch) {
        const hour = String(nextDayHours.lunch.start.hour).padStart(2, '0');
        const minute = String(nextDayHours.lunch.start.minute).padStart(2, '0');
        const dayTranslations: Record<Language, Record<string, string>> = {
          fr: { monday: "lundi", tuesday: "mardi", wednesday: "mercredi", thursday: "jeudi", friday: "vendredi", saturday: "samedi", sunday: "dimanche" },
          en: { monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday", friday: "Friday", saturday: "Saturday", sunday: "Sunday" },
          de: { monday: "Montag", tuesday: "Dienstag", wednesday: "Mittwoch", thursday: "Donnerstag", friday: "Freitag", saturday: "Samstag", sunday: "Sonntag" }
        };
        const dayNameTranslated = dayTranslations[language][nextDayName] || nextDayName;
        const opensMsg: Record<Language, string> = {
          fr: `Ouvre ${dayNameTranslated} à ${hour}:${minute}`,
          en: `Opens ${dayNameTranslated} at ${hour}:${minute}`,
          de: `Öffnet ${dayNameTranslated} um ${hour}:${minute}`
        };
        return {
          status: "closed_after_23",
          isOpen: false,
          message: opensMsg[language],
          nextOpeningTime: `${hour}:${minute}`
        };
      }
    }
  }

  // Fallback (should never reach here, but safety net)
  const closedMsg: Record<Language, string> = {
    fr: "Fermé",
    en: "Closed",
    de: "Geschlossen"
  };
  return {
    status: "closed",
    isOpen: false,
    message: closedMsg[language]
  };
}

/**
 * Check if restaurant is currently open
 * Uses getRestaurantStatus internally for consistency
 */
export function isCurrentlyOpen(): boolean {
  return getRestaurantStatus().isOpen;
}

/**
 * Get next opening time
 * Uses getRestaurantStatus internally for consistency
 * @deprecated Use getRestaurantStatus() instead for more detailed information
 */
export function getNextOpeningTime(): { time: string; message: string } | null {
  const status = getRestaurantStatus();
  
  if (status.isOpen) {
    return null; // Already open
  }

  if (status.nextOpeningTime) {
    return {
      time: status.nextOpeningTime,
      message: status.message
    };
  }

  return null;
}

/**
 * Check if a specific date is valid for reservations (not Tuesday, not in the past)
 */
export function isDateValidForReservation(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);

  // Cannot select past dates
  if (selectedDate < today) {
    return false;
  }

  // Tuesday is closed
  const dayName = getDayName(selectedDate);
  return OPENING_HOURS[dayName].isOpen;
}

/**
 * Check if a specific date and time is valid for reservations
 */
export function isDateTimeValidForReservation(date: Date, hour: number, minute: number): boolean {
  if (!isDateValidForReservation(date)) {
    return false;
  }

  const dayName = getDayName(date);
  const dayHours = OPENING_HOURS[dayName];

  if (!dayHours.isOpen) {
    return false;
  }

  const selectedTime = hour * 60 + minute;

  // Check lunch hours
  if (dayHours.lunch) {
    const lunchStart = dayHours.lunch.start.hour * 60 + dayHours.lunch.start.minute;
    const lunchEnd = dayHours.lunch.end.hour * 60 + dayHours.lunch.end.minute;
    if (selectedTime >= lunchStart && selectedTime < lunchEnd) {
      return true;
    }
  }

  // Check dinner hours
  if (dayHours.dinner) {
    const dinnerStart = dayHours.dinner.start.hour * 60 + dayHours.dinner.start.minute;
    const dinnerEnd = dayHours.dinner.end.hour * 60 + dayHours.dinner.end.minute;
    if (selectedTime >= dinnerStart && selectedTime < dinnerEnd) {
      return true;
    }
  }

  return false;
}

/**
 * Generate available time slots for a specific date
 * Returns time slots in 30-minute intervals
 */
export function getAvailableTimeSlots(date: Date): TimeSlot[] {
  const dayName = getDayName(date);
  const dayHours = OPENING_HOURS[dayName];

  if (!dayHours.isOpen) {
    return [];
  }

  const slots: TimeSlot[] = [];
  const slotInterval = 30; // 30 minutes

  // Generate lunch slots
  if (dayHours.lunch) {
    const lunchStart = dayHours.lunch.start.hour * 60 + dayHours.lunch.start.minute;
    const lunchEnd = dayHours.lunch.end.hour * 60 + dayHours.lunch.end.minute;
    
    for (let time = lunchStart; time < lunchEnd; time += slotInterval) {
      const hour = Math.floor(time / 60);
      const minute = time % 60;
      slots.push({
        hour,
        minute,
        label: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
      });
    }
  }

  // Generate dinner slots
  if (dayHours.dinner) {
    const dinnerStart = dayHours.dinner.start.hour * 60 + dayHours.dinner.start.minute;
    const dinnerEnd = dayHours.dinner.end.hour * 60 + dayHours.dinner.end.minute;
    
    for (let time = dinnerStart; time < dinnerEnd; time += slotInterval) {
      const hour = Math.floor(time / 60);
      const minute = time % 60;
      slots.push({
        hour,
        minute,
        label: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
      });
    }
  }

  return slots;
}

/**
 * Format hours for display
 */
export function formatHours(dayHours: DayHours): string {
  if (!dayHours.isOpen) {
    return "Closed";
  }

  const parts: string[] = [];
  
  if (dayHours.lunch) {
    const start = `${String(dayHours.lunch.start.hour).padStart(2, '0')}:${String(dayHours.lunch.start.minute).padStart(2, '0')}`;
    const end = `${String(dayHours.lunch.end.hour).padStart(2, '0')}:${String(dayHours.lunch.end.minute).padStart(2, '0')}`;
    parts.push(`${start} – ${end}`);
  }

  if (dayHours.dinner) {
    const start = `${String(dayHours.dinner.start.hour).padStart(2, '0')}:${String(dayHours.dinner.start.minute).padStart(2, '0')}`;
    const end = `${String(dayHours.dinner.end.hour).padStart(2, '0')}:${String(dayHours.dinner.end.minute).padStart(2, '0')}`;
    parts.push(`${start} – ${end}`);
  }

  return parts.join(" / ");
}

/**
 * Get formatted hours for all days
 */
export function getAllFormattedHours(): Record<DayName, string> {
  return {
    monday: formatHours(OPENING_HOURS.monday),
    tuesday: formatHours(OPENING_HOURS.tuesday),
    wednesday: formatHours(OPENING_HOURS.wednesday),
    thursday: formatHours(OPENING_HOURS.thursday),
    friday: formatHours(OPENING_HOURS.friday),
    saturday: formatHours(OPENING_HOURS.saturday),
    sunday: formatHours(OPENING_HOURS.sunday)
  };
}

