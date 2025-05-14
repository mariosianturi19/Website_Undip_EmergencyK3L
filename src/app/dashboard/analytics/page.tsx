// src/app/dashboard/analytics/page.tsx
"use client";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Analytics</h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Last 30 days
            </Button>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Response Times</CardTitle>
              <CardDescription>Average time to respond by month</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <p className="text-gray-500">Analytics visualization will appear here</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Types</CardTitle>
              <CardDescription>Distribution of emergency reports by type</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <p className="text-gray-500">Analytics visualization will appear here</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}