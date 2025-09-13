'use client';

import React, { useRef, useCallback } from 'react';
import './ClickSpark.css';

interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: string;
  extraScale?: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const ClickSpark: React.FC<ClickSparkProps> = ({
  sparkColor = '#f00',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = 'ease-out',
  extraScale = 1,
  children,
  className = '',
  style = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const createSpark = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create spark container
    const sparkContainer = document.createElement('div');
    sparkContainer.className = 'click-spark-container';
    sparkContainer.style.position = 'absolute';
    sparkContainer.style.left = `${x}px`;
    sparkContainer.style.top = `${y}px`;
    sparkContainer.style.pointerEvents = 'none';
    sparkContainer.style.zIndex = '1000';

    // Create individual sparks
    for (let i = 0; i < sparkCount; i++) {
      const spark = document.createElement('div');
      spark.className = 'click-spark';
      
      const angle = (360 / sparkCount) * i;
      const radians = (angle * Math.PI) / 180;
      const distance = sparkRadius * extraScale;
      
      const endX = Math.cos(radians) * distance;
      const endY = Math.sin(radians) * distance;
      
      spark.style.position = 'absolute';
      spark.style.left = '0';
      spark.style.top = '0';
      spark.style.width = `${sparkSize}px`;
      spark.style.height = '2px';
      spark.style.backgroundColor = sparkColor;
      spark.style.borderRadius = '1px';
      spark.style.transformOrigin = '0 50%';
      spark.style.transform = `rotate(${angle}deg)`;
      
      // Animate the spark
      spark.animate([
        {
          transform: `rotate(${angle}deg) translateX(0px)`,
          opacity: 1
        },
        {
          transform: `rotate(${angle}deg) translateX(${endX}px)`,
          opacity: 0
        }
      ], {
        duration: duration,
        easing: easing,
        fill: 'forwards'
      });

      sparkContainer.appendChild(spark);
    }

    containerRef.current.appendChild(sparkContainer);

    // Remove spark container after animation
    setTimeout(() => {
      if (sparkContainer.parentNode) {
        sparkContainer.parentNode.removeChild(sparkContainer);
      }
    }, duration);
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration, easing, extraScale]);

  return (
    <div
      ref={containerRef}
      className={`click-spark-wrapper ${className}`}
      style={style}
      onClick={createSpark}
    >
      {children}
    </div>
  );
};

export default ClickSpark;