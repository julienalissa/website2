"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface BreathingGradientProps {
  className?: string;
  color?: string;
}

export function BreathingGradient({ className = "", color = "#D49653" }: BreathingGradientProps) {
  const [mounted, setMounted] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    if (isReducedMotion || !gradientRef.current) {
      return;
    }

    // Gentle breathing animation
    gsap.to(gradientRef.current, {
      opacity: 0.15,
      scale: 1.1,
      duration: 6,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [isReducedMotion, color]);

  if (!mounted || isReducedMotion) {
    return null;
  }

  return (
    <div
      ref={gradientRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      aria-hidden="true"
      style={{
        background: `radial-gradient(ellipse at 50% 50%, ${color}15 0%, transparent 70%)`,
        opacity: 0.1
      }}
    />
  );
}




