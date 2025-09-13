'use client';

import React from 'react';
import SpotlightCard from '../SpotlightCard';
import { Check } from 'lucide-react';
import './ReactBitsSpotlightCard.css';

interface ReactBitsSpotlightCardProps {
  children: React.ReactNode;
  isSelected?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
  className?: string;
  variant?: 'channel' | 'vat' | 'claim';
}

const ReactBitsSpotlightCard: React.FC<ReactBitsSpotlightCardProps> = ({
  children,
  isSelected = false,
  onClick,
  disabled = false,
  className = '',
  variant = 'channel',
}) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled && onClick) {
      onClick(event);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'channel':
        return {
          backgroundColor: isSelected ? '#dbeafe' : '#ffffff', // blue-50 / white
          borderColor: isSelected ? '#3b82f6' : '#e5e7eb', // blue-500 / gray-200
          spotlightColor: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
        };
      case 'vat':
        return {
          backgroundColor: isSelected ? '#dcfce7' : '#ffffff', // green-50 / white
          borderColor: isSelected ? '#22c55e' : '#e5e7eb', // green-500 / gray-200
          spotlightColor: isSelected ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
        };
      case 'claim':
        return {
          backgroundColor: isSelected ? '#fef3c7' : '#ffffff', // yellow-50 / white
          borderColor: isSelected ? '#f59e0b' : '#e5e7eb', // yellow-500 / gray-200
          spotlightColor: isSelected ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.1)',
        };
      default:
        return {
          backgroundColor: isSelected ? '#dbeafe' : '#ffffff',
          borderColor: isSelected ? '#3b82f6' : '#e5e7eb',
          spotlightColor: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      className={`reactbits-spotlight-card ${className} ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <SpotlightCard
        spotlightColor={styles.spotlightColor}
        style={{
          backgroundColor: styles.backgroundColor,
          borderColor: styles.borderColor,
        }}
      >
        <div className="spotlight-card-content">
          {children}
          {isSelected && (
            <div className="selection-indicator">
              <Check className="w-5 h-5" />
            </div>
          )}
        </div>
      </SpotlightCard>
    </div>
  );
};

export default ReactBitsSpotlightCard;
