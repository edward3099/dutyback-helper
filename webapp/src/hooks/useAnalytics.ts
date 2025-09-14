import { useEffect, useCallback, useRef } from 'react';
import { analytics } from '@/lib/analytics';

export function useAnalytics() {
  const journeyIdRef = useRef<string>('');

  /**
   * Track page view
   */
  const trackPageView = useCallback((pageName: string, properties: Record<string, any> = {}) => {
    analytics.trackPageView(pageName, properties);
  }, []);

  /**
   * Track user action
   */
  const trackAction = useCallback((action: string, properties: Record<string, any> = {}) => {
    analytics.trackUserAction(action, properties);
  }, []);

  /**
   * Track business event
   */
  const trackBusiness = useCallback((eventName: string, properties: Record<string, any> = {}) => {
    analytics.trackBusinessEvent(eventName, properties);
  }, []);

  /**
   * Track error
   */
  const trackError = useCallback((error: Error, context: Record<string, any> = {}) => {
    analytics.trackError(error, context);
  }, []);

  /**
   * Track performance
   */
  const trackPerformance = useCallback((
    metricName: string,
    value: number,
    unit: 'milliseconds' | 'bytes' | 'count' | 'percentage',
    properties: Record<string, any> = {}
  ) => {
    analytics.trackPerformance(metricName, value, unit, properties);
  }, []);

  /**
   * Start journey
   */
  const startJourney = useCallback(async (
    journeyType: 'claim_wizard' | 'dashboard_usage' | 'support_interaction' | 'payment_flow',
    initialStep: string,
    properties: Record<string, any> = {}
  ) => {
    const journeyId = await analytics.startJourney(journeyType, initialStep, properties);
    journeyIdRef.current = journeyId;
    return journeyId;
  }, []);

  /**
   * Add journey step
   */
  const addJourneyStep = useCallback(async (
    stepName: string,
    properties: Record<string, any> = {}
  ) => {
    if (journeyIdRef.current) {
      await analytics.addJourneyStep(journeyIdRef.current, stepName, properties);
    }
  }, []);

  /**
   * Complete journey
   */
  const completeJourney = useCallback(async (
    success: boolean,
    exitReason?: string
  ) => {
    if (journeyIdRef.current) {
      await analytics.completeJourney(journeyIdRef.current, success, exitReason);
      journeyIdRef.current = '';
    }
  }, []);

  return {
    trackPageView,
    trackAction,
    trackBusiness,
    trackError,
    trackPerformance,
    startJourney,
    addJourneyStep,
    completeJourney
  };
}

export function usePageTracking(pageName: string, properties: Record<string, any> = {}) {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView(pageName, properties);
  }, [pageName, properties, trackPageView]);
}

export function usePerformanceTracking() {
  const { trackPerformance } = useAnalytics();

  const trackPageLoad = useCallback((loadTime: number) => {
    trackPerformance('page_load_time', loadTime, 'milliseconds');
  }, [trackPerformance]);

  const trackApiCall = useCallback((endpoint: string, responseTime: number) => {
    trackPerformance('api_response_time', responseTime, 'milliseconds', { endpoint });
  }, [trackPerformance]);

  const trackFileUpload = useCallback((fileSize: number, uploadTime: number) => {
    trackPerformance('file_upload_time', uploadTime, 'milliseconds', { file_size: fileSize });
  }, [trackPerformance]);

  const trackExportGeneration = useCallback((exportType: string, generationTime: number) => {
    trackPerformance('export_generation_time', generationTime, 'milliseconds', { export_type: exportType });
  }, [trackPerformance]);

  return {
    trackPageLoad,
    trackApiCall,
    trackFileUpload,
    trackExportGeneration
  };
}

export function useJourneyTracking(
  journeyType: 'claim_wizard' | 'dashboard_usage' | 'support_interaction' | 'payment_flow',
  initialStep: string
) {
  const { startJourney, addJourneyStep, completeJourney } = useAnalytics();

  useEffect(() => {
    const initializeJourney = async () => {
      await startJourney(journeyType, initialStep);
    };
    initializeJourney();
  }, [journeyType, initialStep, startJourney]);

  return {
    addStep: addJourneyStep,
    complete: completeJourney
  };
}
