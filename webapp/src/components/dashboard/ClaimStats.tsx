"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CountUp from "@/components/ui/CountUp";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  TrendingUp,
  Calendar
} from "lucide-react";

interface StatusCounts {
  draft: number;
  submitted: number;
  under_review: number;
  approved: number;
  rejected: number;
  completed: number;
  total: number;
}

interface ClaimStatsProps {
  statusCounts: StatusCounts;
}

export function ClaimStats({ statusCounts }: ClaimStatsProps) {
  const stats = [
    {
      title: "Total Claims",
      value: statusCounts.total,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "In Progress",
      value: statusCounts.draft + statusCounts.submitted + statusCounts.under_review,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      title: "Completed",
      value: statusCounts.completed,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Approved",
      value: statusCounts.approved,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100"
    }
  ];

  const getOverdueCount = () => {
    // This would typically come from your data source
    // For now, we'll return a mock value
    return 2;
  };

  const overdueCount = getOverdueCount();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={stat.title} className="group relative overflow-hidden bg-white rounded-3xl shadow-xl border border-gray-100 hover:border-blue-200 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-2">
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{stat.title}</p>
                  <p className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                    <CountUp 
                      to={stat.value} 
                      from={0} 
                      duration={2}
                      delay={index * 0.2}
                      className="count-up-text"
                    />
                  </p>
                </div>
                <div className={`p-5 rounded-3xl bg-gradient-to-br ${stat.bgColor} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                  <Icon className={`w-10 h-10 ${stat.color}`} />
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200 shadow-sm">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 font-semibold">+12%</span>
                </div>
                <span className="text-gray-500 text-sm font-medium">from last month</span>
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Clean Overdue Claims Alert */}
      {overdueCount > 0 && (
        <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl border border-red-200 hover:border-red-300 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl">
          {/* Subtle red gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-orange-50/30 to-red-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-100/50 to-transparent rounded-full blur-2xl"></div>
          
          <div className="relative p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <p className="text-sm font-bold text-red-600 uppercase tracking-wider">Overdue Claims</p>
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
                </div>
                <p className="text-5xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
                  <CountUp 
                    to={overdueCount} 
                    from={0} 
                    duration={2}
                    delay={1}
                    className="count-up-text"
                  />
                </p>
                <div className="flex items-center gap-3">
                  <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                    Action Required
                  </Badge>
                </div>
              </div>
              <div className="p-5 rounded-3xl bg-gradient-to-br from-red-100 to-orange-100 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg border border-red-200">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
            </div>
            
            <div className="p-5 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-200 shadow-sm">
              <p className="text-sm text-red-700 font-semibold flex items-center gap-3">
                <span className="text-xl">⚠️</span>
                These claims require immediate attention to avoid missing deadlines
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
