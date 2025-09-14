"use client";

import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { claimsAPI } from "@/lib/api/supabase";
import { supabase } from "@/lib/supabase";
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
  Loader2,
  ArrowUpDown,
  Crown,
  TrendingUp,
  PoundSterling,
  Zap,
  Upload,
  Download,
  Send,
  Edit,
  BookOpen,
  BarChart3,
  Activity,
  Star
} from "lucide-react";
import { ClaimCard } from "./ClaimCard";
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
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  const handleSortToggle = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };
  const [claims, setClaims] = useState<Claim[]>([]);

  // Pricing tier configurations
  const pricingTiers = {
    "Free Triage": {
      tier: "Free Triage",
      features: ["Route identification", "Basic courier templates", "HMRC guidance links", "Community support", "Basic deadline reminders"],
      limits: {
        claims_per_month: 1,
        evidence_files_per_claim: 3,
        priority_support: false,
        export_formats: ["pdf"]
      },
      usage: {
        claims_this_month: 0,
        files_uploaded: 0
      },
      color: "gray",
      icon: "Free"
    },
    "Basic Claim Pack": {
      tier: "Basic Claim Pack",
      features: ["Complete claim pack generation", "Evidence checklist enforcement", "Email templates", "Basic deadline reminders", "Email support", "HMRC form generation"],
      limits: {
        claims_per_month: 1,
        evidence_files_per_claim: 5,
        priority_support: false,
        export_formats: ["pdf", "zip"]
      },
      usage: {
        claims_this_month: 0,
        files_uploaded: 0
      },
      color: "blue",
      icon: "Basic"
    },
    "Premium Pack + QC": {
      tier: "Premium Pack + QC",
      features: ["Complete claim pack generation", "Quality assurance review", "Priority support (24-48hr response)", "Success guarantee (refund if not approved)", "Phone support", "Advanced deadline tracking", "Personalized guidance", "Evidence checklist enforcement", "Email templates", "HMRC form generation"],
      limits: {
        claims_per_month: 1,
        evidence_files_per_claim: 10,
        priority_support: true,
        export_formats: ["pdf", "zip"]
      },
      usage: {
        claims_this_month: 0,
        files_uploaded: 0
      },
      color: "purple",
      icon: "Premium"
    },
    "Micro-Seller Plan": {
      tier: "Micro-Seller Plan",
      features: ["Unlimited claim packs", "Priority support", "All export formats", "Real-time updates", "Courier playbooks", "Analytics dashboard"],
      limits: {
        claims_per_month: -1, // unlimited
        evidence_files_per_claim: 10,
        priority_support: true,
        export_formats: ["pdf", "zip"]
      },
      usage: {
        claims_this_month: 0,
        files_uploaded: 0
      },
      color: "green",
      icon: "Pro"
    }
  };

  // Fetch user's subscription
  const fetchUserSubscription = async () => {
    if (!user) return;
    
    try {
      setSubscriptionLoading(true);
      
      // Get user's subscription
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select(`
          *,
          pricing_tiers (
            name,
            features,
            limits,
            price,
            currency,
            interval
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (subError && subError.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error fetching subscription:', subError);
        // Default to Free Triage if no subscription found
        setUserSubscription(pricingTiers["Free Triage"]);
      } else if (subscription && subscription.pricing_tiers) {
        // Map the subscription to our pricing tier format
        const tierName = subscription.pricing_tiers.name as keyof typeof pricingTiers;
        const mappedSubscription = {
          tier: subscription.pricing_tiers.name,
          features: subscription.pricing_tiers.features,
          limits: subscription.pricing_tiers.limits,
          usage: {
            claims_this_month: 0, // This would need to be calculated from actual usage
            files_uploaded: 0
          },
          color: pricingTiers[tierName]?.color || 'gray',
          icon: pricingTiers[tierName]?.icon || 'Free'
        };
        
        setUserSubscription(mappedSubscription);
      } else {
        // No subscription found, default to Free Triage
        setUserSubscription(pricingTiers["Free Triage"]);
      }
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      setUserSubscription(pricingTiers["Free Triage"]);
    } finally {
      setSubscriptionLoading(false);
    }
  };
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load claims and statistics
  useEffect(() => {
    if (!authLoading && user) {
      loadClaims();
      loadStatistics();
      fetchUserSubscription();
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

  // Use user's actual subscription
  const currentSubscription = userSubscription;

  // Show loading state while fetching subscription
  if (subscriptionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        

        {/* Welcome Header with Subscription Info */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back!</h1>
                <p className="text-slate-600">Manage your duty refund claims efficiently</p>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  currentSubscription.color === 'gray' ? 'bg-gray-100 text-gray-800' :
                  currentSubscription.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                  currentSubscription.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  <Crown className="w-4 h-4 mr-2" />
                  {currentSubscription.tier}
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  {currentSubscription.limits.claims_per_month === -1 
                    ? "Unlimited claims" 
                    : `${currentSubscription.usage.claims_this_month}/${currentSubscription.limits.claims_per_month} claims this month`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* Claims Management Section - Now First */}
        <div className="mb-8">
          {/* Claims Header with Filters */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Your Claims</h2>
                <p className="text-slate-600">
                  {claims.length === 0 
                    ? "No claims yet" 
                    : `${filteredClaims.length} of ${claims.length} claims`
                  }
                </p>
              </div>
              <div className="flex gap-3">
                <Input
                  placeholder="Search claims..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </div>

          {/* Claims List */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200">
            {filteredClaims.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto flex items-center justify-center mb-6">
                  <FileText className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No claims found</h3>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your filters to see more results."
                    : "Get started by creating your first claim to begin recovering your duty refunds."
                  }
                </p>
                <Button 
                  onClick={() => router.push('/wizard')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Claim
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {filteredClaims.map((claim, index) => (
                  <ClaimCard
                    key={claim.id}
                    claim={claim}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Metrics Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Your Activity Metrics
            </h2>
            
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Total Claims Created */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Total Claims</p>
                    <p className="text-2xl font-bold text-blue-900">{statusCounts.total}</p>
                    <p className="text-xs text-blue-600 mt-1">All time</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Evidence Files Uploaded */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Evidence Files</p>
                    <p className="text-2xl font-bold text-green-900">{currentSubscription.usage.files_uploaded}</p>
                    <p className="text-xs text-green-600 mt-1">Uploaded this month</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Upload className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Plan Usage */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">Plan Usage</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {currentSubscription.limits.claims_per_month === -1 
                        ? "∞" 
                        : `${currentSubscription.usage.claims_this_month}/${currentSubscription.limits.claims_per_month}`
                      }
                    </p>
                    <p className="text-xs text-purple-600 mt-1">This month</p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Days Since Last Claim */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-700">Last Activity</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {claims.length > 0 
                        ? Math.floor((Date.now() - new Date(claims[0].updated_at).getTime()) / (1000 * 60 * 60 * 24))
                        : "N/A"
                      }
                    </p>
                    <p className="text-xs text-orange-600 mt-1">Days ago</p>
                  </div>
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
              </div>

              {/* Draft Claims */}
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-700">Draft Claims</p>
                    <p className="text-2xl font-bold text-yellow-900">{statusCounts.draft}</p>
                    <p className="text-xs text-yellow-600 mt-1">Ready to submit</p>
                  </div>
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Edit className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
              </div>

              {/* Submitted Claims */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-700">With HMRC</p>
                    <p className="text-2xl font-bold text-indigo-900">{statusCounts.submitted + statusCounts.under_review}</p>
                    <p className="text-xs text-indigo-600 mt-1">Under review</p>
                  </div>
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Send className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>
              </div>

              {/* Average Claim Value */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-700">Avg Claim Value</p>
                    <p className="text-2xl font-bold text-emerald-900">
                      £{claims.length > 0 
                        ? Math.round(claims.reduce((sum, claim) => sum + (claim.total_amount || 0), 0) / claims.length)
                        : 0
                      }
                    </p>
                    <p className="text-xs text-emerald-600 mt-1">Per claim</p>
                  </div>
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <PoundSterling className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </div>

              {/* Account Age */}
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg p-4 border border-rose-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-rose-700">Account Age</p>
                    <p className="text-2xl font-bold text-rose-900">
                      {user ? Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                    </p>
                    <p className="text-xs text-rose-600 mt-1">Days</p>
                  </div>
                  <div className="p-2 bg-rose-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-rose-600" />
                  </div>
                </div>
              </div>

            </div>

            {/* Additional Insights Row */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Claims by Type */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Claims by Type</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Duty Only</span>
                    <span className="font-medium">{claims.filter(c => c.claim_type === 'duty').length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">VAT Only</span>
                    <span className="font-medium">{claims.filter(c => c.claim_type === 'vat').length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Both</span>
                    <span className="font-medium">{claims.filter(c => c.claim_type === 'both').length}</span>
                  </div>
                </div>
              </div>

              {/* Claims by Channel */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Claims by Channel</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Courier</span>
                    <span className="font-medium">{claims.filter(c => c.channel === 'courier').length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Postal</span>
                    <span className="font-medium">{claims.filter(c => c.channel === 'postal').length}</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Recent Activity</h4>
                <div className="space-y-2">
                  <div className="text-sm text-slate-600">
                    {claims.length > 0 ? (
                      <>
                        <div>Last claim: {new Date(claims[0].created_at).toLocaleDateString()}</div>
                        <div>Status: <span className="font-medium capitalize">{claims[0].status.replace('_', ' ')}</span></div>
                      </>
                    ) : (
                      <div>No claims yet</div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column - Quick Actions & Tools */}
          <div className="xl:col-span-1 space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-blue-600" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button 
                  onClick={() => router.push('/wizard')}
                  className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-3" />
                  Start New Claim
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="w-4 h-4 mr-3" />
                  Upload Evidence
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-3" />
                  Export Claims
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-3" />
                  View Playbooks
                </Button>
              </div>
            </div>

            {/* Subscription Usage */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                Usage This Month
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Claims</span>
                    <span className="font-medium">
                      {currentSubscription.limits.claims_per_month === -1 
                        ? "Unlimited" 
                        : `${currentSubscription.usage.claims_this_month}/${currentSubscription.limits.claims_per_month}`
                      }
                    </span>
                  </div>
                  {currentSubscription.limits.claims_per_month !== -1 && (
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(currentSubscription.usage.claims_this_month / currentSubscription.limits.claims_per_month) * 100}%` }}
                      ></div>
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Evidence Files</span>
                    <span className="font-medium">{currentSubscription.usage.files_uploaded}/{currentSubscription.limits.evidence_files_per_claim}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(currentSubscription.usage.files_uploaded / currentSubscription.limits.evidence_files_per_claim) * 100}%` }}
                    ></div>
                  </div>
                </div>
                {currentSubscription.limits.priority_support && (
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Priority Support Enabled
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-purple-600" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900">Claim #DHL1234567890 approved</p>
                    <p className="text-xs text-slate-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900">New evidence uploaded</p>
                    <p className="text-xs text-slate-500">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900">Claim pack generated</p>
                    <p className="text-xs text-slate-500">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tier Features */}
            <div className={`bg-gradient-to-br rounded-xl border p-6 ${
              currentSubscription.color === 'gray' ? 'from-gray-50 to-slate-50 border-gray-200' :
              currentSubscription.color === 'blue' ? 'from-blue-50 to-indigo-50 border-blue-200' :
              currentSubscription.color === 'purple' ? 'from-purple-50 to-violet-50 border-purple-200' :
              'from-green-50 to-emerald-50 border-green-200'
            }`}>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <Star className={`w-5 h-5 mr-2 ${
                  currentSubscription.color === 'gray' ? 'text-gray-600' :
                  currentSubscription.color === 'blue' ? 'text-blue-600' :
                  currentSubscription.color === 'purple' ? 'text-purple-600' :
                  'text-green-600'
                }`} />
                Your Plan Features
              </h3>
              <div className="space-y-2">
                {currentSubscription.features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    {feature}
                  </div>
                ))}
                {currentSubscription.features.length > 4 && (
                  <Button variant="link" className={`p-0 h-auto text-sm ${
                    currentSubscription.color === 'gray' ? 'text-gray-600' :
                    currentSubscription.color === 'blue' ? 'text-blue-600' :
                    currentSubscription.color === 'purple' ? 'text-purple-600' :
                    'text-green-600'
                  }`}>
                    View all {currentSubscription.features.length} features →
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Additional Tools */}
          <div className="xl:col-span-2">
            {/* This space can be used for additional dashboard content in the future */}
          </div>
        </div>
      </div>
    </div>
  );
}
