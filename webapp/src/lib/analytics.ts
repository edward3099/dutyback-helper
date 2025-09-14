import { supabase } from './supabase';

export interface AnalyticsEvent {
  id: string;
  user_id?: string;
  session_id: string;
  event_type: string;
  event_category: 'user_action' | 'system_event' | 'error' | 'performance' | 'business';
  event_name: string;
  properties: Record<string, any>;
  timestamp: string;
  page_url: string;
  user_agent: string;
  ip_address?: string;
  created_at: string;
}

export interface UserJourney {
  id: string;
  user_id?: string;
  session_id: string;
  journey_type: 'claim_wizard' | 'dashboard_usage' | 'support_interaction' | 'payment_flow';
  steps: JourneyStep[];
  started_at: string;
  completed_at?: string;
  duration_seconds?: number;
  success: boolean;
  exit_reason?: string;
  created_at: string;
}

export interface JourneyStep {
  step_name: string;
  step_order: number;
  timestamp: string;
  duration_seconds?: number;
  properties: Record<string, any>;
}

export interface PerformanceMetric {
  id: string;
  metric_type: 'page_load' | 'api_response' | 'database_query' | 'file_upload' | 'export_generation';
  metric_name: string;
  value: number;
  unit: 'milliseconds' | 'bytes' | 'count' | 'percentage';
  page_url?: string;
  api_endpoint?: string;
  user_id?: string;
  session_id: string;
  timestamp: string;
  created_at: string;
}

export interface BusinessMetric {
  id: string;
  metric_type: 'conversion' | 'retention' | 'engagement' | 'revenue' | 'support';
  metric_name: string;
  value: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  date: string;
  user_id?: string;
  properties: Record<string, any>;
  created_at: string;
}

