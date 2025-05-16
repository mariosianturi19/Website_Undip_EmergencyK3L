// src/app/student/emergency/page.tsx
"use client";

import React from "react";
import PanicButton from "@/components/PanicButton";
import { motion } from "framer-motion";
import { Phone, AlertCircle, Info } from "lucide-react";

export default function EmergencyPage() {
  return (
    <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[80vh] max-w-3xl py-8">
      {/* Bagian Judul dengan Animasi */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full text-center mb-10"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Bantuan Darurat</h2>
        <p className="text-gray-600 max-w-lg mx-auto">
          Tekan tombol darurat untuk mengirim peringatan darurat dengan lokasi Anda ke keamanan kampus.
        </p>
      </motion.div>

      {/* Important Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-lg mx-auto mb-8"
      >
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg flex">
          <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5 mr-3" />
          <div>
            <h3 className="font-medium text-yellow-800">Penting</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Tombol ini hanya untuk keadaan darurat yang sebenarnya. Penyalahgunaan dapat dikenakan sanksi sesuai peraturan universitas dan hukum yang berlaku.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tombol Darurat */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="w-full flex flex-col items-center mb-10"
      >
        <PanicButton />
      </motion.div>

      {/* Kartu Kontak Darurat dengan Animasi */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="w-full max-w-lg mx-auto"
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
            <p className="text-3xl font-bold text-blue-900">14001</p>
            <p className="text-sm text-blue-700 mt-1">Tersedia 24/7</p>
            <a 
              href="tel:14001" 
              className="mt-3 inline-flex items-center text-blue-700 text-sm hover:text-blue-900 font-medium"
            >
              <Phone className="h-3.5 w-3.5 mr-1" />
              Hubungi langsung
            </a>
          </motion.div>
        </div>
        
        {/* Information Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <div className="flex items-center justify-center text-sm text-gray-500">
            <Info className="h-4 w-4 mr-2 text-gray-400" />
            <p>Lokasi Anda hanya dibagikan saat tombol darurat digunakan</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}