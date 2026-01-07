"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image, { ImageProps } from "next/image";

interface ParallaxImageProps extends ImageProps {
  intensity?: number;
}

export function ParallaxImage({ intensity = 0.02, className = "", ...imageProps }: ParallaxImageProps) {
  const [mounted, setMounted] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const targetX = useRef(0);
  const targetY = useRef(0);

  useEffect(() => {
    setMounted(true);
    
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    if (isReducedMotion || !containerRef.current || !imageWrapperRef.current) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      targetX.current = (e.clientX - centerX) * intensity;
      targetY.current = (e.clientY - centerY) * intensity;
    };

    const container = containerRef.current;
    container.addEventListener("mousemove", handleMouseMove);
    
    container.addEventListener("mouseleave", () => {
      targetX.current = 0;
      targetY.current = 0;
    });

    // Smooth interpolation
    const animate = () => {
      mouseX.current += (targetX.current - mouseX.current) * 0.1;
      mouseY.current += (targetY.current - mouseY.current) * 0.1;
      
      if (imageWrapperRef.current) {
        gsap.to(imageWrapperRef.current, {
          x: mouseX.current,
          y: mouseY.current,
          duration: 1.5,
          ease: "power2.out"
        });
      }
      
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [intensity, isReducedMotion]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden">
      <div 
        ref={imageWrapperRef} 
        className="absolute inset-0 w-full h-full"
        style={{ willChange: isReducedMotion ? "auto" : "transform" }}
      >
        <Image
          {...imageProps}
          className={className}
        />
      </div>
    </div>
  );
}

