// src/app/student/page.tsx (Tombol Darurat)
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AlertOctagon, Phone, AlertTriangle, X, Check, Shield, FileCheck, ExternalLink } from "lucide-react";
import StudentLayout from "@/components/layouts/StudentLayout";
import { Card, CardContent } from "@/components/ui/card";
import { getUserData } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function PanicButtonPage() {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const userData = getUserData();

  // Dapatkan lokasi pengguna saat komponen dipasang
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError(null);
        },
        (error) => {
          console.error('Kesalahan mendapatkan lokasi:', error);
          setLocationError('Tidak dapat mengakses lokasi Anda. Mohon aktifkan layanan lokasi.');
        }
      );
    } else {
      setLocationError('Geolokasi tidak didukung oleh browser Anda.');
    }
  }, []);

  const handlePanicButtonPress = () => {
    if (!location) {
      toast.error("Akses lokasi diperlukan", {
        description: "Mohon aktifkan layanan lokasi dan coba lagi."
      });
      return;
    }

    if (!isConfirming) {
      setIsConfirming(true);
      // Atur ulang status konfirmasi setelah 3 detik jika tidak diklik
      setTimeout(() => {
        if (isConfirming) setIsConfirming(false);
      }, 3000);
      return;
    }

    // Tampilkan modal syarat dan ketentuan
    setIsTermsModalOpen(true);
  };

  const handleCancelPanic = () => {
    setIsConfirming(false);
    setIsSending(false);
    setCountdown(5);
  };

  const handleCloseTermsModal = () => {
    setIsTermsModalOpen(false);
    setIsConfirming(false);
    setTermsAccepted(false);
  };

  const handleAcceptTerms = () => {
    setIsTermsModalOpen(false);
    setIsSending(true);
    setIsConfirming(false);
    setCountdown(5);

  const userData = getUserData();
  if (userData && !sessionStorage.getItem("welcome_toast_shown")) {
    toast.success(`Selamat datang, ${userData.name}!`, {
      description: "Anda telah berhasil masuk ke SIGAP UNDIP",
    });
    sessionStorage.setItem("welcome_toast_shown", "true");
  }

    // Mulai hitung mundur
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          // Simulasi panggilan API untuk mengirim peringatan darurat
          setTimeout(() => {
            setIsSending(false);
            toast.success("Peringatan darurat terkirim", {
              description: "Layanan darurat telah diberitahu tentang lokasi Anda.",
              duration: 5000,
            });
          }, 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Dapatkan inisial untuk profil
  const getInitial = (name: string | undefined) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  // Modal syarat dan ketentuan
  const TermsModal = () => (
    <AnimatePresence>
      {isTermsModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleCloseTermsModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 bg-red-600 text-white">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <h2 className="text-lg font-bold">Ketentuan Peringatan Darurat</h2>
              </div>
              <button
                onClick={handleCloseTermsModal}
                className="p-1 rounded-full hover:bg-red-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50">
              <Button 
                variant="outline" 
                onClick={handleCloseTermsModal}
                className="border-gray-300"
              >
                Batal
              </Button>
              <Button 
                onClick={handleAcceptTerms}
                disabled={!termsAccepted}
                className={`${!termsAccepted ? 'bg-red-300' : 'bg-red-600 hover:bg-red-700'}`}
              >
                <Shield className="h-4 w-4 mr-2" />
                Lanjutkan
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <StudentLayout>
      <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[80vh] max-w-3xl">
        {/* Bagian Judul dengan Animasi */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Bantuan Darurat</h2>
          <p className="text-gray-600 max-w-lg mx-auto">
            Tekan tombol darurat untuk mengirim peringatan darurat dengan lokasi Anda ke keamanan kampus.
          </p>
        </motion.div>

        {/* Pesan Kesalahan Lokasi dengan Animasi */}
        <AnimatePresence>
          {locationError && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
            >
              <div className="flex items-start">
                <AlertOctagon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p>{locationError}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-2 text-sm underline hover:text-red-800 transition-colors"
                  >
                    Coba akses lokasi lagi
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tombol Darurat dengan Animasi */}
        <div className="w-full flex flex-col items-center mb-8">
          <AnimatePresence mode="wait">
            {isSending ? (
              <motion.div 
                key="sending"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="text-center"
              >
                <motion.div 
                  className="text-3xl font-bold text-red-600 mb-6"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  Mengirim peringatan dalam {countdown} detik
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancelPanic}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-full transition shadow-md"
                >
                  Batal
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                key="button"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative panic-button-container"
              >
                <motion.button
                  onClick={handlePanicButtonPress}
                  disabled={!location}
                  whileHover={location ? { scale: 1.05, boxShadow: "0 10px 25px -5px rgba(239,68,68,0.6)" } : {}}
                  whileTap={location ? { scale: 0.98 } : {}}
                  className={`w-56 h-56 md:w-64 md:h-64 rounded-full flex items-center justify-center ${
                    !location 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : isConfirming
                        ? 'bg-yellow-600 hover:bg-yellow-700'
                        : 'bg-red-600 hover:bg-red-700'
                  } text-white shadow-lg transition-all duration-300 panic-button`}
                >
                  <div className="flex flex-col items-center">
                    <motion.div 
                      animate={isConfirming ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ repeat: isConfirming ? Infinity : 0, duration: 1 }}
                      className="mb-3"
                    >
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                        <path d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM24 38.4C16.04 38.4 9.6 31.96 9.6 24C9.6 16.04 16.04 9.6 24 9.6C31.96 9.6 38.4 16.04 38.4 24C38.4 31.96 31.96 38.4 24 38.4Z" fill="white"/>
                        <path d="M24 14.4C22.56 14.4 21.4 15.56 21.4 17C21.4 18.44 22.56 19.6 24 19.6C25.44 19.6 26.6 18.44 26.6 17C26.6 15.56 25.44 14.4 24 14.4Z" fill="white"/>
                        <path d="M24 24C22.9 24 22 24.9 22 26V33.6C22 34.7 22.9 35.6 24 35.6C25.1 35.6 26 34.7 26 33.6V26C26 24.9 25.1 24 24 24Z" fill="white"/>
                      </svg>
                    </motion.div>
                    <span className="text-2xl font-bold">
                      {isConfirming ? "KONFIRMASI" : "DARURAT"}
                    </span>
                  </div>
                </motion.button>
                
                {/* Efek Animasi yang Ditingkatkan */}
                {!isConfirming && !isSending && location && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-red-500 opacity-20 animate-ping-slow"></div>
                    <div className="absolute inset-0 rounded-full bg-red-500 opacity-10 animate-ping-slower" style={{ animationDelay: "0.5s" }}></div>
                  </>
                )}
                
                {/* Animasi Konfirmasi yang Ditingkatkan */}
                {isConfirming && !isSending && (
                  <motion.div 
                    className="absolute inset-0 rounded-full bg-yellow-500 opacity-30"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  ></motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Kartu Kontak Darurat dengan Animasi */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-4 w-full max-w-lg mx-auto"
        >
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center justify-center mb-3">
              <Phone className="h-5 w-5 mr-2" />
              Kontak Darurat
            </h3>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-blue-100 p-4 rounded-lg text-center shadow-sm"
            >
              <p className="text-blue-800 font-semibold">Keamanan Kampus</p>
              <p className="text-3xl font-bold text-blue-900">112</p>
              <p className="text-sm text-blue-700 mt-1">Tersedia 24/7</p>
              <a 
                href="tel:112" 
                className="mt-3 inline-flex items-center text-blue-700 text-sm hover:text-blue-900"
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                Hubungi langsung
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Modal Syarat dan Ketentuan */}
      <TermsModal />

      {/* CSS Kustom untuk animasi */}
      <style jsx>{`
        @keyframes ping-slow {
          0% {
            transform: scale(0.95);
            opacity: 0.3;
          }
          50% {
            opacity: 0.1;
          }
          100% {
            transform: scale(1.05);
            opacity: 0;
          }
        }
        
        @keyframes ping-slower {
          0% {
            transform: scale(0.9);
            opacity: 0.2;
          }
          50% {
            opacity: 0.1;
          }
          100% {
            transform: scale(1.1);
            opacity: 0;
          }
        }
        
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-ping-slower {
          animation: ping-slower 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </StudentLayout>
  );
}