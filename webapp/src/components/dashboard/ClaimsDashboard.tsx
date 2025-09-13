"use client";

import { useState, useMemo } from "react";
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
  Play
} from "lucide-react";
import { ClaimCard } from "./ClaimCard";
import { ClaimFilters } from "./ClaimFilters";
import { ClaimStats } from "./ClaimStats";
import AnimatedList from "@/components/ui/AnimatedList";
// import { mockClaims } from "@/lib/mockData";

export interface Claim {
  id: string;
  title: string;
  claimType: 'overpayment' | 'rejected' | 'withdrawal' | 'low_value';
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'completed';
  channel: 'courier' | 'postal';
  isVATRegistered: boolean;
  mrn: string;
  eori: string;
  packageValue: number;
  dutyPaid: number;
  vatPaid: number;
  importDate: string;
  deadline: string;
  createdAt: string;
  updatedAt: string;
  progress: number; // 0-100
  courier?: string;
  bor286ChargeReference?: string;
  sellerRefundAcknowledged?: boolean;
  vatReturnAcknowledged?: boolean;
}

export function ClaimsDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [claimTypeFilter, setClaimTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("updatedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Sample claims data for demonstration
  const sampleClaims = [
    { id: "1", title: "Amazon Import Duty Refund", status: "submitted", claimType: "overpayment" },
    { id: "2", title: "eBay VAT Reclaim", status: "under_review", claimType: "low_value" },
    { id: "3", title: "Etsy Customs Refund", status: "approved", claimType: "overpayment" },
    { id: "4", title: "Wish.com Duty Claim", status: "draft", claimType: "rejected" },
    { id: "5", title: "AliExpress Import Refund", status: "completed", claimType: "withdrawal" },
    { id: "6", title: "Shopify VAT Claim", status: "submitted", claimType: "overpayment" },
    { id: "7", title: "Etsy Customs Duty", status: "under_review", claimType: "low_value" },
    { id: "8", title: "Amazon FBA Refund", status: "approved", claimType: "overpayment" },
  ];

  // Filter and sort claims
  const filteredClaims = useMemo(() => {
    let filtered = sampleClaims;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(claim =>
        claim.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(claim => claim.status === statusFilter);
    }

    // Apply claim type filter
    if (claimTypeFilter !== "all") {
      filtered = filtered.filter(claim => claim.claimType === claimTypeFilter);
    }

    return filtered;
  }, [searchQuery, statusFilter, claimTypeFilter, sortBy, sortOrder]);

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
    
    sampleClaims.forEach(claim => {
      counts[claim.status]++;
      counts.total++;
    });
    
    return counts;
  };

  const statusCounts = getStatusCounts();

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
            <Button className="flex items-center gap-2">
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
                        ? `Showing ${filteredClaims.length} of 0 claims`
                        : `You have 0 total claims`
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
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Claim
                    </Button>
                  </div>
                ) : (
                  <AnimatedList
                    items={filteredClaims.map(claim => claim.title)}
                    onItemSelect={(item, index) => {
                      console.log('Selected claim:', item, 'at index:', index);
                    }}
                    showGradients={true}
                    enableArrowNavigation={true}
                    displayScrollbar={true}
                    className="claims-animated-list"
                    itemClassName="claim-item"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
