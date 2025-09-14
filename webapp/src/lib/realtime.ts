import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { Database } from './supabase';

type Tables = Database['public']['Tables'];
type Claim = Tables['claims']['Row'];
type Evidence = Tables['evidence']['Row'];
type Outcome = Tables['outcomes']['Row'];

export interface RealtimeUpdate {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: 'claims' | 'evidence' | 'outcomes';
  data: Claim | Evidence | Outcome;
  oldData?: Claim | Evidence | Outcome;
}

export interface ClaimStatusUpdate {
  claimId: string;
  oldStatus: string;
  newStatus: string;
  updatedAt: string;
  message?: string;
}

export interface NotificationData {
  id: string;
  type: 'claim_status' | 'evidence_uploaded' | 'outcome_received' | 'reminder';
  title: string;
  message: string;
  claimId?: string;
  read: boolean;
  createdAt: string;
  data?: any;
}

export class RealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map();
  private listeners: Map<string, Set<(update: RealtimeUpdate) => void>> = new Map();

  /**
   * Subscribe to real-time updates for a specific user's claims
   */
  subscribeToUserClaims(
    userId: string,
    onUpdate: (update: RealtimeUpdate) => void
  ): () => void {
    const channelName = `user_claims_${userId}`;
    
    // Remove existing channel if it exists
    this.unsubscribe(channelName);

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'claims',
          filter: `user_id=eq.${userId}`
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          this.handleUpdate('claims', payload, onUpdate);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'evidence',
          filter: `claim_id=in.(${this.getUserClaimIds(userId)})`
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          this.handleUpdate('evidence', payload, onUpdate);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'outcomes',
          filter: `claim_id=in.(${this.getUserClaimIds(userId)})`
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          this.handleUpdate('outcomes', payload, onUpdate);
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);
    this.addListener(channelName, onUpdate);

    // Return unsubscribe function
    return () => this.unsubscribe(channelName);
  }

  /**
   * Subscribe to claim status changes specifically
   */
  subscribeToClaimStatus(
    claimId: string,
    onStatusChange: (update: ClaimStatusUpdate) => void
  ): () => void {
    const channelName = `claim_status_${claimId}`;
    
    this.unsubscribe(channelName);

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'claims',
          filter: `id=eq.${claimId}`
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          if (payload.new && payload.old) {
            const oldStatus = payload.old.status;
            const newStatus = payload.new.status;
            
            if (oldStatus !== newStatus) {
              onStatusChange({
                claimId,
                oldStatus,
                newStatus,
                updatedAt: payload.new.updated_at,
                message: this.getStatusChangeMessage(oldStatus, newStatus)
              });
            }
          }
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);

    return () => this.unsubscribe(channelName);
  }

  /**
   * Subscribe to all real-time updates (for admin/monitoring)
   */
  subscribeToAllUpdates(
    onUpdate: (update: RealtimeUpdate) => void
  ): () => void {
    const channelName = 'all_updates';
    
    this.unsubscribe(channelName);

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'claims'
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          this.handleUpdate('claims', payload, onUpdate);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'evidence'
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          this.handleUpdate('evidence', payload, onUpdate);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'outcomes'
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          this.handleUpdate('outcomes', payload, onUpdate);
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);
    this.addListener(channelName, onUpdate);

    return () => this.unsubscribe(channelName);
  }

  /**
   * Send a notification to a specific user
   */
  async sendNotification(
    userId: string,
    notification: Omit<NotificationData, 'id' | 'createdAt' | 'read'>
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          claim_id: notification.claimId,
          data: notification.data,
          read: false
        });

      if (error) {
        console.error('Failed to send notification:', error);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  /**
   * Get user's notifications
   */
  async getUserNotifications(userId: string): Promise<NotificationData[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch notifications:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Failed to mark notification as read:', error);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllNotificationsAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) {
        console.error('Failed to mark all notifications as read:', error);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }

  /**
   * Clean up all subscriptions
   */
  cleanup(): void {
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
    this.listeners.clear();
  }

  private handleUpdate(
    table: 'claims' | 'evidence' | 'outcomes',
    payload: RealtimePostgresChangesPayload<any>,
    onUpdate: (update: RealtimeUpdate) => void
  ): void {
    const update: RealtimeUpdate = {
      type: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
      table,
      data: payload.new || payload.old,
      oldData: payload.old
    };

    onUpdate(update);
  }

  private addListener(channelName: string, listener: (update: RealtimeUpdate) => void): void {
    if (!this.listeners.has(channelName)) {
      this.listeners.set(channelName, new Set());
    }
    this.listeners.get(channelName)!.add(listener);
  }

  private removeListener(channelName: string, listener: (update: RealtimeUpdate) => void): void {
    const listeners = this.listeners.get(channelName);
    if (listeners) {
      listeners.delete(listener);
      if (listeners.size === 0) {
        this.listeners.delete(channelName);
      }
    }
  }

  private unsubscribe(channelName: string): void {
    const channel = this.channels.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
    }
    this.listeners.delete(channelName);
  }

  private getStatusChangeMessage(oldStatus: string, newStatus: string): string {
    const statusMessages: Record<string, Record<string, string>> = {
      'submitted': {
        'under_review': 'Your claim is now under review by HMRC',
        'approved': 'Great news! Your claim has been approved',
        'rejected': 'Your claim has been rejected. Please check the details',
        'additional_info_required': 'HMRC requires additional information for your claim'
      },
      'under_review': {
        'approved': 'Excellent! Your claim has been approved and refund is being processed',
        'rejected': 'Unfortunately, your claim has been rejected',
        'additional_info_required': 'HMRC needs more information to process your claim'
      },
      'additional_info_required': {
        'under_review': 'Thank you for providing additional information. Your claim is back under review',
        'approved': 'Your claim has been approved after providing additional information',
        'rejected': 'Your claim has been rejected after review of additional information'
      }
    };

    return statusMessages[oldStatus]?.[newStatus] || `Claim status changed from ${oldStatus} to ${newStatus}`;
  }

  private async getUserClaimIds(userId: string): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('claims')
        .select('id')
        .eq('user_id', userId);

      if (error || !data) {
        return '';
      }

      return data.map(claim => claim.id).join(',');
    } catch (error) {
      console.error('Error fetching user claim IDs:', error);
      return '';
    }
  }
}

// Export singleton instance
export const realtimeService = new RealtimeService();
