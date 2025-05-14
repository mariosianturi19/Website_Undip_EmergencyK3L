// src/components/reports/ReportList.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  RefreshCw, 
  Filter, 
  Search, 
  Loader2, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  User,
  MapPin,
  Info,
  X
} from "lucide-react";
import { getAccessToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

// Define interface for report and user
interface ReportUser {
  id: number;
  name: string;
  email: string;
  role: string;
  nim?: string;
  jurusan?: string;
}

interface Report {
  id: number;
  user: ReportUser;
  photo_url: string;
  photo_path: string;
  location: string;
  problem_type: string;
  description: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

// Status options
const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "rejected", label: "Rejected" },
];

// Problem type options
const problemTypeOptions = [
  { value: "all", label: "All Types" },
  { value: "electrical", label: "Electrical Issues" },
  { value: "tree", label: "Tree Hazard" },
  { value: "stairs", label: "Stairway Issues" },
  { value: "elevator", label: "Elevator Problems" },
  { value: "door", label: "Door Issues" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "water_supply", label: "Water Supply" },
  { value: "waste_management", label: "Waste Management" },
  { value: "public_safety", label: "Public Safety" },
  { value: "public_health", label: "Public Health" },
  { value: "environmental", label: "Environmental" },
  { value: "other", label: "Other" },
];

export default function ReportList() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsRefreshing(true);
    
    try {
      const token = await getAccessToken();
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch("/api/reports", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch reports: ${response.status}`);
      }

      const data = await response.json();
      console.log("Reports data:", data);
      
      // Ensure data is an array
      const reportsArray = Array.isArray(data) ? data : [];
      setReports(reportsArray);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Format date for better display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format problem type for better display
  const formatProblemType = (type: string) => {
    return type
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  // Get status badge styling and icon
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-300",
          icon: <Clock className="h-3.5 w-3.5 mr-1" />
        };
      case 'in_progress':
        return {
          color: "bg-blue-100 text-blue-800 border-blue-300",
          icon: <Info className="h-3.5 w-3.5 mr-1" />
        };
      case 'resolved':
        return {
          color: "bg-green-100 text-green-800 border-green-300",
          icon: <CheckCircle className="h-3.5 w-3.5 mr-1" />
        };
      case 'rejected':
        return {
          color: "bg-red-100 text-red-800 border-red-300",
          icon: <XCircle className="h-3.5 w-3.5 mr-1" />
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-300",
          icon: <AlertCircle className="h-3.5 w-3.5 mr-1" />
        };
    }
  };

  // Filter the reports based on search query and filters
  const filteredReports = reports.filter(report => {
    // Text search
    const matchesSearch = 
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(report.id).includes(searchQuery);
    
    // Status filter
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    
    // Type filter
    const matchesType = typeFilter === "all" || report.problem_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports</h1>
        <Button onClick={fetchReports} disabled={isRefreshing}>
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter and search reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search reports..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
              options={statusOptions}
            />
            
            <Select
              value={typeFilter}
              onValueChange={setTypeFilter}
              options={problemTypeOptions}
            />
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No reports found</h3>
          <p className="text-gray-500">
            {searchQuery || statusFilter !== "all" || typeFilter !== "all"
              ? "Try changing your search or filter criteria"
              : "There are no reports in the system yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredReports.map((report) => {
            const statusBadge = getStatusBadge(report.status);
            return (
              <Card key={report.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {report.photo_url && (
                    // eslint-disable-next-line
                    <img
                      src={report.photo_url}
                      alt={`Report #${report.id}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge className={`${statusBadge.color} flex items-center px-3 py-1 border`}>
                      {statusBadge.icon}
                      <span>{report.status.replace(/_/g, ' ').toUpperCase()}</span>
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Report #{report.id}</CardTitle>
                      <CardDescription>
                        {formatDate(report.created_at)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <User className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{report.user.name}</p>
                        <p className="text-xs text-gray-500">{report.user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <p className="text-sm">{report.location}</p>
                    </div>
                    
                    <div>
                      <Badge variant="outline" className="font-normal">
                        {formatProblemType(report.problem_type)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm line-clamp-3">{report.description}</p>
                    
                    <div className="flex justify-end pt-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Detail Modal - for future implementation */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Report #{selectedReport.id}</h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedReport(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Report details will go here */}
              <div className="mb-6">
                <p className="text-sm text-gray-500">
                  Submitted on {formatDate(selectedReport.created_at)}
                </p>
              </div>
              
              {/* Buttons */}
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setSelectedReport(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}