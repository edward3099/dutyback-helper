'use client';

import React from 'react';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRealtimeConnection } from '@/hooks/useRealtime';

interface RealtimeStatusProps {
  className?: string;
}

export function RealtimeStatus({ className }: RealtimeStatusProps) {
  const { isConnected, connectionStatus } = useRealtimeConnection();

  const getStatusInfo = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: <Wifi className="w-4 h-4" />,
          text: 'Live Updates',
          variant: 'default' as const,
          color: 'text-green-600'
        };
      case 'connecting':
        return {
          icon: <Loader2 className="w-4 h-4 animate-spin" />,
          text: 'Connecting...',
          variant: 'secondary' as const,
          color: 'text-yellow-600'
        };
      case 'disconnected':
        return {
          icon: <WifiOff className="w-4 h-4" />,
          text: 'Offline',
          variant: 'destructive' as const,
          color: 'text-red-600'
        };
      default:
        return {
          icon: <WifiOff className="w-4 h-4" />,
          text: 'Unknown',
          variant: 'secondary' as const,
          color: 'text-gray-600'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Badge 
      variant={statusInfo.variant}
      className={`flex items-center gap-1 ${className}`}
    >
      <span className={statusInfo.color}>
        {statusInfo.icon}
      </span>
      <span className="text-xs font-medium">
        {statusInfo.text}
      </span>
    </Badge>
  );
}
