"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      {/* Overdue Claims Alert */}
      {overdueCount > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-red-100">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-red-800">Overdue Claims</p>
                <p className="text-2xl font-bold text-red-900">{overdueCount}</p>
                <Badge variant="destructive" className="mt-1">
                  Action Required
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
