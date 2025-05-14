// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getUserRole } from "@/lib/auth";
import { Loader2, Users, Bell, BarChart3, FileText } from "lucide-react";
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

export default function Dashboard() {
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
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
    
    setIsLoading(false);
  }, [router]);

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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Last 7 days
            </Button>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Volunteers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">24</div>
                <div className="p-2 bg-green-50 text-green-600 rounded-full">
                  <Users size={20} />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Emergency Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">5</div>
                <div className="p-2 bg-red-50 text-red-600 rounded-full">
                  <Bell size={20} />
                </div>
              </div>
              <p className="text-xs text-red-600 mt-2">
                3 new reports today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">4.2 min</div>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
                  <BarChart3 size={20} />
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                -15% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>
                Overview of the latest system activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                    <Users size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">New volunteer registered</p>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <p className="text-sm text-gray-500">Ahmad Zaky joined as a volunteer</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-full bg-red-50 text-red-600">
                    <Bell size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Emergency alert triggered</p>
                      <span className="text-xs text-gray-500">5 hours ago</span>
                    </div>
                    <p className="text-sm text-gray-500">At Faculty of Engineering, prompt response by team</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-full bg-green-50 text-green-600">
                    <FileText size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Report submitted</p>
                      <span className="text-xs text-gray-500">Yesterday</span>
                    </div>
                    <p className="text-sm text-gray-500">Monthly safety report uploaded by admin</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Volunteer Distribution</CardTitle>
              <CardDescription>
                By department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm">Computer Science</p>
                    <span className="text-sm font-medium">8</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '32%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm">Medical</p>
                    <span className="text-sm font-medium">6</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '24%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm">Engineering</p>
                    <span className="text-sm font-medium">5</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm">Others</p>
                    <span className="text-sm font-medium">5</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}