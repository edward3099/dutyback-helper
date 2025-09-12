"use client";

import Aurora from './Aurora';

export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* ReactBits Aurora background - beautiful gradient waves */}
      <Aurora
        colorStops={[
          '#3b82f6', // Blue
          '#8b5cf6', // Purple
          '#ec4899'  // Pink
        ]}
        amplitude={0.4}
        blend={0.7}
        speed={0.2}
      />
      
      {/* Additional gradient overlays for depth and branding */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
    </div>
  );
}
