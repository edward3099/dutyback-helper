"use client";

import LightRays from './LightRays';

export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* ReactBits Light Rays background - beautiful animated light rays */}
      <LightRays
        raysOrigin="top-center"
        raysColor="#3b82f6"
        raysSpeed={1.2}
        lightSpread={0.8}
        rayLength={1.5}
        followMouse={true}
        mouseInfluence={0.1}
        noiseAmount={0.05}
        distortion={0.02}
        pulsating={true}
        fadeDistance={0.8}
        saturation={1.2}
      />
      
      {/* Additional gradient overlays for depth and branding */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
    </div>
  );
}
