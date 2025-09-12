"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Calendar,
  FileText,
  ExternalLink,
  Play,
  DollarSign,
  Package,
  Truck,
  Mail
} from "lucide-react";
import { Claim } from "./ClaimsDashboard";

interface ClaimCardProps {
  claim: Claim;
}

const statusConfig = {
  draft: {
    label: "Draft",
    color: "bg-gray-100 text-gray-800",
    icon: FileText,
    description: "Claim in progress"
  },
  submitted: {
    label: "Submitted",
    color: "bg-blue-100 text-blue-800",
    icon: Clock,
    description: "Awaiting review"
  },
  under_review: {
    label: "Under Review",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
    description: "HMRC is reviewing"
  },
  approved: {
    label: "Approved",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    description: "Refund approved"
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
    description: "Claim rejected"
  },
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    description: "Refund received"
  }
};

const claimTypeConfig = {
  overpayment: {
    label: "Overpayment",
    color: "bg-red-100 text-red-800",
    icon: DollarSign
  },
  rejected: {
    label: "Rejected Import",
    color: "bg-orange-100 text-orange-800",
    icon: XCircle
  },
  withdrawal: {
    label: "Withdrawal",
    color: "bg-blue-100 text-blue-800",
    icon: Clock
  },
  low_value: {
    label: "Low Value",
    color: "bg-green-100 text-green-800",
    icon: Package
  }
};

const channelConfig = {
  courier: {
    label: "Courier",
    icon: Truck,
    color: "text-blue-600"
  },
  postal: {
    label: "Postal",
    icon: Mail,
    color: "text-green-600"
  }
};

export function ClaimCard({ claim }: ClaimCardProps) {
  const status = statusConfig[claim.status];
  const claimType = claimTypeConfig[claim.claimType];
  const channel = channelConfig[claim.channel];
  const StatusIcon = status.icon;
  const ClaimTypeIcon = claimType.icon;
  const ChannelIcon = channel.icon;

  const isOverdue = new Date(claim.deadline) < new Date() && claim.status !== 'completed' && claim.status !== 'rejected';
  const daysUntilDeadline = Math.ceil((new Date(claim.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{claim.title}</CardTitle>
              <Badge className={status.color}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {status.label}
              </Badge>
            </div>
            <CardDescription className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <ClaimTypeIcon className="w-4 h-4" />
                {claimType.label}
              </span>
              <span className="flex items-center gap-1">
                <ChannelIcon className={`w-4 h-4 ${channel.color}`} />
                {channel.label}
              </span>
              {claim.isVATRegistered && (
                <span className="text-blue-600 font-medium">VAT Registered</span>
              )}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">
              {formatCurrency(claim.dutyPaid + claim.vatPaid)} total
            </div>
            <div className="text-xs text-gray-500">
              {formatCurrency(claim.packageValue)} package value
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Progress Bar */}
        {claim.status === 'draft' && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="text-gray-900 font-medium">{claim.progress}%</span>
            </div>
            <Progress value={claim.progress} className="h-2" />
          </div>
        )}

        {/* Key Information */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-600">MRN:</span>
            <span className="ml-2 font-mono text-gray-900">{claim.mrn}</span>
          </div>
          <div>
            <span className="text-gray-600">EORI:</span>
            <span className="ml-2 font-mono text-gray-900">{claim.eori}</span>
          </div>
          <div>
            <span className="text-gray-600">Import Date:</span>
            <span className="ml-2 text-gray-900">{formatDate(claim.importDate)}</span>
          </div>
          <div>
            <span className="text-gray-600">Deadline:</span>
            <span className={`ml-2 font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
              {formatDate(claim.deadline)}
            </span>
          </div>
        </div>

        {/* Deadline Alert */}
        {isOverdue && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Overdue:</strong> This claim deadline has passed. Contact HMRC immediately.
            </AlertDescription>
          </Alert>
        )}

        {!isOverdue && daysUntilDeadline <= 30 && claim.status !== 'completed' && claim.status !== 'rejected' && (
          <Alert className="mb-4 border-yellow-200 bg-yellow-50">
            <Clock className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Deadline approaching:</strong> {daysUntilDeadline} days remaining
            </AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            {claim.status === 'draft' ? (
              <Button size="sm" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Continue Claim
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                View Details
              </Button>
            )}
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-xs text-gray-500">
            Updated {formatDate(claim.updatedAt)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
