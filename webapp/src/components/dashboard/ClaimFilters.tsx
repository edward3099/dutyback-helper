"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, ArrowUpDown, AlertTriangle, Clock, XCircle, Calendar } from "lucide-react";

interface ClaimFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  claimTypeFilter: string;
  setClaimTypeFilter: (type: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
}

export function ClaimFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  claimTypeFilter,
  setClaimTypeFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder
}: ClaimFiltersProps) {
  const handleSortToggle = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="space-y-8">
      {/* Clean Search & Filter */}
      <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl border border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50"></div>
        
        <div className="relative p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl border border-blue-200">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900">Search & Filter</h3>
          </div>
          
          <div className="space-y-8">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              <Input
                placeholder="Search by MRN, EORI, or courier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-16 h-16 rounded-2xl bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 focus:bg-white transition-all duration-300 text-lg font-medium"
              />
            </div>

            <div className="grid grid-cols-1 gap-8">
              <div>
                <label className="text-sm font-bold text-gray-600 mb-4 block uppercase tracking-wider">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-16 rounded-2xl bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20 focus:bg-white text-lg font-medium">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-xl">
                    <SelectItem value="all" className="text-gray-900 hover:bg-gray-50 text-lg">All Statuses</SelectItem>
                    <SelectItem value="draft" className="text-gray-900 hover:bg-gray-50 text-lg">Draft</SelectItem>
                    <SelectItem value="submitted" className="text-gray-900 hover:bg-gray-50 text-lg">Submitted</SelectItem>
                    <SelectItem value="under_review" className="text-gray-900 hover:bg-gray-50 text-lg">Under Review</SelectItem>
                    <SelectItem value="approved" className="text-gray-900 hover:bg-gray-50 text-lg">Approved</SelectItem>
                    <SelectItem value="rejected" className="text-gray-900 hover:bg-gray-50 text-lg">Rejected</SelectItem>
                    <SelectItem value="completed" className="text-gray-900 hover:bg-gray-50 text-lg">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-600 mb-4 block uppercase tracking-wider">Claim Type</label>
                <Select value={claimTypeFilter} onValueChange={setClaimTypeFilter}>
                  <SelectTrigger className="h-16 rounded-2xl bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20 focus:bg-white text-lg font-medium">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-xl">
                    <SelectItem value="all" className="text-gray-900 hover:bg-gray-50 text-lg">All Types</SelectItem>
                    <SelectItem value="duty" className="text-gray-900 hover:bg-gray-50 text-lg">Duty Only</SelectItem>
                    <SelectItem value="vat" className="text-gray-900 hover:bg-gray-50 text-lg">VAT Only</SelectItem>
                    <SelectItem value="both" className="text-gray-900 hover:bg-gray-50 text-lg">Both Duty & VAT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-600 mb-4 block uppercase tracking-wider">Sort By</label>
                <div className="flex gap-4">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-16 rounded-2xl bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20 focus:bg-white text-lg font-medium flex-1">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 shadow-xl">
                      <SelectItem value="updated_at" className="text-gray-900 hover:bg-gray-50 text-lg">Last Updated</SelectItem>
                      <SelectItem value="created_at" className="text-gray-900 hover:bg-gray-50 text-lg">Date Created</SelectItem>
                      <SelectItem value="status" className="text-gray-900 hover:bg-gray-50 text-lg">Status</SelectItem>
                      <SelectItem value="total_amount" className="text-gray-900 hover:bg-gray-50 text-lg">Amount</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSortToggle}
                    className="h-16 px-8 rounded-2xl bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-all duration-300"
                  >
                    <ArrowUpDown className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Quick Actions */}
      <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl border border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-green-50/50"></div>
        
        <div className="relative p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl border border-green-200">
              <Filter className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900">Quick Actions</h3>
          </div>
          
          <div className="space-y-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start h-16 rounded-2xl bg-gray-50 border-gray-200 text-gray-700 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all duration-300 group text-lg font-semibold"
            >
              <AlertTriangle className="w-6 h-6 mr-4 text-red-500 group-hover:text-red-600" />
              <span>Show Overdue Claims</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start h-16 rounded-2xl bg-gray-50 border-gray-200 text-gray-700 hover:bg-yellow-50 hover:border-yellow-200 hover:text-yellow-700 transition-all duration-300 group text-lg font-semibold"
            >
              <Clock className="w-6 h-6 mr-4 text-yellow-500 group-hover:text-yellow-600" />
              <span>Show Draft Claims</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start h-16 rounded-2xl bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-all duration-300 group text-lg font-semibold"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setClaimTypeFilter("all");
              }}
            >
              <XCircle className="w-6 h-6 mr-4 text-gray-500 group-hover:text-gray-600" />
              <span>Clear All Filters</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Clean Recent Activity */}
      <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl border border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-transparent rounded-full blur-2xl"></div>
        
        <div className="relative p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl border border-blue-200">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900">Recent Activity</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:bg-gray-100 transition-all duration-300 group">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
              <div className="flex-1">
                <p className="text-lg font-semibold text-gray-900 group-hover:text-green-700 transition-colors duration-300">Claim #12345 approved</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:bg-gray-100 transition-all duration-300 group">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-lg font-semibold text-gray-900 group-hover:text-yellow-700 transition-colors duration-300">New claim submitted</p>
                <p className="text-sm text-gray-500">1 day ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:bg-gray-100 transition-all duration-300 group">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">Document uploaded</p>
                <p className="text-sm text-gray-500">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
