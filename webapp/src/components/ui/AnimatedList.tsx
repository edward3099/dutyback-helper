"use client";

import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './AnimatedList.css';

gsap.registerPlugin(ScrollTrigger);

const AnimatedListItem = ({ children, className = '', delay = 0 }) => {
  const itemRef = useRef(null);

  useEffect(() => {
    const item = itemRef.current;
    if (!item) return;

    gsap.fromTo(
      item,
      {
        opacity: 0,
        y: 50,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
        delay: delay,
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [delay]);

  return (
    <div ref={itemRef} className={`animated-list-item ${className}`}>
      {children}
    </div>
  );
};

const AnimatedList = ({
  children,
  className = '',
  staggerDelay = 0.1,
  animationType = 'fadeUp'
}) => {
  const listRef = useRef(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const items = list.querySelectorAll('.animated-list-item');
    
    // Reset all items
    gsap.set(items, {
      opacity: 0,
      y: animationType === 'fadeUp' ? 50 : 0,
      x: animationType === 'fadeLeft' ? -50 : animationType === 'fadeRight' ? 50 : 0,
      scale: animationType === 'scale' ? 0.9 : 1
    });

    // Animate items in sequence
    gsap.to(items, {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      duration: 0.6,
      ease: 'power2.out',
      stagger: staggerDelay,
      scrollTrigger: {
        trigger: list,
        start: 'top 70%',
        end: 'bottom 30%',
        toggleActions: 'play none none reverse'
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [staggerDelay, animationType]);

  return (
    <div ref={listRef} className={`animated-list ${className}`}>
      {children}
    </div>
  );
};

export { AnimatedList, AnimatedListItem };
