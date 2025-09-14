'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  ExternalLink, 
  RefreshCw,
  Clock,
  FileText,
  Shield
} from 'lucide-react';
import { usePolicyMonitor, usePolicyChanges } from '@/hooks/usePolicyMonitor';
import { PolicyChange } from '@/lib/policy-monitor';

export function PolicyMonitorDashboard() {
  const { 
    policies, 
    changes, 
    isLoading, 
    error, 
    fetchPolicies, 
    fetchChanges,
    getChangesBySeverity,
    getRecentChanges
  } = usePolicyMonitor();

  const {
    getCriticalChanges,
    getUserAffectingChanges
  } = usePolicyChanges();

  const [selectedTab, setSelectedTab] = useState('overview');

  const criticalChanges = getCriticalChanges();
  const userAffectingChanges = getUserAffectingChanges();
  const recentChanges = getRecentChanges(7);

  const getSeverityIcon = (severity: PolicyChange['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'medium':
        return <Info className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: PolicyChange['severity']) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'default';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Error loading policy monitoring data: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Policy Monitoring</h2>
          <p className="text-gray-600">Monitor GOV.UK policy changes and updates</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              fetchPolicies();
              fetchChanges();
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monitored Policies</p>
                <p className="text-2xl font-bold text-gray-900">{policies.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Critical Changes</p>
                <p className="text-2xl font-bold text-gray-900">{criticalChanges.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">User Affecting</p>
                <p className="text-2xl font-bold text-gray-900">{userAffectingChanges.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recent (7 days)</p>
                <p className="text-2xl font-bold text-gray-900">{recentChanges.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="changes">Recent Changes</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Critical Changes Alert */}
          {criticalChanges.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{criticalChanges.length} critical policy change(s)</strong> detected that may affect users.
                Review the changes tab for details.
              </AlertDescription>
            </Alert>
          )}

          {/* Recent Changes Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Policy Changes</CardTitle>
              <CardDescription>
                Changes detected in the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentChanges.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No changes detected in the last 7 days</p>
              ) : (
                <div className="space-y-3">
                  {recentChanges.slice(0, 5).map((change) => (
                    <div key={change.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getSeverityIcon(change.severity)}
                        <div>
                          <p className="font-medium text-sm">
                            {change.policy_documents?.title || 'Unknown Policy'}
                          </p>
                          <p className="text-xs text-gray-600">{change.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getSeverityColor(change.severity)}>
                          {change.severity}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatDate(change.detected_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="changes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Policy Changes</CardTitle>
              <CardDescription>
                Complete history of detected policy changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {changes.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No changes detected</p>
              ) : (
                <div className="space-y-3">
                  {changes.map((change) => (
                    <div key={change.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getSeverityIcon(change.severity)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">
                                {change.policy_documents?.title || 'Unknown Policy'}
                              </h4>
                              <Badge variant={getSeverityColor(change.severity)}>
                                {change.severity}
                              </Badge>
                              {change.affects_users && (
                                <Badge variant="outline">Affects Users</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{change.description}</p>
                            <div className="text-xs text-gray-500">
                              <span className="font-medium">Type:</span> {change.change_type.replace('_', ' ')} • 
                              <span className="font-medium ml-2">Detected:</span> {formatDate(change.detected_at)}
                            </div>
                            {change.policy_documents?.url && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mt-2 p-0 h-auto"
                                onClick={() => window.open(change.policy_documents.url, '_blank')}
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                View Policy
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monitored Policies</CardTitle>
              <CardDescription>
                Currently monitored GOV.UK policy documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {policies.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No policies being monitored</p>
              ) : (
                <div className="space-y-3">
                  {policies.map((policy) => (
                    <div key={policy.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{policy.title}</h4>
                            <Badge variant="outline">{policy.category.replace('_', ' ')}</Badge>
                            <Badge variant={policy.status === 'active' ? 'default' : 'secondary'}>
                              {policy.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Last modified: {formatDate(policy.last_modified)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Version: {policy.version} • Checksum: {policy.checksum.slice(0, 8)}...
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(policy.url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
