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
    toast.success("Berhasil keluar dari sistem");
    router.push("/auth/login"); // Update path: Sebelumnya /login
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar - keeping original color scheme */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-md sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4 items-center">
              <Link href="/student/emergency" className="font-semibold text-lg flex items-center">
                <motion.div
                  whileHover={{ rotate: 10 }}
                  className="mr-2"
                >
                  <Image
                    src="/images/Undip-Logo.png"
                    alt="Logo UNDIP"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </motion.div>
                <span>SIGAP UNDIP</span>
              </Link>
              
              {/* Navigasi Desktop */}
              <div className="hidden sm:flex space-x-1">
                <Link
                  href="/student/emergency" // Update path: Sebelumnya /student
                  className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                    pathname === "/student/emergency"
                      ? "bg-white/20 text-white"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  Tombol Darurat
                </Link>
                <Link
                  href="/student/report"
                  className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                    pathname === "/student/report"
                      ? "bg-white/20 text-white"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  Laporan dengan Foto
                </Link>
              </div>
            </div>
            
            {/* Tombol Keluar Desktop */}
            <div className="hidden sm:block">
              <Button variant="ghost" onClick={handleLogout} className="text-white hover:bg-white/20">
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </div>
            
            {/* Tombol Menu Mobile */}
            <button
              className="sm:hidden p-2 rounded-md text-white hover:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
          
          {/* Navigasi Mobile */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="sm:hidden overflow-hidden mt-2"
              >
                <div className="flex flex-col p-2 space-y-1">
                  <Link
                    href="/student/emergency" // Update path: Sebelumnya /student
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-3 rounded-md text-sm font-semibold transition-colors ${
                      pathname === "/student/emergency"
                        ? "bg-white/20 text-white"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    Tombol Darurat
                  </Link>
                  <Link
                    href="/student/report"
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-3 rounded-md text-sm font-semibold transition-colors ${
                      pathname === "/student/report"
                        ? "bg-white/20 text-white"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    Laporan dengan Foto
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="justify-start px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Keluar
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Konten utama */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer dengan animasi */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Footer />
      </motion.div>
    </div>
  );
}