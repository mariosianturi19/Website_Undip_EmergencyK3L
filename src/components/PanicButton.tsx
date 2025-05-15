// src/components/PanicButton.tsx
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { AlertCircle, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PanicButtonTerms from "./PanicButtonTerms";

interface LocationData {
  lat: number;
  lng: number;
}

const PanicButton: React.FC = () => {
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState<boolean>(false);
  const [location, setLocation] = useState<LocationData | null>(null);

  // Get user location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error("Tidak dapat mengakses lokasi");
        }
      );
    } else {
      toast.error("Browser tidak mendukung geolokasi");
    }
  }, []);

  const handlePanicButtonPress = () => {
    if (!location) {
      toast.error("Aktifkan layanan lokasi");
      return;
    }

    if (!isConfirming) {
      setIsConfirming(true);
      // Reset after 3 seconds if not confirmed
      setTimeout(() => {
        if (isConfirming) setIsConfirming(false);
      }, 3000);
      return;
    }

    // Show terms modal
    setIsTermsModalOpen(true);
  };

  const handleAcceptTerms = () => {
    setIsTermsModalOpen(false);
    setIsConfirming(false);
    sendEmergencyAlert();
  };

  const sendEmergencyAlert = async () => {
    try {
      // Mock API call
      toast.success("Peringatan darurat terkirim", {
        description: "Bantuan sedang dalam perjalanan"
      });
    } catch (error) {
      toast.error("Gagal mengirim peringatan");
    }
  };

  const handleCloseTermsModal = () => {
    setIsTermsModalOpen(false);
    setIsConfirming(false);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Main Button */}
        <motion.button
          onClick={handlePanicButtonPress}
          disabled={!location}
          whileHover={location ? { scale: 1.03 } : {}}
          whileTap={location ? { scale: 0.97 } : {}}
          className={`relative z-10 w-44 h-44 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
            !location 
              ? 'bg-gray-400 cursor-not-allowed' 
              : isConfirming
                ? 'bg-amber-600'
                : 'bg-red-600'
          }`}
        >
          <div className="flex flex-col items-center">
            <motion.div 
              animate={isConfirming ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: isConfirming ? Infinity : 0, duration: 1 }}
            >
              <AlertCircle className="h-10 w-10 mb-2" />
            </motion.div>
            <span className="text-xl tracking-wide">
              {isConfirming ? "KONFIRMASI" : "DARURAT"}
            </span>
            {isConfirming && (
              <span className="text-xs mt-1 bg-amber-700/50 px-2 py-0.5 rounded-full">
                Tekan untuk lanjut
              </span>
            )}
          </div>
        </motion.button>
        
        {/* Pulse Animation */}
        {!isConfirming && location && (
          <>
            <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full bg-red-500 opacity-25 animate-ping-slow -z-10"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full bg-red-500 opacity-15 animate-ping-slower -z-20"></div>
          </>
        )}
        
        {/* Confirm Animation */}
        {isConfirming && (
          <motion.div 
            initial={{ opacity: 0.2 }}
            animate={{ 
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.05, 1]
            }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute top-0 left-0 right-0 bottom-0 rounded-full bg-amber-500 -z-10"
          />
        )}
      </div>
      
      {/* Location Status */}
      {!location && (
        <div className="mt-3 text-sm text-gray-600 animate-pulse">
          Mengaktifkan lokasi...
        </div>
      )}

      {/* Terms Modal */}
      <PanicButtonTerms 
        isOpen={isTermsModalOpen}
        onAccept={handleAcceptTerms}
        onClose={handleCloseTermsModal}
      />

      <style jsx>{`
        @keyframes ping-slow {
          0% { transform: scale(0.95); opacity: 0.25; }
          50% { opacity: 0.15; }
          100% { transform: scale(1.05); opacity: 0; }
        }
        
        @keyframes ping-slower {
          0% { transform: scale(0.9); opacity: 0.15; }
          50% { opacity: 0.1; }
          100% { transform: scale(1.1); opacity: 0; }
        }
        
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-ping-slower {
          animation: ping-slower 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default PanicButton;