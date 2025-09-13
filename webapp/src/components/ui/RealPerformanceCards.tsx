"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Clock, Shield, ArrowUpRight } from 'lucide-react';
import ReactBitsSpotlightCard from './ReactBitsSpotlightCard';
import CountUp from './CountUp';

const performanceData = [
  {
    id: 1,
    title: "Success Rate",
    value: 94,
    suffix: "%",
    description: "Average approval rate across all couriers",
    icon: <TrendingUp className="h-6 w-6 text-green-600" />,
    color: "green",
    trend: "+12%",
    trendDirection: "up"
  },
  {
    id: 2,
    title: "Avg Decision Time",
    value: 12,
    suffix: " days",
    description: "Median processing time for claims",
    icon: <Clock className="h-6 w-6 text-blue-600" />,
    color: "blue",
    trend: "-3 days",
    trendDirection: "up"
  },
  {
    id: 3,
    title: "Avg Refund",
    value: 847,
    prefix: "£",
    description: "Per successful claim",
    icon: <Shield className="h-6 w-6 text-purple-600" />,
    color: "purple",
    trend: "+£127",
    trendDirection: "up"
  }
];

const RealPerformanceCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {performanceData.map((item, index) => (
        <ReactBitsSpotlightCard 
          key={item.id} 
          variant={item.color === "green" ? "vat" : item.color === "blue" ? "channel" : "claim"}
          className="group"
        >
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            </div>
            
            <CardHeader className="relative z-10 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-white/80 shadow-sm border border-gray-100">
                  {item.icon}
                </div>
                <div className="flex items-center space-x-1 text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>{item.trend}</span>
                </div>
              </div>
              
              <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                {item.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="relative z-10 pt-0">
              <div className="mb-3">
                <div className="flex items-baseline space-x-1">
                  {item.prefix && (
                    <span className="text-2xl font-bold text-gray-900">{item.prefix}</span>
                  )}
                  <CountUp
                    to={item.value}
                    className="text-4xl font-bold text-gray-900"
                    duration={2}
                    delay={index * 0.2}
                  />
                  {item.suffix && (
                    <span className="text-2xl font-bold text-gray-900">{item.suffix}</span>
                  )}
                </div>
              </div>
              
              <CardDescription className="text-sm text-gray-600 leading-relaxed">
                {item.description}
              </CardDescription>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-1000 delay-${index * 200} ${
                      item.color === "green" ? "bg-gradient-to-r from-green-400 to-green-600" :
                      item.color === "blue" ? "bg-gradient-to-r from-blue-400 to-blue-600" :
                      "bg-gradient-to-r from-purple-400 to-purple-600"
                    }`}
                    style={{ 
                      width: `${item.value}%`,
                      animation: `slideIn 1s ease-out ${index * 0.2}s both`
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </ReactBitsSpotlightCard>
      ))}
    </div>
  );
};

export default RealPerformanceCards;
