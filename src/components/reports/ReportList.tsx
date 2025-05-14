// src/components/reports/ReportList.tsx
"use client";

import { useState, useEffect, MouseEvent } from "react";
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
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Calendar,
  SlidersHorizontal
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
import { motion, AnimatePresence } from "framer-motion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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
      const reportsArray = Array.isArray(data) ? data : data.data || [];
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

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return formatDate(dateString);
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

  // Toggle sort direction or change sort field
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort icon
  const getSortIcon = (field: string) => {
    if (field !== sortField) return <ChevronDown className="h-4 w-4 opacity-40" />;
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4 text-blue-600" />
    ) : (
      <ChevronDown className="h-4 w-4 text-blue-600" />
    );
  };

  // Sort reports
  const sortReports = (a: Report, b: Report) => {
    let valueA, valueB;
    
    switch (sortField) {
      case 'date':
        valueA = new Date(a.created_at).getTime();
        valueB = new Date(b.created_at).getTime();
        break;
      case 'status':
        valueA = a.status;
        valueB = b.status;
        break;
      case 'location':
        valueA = a.location.toLowerCase();
        valueB = b.location.toLowerCase();
        break;
      case 'type':
        valueA = a.problem_type;
        valueB = b.problem_type;
        break;
      default:
        valueA = new Date(a.created_at).getTime();
        valueB = new Date(b.created_at).getTime();
    }
    
    if (sortDirection === 'asc') {
      return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
    } else {
      return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
    }
  };

  // Filter the reports based on search query and filters
  const filteredReports = reports
    .filter(report => {
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
    })
    .sort(sortReports);

  // View report detail
  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setIsDetailOpen(true);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const detailVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  function handleRefresh(event: MouseEvent<HTMLButtonElement>): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
          <p className="text-gray-500 mt-1">View and manage user submitted reports</p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          className="border-gray-200"
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-xl font-bold text-gray-800">Filters</CardTitle>
            <CardDescription>
              Filter and search reports
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search reports..."
                  className="pl-10 border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
                options={statusOptions}
                className="border-gray-200"
              />
              
              <Select
                value={typeFilter}
                onValueChange={setTypeFilter}
                options={problemTypeOptions}
                className="border-gray-200"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-xl font-bold text-gray-800">Report List</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
              </div>
            ) : filteredReports.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center p-12"
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="rounded-full bg-gray-100 p-4 mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  {searchQuery || statusFilter !== "all" || typeFilter !== "all" ? (
                    <>
                      <h3 className="text-lg font-medium text-gray-800 mb-1">No matching reports</h3>
                      <p className="text-gray-500 mb-4">Try changing your search or filter criteria</p>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSearchQuery('');
                          setStatusFilter('all');
                          setTypeFilter('all');
                        }}
                        className="border-gray-200"
                      >
                        Clear filters
                      </Button>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-medium text-gray-800 mb-1">No reports found</h3>
                      <p className="text-gray-500 mb-4">There are currently no reports in the system</p>
                      <Button 
                        variant="outline"
                        onClick={handleRefresh}
                        className="border-gray-200"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-gray-700 text-sm">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <button
                          className="flex items-center font-medium"
                          onClick={() => handleSort('date')}
                        >
                          Date
                          {getSortIcon('date')}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <span className="font-medium">Reporter</span>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          className="flex items-center font-medium"
                          onClick={() => handleSort('location')}
                        >
                          Location
                          {getSortIcon('location')}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          className="flex items-center font-medium"
                          onClick={() => handleSort('type')}
                        >
                          Problem Type
                          {getSortIcon('type')}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          className="flex items-center font-medium"
                          onClick={() => handleSort('status')}
                        >
                          Status
                          {getSortIcon('status')}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <motion.tbody
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="divide-y divide-gray-100"
                  >
                    {filteredReports.map((report) => {
                      const statusBadge = getStatusBadge(report.status);
                      return (
                        <motion.tr 
                          key={report.id}
                          variants={itemVariants}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex flex-col">
                              <div className="text-sm font-medium text-gray-900">
                                {new Date(report.created_at).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatTimeAgo(report.created_at)}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-medium">
                                  {report.user?.name ? report.user.name.charAt(0).toUpperCase() : "U"}
                                </span>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{report.user?.name}</div>
                                <div className="text-xs text-gray-500">{report.user?.nim || report.user?.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 text-gray-400 mr-1.5 flex-shrink-0" />
                              <span className="truncate max-w-[180px]">{report.location}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <Badge variant="outline" className="capitalize font-normal">
                              {formatProblemType(report.problem_type)}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <Badge className={`flex items-center px-2 py-1 ${statusBadge.color} font-normal border capitalize`}>
                              {statusBadge.icon}
                              <span>{report.status.replace(/_/g, ' ')}</span>
                            </Badge>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 h-8"
                                onClick={() => handleViewReport(report)}
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem onClick={() => handleViewReport(report)} className="cursor-pointer">
                                    <ExternalLink className="h-4 w-4 mr-2 text-blue-600" />
                                    <span>View details</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="cursor-pointer">
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                    <span>Mark as resolved</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <Info className="h-4 w-4 mr-2 text-blue-600" />
                                    <span>Mark as in progress</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer text-red-600">
                                    <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                    <span>Reject report</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </motion.tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Report Detail Modal */}
      <AnimatePresence>
        {isDetailOpen && selectedReport && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDetailOpen(false)}
          >
            <motion.div 
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
              variants={detailVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
                <h2 className="text-xl font-bold text-gray-800">Report #{selectedReport.id}</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsDetailOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Report Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <Badge className={`mt-1 ${getStatusBadge(selectedReport.status).color} px-2.5 py-1 text-xs font-normal border capitalize flex items-center w-fit`}>
                        {getStatusBadge(selectedReport.status).icon}
                        <span>{selectedReport.status.replace(/_/g, ' ')}</span>
                      </Badge>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Submitted on</p>
                      <p className="text-sm text-gray-900 mt-1">{formatDate(selectedReport.created_at)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Problem Type</p>
                      <Badge variant="outline" className="mt-1 capitalize">
                        {formatProblemType(selectedReport.problem_type)}
                      </Badge>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <div className="flex items-center mt-1 text-sm text-gray-900">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1.5" />
                        <span>{selectedReport.location}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Description</p>
                      <p className="text-sm text-gray-900 mt-1 whitespace-pre-line">{selectedReport.description}</p>
                    </div>
                    
                    {selectedReport.admin_notes && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Admin Notes</p>
                        <p className="text-sm text-gray-900 mt-1 whitespace-pre-line bg-gray-50 p-2 rounded border border-gray-200">{selectedReport.admin_notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Photo Evidence</h3>
                  <div className="bg-gray-100 rounded-lg overflow-hidden border">
                    {selectedReport.photo_url ? (
                      <img
                        src={selectedReport.photo_url}
                        alt={`Report #${selectedReport.id}`}
                        className="w-full object-contain max-h-[400px]"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-64 bg-gray-100 text-gray-400">
                        <p>No image available</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Reporter</h3>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {selectedReport.user?.name ? selectedReport.user.name.charAt(0).toUpperCase() : "U"}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{selectedReport.user?.name}</p>
                        <p className="text-xs text-gray-500">{selectedReport.user?.email}</p>
                        {selectedReport.user?.nim && (
                          <p className="text-xs text-gray-500">NIM: {selectedReport.user.nim}</p>
                        )}
                        {selectedReport.user?.jurusan && (
                          <p className="text-xs text-gray-500">Department: {selectedReport.user.jurusan}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  Close
                </Button>
                <Button variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                  <Info className="h-4 w-4 mr-2" />
                  Mark as In Progress
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Resolved
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}