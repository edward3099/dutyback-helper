"use client";

import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import './ScrollStack.css';

gsap.registerPlugin(ScrollTrigger);

const ScrollStackItem = ({ children, className = '' }) => {
  return (
    <div className={`scroll-stack-item ${className}`}>
      {children}
    </div>
  );
};

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  onStackComplete = () => {}
}) => {
  const containerRef = useRef(null);
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll('.scroll-stack-item');
    if (items.length === 0) return;

    // Set initial positions
    items.forEach((item, index) => {
      gsap.set(item, {
        y: index * itemDistance,
        scale: baseScale - (index * itemScale),
        rotation: index * rotationAmount,
        filter: `blur(${index * blurAmount}px)`,
        zIndex: items.length - index
      });
    });

    // Create scroll triggers for each item
    items.forEach((item, index) => {
      const isLastItem = index === items.length - 1;
      
      gsap.to(item, {
        y: 0,
        scale: baseScale,
        rotation: 0,
        filter: 'blur(0px)',
        duration: scaleDuration,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: `top ${stackPosition}`,
          end: `top ${scaleEndPosition}`,
          scrub: true,
          onComplete: isLastItem ? onStackComplete : undefined
        }
      });

      // Stacking effect
      if (index > 0) {
        gsap.to(item, {
          y: index * itemStackDistance,
          scale: baseScale - (index * itemScale),
          rotation: index * rotationAmount,
          filter: `blur(${index * blurAmount}px)`,
          scrollTrigger: {
            trigger: container,
            start: `top ${stackPosition}`,
            end: `top ${scaleEndPosition}`,
            scrub: true
          }
        });
      }
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    scaleDuration,
    rotationAmount,
    blurAmount,
    onStackComplete
  ]);

  return (
    <div ref={containerRef} className={`scroll-stack ${className}`}>
      {children}
    </div>
  );
};

export { ScrollStack, ScrollStackItem };