export class AnalyticsService {
  private sessionId: string;
  private userId?: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = undefined; // Will be set when needed
  }

  /**
   * Track a custom event
   */
  async trackEvent(
    eventName: string,
    eventCategory: AnalyticsEvent['event_category'],
    properties: Record<string, any> = {}
  ): Promise<void> {
    try {
      // Get current user ID
      const userId = await this.getCurrentUserId();
      
      // Only track events if user is authenticated
      if (!userId) {
        return;
      }

      const event: Omit<AnalyticsEvent, 'id' | 'created_at'> = {
        user_id: userId,
        session_id: this.sessionId,
        event_type: 'custom',
        event_category: eventCategory,
        event_name: eventName,
        properties,
        timestamp: new Date().toISOString(),
        page_url: window.location.href,
        user_agent: navigator.userAgent,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('analytics_events')
        .insert(event);

      if (error) {
        console.error('Error tracking event:', error);
      }
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  /**
   * Track page view
   */
  async trackPageView(pageName: string, properties: Record<string, any> = {}): Promise<void> {
    await this.trackEvent('page_view', 'user_action', {
      page_name: pageName,
      ...properties
    });
  }

  /**
   * Track user action
   */
  async trackUserAction(action: string, properties: Record<string, any> = {}): Promise<void> {
    await this.trackEvent(action, 'user_action', properties);
  }

  /**
   * Track business event
   */
  async trackBusinessEvent(eventName: string, properties: Record<string, any> = {}): Promise<void> {
    await this.trackEvent(eventName, 'business', properties);
  }

  /**
   * Track error
   */
  async trackError(error: Error, context: Record<string, any> = {}): Promise<void> {
    await this.trackEvent('error', 'error', {
      error_message: error.message,
      error_stack: error.stack,
      ...context
    });
  }

  /**
   * Track performance metric
   */
  async trackPerformance(
    metricName: string,
    value: number,
    unit: PerformanceMetric['unit'],
    properties: Record<string, any> = {}
  ): Promise<void> {
    try {
      // Get current user ID
      const userId = await this.getCurrentUserId();
      
      // Only track performance metrics if user is authenticated
      if (!userId) {
        return;
      }

      const metric: Omit<PerformanceMetric, 'id' | 'created_at'> = {
        metric_type: 'performance',
        metric_name: metricName,
        value,
        unit,
        page_url: window.location.href,
        user_id: userId,
        session_id: this.sessionId,
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('performance_metrics')
        .insert(metric);

      if (error) {
        console.error('Error tracking performance metric:', error);
      }
    } catch (error) {
      console.error('Error tracking performance metric:', error);
    }
  }

  /**
   * Start user journey tracking
   */
  async startJourney(
    journeyType: UserJourney['journey_type'],
    initialStep: string,
    properties: Record<string, any> = {}
  ): Promise<string> {
    try {
      // Get current user ID
      const userId = await this.getCurrentUserId();
      
      // Only start journey if user is authenticated
      if (!userId) {
        return '';
      }

      const journeyId = this.generateId();
      const journey: Omit<UserJourney, 'id' | 'created_at'> = {
        user_id: userId,
        session_id: this.sessionId,
        journey_type: journeyType,
        steps: [{
          step_name: initialStep,
          step_order: 1,
          timestamp: new Date().toISOString(),
          properties
        }],
        started_at: new Date().toISOString(),
        success: false,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('user_journeys')
        .insert({ ...journey, id: journeyId });

      if (error) {
        console.error('Error starting journey:', error);
        return '';
      }

      return journeyId;
    } catch (error) {
      console.error('Error starting journey:', error);
      return '';
    }
  }

  /**
   * Add step to user journey
   */
  async addJourneyStep(
    journeyId: string,
    stepName: string,
    properties: Record<string, any> = {}
  ): Promise<void> {
    try {
      // Get current user ID
      const userId = await this.getCurrentUserId();
      
      // Only add journey step if user is authenticated
      if (!userId) {
        return;
      }

      // Get current journey
      const { data: journey, error: fetchError } = await supabase
        .from('user_journeys')
        .select('steps')
        .eq('id', journeyId)
        .single();

      if (fetchError || !journey) {
        console.error('Error fetching journey:', fetchError);
        return;
      }

      const newStep: JourneyStep = {
        step_name: stepName,
        step_order: journey.steps.length + 1,
        timestamp: new Date().toISOString(),
        properties
      };

      const updatedSteps = [...journey.steps, newStep];

      const { error } = await supabase
        .from('user_journeys')
        .update({ steps: updatedSteps })
        .eq('id', journeyId);

      if (error) {
        console.error('Error adding journey step:', error);
      }
    } catch (error) {
      console.error('Error adding journey step:', error);
    }
  }

  /**
   * Complete user journey
   */
  async completeJourney(
    journeyId: string,
    success: boolean,
    exitReason?: string
  ): Promise<void> {
    try {
      // Get current user ID
      const userId = await this.getCurrentUserId();
      
      // Only complete journey if user is authenticated
      if (!userId) {
        return;
      }

      const { data: journey, error: fetchError } = await supabase
        .from('user_journeys')
        .select('started_at, steps')
        .eq('id', journeyId)
        .single();

      if (fetchError || !journey) {
        console.error('Error fetching journey:', fetchError);
        return;
      }

      const startedAt = new Date(journey.started_at);
      const completedAt = new Date();
      const durationSeconds = Math.floor((completedAt.getTime() - startedAt.getTime()) / 1000);

      const { error } = await supabase
        .from('user_journeys')
        .update({
          completed_at: completedAt.toISOString(),
          duration_seconds: durationSeconds,
          success,
          exit_reason: exitReason
        })
        .eq('id', journeyId);

      if (error) {
        console.error('Error completing journey:', error);
      }
    } catch (error) {
      console.error('Error completing journey:', error);
    }
  }

  /**
   * Get analytics dashboard data
   */
  async getDashboardData(period: '7d' | '30d' | '90d' = '30d'): Promise<{
    totalEvents: number;
    uniqueUsers: number;
    pageViews: number;
    conversionRate: number;
    topPages: Array<{ page: string; views: number }>;
    topEvents: Array<{ event: string; count: number }>;
    userJourneys: Array<{ journey_type: string; count: number; success_rate: number }>;
  }> {
    try {
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Get total events
      const { count: totalEvents } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString());

      // Get unique users
      const { count: uniqueUsers } = await supabase
        .from('analytics_events')
        .select('user_id', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString())
        .not('user_id', 'is', null);

      // Get page views
      const { count: pageViews } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString())
        .eq('event_name', 'page_view');

      // Get top pages
      const { data: topPagesData } = await supabase
        .from('analytics_events')
        .select('properties->page_name')
        .gte('created_at', startDate.toISOString())
        .eq('event_name', 'page_view');

      const topPages = this.aggregateTopItems(
        topPagesData?.map(item => item.properties?.page_name).filter(Boolean) || []
      );

      // Get top events
      const { data: topEventsData } = await supabase
        .from('analytics_events')
        .select('event_name')
        .gte('created_at', startDate.toISOString());

      const topEvents = this.aggregateTopItems(
        topEventsData?.map(item => item.event_name) || []
      );

      // Get user journeys
      const { data: journeysData } = await supabase
        .from('user_journeys')
        .select('journey_type, success')
        .gte('created_at', startDate.toISOString());

      const userJourneys = this.aggregateJourneys(journeysData || []);

      // Calculate conversion rate (simplified)
      const conversionRate = userJourneys.length > 0 
        ? (userJourneys.reduce((sum, journey) => sum + journey.success_rate, 0) / userJourneys.length) * 100
        : 0;

      return {
        totalEvents: totalEvents || 0,
        uniqueUsers: uniqueUsers || 0,
        pageViews: pageViews || 0,
        conversionRate: Math.round(conversionRate * 100) / 100,
        topPages: topPages.slice(0, 5),
        topEvents: topEvents.slice(0, 5),
        userJourneys
      };
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      return {
        totalEvents: 0,
        uniqueUsers: 0,
        pageViews: 0,
        conversionRate: 0,
        topPages: [],
        topEvents: [],
        userJourneys: []
      };
    }
  }

  /**
   * Get performance metrics
   */
  async getPerformanceMetrics(period: '7d' | '30d' | '90d' = '30d'): Promise<{
    averagePageLoad: number;
    averageApiResponse: number;
    slowestPages: Array<{ page: string; avgLoadTime: number }>;
    errorRate: number;
  }> {
    try {
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Get page load metrics
      const { data: pageLoadData } = await supabase
        .from('performance_metrics')
        .select('value, page_url')
        .gte('created_at', startDate.toISOString())
        .eq('metric_name', 'page_load_time');

      const averagePageLoad = pageLoadData?.length 
        ? pageLoadData.reduce((sum, item) => sum + item.value, 0) / pageLoadData.length
        : 0;

      // Get API response metrics
      const { data: apiResponseData } = await supabase
        .from('performance_metrics')
        .select('value')
        .gte('created_at', startDate.toISOString())
        .eq('metric_name', 'api_response_time');

      const averageApiResponse = apiResponseData?.length
        ? apiResponseData.reduce((sum, item) => sum + item.value, 0) / apiResponseData.length
        : 0;

      // Get slowest pages
      const slowestPages = this.aggregateSlowestPages(pageLoadData || []);

      // Get error rate
      const { count: totalEvents } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString());

      const { count: errorEvents } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString())
        .eq('event_category', 'error');

      const errorRate = totalEvents ? (errorEvents || 0) / totalEvents * 100 : 0;

      return {
        averagePageLoad: Math.round(averagePageLoad * 100) / 100,
        averageApiResponse: Math.round(averageApiResponse * 100) / 100,
        slowestPages: slowestPages.slice(0, 5),
        errorRate: Math.round(errorRate * 100) / 100
      };
    } catch (error) {
      console.error('Error getting performance metrics:', error);
      return {
        averagePageLoad: 0,
        averageApiResponse: 0,
        slowestPages: [],
        errorRate: 0
      };
    }
  }

  /**
   * Helper methods
   */
  private generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  private generateId(): string {
    return 'id_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  private async getCurrentUserId(): Promise<string | undefined> {
    // Get the current user from Supabase auth
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id;
  }

  private aggregateTopItems(items: string[]): Array<{ item: string; count: number }> {
    const counts = items.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([item, count]) => ({ item, count }))
      .sort((a, b) => b.count - a.count);
  }

  private aggregateJourneys(journeys: Array<{ journey_type: string; success: boolean }>): Array<{ journey_type: string; count: number; success_rate: number }> {
    const grouped = journeys.reduce((acc, journey) => {
      if (!acc[journey.journey_type]) {
        acc[journey.journey_type] = { total: 0, successful: 0 };
      }
      acc[journey.journey_type].total++;
      if (journey.success) {
        acc[journey.journey_type].successful++;
      }
      return acc;
    }, {} as Record<string, { total: number; successful: number }>);

    return Object.entries(grouped).map(([journey_type, data]) => ({
      journey_type,
      count: data.total,
      success_rate: data.total > 0 ? data.successful / data.total : 0
    }));
  }

  private aggregateSlowestPages(pageLoadData: Array<{ value: number; page_url: string }>): Array<{ page: string; avgLoadTime: number }> {
    const grouped = pageLoadData.reduce((acc, item) => {
      if (!acc[item.page_url]) {
        acc[item.page_url] = [];
      }
      acc[item.page_url].push(item.value);
      return acc;
    }, {} as Record<string, number[]>);

    return Object.entries(grouped).map(([page, values]) => ({
      page,
      avgLoadTime: values.reduce((sum, val) => sum + val, 0) / values.length
    })).sort((a, b) => b.avgLoadTime - a.avgLoadTime);
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();
