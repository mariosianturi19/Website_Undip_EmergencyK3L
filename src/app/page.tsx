"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUserRole, getUserData } from "@/lib/auth";
import { toast } from "@/components/ui/sonner";
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    // Tampilkan toast loading
    const loadingToast = toast.loading("Memeriksa autentikasi...");
    
    // Tunda kecil untuk memungkinkan toast ditampilkan
    setTimeout(() => {
      try {
        // Redirect berdasarkan status autentikasi
        if (isAuthenticated()) {
          const role = getUserRole();
          const userData = getUserData();
          const userName = userData?.name || "Pengguna";
          
          // Jika pengguna adalah mahasiswa/pengguna biasa, alihkan langsung ke halaman tombol panik mahasiswa
          if (role === "user") {
            toast.success(`Selamat datang kembali, ${userName}!`, {
              description: "Mengalihkan ke halaman darurat",
              id: loadingToast,
            });
            router.push("/student");
          } else {
            // Admin dan relawan masuk ke dasbor
            toast.success(`Selamat datang kembali, ${userName}!`, {
              description: "Mengalihkan ke dasbor",
              id: loadingToast,
            });
            router.push("/dashboard");
          }
        } else {
          toast.info("Silakan masuk", {
            description: "Mengalihkan ke halaman masuk",
            id: loadingToast,
          });
          router.push("/login");
        }
      } catch (error) {
        // Jika terjadi kesalahan selama pemeriksaan autentikasi
        toast.error("Kesalahan autentikasi", {
          description: "Silakan coba lagi atau hubungi dukungan",
          id: loadingToast,
        });
        setIsRedirecting(false);
      }
    }, 800); // Tunda kecil untuk UX yang lebih baik
  }, [router]);

  // Kembalikan status loading saat pengalihan
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-100">SIGAP UNDIP</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isRedirecting ? "Mengarahkan ke halaman yang sesuai..." : "Silakan segarkan halaman atau coba lagi nanti."}
        </p>
      </div>
    </div>
  );
}