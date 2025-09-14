import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { realtimeService, RealtimeUpdate, ClaimStatusUpdate, NotificationData } from '@/lib/realtime';

export function useRealtimeUpdates() {
  const { user } = useAuth();
  const [updates, setUpdates] = useState<RealtimeUpdate[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsConnected(false);
      return;
    }

    const unsubscribe = realtimeService.subscribeToUserClaims(
      user.id,
      (update) => {
        setUpdates(prev => [update, ...prev.slice(0, 49)]); // Keep last 50 updates
        setIsConnected(true);
      }
    );

    return () => {
      unsubscribe();
      setIsConnected(false);
    };
  }, [user]);

  const clearUpdates = useCallback(() => {
    setUpdates([]);
  }, []);

  return {
    updates,
    isConnected,
    clearUpdates
  };
}

export function useClaimStatusUpdates(claimId: string) {
  const [statusUpdates, setStatusUpdates] = useState<ClaimStatusUpdate[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!claimId) return;

    const unsubscribe = realtimeService.subscribeToClaimStatus(
      claimId,
      (update) => {
        setStatusUpdates(prev => [update, ...prev]);
        setIsConnected(true);
      }
    );

    return () => {
      unsubscribe();
      setIsConnected(false);
    };
  }, [claimId]);

  const clearStatusUpdates = useCallback(() => {
    setStatusUpdates([]);
  }, []);

  return {
    statusUpdates,
    isConnected,
    clearStatusUpdates
  };
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const data = await realtimeService.getUserNotifications(user.id);
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await realtimeService.markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    try {
      await realtimeService.markAllNotificationsAsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }, [user]);

  const sendNotification = useCallback(async (
    type: NotificationData['type'],
    title: string,
    message: string,
    claimId?: string,
    data?: any
  ) => {
    if (!user) return;

    try {
      await realtimeService.sendNotification(user.id, {
        type,
        title,
        message,
        claimId,
        data
      });
      // Refresh notifications after sending
      fetchNotifications();
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }, [user, fetchNotifications]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    sendNotification
  };
}

export function useRealtimeConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');

  useEffect(() => {
    // Subscribe to connection status changes
    const handleConnectionChange = (status: string) => {
      if (status === 'SUBSCRIBED') {
        setIsConnected(true);
        setConnectionStatus('connected');
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        setIsConnected(false);
        setConnectionStatus('disconnected');
      } else {
        setConnectionStatus('connecting');
      }
    };

    // This would be implemented with actual Supabase connection status
    // For now, we'll simulate it
    const interval = setInterval(() => {
      // In a real implementation, you'd check the actual connection status
      setIsConnected(true);
      setConnectionStatus('connected');
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return {
    isConnected,
    connectionStatus
  };
}
