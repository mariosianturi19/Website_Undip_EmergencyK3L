"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUserRole } from "@/lib/auth";
import { toast } from "@/components/ui/sonner";
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    // Show loading toast
    const loadingToast = toast.loading("Checking authentication...");
    
    // Small delay to allow the toast to show
    setTimeout(() => {
      try {
        // Redirect based on authentication status
        if (isAuthenticated()) {
          const role = getUserRole();
          
          // If user is student/regular user, redirect directly to student panic button page
          if (role === "user") {
            toast.success("Welcome back!", {
              description: "Redirecting to emergency page",
              id: loadingToast,
            });
            router.push("/student");
          } else {
            // Admin and volunteers go to dashboard
            toast.success("Welcome back, admin!", {
              description: "Redirecting to dashboard",
              id: loadingToast,
            });
            router.push("/dashboard");
          }
        } else {
          toast.info("Please log in", {
            description: "Redirecting to login page",
            id: loadingToast,
          });
          router.push("/login");
        }
      } catch (error) {
        // If there's an error during authentication check
        toast.error("Authentication error", {
          description: "Please try again or contact support",
          id: loadingToast,
        });
        setIsRedirecting(false);
      }
    }, 800); // Small delay for better UX
  }, [router]);

  // Return a loading state while redirecting
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-100">UNDIP Emergency</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isRedirecting ? "Redirecting to the appropriate page..." : "Please refresh the page or try again later."}
        </p>
      </div>
    </div>
  );
}
