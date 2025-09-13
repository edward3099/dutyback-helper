"use client";

import MagicBento, { ParticleCard } from './MagicBento';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle, ArrowRight } from 'lucide-react';

const steps = [
  {
    label: 'Step 1',
    title: 'Answer Questions',
    description: 'Tell us about your import and we\'ll route you to the correct HMRC process',
    icon: FileText,
    color: '#f8fafc'
  },
  {
    label: 'Step 2', 
    title: 'Get Your Pack',
    description: 'Receive tailored templates and guidance for your specific claim type',
    icon: CheckCircle,
    color: '#f0f9ff'
  },
  {
    label: 'Step 3',
    title: 'Submit & Track',
    description: 'Submit your claim and track its progress through HMRC processing',
    icon: ArrowRight,
    color: '#f0fdf4'
  }
];

export default function HowItWorksMagicBento() {
  return (
    <MagicBento
      textAutoHide={false}
      enableStars={true}
      enableSpotlight={true}
      enableBorderGlow={true}
      disableAnimations={false}
      spotlightRadius={400}
      particleCount={8}
      enableTilt={false}
      glowColor="59, 130, 246"
      clickEffect={true}
      enableMagnetism={true}
    >
      {steps.map((step, index) => {
        const IconComponent = step.icon;
        const baseClassName = `card ${true ? 'card--text-autohide' : ''} ${true ? 'card--border-glow' : ''}`;
        
        return (
          <ParticleCard
            key={index}
            className={baseClassName}
            style={{
              backgroundColor: step.color,
              '--glow-color': '59, 130, 246'
            }}
            disableAnimations={false}
            particleCount={8}
            glowColor="59, 130, 246"
            enableTilt={false}
            clickEffect={true}
            enableMagnetism={true}
          >
            <div className="card__header">
              <div className="card__label">{step.label}</div>
            </div>
            <div className="card__content">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <IconComponent className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <h2 className="card__title text-center">{step.title}</h2>
              <p className="card__description text-center">{step.description}</p>
            </div>
          </ParticleCard>
        );
      })}
    </MagicBento>
  );
}
