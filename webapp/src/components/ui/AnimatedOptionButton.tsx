'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlareHover from './GlareHover';
import ClickSpark from './ClickSpark';
import Magnet from './Magnet';
import StarBorder from './StarBorder';
import { Check } from 'lucide-react';

interface AnimatedOptionButtonProps {
  children: React.ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'channel' | 'vat' | 'claim' | 'identifier';
  className?: string;
  style?: React.CSSProperties;
}

const AnimatedOptionButton: React.FC<AnimatedOptionButtonProps> = ({
  children,
  isSelected = false,
  onClick,
  disabled = false,
  variant = 'default',
  className = '',
  style = {}
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getVariantStyles = () => {
    const baseStyles = {
      width: '100%',
      minHeight: '80px',
      padding: '1rem',
      borderRadius: '12px',
      border: '2px solid',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    };

    switch (variant) {
      case 'channel':
        return {
          ...baseStyles,
          background: isSelected ? '#3b82f6' : '#f8fafc',
          borderColor: isSelected ? '#3b82f6' : '#e2e8f0',
          color: isSelected ? 'white' : '#1e293b'
        };
      case 'vat':
        return {
          ...baseStyles,
          background: isSelected ? '#10b981' : '#f0fdf4',
          borderColor: isSelected ? '#10b981' : '#d1fae5',
          color: isSelected ? 'white' : '#064e3b'
        };
      case 'claim':
        return {
          ...baseStyles,
          background: isSelected ? '#8b5cf6' : '#faf5ff',
          borderColor: isSelected ? '#8b5cf6' : '#e9d5ff',
          color: isSelected ? 'white' : '#581c87'
        };
      case 'identifier':
        return {
          ...baseStyles,
          background: isSelected ? '#f59e0b' : '#fffbeb',
          borderColor: isSelected ? '#f59e0b' : '#fed7aa',
          color: isSelected ? 'white' : '#92400e'
        };
      default:
        return {
          ...baseStyles,
          background: isSelected ? '#6366f1' : '#f1f5f9',
          borderColor: isSelected ? '#6366f1' : '#cbd5e1',
          color: isSelected ? 'white' : '#334155'
        };
    }
  };

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <Magnet strength={0.2} range={80}>
      <ClickSpark
        sparkColor={isSelected ? '#ffffff' : '#3b82f6'}
        sparkSize={8}
        sparkRadius={20}
        sparkCount={6}
        duration={300}
        className="w-full"
      >
        <GlareHover
          width="100%"
          height="100%"
          background="transparent"
          borderRadius="12px"
          borderColor="transparent"
          glareColor="#ffffff"
          glareOpacity={0.3}
          glareAngle={-30}
          glareSize={200}
          transitionDuration={400}
          playOnce={false}
        >
          <StarBorder
            isActive={isSelected}
            color={isSelected ? '#ffffff' : '#3b82f6'}
            size={16}
          >
            <motion.div
              className={`animated-option-button ${className}`}
              style={{ ...getVariantStyles(), ...style }}
              onClick={handleClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              whileHover={!disabled ? { scale: 1.02 } : {}}
              whileTap={!disabled ? { scale: 0.98 } : {}}
              animate={{
                boxShadow: isSelected
                  ? '0 10px 25px -5px rgba(59, 130, 246, 0.3)'
                  : isHovered
                  ? '0 8px 20px -5px rgba(0, 0, 0, 0.1)'
                  : '0 2px 4px -1px rgba(0, 0, 0, 0.1)'
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex-1 text-left">
                  {children}
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-3"
                  >
                    <Check className="w-5 h-5" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          </StarBorder>
        </GlareHover>
      </ClickSpark>
    </Magnet>
  );
};

export default AnimatedOptionButton;
