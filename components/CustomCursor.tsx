"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Main cursor spring - more responsive, still smooth
  const springConfig = { damping: 30, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  // Halo cursor spring (with delay) - slightly more responsive
  const haloSpringConfig = { damping: 25, stiffness: 220 };
  const haloXSpring = useSpring(cursorX, haloSpringConfig);
  const haloYSpring = useSpring(cursorY, haloSpringConfig);

  useEffect(() => {
    setMounted(true);
    
    // Only show on desktop (non-touch devices)
    const isTouchDevice = 
      typeof window !== "undefined" && (
        "ontouchstart" in window || 
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches
      );
    
    if (isTouchDevice) {
      return;
    }

    setIsVisible(true);

    const updateCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest(".btn-primary") ||
        target.closest(".btn-secondary")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseMoveCombined = (e: MouseEvent) => {
      updateCursor(e);
      handleMouseMove(e);
    };

    window.addEventListener("mousemove", handleMouseMoveCombined);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMoveCombined);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [cursorX, cursorY]);

  if (!mounted || !isVisible) return null;

  return (
    <>
      {/* Hide default cursor with CSS */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>
      
      {/* Halo cursor - follows with delay */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: haloXSpring,
          y: haloYSpring,
          translateX: "-50%",
          translateY: "-50%"
        }}
      >
        <motion.div
          animate={{
            width: isHovering ? 60 : 40,
            height: isHovering ? 60 : 40,
            opacity: isHovering ? 0.15 : 0.1
          }}
          transition={{
            duration: 0.3,
            ease: [0.25, 0.1, 0.25, 1]
          }}
          className="rounded-full border border-persian-orange/30 bg-persian-orange/5 backdrop-blur-sm"
        />
      </motion.div>
      
      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%"
        }}
      >
        <motion.div
          animate={{
            width: isClicking ? 18 : isHovering ? 36 : 24,
            height: isClicking ? 18 : isHovering ? 36 : 24,
            opacity: isHovering ? 0.8 : 0.6
          }}
          transition={{
            duration: isClicking ? 0.08 : 0.2,
            ease: [0.25, 0.1, 0.25, 1]
          }}
          className="rounded-full border-2 border-persian-orange/70 bg-parchment-200/30 backdrop-blur-sm shadow-[0_0_20px_rgba(212,150,83,0.3)]"
        />
      </motion.div>
    </>
  );
}

