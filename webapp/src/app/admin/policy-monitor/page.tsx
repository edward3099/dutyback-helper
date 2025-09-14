'use client';

import React, { useEffect, useState } from 'react';
import { PolicyMonitorDashboard } from '@/components/policy/PolicyMonitorDashboard';
import { policyMonitor } from '@/lib/policy-monitor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Square, Settings } from 'lucide-react';

export default function PolicyMonitorPage() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [status, setStatus] = useState<{ isRunning: boolean; config: any } | null>(null);

  useEffect(() => {
    // Get initial status
    setStatus(policyMonitor.getStatus());
    setIsMonitoring(policyMonitor.getStatus().isRunning);

    // Initialize default policies if not already done
    policyMonitor.initializeDefaultPolicies();
  }, []);

  const handleStartMonitoring = async () => {
    try {
      await policyMonitor.startMonitoring();
      setStatus(policyMonitor.getStatus());
      setIsMonitoring(true);
    } catch (error) {
      console.error('Failed to start monitoring:', error);
    }
  };

  const handleStopMonitoring = () => {
    policyMonitor.stopMonitoring();
    setStatus(policyMonitor.getStatus());
    setIsMonitoring(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Policy Monitoring Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Monitor GOV.UK policy changes and keep users informed
          </p>
        </div>

        {/* Status Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Monitoring Status
            </CardTitle>
            <CardDescription>
              Current status of the policy monitoring system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant={isMonitoring ? 'default' : 'secondary'}>
                    {isMonitoring ? 'Running' : 'Stopped'}
                  </Badge>
                  {status && (
                    <span className="text-sm text-gray-600">
                      Check interval: {status.config.checkInterval} minutes
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isMonitoring ? (
                  <Button onClick={handleStopMonitoring} variant="outline">
                    <Square className="w-4 h-4 mr-2" />
                    Stop Monitoring
                  </Button>
                ) : (
                  <Button onClick={handleStartMonitoring}>
                    <Play className="w-4 h-4 mr-2" />
                    Start Monitoring
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard */}
        <PolicyMonitorDashboard />
      </div>
    </div>
  );
}
