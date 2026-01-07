"use client";

import { useLanguage } from "@/contexts/LanguageContext";

interface ImagePlaceholderProps {
  alt?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  quality?: number;
  src?: string;
  style?: React.CSSProperties;
}

export function ImagePlaceholder({
  alt = "Photo",
  width,
  height,
  fill = false,
  className = "",
  priority,
  quality,
  src,
  style,
  ...props
}: ImagePlaceholderProps) {
  const { language } = useLanguage();
  
  const placeholderText = language === "fr" 
    ? "photo bientôt disponible"
    : language === "de"
    ? "Foto bald verfügbar"
    : "photo coming soon";

  // Si on a une source d'image, afficher l'image
  if (src) {
    if (fill) {
      return (
        <img
          src={src}
          alt={alt}
          className={className}
          style={style}
          {...props}
        />
      );
    }
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={style}
        {...props}
      />
    );
  }

  // Sinon, afficher le placeholder
  if (fill) {
    return (
      <div
        className={`absolute inset-0 bg-gray-300 flex items-center justify-center ${className}`}
        style={style}
        {...props}
      >
        <div className="text-center px-4">
          <p className="text-gray-600 text-sm md:text-base font-medium">
            {placeholderText}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gray-300 flex items-center justify-center ${className}`}
      style={{
        width: width || "100%",
        height: height || "100%",
        ...style
      }}
      {...props}
    >
      <div className="text-center px-4">
        <p className="text-gray-600 text-sm md:text-base font-medium">
          {placeholderText}
        </p>
      </div>
    </div>
  );
}


