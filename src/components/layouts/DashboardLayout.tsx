// src/components/layouts/DashboardLayout.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { clearAuthTokens, getUserData } from "@/lib/auth";
import { toast } from "sonner";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Users, 
  FileText, 
  Settings, 
  Bell, 
  ChevronLeft,
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

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [userData, setUserData] = useState<any>(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

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

  // Animation variants
  const sidebarVariants = {
    expanded: {
      width: "16rem",
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    collapsed: {
      width: "5rem",
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  const textVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      display: "block",
      transition: { delay: 0.1, duration: 0.2 }
    },
    collapsed: {
      opacity: 0,
      x: -10,
      transitionEnd: { display: "none" },
      transition: { duration: 0.2 }
    }
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

  // Menu items
  const menuItems = [
    { icon: PieChart, label: "Overview", path: "/dashboard" },
    { icon: Users, label: "Volunteers", path: "/dashboard/volunteers" },
    { icon: FileText, label: "Reports", path: "/dashboard/reports" }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Animated Sidebar */}
        <motion.div 
          ref={sidebarRef}
          className="bg-white border-r border-gray-200 h-screen overflow-hidden relative"
          initial="collapsed"
          animate={isSidebarExpanded ? "expanded" : "collapsed"}
          variants={sidebarVariants}
          onHoverStart={() => setIsSidebarExpanded(true)}
          onHoverEnd={() => setIsSidebarExpanded(false)}
        >
          <div className="flex flex-col h-full">
            {/* Logo Section */}
            <div className="h-16 flex items-center px-4 border-b border-gray-200">
              <div className="flex items-center justify-center w-full">
                <div className="rounded-full bg-blue-50 w-10 h-10 flex items-center justify-center overflow-hidden">
                  <Image 
                    src="/images/Undip-Logo.png" 
                    alt="UNDIP Logo"
                    width={40} 
                    height={40}
                    className="object-cover"
                  />
                </div>
                <motion.span
                  variants={textVariants}
                  className="ml-1 font-semibold text-lg text-gray-1000"
                >
                  UNDIP Admin
                </motion.span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 py-6 px-3 space-y-2">
              {menuItems.map((item) => {
                const isItemActive = isActive(item.path);
                return (
                  <motion.div
                    key={item.path}
                    className="relative"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      onClick={() => router.push(item.path)}
                      className={`
                        flex items-center px-3 py-3 rounded-lg cursor-pointer
                        transition-all duration-300 group
                        ${isItemActive 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'hover:bg-gray-50 text-gray-600 hover:text-blue-600'
                        }
                      `}
                    >
                      <div className="relative">
                        <item.icon className={`w-5 h-5 ${isItemActive ? 'text-blue-600' : 'group-hover:text-blue-600'}`} />
                        {isItemActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute -left-1 -right-1 -top-1 -bottom-1 rounded-md bg-blue-100/50 -z-10"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </div>
                      <motion.span
                        variants={textVariants}
                        className="ml-3 font-medium"
                      >
                        {item.label}
                      </motion.span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Logout Button */}
            <div className="p-3 mb-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-3 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-300"
                >
                  <LogOut className="w-5 h-5" />
                  <motion.span
                    variants={textVariants}
                    className="ml-3 font-medium"
                  >
                    Logout
                  </motion.span>
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>

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
            </div>
            <div className="flex items-center space-x-4">

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
        </div>/
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}