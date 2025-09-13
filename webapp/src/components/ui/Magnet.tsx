'use client';

import React, { useRef, useCallback, useState } from 'react';
import './Magnet.css';

interface MagnetProps {
  children: React.ReactNode;
  strength?: number;
  range?: number;
  className?: string;
  style?: React.CSSProperties;
}

const Magnet: React.FC<MagnetProps> = ({
  children,
  strength = 0.3,
  range = 100,
  className = '',
  style = {}
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!elementRef.current || !isHovering) return;

    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const distanceX = mouseX - centerX;
    const distanceY = mouseY - centerY;
    
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    if (distance < range) {
      const moveX = (distanceX / range) * strength * 20;
      const moveY = (distanceY / range) * strength * 20;
      
      elementRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
  }, [strength, range, isHovering]);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    if (elementRef.current) {
      elementRef.current.style.transform = 'translate(0px, 0px)';
    }
  }, []);

  return (
    <div
      ref={elementRef}
      className={`magnet ${className}`}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

export default Magnet;
