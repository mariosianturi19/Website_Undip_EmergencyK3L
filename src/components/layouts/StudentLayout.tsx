// src/components/layouts/StudentLayout.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clearAuthTokens } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";

interface StudentLayoutProps {
  children: React.ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearAuthTokens();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar - using the same background color as login page heading */}
      <nav className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4 items-center">
              <Link href="/student" className="font-semibold text-lg">
                UNDIP Emergency
              </Link>
              <div className="hidden sm:flex space-x-1">
                <Link
                  href="/student"
                  className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                    pathname === "/student"
                      ? "bg-white/20 text-white"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  Panic Button
                </Link>
                <Link
                  href="/student/report"
                  className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                    pathname === "/student/report"
                      ? "bg-white/20 text-white"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  Report with Photo
                </Link>
              </div>
            </div>
            <Button variant="ghost" onClick={handleLogout} className="text-white">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
          
          {/* Mobile navigation */}
          <div className="sm:hidden flex justify-center mt-1 space-x-2">
            <Link
              href="/student"
              className={`px-3 py-1.5 rounded-md text-sm font-semibold flex-1 text-center ${
                pathname === "/student"
                  ? "bg-white/20 text-white"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              Panic Button
            </Link>
            <Link
              href="/student/report"
              className={`px-3 py-1.5 rounded-md text-sm font-semibold flex-1 text-center ${
                pathname === "/student/report"
                  ? "bg-white/20 text-white"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              Report with Photo
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}