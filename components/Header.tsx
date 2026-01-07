"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReservation } from "./ReservationProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "./LanguageSelector";
import { useOpeningStatus } from "@/hooks/useOpeningStatus";
import { NowOpenStatus } from "./NowOpenStatus";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { openReservation } = useReservation();
  const { t } = useLanguage();
  const { isBeforeOpening, isOpeningDay } = useOpeningStatus();

  const navigation = [
    { name: t.nav.home, href: "/" },
    { name: t.nav.about, href: "/about" },
    { name: t.nav.menu, href: "/menu" },
    { name: t.nav.drinks, href: "/drinks" },
    { name: t.nav.events, href: "/events" },
    { name: t.nav.gallery, href: "/gallery" },
    { name: t.nav.contact, href: "/contact" }
  ];

  return (
    <header className="sticky top-0 z-50 bg-parchment-200/95 backdrop-blur-sm border-b border-parchment-300/30 texture-overlay">
      <nav className="container mx-auto px-6 sm:px-8 lg:px-12" aria-label="Main">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Le Savoré"
              width={50}
              height={50}
              className="object-contain"
            />
            <span className="text-2xl font-serif font-medium text-charleston-green tracking-tight transition-opacity hover:opacity-80 duration-300">
              Le Savoré
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`text-sm font-medium transition-colors duration-300 ${
                    isActive
                      ? "text-charleston-green border-b border-charleston-green pb-1"
                      : "text-text-body hover:text-charleston-green"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            <NowOpenStatus variant="text" className="hidden lg:flex text-sm font-medium" />
            <button 
              onClick={openReservation} 
              className={`btn-primary ml-4 ${(isBeforeOpening || isOpeningDay) ? 'bg-persian-orange/90 hover:bg-persian-orange border-persian-orange' : ''}`}
            >
              {(isBeforeOpening || isOpeningDay) ? t.opening.reserveForOpening : t.nav.reserveTable}
            </button>
            <LanguageSelector />
          </div>

          {/* Mobile menu button and language selector */}
          <div className="flex items-center gap-4 lg:hidden">
            <LanguageSelector />
            <button
              type="button"
              className="p-2 text-text-dark transition-opacity hover:opacity-70 duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Ouvrir le menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="lg:hidden border-t border-parchment-300/30"
            >
              <div className="space-y-1 px-2 pb-4 pt-3">
                {navigation.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block rounded-md px-3 py-2 text-base font-medium transition-colors duration-300 ${
                        isActive
                          ? "bg-parchment-300/30 text-charleston-green"
                          : "text-text-body hover:bg-parchment-300/20"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openReservation();
                  }}
                  className="btn-primary block w-full text-center mt-4"
                >
                  {t.nav.reserveTable}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
