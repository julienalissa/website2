"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { gsap } from "gsap";
import { useLanguage } from "@/contexts/LanguageContext";
import { restaurantInfo } from "@/lib/data";

export function IntroOverlay() {
  // Try to get language context, but handle case where it's not available yet
  let tagline = restaurantInfo.tagline;
  let skipText = "Passer";
  try {
    const { t } = useLanguage();
    tagline = t?.hero?.tagline || restaurantInfo.tagline;
    skipText = t?.intro?.skip || "Passer";
  } catch {
    // Fallback if LanguageProvider is not mounted yet
    tagline = restaurantInfo.tagline;
    skipText = "Passer";
  }
  
  const [isVisible, setIsVisible] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();
  
  const overlayRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const skipButtonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);

  // Image is always ready with placeholder
  useEffect(() => {
    setImageLoaded(true);
    setImageError(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  useEffect(() => {
    // Only show on home page
    if (pathname !== "/") {
      setIsVisible(false);
      return;
    }

    // Check if mobile
    const checkMobile = () => {
      if (typeof window === "undefined") return false;
      const isTouchDevice = 
        "ontouchstart" in window || 
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches;
      return isTouchDevice;
    };
    
    const mobile = checkMobile();
    setIsMobile(mobile);
    
    // Always show intro on home page (no localStorage check)
    if (typeof window !== "undefined") {
      setIsVisible(true);
      
      // Prevent scroll during intro
      document.body.classList.add("intro-active");
      
      // Wait for image to load AND next frame to ensure DOM is ready
      const startAnimation = () => {
        if (!imageLoaded) {
          // Wait a bit more for image
          setTimeout(startAnimation, 100);
          return;
        }
        
        setIsReady(true);
        
        // Wait for next frame to ensure DOM is ready
        requestAnimationFrame(() => {
        if (mobile) {
          // Simple fade for mobile
          const tl = gsap.timeline();
          tl.to(overlayRef.current, {
            opacity: 0,
            duration: 1.5,
            ease: "power2.inOut",
            delay: 1
          });
          tl.call(() => {
            setIsVisible(false);
            document.body.classList.remove("intro-active");
          });
        } else {
          // Cinematic experience for desktop
          const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
          
          // Initial state
          gsap.set(imageRef.current, {
            scale: 1.2,
            opacity: 0,
            filter: "blur(20px) brightness(0.3)"
          });
          gsap.set(lightRef.current, {
            opacity: 0,
            scale: 0.5
          });
          gsap.set(vignetteRef.current, {
            opacity: 0.8
          });
          gsap.set(textRef.current, {
            opacity: 0,
            y: 30
          });
          gsap.set(skipButtonRef.current, {
            opacity: 0,
            y: -10
          });
          
          // Show skip button
          tl.to(skipButtonRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
          }, 0.3);
          
          // Image starts to appear - blur reduces, brightness increases
          tl.to(imageRef.current, {
            opacity: 1,
            filter: "blur(8px) brightness(0.5)",
            duration: 1.5,
            ease: "power2.out"
          }, 0.5);
          
          // Warm light appears from center
          tl.to(lightRef.current, {
            opacity: 0.4,
            scale: 1,
            duration: 2,
            ease: "power2.out"
          }, 0.8);
          
          // Image comes into focus - zoom in slightly, remove blur
          tl.to(imageRef.current, {
            scale: 1.05,
            filter: "blur(0px) brightness(0.7)",
            duration: 2,
            ease: "power2.inOut"
          }, 1.5);
          
          // Vignette reduces, revealing more of the image
          tl.to(vignetteRef.current, {
            opacity: 0.3,
            duration: 1.5,
            ease: "power2.out"
          }, 2);
          
          // Text appears elegantly
          tl.to(textRef.current, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power2.out"
          }, 2.5);
          
          // Light intensifies
          tl.to(lightRef.current, {
            opacity: 0.6,
            scale: 1.2,
            duration: 1.5,
            ease: "power2.out"
          }, 3);
          
          // Final image reveal - full brightness, perfect focus
          tl.to(imageRef.current, {
            scale: 1,
            filter: "blur(0px) brightness(1)",
            duration: 1.5,
            ease: "power2.inOut"
          }, 3.5);
          
          // Vignette almost disappears
          tl.to(vignetteRef.current, {
            opacity: 0.1,
            duration: 1,
            ease: "power2.out"
          }, 4);
          
          // Light expands and fades
          tl.to(lightRef.current, {
            opacity: 0,
            scale: 2.5,
            duration: 1.2,
            ease: "power2.in"
          }, 4.5);
          
          // Text fades out
          tl.to(textRef.current, {
            opacity: 0,
            y: -20,
            duration: 0.8,
            ease: "power2.in"
          }, 4.8);
          
          // Image fades out
          tl.to(imageRef.current, {
            opacity: 0,
            scale: 1.1,
            duration: 1,
            ease: "power2.in"
          }, 5);
          
          // Overlay fades out completely
          tl.to(overlayRef.current, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.in"
          }, 5.2);
          
          // Complete - reveal the hero
          tl.call(() => {
            setIsVisible(false);
            document.body.classList.remove("intro-active");
          }, undefined, 5.5);
        }
      });
    };
    
    // Start animation when ready
    if (imageLoaded) {
      startAnimation();
    }
    } // Close if (typeof window !== "undefined")
    
    return () => {
      // Cleanup
      if (overlayRef.current) {
        gsap.killTweensOf(overlayRef.current);
      }
    };
  }, [pathname, isMobile, imageLoaded]);

  const handleSkip = () => {
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          setIsVisible(false);
          document.body.classList.remove("intro-active");
        }
      });
    }
    setIsSkipped(true);
  };

  if (!isVisible || isSkipped) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] pointer-events-none"
      style={{ 
        opacity: 1,
        // Fallback background - always visible to prevent black screen
        backgroundColor: "#1a1a1a", // charleston-green equivalent
        backgroundImage: imageError 
          ? "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)" 
          : undefined
      }}
    >
      {/* Grain texture overlay - subtle film grain */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
          mixBlendMode: "overlay"
        }}
      />
      
      {/* Main Image Container */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {/* Fallback background - always visible */}
        <div 
          className="absolute inset-0"
          style={{
            background: imageError 
              ? "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)"
              : "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
            opacity: imageLoaded && !imageError ? 0.3 : 1,
            transition: "opacity 0.5s ease-in-out"
          }}
        />
        
        <div
          ref={imageRef}
          className="relative w-full h-full"
          style={{
            transform: "scale(1.2)",
            opacity: imageLoaded && !imageError ? 0 : 1,
            filter: imageLoaded && !imageError ? "blur(20px) brightness(0.3)" : "none"
          }}
        >
          <ImagePlaceholder
            alt="Le Savoré - Introduction"
            fill
            className="object-cover"
          />
        </div>
      </div>
      
      {/* Vignette overlay - dark edges */}
      <div
        ref={vignetteRef}
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0, 0, 0, 0.8) 100%)",
          opacity: 0.8
        }}
      />
      
      {/* Warm golden light in center - Mediterranean glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-15">
        <div
          ref={lightRef}
          className="w-[600px] h-[600px] rounded-full bg-persian-orange/40"
          style={{ 
            opacity: 0, 
            transform: "scale(0.5)",
            filter: "blur(80px)"
          }}
        />
      </div>
      
      {/* Elegant text overlay */}
      <div
        ref={textRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
        style={{ opacity: 0, transform: "translateY(30px)" }}
      >
        <div className="text-center px-8">
          <h1 className="text-5xl md:text-7xl font-serif font-medium text-white mb-4 tracking-tight" style={{ 
            textShadow: '0 2px 30px rgba(0, 0, 0, 0.5), 0 0 60px rgba(0, 0, 0, 0.3)',
            letterSpacing: '0.02em'
          }}>
            {restaurantInfo.name}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light tracking-wide" style={{
            textShadow: '0 1px 20px rgba(0, 0, 0, 0.4)',
            letterSpacing: '0.05em'
          }}>
            {tagline}
          </p>
        </div>
      </div>

      {/* Skip button - very discreet */}
      <button
        ref={skipButtonRef}
        onClick={handleSkip}
        onMouseDown={(e) => e.stopPropagation()}
        className="absolute top-8 right-8 px-5 py-2.5 text-xs text-white/30 hover:text-white/60 transition-colors duration-300 pointer-events-auto z-[101] font-light tracking-widest uppercase"
        style={{ opacity: 0 }}
        aria-label={skipText}
      >
        {skipText}
      </button>
    </div>
  );
}
