// src/components/volunteers/DeleteVolunteerDialog.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AlertCircle, Loader2 } from "lucide-react";
import { getAccessToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Update the interface to match the actual API response
interface Volunteer {
  id: number;
  name: string;
  email: string;
  role: string;
  nik: string;
  no_telp: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

interface DeleteVolunteerDialogProps {
  volunteer: Volunteer;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteVolunteerDialog({
  volunteer,
  isOpen,
  onClose,
  onDelete,
}: DeleteVolunteerDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      // Get access token
      const token = await getAccessToken();
      
      if (!token) {
        throw new Error("Authentication required");
      }

      // Use the updated API endpoint for deleting users
      const response = await fetch(`/api/volunteers/${volunteer.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete volunteer");
      }

      onDelete();
    } catch (error) {
      console.error("Error deleting volunteer:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
      toast.error("Failed to delete volunteer");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the volunteer account for <strong>{volunteer.name}</strong> ({volunteer.email}).
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>Delete</>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}