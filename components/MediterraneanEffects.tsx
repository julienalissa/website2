"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export function MediterraneanEffects() {
  const [mounted, setMounted] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const wavesRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const targetX = useRef(0);
  const targetY = useRef(0);

  useEffect(() => {
    setMounted(true);
    
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    // Check if device is low-end (simple heuristic)
    const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    
    if (isReducedMotion || isLowEnd) {
      return;
    }

    // Smooth mouse tracking with damping
    const handleMouseMove = (e: MouseEvent) => {
      targetX.current = (e.clientX / window.innerWidth - 0.5) * 20;
      targetY.current = (e.clientY / window.innerHeight - 0.5) * 20;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animate mouse influence with smooth interpolation
    const animateMouse = () => {
      mouseX.current += (targetX.current - mouseX.current) * 0.05;
      mouseY.current += (targetY.current - mouseY.current) * 0.05;
      
      if (wavesRef.current) {
        gsap.to(wavesRef.current, {
          x: mouseX.current * 0.3,
          y: mouseY.current * 0.2,
          duration: 2,
          ease: "power1.out"
        });
      }
      
      requestAnimationFrame(animateMouse);
    };
    animateMouse();

    // Animate floating shapes
    if (shapesRef.current) {
      const shapes = shapesRef.current.children;
      Array.from(shapes).forEach((shape, index) => {
        const delay = index * 0.5;
        const duration = 8 + Math.random() * 4;
        const x = (Math.random() - 0.5) * 30;
        const y = (Math.random() - 0.5) * 30;
        
        gsap.to(shape, {
          x: x,
          y: y,
          rotation: (Math.random() - 0.5) * 10,
          duration: duration,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: delay
        });
      });
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [isReducedMotion]);

  if (!mounted || isReducedMotion) {
    return null;
  }

  return (
    <>
      {/* Animated Waves - Mediterranean inspired */}
      <div
        ref={wavesRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.02] mediterranean-layer"
        aria-hidden="true"
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 400"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D49653" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#D49653" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,200 Q300,150 600,200 T1200,200 L1200,400 L0,400 Z"
            fill="url(#waveGradient)"
          >
            <animate
              attributeName="d"
              values="M0,200 Q300,150 600,200 T1200,200 L1200,400 L0,400 Z;M0,210 Q300,160 600,210 T1200,210 L1200,400 L0,400 Z;M0,200 Q300,150 600,200 T1200,200 L1200,400 L0,400 Z"
              dur="8s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M0,250 Q400,200 800,250 T1200,250 L1200,400 L0,400 Z"
            fill="url(#waveGradient)"
            opacity="0.6"
          >
            <animate
              attributeName="d"
              values="M0,250 Q400,200 800,250 T1200,250 L1200,400 L0,400 Z;M0,240 Q400,190 800,240 T1200,240 L1200,400 L0,400 Z;M0,250 Q400,200 800,250 T1200,250 L1200,400 L0,400 Z"
              dur="10s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>

      {/* Organic Floating Shapes */}
      <div
        ref={shapesRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.015] mediterranean-layer"
        aria-hidden="true"
      >
        {/* Shape 1 - Soft blob */}
        <div className="absolute top-[20%] left-[10%] w-64 h-64">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path
              d="M50,100 Q30,60 50,30 Q70,10 100,30 Q130,10 150,30 Q170,60 150,100 Q170,140 150,170 Q130,190 100,170 Q70,190 50,170 Q30,140 50,100 Z"
              fill="#D49653"
            >
              <animate
                attributeName="d"
                values="M50,100 Q30,60 50,30 Q70,10 100,30 Q130,10 150,30 Q170,60 150,100 Q170,140 150,170 Q130,190 100,170 Q70,190 50,170 Q30,140 50,100 Z;M55,95 Q35,65 55,35 Q75,15 100,35 Q125,15 145,35 Q165,65 145,95 Q165,135 145,165 Q125,185 100,165 Q75,185 55,165 Q35,135 55,95 Z;M50,100 Q30,60 50,30 Q70,10 100,30 Q130,10 150,30 Q170,60 150,100 Q170,140 150,170 Q130,190 100,170 Q70,190 50,170 Q30,140 50,100 Z"
                dur="12s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>

        {/* Shape 2 - Gentle curve */}
        <div className="absolute top-[60%] right-[15%] w-48 h-48">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path
              d="M20,100 Q50,50 100,50 Q150,50 180,100 Q150,150 100,150 Q50,150 20,100 Z"
              fill="#D49653"
            >
              <animate
                attributeName="d"
                values="M20,100 Q50,50 100,50 Q150,50 180,100 Q150,150 100,150 Q50,150 20,100 Z;M25,105 Q55,55 100,55 Q145,55 175,105 Q145,155 100,155 Q55,155 25,105 Z;M20,100 Q50,50 100,50 Q150,50 180,100 Q150,150 100,150 Q50,150 20,100 Z"
                dur="15s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>

        {/* Shape 3 - Soft wave form */}
        <div className="absolute bottom-[25%] left-[25%] w-56 h-56">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path
              d="M0,100 Q50,80 100,100 T200,100 L200,200 L0,200 Z"
              fill="#D49653"
            >
              <animate
                attributeName="d"
                values="M0,100 Q50,80 100,100 T200,100 L200,200 L0,200 Z;M0,105 Q50,85 100,105 T200,105 L200,200 L0,200 Z;M0,100 Q50,80 100,100 T200,100 L200,200 L0,200 Z"
                dur="10s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>
      </div>
    </>
  );
}

