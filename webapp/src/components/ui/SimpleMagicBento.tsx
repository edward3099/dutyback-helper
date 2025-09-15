import React from 'react';
import './SimpleMagicBento.css';

interface MetricCard {
  id: string;
  label: string;
  title: string;
  description: string;
  value: string | number;
  subtitle: string;
  color: string;
  icon: React.ReactNode;
}

interface SimpleMagicBentoProps {
  metrics: MetricCard[];
}

const SimpleMagicBento: React.FC<SimpleMagicBentoProps> = ({ metrics }) => {
  return (
    <div className="simple-magic-bento">
      <div className="card-grid">
        {metrics.map((metric, index) => (
          <div 
            key={metric.id} 
            className="card"
            style={{
              '--glow-color': '37, 99, 235',
              '--card-delay': `${index * 0.1}s`
            } as React.CSSProperties}
          >
            <div className="card-content">
              <div className="card-header">
                <div className="card-icon">
                  {metric.icon}
                </div>
                <div className="card-label">{metric.label}</div>
              </div>
              <div className="card-body">
                <div className="card-value">{metric.value}</div>
                <div className="card-description">{metric.subtitle}</div>
              </div>
            </div>
            <div className="card-glow"></div>
            <div className="card-border-glow"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleMagicBento;
