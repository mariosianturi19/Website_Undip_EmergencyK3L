// src/app/dashboard/reports/page.tsx
"use client";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import ReportList from "@/components/reports/ReportList";

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <ReportList />
    </DashboardLayout>
  );
}