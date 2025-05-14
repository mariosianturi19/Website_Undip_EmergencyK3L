// src/components/layouts/DashboardLayout.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { clearAuthTokens, getUserData } from "@/lib/auth";
import { toast } from "sonner";
import Image from "next/image";
import { 
  Users, 
  FileText, 
  Settings, 
  Bell, 
  ChevronDown, 
  LogOut, 
  Sliders, 
  PieChart,
  BarChart3,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Footer from "@/components/footer";
import Link from "next/link";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [userData, setUserData] = useState<any>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem("user_data");
    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData));
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  const handleLogout = () => {
    clearAuthTokens();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const getSidebarWidth = () => {
    return isSidebarCollapsed ? "w-16" : "w-64";
  };

  const getInitials = (name: string) => {
    if (!name) return "AD";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${getSidebarWidth()}`}>
          <div className="flex flex-col h-full">
            <div className="h-16 border-b border-gray-200 flex items-center px-4">
              <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
                <div className="w-8 h-8 rounded-md overflow-hidden">
                  <Image 
                    src="/images/Undip-Logo.png" 
                    alt="UNDIP Logo"
                    width={32} 
                    height={32}
                    className="object-contain"
                  />
                </div>
                {!isSidebarCollapsed && <span className="font-semibold text-lg">UNDIP Admin</span>}
              </div>
            </div>
            <div className="flex-1 py-6 overflow-auto">
              <ul className="space-y-1 px-2">
                <li>
                  <Link
                    href="/dashboard"
                    className={`flex items-center w-full py-2 px-3 rounded-lg transition-colors ${
                      isActive("/dashboard")
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <PieChart size={20} />
                    {!isSidebarCollapsed && <span className="ml-3">Overview</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/volunteers"
                    className={`flex items-center w-full py-2 px-3 rounded-lg transition-colors ${
                      isActive("/dashboard/volunteers")
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Users size={20} />
                    {!isSidebarCollapsed && <span className="ml-3">Volunteers</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/reports"
                    className={`flex items-center w-full py-2 px-3 rounded-lg transition-colors ${
                      isActive("/dashboard/reports")
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <FileText size={20} />
                    {!isSidebarCollapsed && <span className="ml-3">Reports</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/analytics"
                    className={`flex items-center w-full py-2 px-3 rounded-lg transition-colors ${
                      isActive("/dashboard/analytics")
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <BarChart3 size={20} />
                    {!isSidebarCollapsed && <span className="ml-3">Analytics</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/settings"
                    className={`flex items-center w-full py-2 px-3 rounded-lg transition-colors ${
                      isActive("/dashboard/settings")
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Settings size={20} />
                    {!isSidebarCollapsed && <span className="ml-3">Settings</span>}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="mt-auto border-t border-gray-200 p-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-full flex justify-center"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              >
                <ChevronDown
                  size={18}
                  className={`transform transition-transform ${
                    isSidebarCollapsed ? "rotate-90" : "-rotate-90"
                  }`}
                />
                {!isSidebarCollapsed && <span className="ml-2">Collapse</span>}
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top header */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <div className="flex items-center">
              <div className="flex items-center space-x-3 mr-6">
                <Image 
                  src="/images/Undip-Logo.png" 
                  alt="UNDIP Logo"
                  width={24} 
                  height={24}
                  className="object-contain"
                />
                <span className="font-semibold">UNDIP Emergency</span>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search..."
                  className="pl-10 rounded-full bg-gray-50 border-none focus:bg-white"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border border-gray-200">
                      <AvatarImage
                        src={userData?.avatar_url || ""}
                        alt={userData?.name || "Admin"}
                      />
                      <AvatarFallback>{userData?.name ? getInitials(userData.name) : "AD"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" sideOffset={5}>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {userData && (
                    <>
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium">{userData.name}</p>
                        <p className="text-xs text-gray-500">{userData.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/dashboard/settings')}>
                    <Sliders className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}