"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactBitsSpotlightCard from "@/components/ui/ReactBitsSpotlightCard";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  AlertTriangle,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from "lucide-react";

export interface CourierStats {
  courier: string;
  approvalRate: number;
  medianDecisionDays: number;
  averageRefund: number;
  totalClaims: number;
  approvedClaims: number;
  rejectedClaims: number;
  pendingClaims: number;
}

export interface OutcomeStatsProps {
  courierStats: CourierStats[];
  className?: string;
  showTitle?: boolean;
  variant?: 'homepage' | 'full';
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export function OutcomeStats({ 
  courierStats, 
  className = "", 
  showTitle = true,
  variant = 'full'
}: OutcomeStatsProps) {
  // Calculate overall stats
  const overallStats = {
    totalApprovalRate: courierStats.reduce((acc, courier) => acc + courier.approvalRate, 0) / courierStats.length,
    averageDecisionDays: courierStats.reduce((acc, courier) => acc + courier.medianDecisionDays, 0) / courierStats.length,
    averageRefundAmount: courierStats.reduce((acc, courier) => acc + courier.averageRefund, 0) / courierStats.length,
    totalClaims: courierStats.reduce((acc, courier) => acc + courier.totalClaims, 0),
    totalApproved: courierStats.reduce((acc, courier) => acc + courier.approvedClaims, 0),
    totalRejected: courierStats.reduce((acc, courier) => acc + courier.rejectedClaims, 0),
    totalPending: courierStats.reduce((acc, courier) => acc + courier.pendingClaims, 0)
  };

  // Prepare data for charts
  const approvalRateData = courierStats.map(courier => ({
    courier: courier.courier,
    rate: courier.approvalRate,
    claims: courier.totalClaims
  }));

  const decisionDaysData = courierStats.map(courier => ({
    courier: courier.courier,
    days: courier.medianDecisionDays,
    claims: courier.totalClaims
  }));

  const refundAmountData = courierStats.map(courier => ({
    courier: courier.courier,
    amount: courier.averageRefund,
    claims: courier.totalClaims
  }));

  const statusDistributionData = [
    { name: 'Approved', value: overallStats.totalApproved, color: '#10B981' },
    { name: 'Rejected', value: overallStats.totalRejected, color: '#EF4444' },
    { name: 'Pending', value: overallStats.totalPending, color: '#F59E0B' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === 'rate' && `${entry.value.toFixed(1)}%`}
              {entry.dataKey === 'days' && `${entry.value} days`}
              {entry.dataKey === 'amount' && formatCurrency(entry.value)}
              {entry.dataKey === 'claims' && ` (${entry.payload.claims} claims)`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (variant === 'homepage') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
        {/* Quick Stats Cards with Spotlight Effect */}
        <ReactBitsSpotlightCard variant="vat">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatPercentage(overallStats.totalApprovalRate)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Average across all couriers
              </p>
            </CardContent>
          </Card>
        </ReactBitsSpotlightCard>

        <ReactBitsSpotlightCard variant="channel">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Decision Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {overallStats.averageDecisionDays.toFixed(0)} days
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Median processing time
              </p>
            </CardContent>
          </Card>
        </ReactBitsSpotlightCard>

        <ReactBitsSpotlightCard variant="claim">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Refund</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(overallStats.averageRefundAmount)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Per successful claim
              </p>
            </CardContent>
          </Card>
        </ReactBitsSpotlightCard>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {showTitle && (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Outcome Statistics</h2>
          <p className="text-lg text-gray-600">
            Real performance data from successful claims
          </p>
        </div>
      )}

      {/* Overall Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatPercentage(overallStats.totalApprovalRate)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {overallStats.totalApproved} of {overallStats.totalClaims} claims approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Avg Decision Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {overallStats.averageDecisionDays.toFixed(0)} days
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Median processing time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-purple-600" />
              Avg Refund
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(overallStats.averageRefundAmount)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Per successful claim
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              Total Claims
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {overallStats.totalClaims}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Processed through our platform
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Charts */}
      <Tabs defaultValue="approval" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="approval" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Approval Rates
          </TabsTrigger>
          <TabsTrigger value="timing" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Decision Times
          </TabsTrigger>
          <TabsTrigger value="refunds" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Refund Amounts
          </TabsTrigger>
          <TabsTrigger value="distribution" className="flex items-center gap-2">
            <PieChartIcon className="w-4 h-4" />
            Status Distribution
          </TabsTrigger>
        </TabsList>

        <TabsContent value="approval" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Approval Rates by Courier
              </CardTitle>
              <CardDescription>
                Success rate percentage for each courier service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={approvalRateData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="courier" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="rate" 
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Decision Times by Courier
              </CardTitle>
              <CardDescription>
                Median number of days for claim processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={decisionDaysData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="courier" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      domain={[0, 'dataMax + 5']}
                      tickFormatter={(value) => `${value} days`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="days" 
                      fill="#10B981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refunds" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Average Refund Amounts by Courier
              </CardTitle>
              <CardDescription>
                Mean refund amount for successful claims
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={refundAmountData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="courier" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      domain={[0, 'dataMax + 50']}
                      tickFormatter={(value) => formatCurrency(value)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="amount" 
                      fill="#8B5CF6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5" />
                Overall Claim Status Distribution
              </CardTitle>
              <CardDescription>
                Breakdown of all claims by final status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Claims']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
