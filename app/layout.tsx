import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { IntroOverlay } from "@/components/IntroOverlay";
import { CustomCursor } from "@/components/CustomCursor";
import { ReservationProvider } from "@/components/ReservationProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { OpeningPopup } from "@/components/OpeningPopup";
import "./globals.css";

export const metadata: Metadata = {
  title: "Le Savoré - Fine Dining en Suisse",
  description: "Découvrez une cuisine méditerranéenne de saison, élaborée avec la qualité suisse et le souci du détail dans une atmosphère élégante et accueillante.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <LanguageProvider>
          <ReservationProvider>
            <CustomCursor />
            <IntroOverlay />
            <OpeningPopup />
            <Header />
            <main>{children}</main>
            <Footer />
          </ReservationProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

