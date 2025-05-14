// src/app/dashboard/settings/page.tsx
"use client";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Settings</h1>
          <Button>Save Changes</Button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4">General Settings</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    System Name
                  </label>
                  <Input 
                    defaultValue="UNDIP Emergency Response System" 
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <Input 
                    defaultValue="emergency@undip.ac.id" 
                    className="w-full"
                  />
                </div>
              </div>
              
              <div>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="text-sm text-gray-700">Enable email notifications</span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="text-sm text-gray-700">Enable SMS alerts for emergencies</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}