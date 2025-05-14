// src/components/layouts/StudentLayout.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clearAuthTokens } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface StudentLayoutProps {
  children: React.ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    clearAuthTokens();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <div>
      {/* You can add a header, sidebar, or navigation here if needed */}
      <main>{children}</main>
    </div>
  );
}