'use client';

import React, { useRef, useEffect } from 'react';
import './StarBorder.css';

interface StarBorderProps {
  children: React.ReactNode;
  isActive?: boolean;
  color?: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

const StarBorder: React.FC<StarBorderProps> = ({
  children,
  isActive = false,
  color = '#3b82f6',
  size = 20,
  className = '',
  style = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const stars = container.querySelectorAll('.star-border-star');
    
    stars.forEach((star, index) => {
      const delay = index * 100;
      if (isActive) {
        (star as HTMLElement).style.animation = `starBorderAppear 0.5s ease-out ${delay}ms forwards`;
      } else {
        (star as HTMLElement).style.animation = 'none';
        (star as HTMLElement).style.opacity = '0';
      }
    });
  }, [isActive]);

  return (
    <div
      ref={containerRef}
      className={`star-border ${isActive ? 'star-border--active' : ''} ${className}`}
      style={style}
    >
      {children}
      <div className="star-border-stars">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="star-border-star"
            style={{
              '--star-color': color,
              '--star-size': `${size}px`,
              '--star-angle': `${i * 45}deg`
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
};

export default StarBorder;
