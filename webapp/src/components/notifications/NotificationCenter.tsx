'use client';

import React, { useState } from 'react';
import { Bell, X, Check, AlertCircle, CheckCircle, Info, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/hooks/useRealtime';
import { NotificationData } from '@/lib/realtime';

interface NotificationCenterProps {
  className?: string;
}

export function NotificationCenter({ className }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead
  } = useNotifications();

  const getNotificationIcon = (type: NotificationData['type']) => {
    switch (type) {
      case 'claim_status':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'evidence_uploaded':
        return <Check className="w-4 h-4 text-blue-500" />;
      case 'outcome_received':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'reminder':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const handleNotificationClick = async (notification: NotificationData) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <Card className="absolute right-0 top-12 w-80 z-50 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Notifications</CardTitle>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs"
                    >
                      Mark all read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <ScrollArea className="h-96">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    Loading notifications...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No notifications yet
                  </div>
                ) : (
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                          !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className={`text-sm font-medium ${
                                !notification.read ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                              </h4>
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(notification.createdAt)}
                              </span>
                            </div>
                            <p className={`text-sm mt-1 ${
                              !notification.read ? 'text-gray-800' : 'text-gray-600'
                            }`}>
                              {notification.message}
                            </p>
                            {notification.claimId && (
                              <div className="mt-2">
                                <Badge variant="outline" className="text-xs">
                                  Claim #{notification.claimId.slice(-8)}
                                </Badge>
                              </div>
                            )}
                          </div>
                          {!notification.read && (
                            <div className="flex-shrink-0">
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
