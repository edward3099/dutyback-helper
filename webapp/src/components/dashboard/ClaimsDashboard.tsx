"use client";

import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { claimsAPI } from "@/lib/api/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Calendar,
  FileText,
  ExternalLink,
  Play,
  Loader2
} from "lucide-react";
import { ClaimCard } from "./ClaimCard";
import { ClaimFilters } from "./ClaimFilters";
import { ClaimStats } from "./ClaimStats";
import AnimatedList from "@/components/ui/AnimatedList";
import { useRouter } from "next/navigation";

export interface Claim {
  id: string;
  user_id: string;
  claim_type: 'duty' | 'vat' | 'both';
  channel: 'courier' | 'postal';
  vat_status: 'registered' | 'not_registered';
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  mrn: string | null;
  eori: string | null;
  courier_name: string | null;
  tracking_number: string | null;
  import_date: string | null;
  duty_amount: number | null;
  vat_amount: number | null;
  total_amount: number | null;
  refund_amount: number | null;
  reason: string | null;
  additional_notes: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export function ClaimsDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [claimTypeFilter, setClaimTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("updated_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [claims, setClaims] = useState<Claim[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load claims and statistics
  useEffect(() => {
    if (!authLoading && user) {
      loadClaims();
      loadStatistics();
    } else if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading]);

  const loadClaims = async () => {
    try {
      setLoading(true);
      const { data, error } = await claimsAPI.getClaims({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        limit: 100
      });
      
      if (error) throw new Error(error);
      setClaims(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const { data, error } = await claimsAPI.getStatistics();
      if (error) throw new Error(error);
      setStatistics(data);
    } catch (err: any) {
      console.error('Failed to load statistics:', err);
    }
  };

  // Filter and sort claims
  const filteredClaims = useMemo(() => {
    let filtered = claims;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(claim => {
        const searchText = `${claim.mrn || ''} ${claim.eori || ''} ${claim.tracking_number || ''} ${claim.courier_name || ''}`.toLowerCase();
        return searchText.includes(searchQuery.toLowerCase());
      });
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(claim => claim.status === statusFilter);
    }

    // Apply claim type filter
    if (claimTypeFilter !== "all") {
      filtered = filtered.filter(claim => claim.claim_type === claimTypeFilter);
    }

    // Sort claims
    filtered.sort((a, b) => {
      const aValue = a[sortBy as keyof Claim];
      const bValue = b[sortBy as keyof Claim];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

    return filtered;
  }, [claims, searchQuery, statusFilter, claimTypeFilter, sortBy, sortOrder]);

  const getStatusCounts = () => {
    const counts = {
      draft: 0,
      submitted: 0,
      under_review: 0,
      approved: 0,
      rejected: 0,
      completed: 0,
      total: 0
    };
    
    claims.forEach(claim => {
      if (claim.status === 'approved') {
        counts.completed++;
      }
      counts[claim.status as keyof typeof counts]++;
      counts.total++;
    });
    
    return counts;
  };

  const statusCounts = getStatusCounts();

  // Refresh data when filters change
  useEffect(() => {
    if (user) {
      loadClaims();
    }
  }, [statusFilter, claimTypeFilter]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pt-24 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pt-24 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please sign in to view your dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pt-24 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load claims: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Claims Dashboard</h1>
              <p className="text-lg text-gray-600 mt-2">
                Manage your import duty refund claims
              </p>
            </div>
            <Button 
              className="flex items-center gap-2"
              onClick={() => router.push('/wizard')}
            >
              <Plus className="w-4 h-4" />
              New Claim
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <ClaimStats statusCounts={statusCounts} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ClaimFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              claimTypeFilter={claimTypeFilter}
              setClaimTypeFilter={setClaimTypeFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
          </div>

          {/* Claims List */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Your Claims ({filteredClaims.length})
                    </CardTitle>
                    <CardDescription>
                      {searchQuery || statusFilter !== "all" || claimTypeFilter !== "all" 
                        ? `Showing ${filteredClaims.length} of ${claims.length} claims`
                        : `You have ${claims.length} total claims`
                      }
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      More Filters
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredClaims.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No claims found</h3>
                    <p className="text-gray-600 mb-4">
                      {searchQuery || statusFilter !== "all" || claimTypeFilter !== "all"
                        ? "Try adjusting your filters to see more results."
                        : "Get started by creating your first claim."
                      }
                    </p>
                    <Button onClick={() => router.push('/wizard')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Claim
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredClaims.map((claim, index) => (
                      <ClaimCard
                        key={claim.id}
                        claim={claim}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
