"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { claimsAPI } from "@/lib/api/supabase";
import { OutcomeStats } from "@/components/stats/OutcomeStats";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";

export default function StatsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      loadStatistics();
    } else if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const { data, error } = await claimsAPI.getStatistics();
      
      if (error) throw new Error(error);
      setStatistics(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pt-24 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading statistics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pt-24 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load statistics: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pt-24 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please sign in to view statistics.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Transform statistics data to match the expected format
  const courierStats = statistics ? (statistics.courier_breakdown || []).map((courier: any) => ({
    courier: courier.courier_name || 'Unknown',
    approvalRate: courier.approval_rate || 0,
    medianDecisionDays: courier.median_decision_days || 0,
    averageRefund: courier.average_refund || 0,
    totalClaims: courier.total_claims || 0,
    approvedClaims: courier.approved_claims || 0,
    rejectedClaims: courier.rejected_claims || 0,
    pendingClaims: courier.pending_claims || 0,
  })) : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <OutcomeStats 
          courierStats={courierStats}
          variant="full"
          showTitle={true}
        />
      </div>
    </div>
  );
}
