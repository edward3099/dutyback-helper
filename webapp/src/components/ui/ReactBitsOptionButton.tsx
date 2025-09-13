'use client';

import React, { useState, useCallback } from 'react';
import ReactBitsMagnet from './ReactBitsMagnet';
import ReactBitsClickSpark from './ReactBitsClickSpark';
import ReactBitsGlareHover from './ReactBitsGlareHover';
import ReactBitsStarBorder from './ReactBitsStarBorder';
import { Check } from 'lucide-react';
import './ReactBitsOptionButton.css';

interface ReactBitsOptionButtonProps {
  children: React.ReactNode;
  isSelected?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'channel' | 'vat' | 'claim';
}

const ReactBitsOptionButton: React.FC<ReactBitsOptionButtonProps> = ({
  children,
  isSelected = false,
  onClick,
  disabled = false,
  className = '',
  style,
  variant,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled && onClick) {
      onClick(event);
    }
  }, [disabled, onClick]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'channel':
        return {
          backgroundColor: isSelected ? '#e0f2fe' : '#ffffff',
          borderColor: isSelected ? '#3b82f6' : '#e5e7eb',
          color: '#1f2937',
        };
      case 'vat':
        return {
          backgroundColor: isSelected ? '#dcfce7' : '#ffffff',
          borderColor: isSelected ? '#22c55e' : '#e5e7eb',
          color: '#1f2937',
        };
      case 'claim':
        return {
          backgroundColor: isSelected ? '#fef3c7' : '#ffffff',
          borderColor: isSelected ? '#f59e0b' : '#e5e7eb',
          color: '#1f2937',
        };
      default:
        return {
          backgroundColor: isSelected ? '#e0f2fe' : '#ffffff',
          borderColor: isSelected ? '#3b82f6' : '#e5e7eb',
          color: '#1f2937',
        };
    }
  };

  return (
    <ReactBitsMagnet 
      padding={50} 
      disabled={disabled}
      magnetStrength={3}
    >
      <ReactBitsClickSpark 
        disabled={disabled}
        sparkColor="#3b82f6"
        sparkSize={8}
        sparkRadius={20}
        sparkCount={6}
        duration={300}
      >
        <ReactBitsGlareHover
          disabled={disabled}
          width="100%"
          height="100%"
          background="transparent"
          borderRadius="12px"
          borderColor="transparent"
          glareColor="#ffffff"
          glareOpacity={0.3}
          glareAngle={-45}
          glareSize={200}
          transitionDuration={400}
        >
          <ReactBitsStarBorder
            as="div"
            color={isSelected ? '#3b82f6' : '#e5e7eb'}
            speed="3s"
            thickness={isSelected ? 2 : 1}
            className="reactbits-option-button"
            style={{ ...getVariantStyles(), ...style }}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex-1 text-left">
                {children}
              </div>
              {isSelected && (
                <div className="ml-3 text-blue-600">
                  <Check className="w-5 h-5" />
                </div>
              )}
            </div>
          </ReactBitsStarBorder>
        </ReactBitsGlareHover>
      </ReactBitsClickSpark>
    </ReactBitsMagnet>
  );
};

export default ReactBitsOptionButton;
