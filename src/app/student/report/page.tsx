// src/app/student/report/page.tsx
"use client";

import { useState, useRef, FormEvent, useEffect } from "react";
import { toast } from "sonner";
import { Camera, Upload, X, Check, Image as ImageIcon, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StudentLayout from "@/components/layouts/StudentLayout";
import { getAccessToken, isAuthenticated } from "@/lib/auth";
import { useRouter } from "next/navigation";

// Opsi jenis masalah
const reportTypeOptions = [
  { value: "electrical", label: "Electrical Issues" },
  { value: "tree", label: "Tree Hazard" },
  { value: "stairs", label: "Stairway Issues" },
  { value: "elevator", label: "Elevator Problems" },
  { value: "door", label: "Door Issues" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "water_supply", label: "Water Supply" },
  { value: "waste_management", label: "Waste Management" },
  { value: "public_safety", label: "Public Safety" },
  { value: "public_health", label: "Public Health" },
  { value: "environmental", label: "Environmental" },
  { value: "other", label: "Other" }
];

export default function ReportPhotoPage() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [reportType, setReportType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Check authentication when the component mounts
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error("You must be logged in to submit reports");
      router.push("/login");
    }
  }, [router]);

  // Function to handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to handle camera access
  const handleCameraAccess = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to clear selected image
  const handleClearImage = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!selectedFile) {
      toast.error("Please upload an image for your report");
      return;
    }
    
    if (!reportType) {
      toast.error("Please select a report type");
      return;
    }
    
    if (!description || description.trim().length < 10) {
      toast.error("Please provide a detailed description (at least 10 characters)");
      return;
    }
    
    if (!location || location.trim().length < 3) {
      toast.error("Please provide a valid location");
      return;
    }

    // Check if authenticated before submission
    if (!isAuthenticated()) {
      toast.error("Your session has expired. Please login again.");
      router.push("/login");
      return;
    }
    
    // Submit form
    setIsSubmitting(true);
    
    try {
      // Get fresh token before submitting
      const token = await getAccessToken();
      
      if (!token) {
        throw new Error("Authentication required. Please login again.");
      }

      // STEP 1: Upload foto terlebih dahulu
      console.log("Uploading photo...");
      
      const photoFormData = new FormData();
      photoFormData.append('photo', selectedFile);
      
      const photoResponse = await fetch('/api/upload-photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: photoFormData
      });
      
      if (!photoResponse.ok) {
        const errorData = await photoResponse.json();
        throw new Error(errorData.message || `Photo upload failed with status ${photoResponse.status}`);
      }
      
      const photoData = await photoResponse.json();
      console.log("Photo upload response:", photoData);
      
      if (!photoData.success || !photoData.photo_path) {
        throw new Error("Failed to get photo path from server");
      }
      
      // STEP 2: Kirim laporan dengan photo_path yang didapat
      console.log("Submitting report with photo path:", photoData.photo_path);
      
      const reportData = {
        photo_path: photoData.photo_path,
        location: location,
        problem_type: reportType,
        description: description
      };
      
      const reportResponse = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData)
      });
      
      if (!reportResponse.ok) {
        const errorData = await reportResponse.json();
        throw new Error(errorData.message || `Report submission failed with status ${reportResponse.status}`);
      }
      
      const reportResult = await reportResponse.json();
      console.log("Report submission response:", reportResult);

      toast.success("Report submitted successfully", {
        description: "Your report has been sent and will be reviewed shortly.",
      });
      
      // Reset form
      setPreviewImage(null);
      setSelectedFile(null);
      setReportType("");
      setDescription("");
      setLocation("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      // Redirect to student page or reports page
      router.push("/student");
    } catch (error) {
      console.error("Error submitting report:", error);
      
      // Handle authentication errors specifically
      if (error instanceof Error && error.message.includes("Authentication required")) {
        toast.error("Your session has expired", {
          description: "Please login again to continue.",
        });
        router.push("/login");
      } else {
        toast.error("Failed to submit report", {
          description: error instanceof Error ? error.message : "An unexpected error occurred",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StudentLayout>
      <div className="container mx-auto p-4 max-w-lg">
        <div className="my-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Report an Issue</h1>
          <p className="text-gray-600 mb-6">
            Upload a photo and details about the issue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label htmlFor="photo">Photo Evidence</Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              {previewImage ? (
                <div className="w-full space-y-2">
                  <div className="relative w-full aspect-video overflow-hidden rounded-lg">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="w-full h-full object-contain" 
                    />
                    <button
                      type="button"
                      onClick={handleClearImage}
                      className="absolute top-2 right-2 bg-black/60 p-1 rounded-full text-white hover:bg-black/80 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>

            <div className="flex space-x-2 mt-2">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </div>
          </div>

          {/* Report Type Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="report-type">Report Type</Label>
            <Select
              id="report-type"
              value={reportType}
              onValueChange={setReportType}
              placeholder="Select type of issue"
              options={reportTypeOptions}
            />
          </div>

          {/* Location Input */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                id="location"
                placeholder="Building/Floor/Room or specific area"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-gray-500">
              Be as specific as possible about the location of the issue
            </p>
          </div>

          {/* Description Textarea */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Please provide details about the issue..."
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              Be specific about the severity and any potential safety concerns.
            </p>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full py-6 text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <Check className="h-5 w-5 mr-2" />
                Submit Report
              </>
            )}
          </Button>
        </form>
      </div>
    </StudentLayout>
  );
}