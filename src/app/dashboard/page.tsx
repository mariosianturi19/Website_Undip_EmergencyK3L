// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getUserRole, getAccessToken } from "@/lib/auth";
import { Loader2, Users, Bell, Image, AlertTriangle, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { toast } from "sonner";
import { motion } from "framer-motion";

// Define interface for activities
interface Activity {
  id: string;
  type: 'volunteer' | 'report' | 'alert';
  title: string;
  description: string;
  timestamp: Date;
  icon: 'Users' | 'Image' | 'AlertTriangle';
}

export default function Dashboard() {
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [volunteerCount, setVolunteerCount] = useState<number>(0);
  const [reportCount, setReportCount] = useState<number>(0);
  const [alertCount, setAlertCount] = useState<number>(3); // Dummy data for alerts
  const [activities, setActivities] = useState<Activity[]>([]);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    // Get the user role
    const userRole = getUserRole();
    setRole(userRole);
    
    // If user is a regular user, redirect to the student page
    if (userRole === "user") {
      router.push("/student");
      return;
    }
    
    // Fetch counts and activities
    fetchCounts();
  }, [router]);

  const fetchCounts = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Authentication required");
        return;
      }

      // Fetch volunteer count
      const volunteerResponse = await fetch("/api/volunteers", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (volunteerResponse.ok) {
        const volunteerData = await volunteerResponse.json();
        // Determine count based on API response structure
        const volunteers = Array.isArray(volunteerData) ? volunteerData : [];
        setVolunteerCount(volunteers.length);
        
        // Add volunteer activities from the data
        const volunteerActivities: Activity[] = volunteers.slice(0, 2).map((vol: any) => ({
          id: `vol-${vol.id}`,
          type: 'volunteer',
          title: "New volunteer registered",
          description: `${vol.name} joined as a volunteer`,
          timestamp: new Date(vol.created_at),
          icon: 'Users'
        }));

        // Fetch reports count
        const reportResponse = await fetch("/api/reports", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        if (reportResponse.ok) {
          const reportData = await reportResponse.json();
          let reports = [];
          
          // If the response is an object with a 'data' array (paginated response)
          if (reportData && reportData.data && Array.isArray(reportData.data)) {
            reports = reportData.data;
            setReportCount(reportData.total || reportData.data.length);
          } 
          // If the response is a direct array
          else if (Array.isArray(reportData)) {
            reports = reportData;
            setReportCount(reportData.length);
          }
          
          // Add report activities
          const reportActivities: Activity[] = reports.slice(0, 2).map((report: any) => ({
            id: `report-${report.id}`,
            type: 'report',
            title: "Report submitted with photo",
            description: `At ${report.location}, ${report.problem_type} issue reported`,
            timestamp: new Date(report.created_at),
            icon: 'Image'
          }));
          
          // Create dummy emergency alert activities
          const alertActivities: Activity[] = [
            {
              id: 'alert-1',
              type: 'alert',
              title: "Emergency alert triggered",
              description: "At Faculty of Engineering, prompt response by team",
              timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
              icon: 'AlertTriangle'
            },
            {
              id: 'alert-2',
              type: 'alert',
              title: "Emergency situation resolved",
              description: "Medical team responded in Science Building",
              timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000), // 9 hours ago
              icon: 'AlertTriangle'
            }
          ];
          
          // Combine all activities and sort by timestamp (newest first)
          const allActivities = [...volunteerActivities, ...reportActivities, ...alertActivities]
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
          
          setActivities(allActivities);
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching counts:", error);
      toast.error("Failed to load dashboard data");
      setIsLoading(false);
    }
  };

  // Helper function to format date for display
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Get icon component based on activity type
  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'volunteer':
        return <Users size={16} className="text-blue-600" />;
      case 'report':
        return <Image size={16} className="text-green-600" />;
      case 'alert':
        return <AlertTriangle size={16} className="text-red-600" />;
      default:
        return <Users size={16} />;
    }
  };

  // Get background color class for activity icon
  const getIconBgColor = (type: string) => {
    switch(type) {
      case 'volunteer':
        return 'bg-blue-100';
      case 'report':
        return 'bg-green-100';
      case 'alert':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  if (!isClient) {
    return null; // Return nothing during server-side rendering
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  // Dashboard overview content
  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-gray-500 mt-1">Welcome back, review the latest statistics and activities</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex space-x-2"
          >
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div 
            custom={0} 
            initial="hidden" 
            animate="visible" 
            variants={cardVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                <CardTitle className="text-blue-900 flex items-center text-lg">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  Total Volunteers
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-gray-800">{volunteerCount}</span>
                    <span className="text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Active volunteers
                    </span>
                  </div>
                  <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            custom={1} 
            initial="hidden" 
            animate="visible" 
            variants={cardVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-green-100 border-b border-green-100">
                <CardTitle className="text-green-900 flex items-center text-lg">
                  <Image className="h-5 w-5 mr-2 text-green-600" />
                  Photo Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-gray-800">{reportCount}</span>
                    <span className="text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Total submitted
                    </span>
                  </div>
                  <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
                    <Image className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            custom={2} 
            initial="hidden" 
            animate="visible" 
            variants={cardVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-2 bg-gradient-to-r from-red-50 to-red-100 border-b border-red-100">
                <CardTitle className="text-red-900 flex items-center text-lg">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                  Emergency Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-gray-800">{alertCount}</span>
                    <span className="text-sm text-red-600 flex items-center mt-1">
                      <ArrowDown className="h-3 w-3 mr-1" />
                      Last 24 hours
                    </span>
                  </div>
                  <div className="h-12 w-12 bg-red-50 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border border-gray-200 shadow-sm h-full">
              <CardHeader className="pb-2 border-b">
                <CardTitle className="text-xl font-bold text-gray-800">Recent Activities</CardTitle>
                <CardDescription>
                  Overview of the latest system activities
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {activities.length > 0 ? (
                    activities.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + (index * 0.1), duration: 0.3 }}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`p-2 rounded-full ${getIconBgColor(activity.type)}`}>
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-gray-900 truncate">{activity.title}</p>
                              <span className="text-xs text-gray-500 whitespace-nowrap">{formatTimeAgo(activity.timestamp)}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-0.5">{activity.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">No recent activities</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}