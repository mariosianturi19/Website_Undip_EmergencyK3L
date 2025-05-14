// src/app/student/page.tsx (Panic Button)
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AlertOctagon, Phone } from "lucide-react";
import StudentLayout from "@/components/layouts/StudentLayout";
import { Card, CardContent } from "@/components/ui/card";
import { getUserData } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";

export default function PanicButtonPage() {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const userData = getUserData();

  // Get user's location when component mounts
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
          console.error('Error getting location:', error);
          setLocationError('Unable to access your location. Please enable location services.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  }, []);

  const handlePanicButtonPress = () => {
    if (!location) {
      toast.error("Location access is required", {
        description: "Please enable location services and try again."
      });
      return;
    }

    if (!isConfirming) {
      setIsConfirming(true);
      // Auto-reset confirmation state after 3 seconds if not clicked
      setTimeout(() => {
        if (isConfirming) setIsConfirming(false);
      }, 3000);
      return;
    }

    setIsSending(true);
    setIsConfirming(false);
    setCountdown(5);

    // Start countdown
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          // Simulate API call for sending emergency alert
          setTimeout(() => {
            setIsSending(false);
            toast.success("Emergency alert sent", {
              description: "Emergency services have been notified of your location.",
              duration: 5000,
            });
          }, 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCancelPanic = () => {
    setIsConfirming(false);
    setIsSending(false);
    setCountdown(5);
  };

  // Get initial for profile
  const getInitial = (name: string | undefined) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <StudentLayout>
      {/* Profile Card - Improved with animation */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-20 right-4 z-10 md:right-8 lg:right-12 max-w-xs w-full sm:w-auto"
      >
        <Card className="shadow-md border-gray-200 overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mr-4 shadow-sm">
                <span className="text-xl font-semibold text-white">
                  {getInitial(userData?.name)}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{userData?.name || "Student Name"}</h3>
                <p className="text-sm text-gray-600">{userData?.nim || "No NIM"}</p>
                <p className="text-sm text-gray-600">{userData?.jurusan || "No Department"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[80vh] max-w-3xl">
        {/* Title Section with Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Emergency Assistance</h2>
          <p className="text-gray-600 max-w-lg mx-auto">
            Press the panic button to send an emergency alert with your location to campus security.
          </p>
        </motion.div>

        {/* Location Error Message with Animation */}
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
                    Retry location access
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Panic Button with Animation */}
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
                  Sending alert in {countdown} seconds
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancelPanic}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-full transition shadow-md"
                >
                  Cancel
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
                      {isConfirming ? "CONFIRM" : "PANIC"}
                    </span>
                  </div>
                </motion.button>
                
                {/* Enhanced Animation Effects */}
                {!isConfirming && !isSending && location && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-red-500 opacity-20 animate-ping-slow"></div>
                    <div className="absolute inset-0 rounded-full bg-red-500 opacity-10 animate-ping-slower" style={{ animationDelay: "0.5s" }}></div>
                  </>
                )}
                
                {/* Improved Confirmation Animation */}
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

        {/* Emergency Contact Card with Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 w-full max-w-lg mx-auto"
        >
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center justify-center mb-3">
              <Phone className="h-5 w-5 mr-2" />
              Emergency Contact
            </h3>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-blue-100 p-4 rounded-lg text-center shadow-sm"
            >
              <p className="text-blue-800 font-semibold">Campus Security</p>
              <p className="text-3xl font-bold text-blue-900">112</p>
              <p className="text-sm text-blue-700 mt-1">Available 24/7</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Custom CSS for animations */}
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