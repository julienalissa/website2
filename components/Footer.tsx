"use client";

import Link from "next/link";
import { restaurantInfo } from "@/lib/data";
import { useReservation } from "./ReservationProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOpeningStatus } from "@/hooks/useOpeningStatus";
import { getAllFormattedHours } from "@/lib/openingHours";

export function Footer() {
  const { openReservation } = useReservation();
  const { t } = useLanguage();
  const { isBeforeOpening, isOpeningDay } = useOpeningStatus();
  const formattedHours = getAllFormattedHours();
  
  return (
    <footer className="bg-charleston-green text-white/80">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-serif font-medium text-white mb-4">
              {restaurantInfo.name}
            </h3>
            <p className="text-sm leading-relaxed text-white/70">
              {t.hero.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              {t.footer.discover}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-white transition-colors">
                  {t.nav.menu}
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  {t.nav.gallery}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              {t.contact.title}
            </h4>
            <div className="space-y-2 text-sm">
              <p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurantInfo.address + ", Switzerland")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {restaurantInfo.address}
                </a>
              </p>
              <p>
                <a href={`tel:${restaurantInfo.phone}`} className="hover:text-white transition-colors">
                  {restaurantInfo.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${restaurantInfo.email}`} className="hover:text-white transition-colors">
                  {restaurantInfo.email}
                </a>
              </p>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              {t.footer.hours}
            </h4>
            <div className="space-y-1 text-sm">
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

        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/60">
              &copy; {new Date().getFullYear()} {restaurantInfo.name}. {t.footer.allRightsReserved}
            </p>
            <button 
              onClick={openReservation} 
              className={`btn-primary ${(isBeforeOpening || isOpeningDay) ? 'bg-persian-orange/90 hover:bg-persian-orange border-persian-orange' : ''}`}
            >
              {(isBeforeOpening || isOpeningDay) ? t.opening.reserveForOpening : t.nav.reserveTable}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
