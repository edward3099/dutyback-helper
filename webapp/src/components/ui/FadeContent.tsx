"use client";

import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './FadeContent.css';

gsap.registerPlugin(ScrollTrigger);

const FadeContent = ({
  children,
  className = '',
  fadeDirection = 'up',
  duration = 0.8,
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px 0px -100px 0px'
}) => {
  const contentRef = useRef(null);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    // Set initial state based on fade direction
    const initialProps = {
      opacity: 0,
      y: fadeDirection === 'up' ? 50 : fadeDirection === 'down' ? -50 : 0,
      x: fadeDirection === 'left' ? 50 : fadeDirection === 'right' ? -50 : 0,
      scale: fadeDirection === 'scale' ? 0.9 : 1
    };

    gsap.set(content, initialProps);

    gsap.to(content, {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      duration: duration,
      delay: delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: content,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
        threshold: threshold,
        rootMargin: rootMargin
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [fadeDirection, duration, delay, threshold, rootMargin]);

  return (
    <div ref={contentRef} className={`fade-content ${className}`}>
      {children}
    </div>
  );
};

export default FadeContent;
