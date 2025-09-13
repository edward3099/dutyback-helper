'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import './ReactBitsFadeContent.css';

interface ReactBitsFadeContentProps {
  children: React.ReactNode;
  blur?: boolean;
  duration?: number;
  delay?: number;
  easing?: string;
  threshold?: number;
  initialOpacity?: number;
  className?: string;
}

const ReactBitsFadeContent: React.FC<ReactBitsFadeContentProps> = ({
  children,
  blur = false,
  duration = 1000,
  delay = 0,
  easing = 'ease-out',
  threshold = 0.1,
  initialOpacity = 0,
  className = '',
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    amount: threshold 
  });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  return (
    <motion.div
      ref={ref}
      initial={{ 
        opacity: initialOpacity,
        filter: blur ? 'blur(10px)' : 'blur(0px)'
      }}
      animate={hasAnimated ? { 
        opacity: 1,
        filter: 'blur(0px)'
      } : { 
        opacity: initialOpacity,
        filter: blur ? 'blur(10px)' : 'blur(0px)'
      }}
      transition={{
        duration: duration / 1000,
        delay: delay / 1000,
        ease: easing === 'ease-out' ? 'easeOut' : easing,
      }}
      className={`fade-content ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default ReactBitsFadeContent;
