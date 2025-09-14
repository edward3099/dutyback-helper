'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Users, 
  Eye, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  RefreshCw,
  Download
} from 'lucide-react';
import { analytics } from '@/lib/analytics';

interface DashboardData {
  totalEvents: number;
  uniqueUsers: number;
  pageViews: number;
  conversionRate: number;
  topPages: Array<{ item: string; count: number }>;
  topEvents: Array<{ item: string; count: number }>;
  userJourneys: Array<{ journey_type: string; count: number; success_rate: number }>;
}

interface PerformanceData {
  averagePageLoad: number;
  averageApiResponse: number;
  slowestPages: Array<{ page: string; avgLoadTime: number }>;
  errorRate: number;
}

export function AnalyticsDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedTab, setSelectedTab] = useState('overview');

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const data = await analytics.getDashboardData(selectedPeriod);
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPerformanceData = async () => {
    try {
      const data = await analytics.getPerformanceMetrics(selectedPeriod);
      setPerformanceData(data);
    } catch (error) {
      console.error('Error fetching performance data:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchPerformanceData();
  }, [selectedPeriod]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const formatTime = (ms: number) => {
    if (ms >= 1000) {
      return `${(ms / 1000).toFixed(1)}s`;
    }
    return `${ms.toFixed(0)}ms`;
  };

  if (isLoading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Loading analytics data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Track user behavior and system performance</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as '7d' | '30d' | '90d')}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button
            onClick={() => {
              fetchDashboardData();
              fetchPerformanceData();
            }}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Events</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(dashboardData.totalEvents)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Unique Users</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(dashboardData.uniqueUsers)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Page Views</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(dashboardData.pageViews)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPercentage(dashboardData.conversionRate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* User Journeys */}
          <Card>
            <CardHeader>
              <CardTitle>User Journeys</CardTitle>
              <CardDescription>
                Success rates for different user journey types
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData?.userJourneys.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No journey data available</p>
              ) : (
                <div className="space-y-3">
                  {dashboardData?.userJourneys.map((journey, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm capitalize">
                          {journey.journey_type.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-gray-600">{journey.count} journeys</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={journey.success_rate > 0.7 ? 'default' : 'secondary'}>
                          {formatPercentage(journey.success_rate * 100)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
              <CardDescription>
                Most visited pages in the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData?.topPages.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No page data available</p>
              ) : (
                <div className="space-y-3">
                  {dashboardData?.topPages.map((page, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{page.item}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{formatNumber(page.count)} views</span>
                        <Badge variant="outline">#{index + 1}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Events</CardTitle>
              <CardDescription>
                Most triggered events in the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData?.topEvents.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No event data available</p>
              ) : (
                <div className="space-y-3">
                  {dashboardData?.topEvents.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{event.item}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{formatNumber(event.count)} times</span>
                        <Badge variant="outline">#{index + 1}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {performanceData && (
            <>
              {/* Performance Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Clock className="h-8 w-8 text-blue-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Avg Page Load</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatTime(performanceData.averagePageLoad)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <BarChart3 className="h-8 w-8 text-green-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Avg API Response</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatTime(performanceData.averageApiResponse)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <AlertTriangle className="h-8 w-8 text-red-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Error Rate</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatPercentage(performanceData.errorRate)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Slowest Pages */}
              <Card>
                <CardHeader>
                  <CardTitle>Slowest Pages</CardTitle>
                  <CardDescription>
                    Pages with the highest average load times
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {performanceData.slowestPages.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No performance data available</p>
                  ) : (
                    <div className="space-y-3">
                      {performanceData.slowestPages.map((page, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{page.page}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                              {formatTime(page.avgLoadTime)}
                            </span>
                            <Badge variant={page.avgLoadTime > 3000 ? 'destructive' : 'secondary'}>
                              #{index + 1}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
