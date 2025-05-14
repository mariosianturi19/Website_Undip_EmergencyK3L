// src/components/ProtectedRoute.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated, getUserRole } from "@/lib/auth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        router.push("/login");
        return;
      }
      
      // Check if user is in the correct route based on role
      const role = getUserRole();
      
      // If user tries to access dashboard but is a regular user
      if (pathname.startsWith("/dashboard") && role === "user") {
        router.push("/student");
        return;
      }
      
      // If user tries to access student pages but is admin/volunteer
      if (pathname.startsWith("/student") && (role === "admin" || role === "volunteer")) {
        router.push("/dashboard");
        return;
      }
      
      setIsChecking(false);
    };

    checkAuth();
  }, [router, pathname]);

  if (!isClient) {
    return null;
  }

  if (isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return <>{children}</>;
}