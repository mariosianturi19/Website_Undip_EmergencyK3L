// src/app/dashboard/volunteers/page.tsx
"use client";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import VolunteerManagement from "@/components/volunteers/VolunteerManagement";

export default function VolunteersPage() {
  return (
    <DashboardLayout>
      <VolunteerManagement />
    </DashboardLayout>
  );
}