"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { ReservationModal } from "./ReservationModal";

interface ReservationContextType {
  openReservation: () => void;
  closeReservation: () => void;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export function useReservation() {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error("useReservation must be used within ReservationProvider");
  }
  return context;
}

export function ReservationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openReservation = () => setIsOpen(true);
  const closeReservation = () => setIsOpen(false);

  return (
    <ReservationContext.Provider value={{ openReservation, closeReservation }}>
      {children}
      <ReservationModal isOpen={isOpen} onClose={closeReservation} />
    </ReservationContext.Provider>
  );
}







