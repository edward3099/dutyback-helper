'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import './ReactBitsAnimatedList.css';

interface ReactBitsAnimatedListProps {
  children: React.ReactNode;
  staggerDelay?: number;
  duration?: number;
  delay?: number;
  threshold?: number;
  className?: string;
}

const ReactBitsAnimatedList: React.FC<ReactBitsAnimatedListProps> = ({
  children,
  staggerDelay = 100,
  duration = 600,
  delay = 0,
  threshold = 0.1,
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

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={hasAnimated ? 'visible' : 'hidden'}
      transition={{
        delay: delay / 1000,
        staggerChildren: staggerDelay / 1000,
        duration: duration / 1000,
      }}
      className={`animated-list ${className}`}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div 
          key={index} 
          variants={itemVariants}
          className="animated-list-item"
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ReactBitsAnimatedList;
