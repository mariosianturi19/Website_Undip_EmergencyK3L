// src/components/volunteers/VolunteerForm.tsx
"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAccessToken } from "@/lib/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

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

interface VolunteerFormProps {
  mode: "create" | "edit";
  volunteer: Volunteer | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

// Update the form schema to include password
const volunteerFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  nik: z.string().min(16, "NIK must be at least 16 digits").max(16, "NIK must be 16 digits"),
  no_telp: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  // Only require password confirmation for new volunteers
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Create a separate schema for edit mode without password requirements
const editVolunteerFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  nik: z.string().min(16, "NIK must be at least 16 digits").max(16, "NIK must be 16 digits"),
  no_telp: z.string().min(10, "Phone number must be at least 10 digits"),
});

type VolunteerFormValues = z.infer<typeof volunteerFormSchema>;
type EditVolunteerFormValues = z.infer<typeof editVolunteerFormSchema>;

export default function VolunteerForm({
  mode,
  volunteer,
  isOpen,
  onClose,
  onSave,
}: VolunteerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Use different resolver based on mode
  const formSchema = mode === "create" ? volunteerFormSchema : editVolunteerFormSchema;

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: volunteer?.name || "",
      email: volunteer?.email || "",
      nik: volunteer?.nik || "",
      no_telp: volunteer?.no_telp || "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Get access token
      const token = await getAccessToken();
      
      if (!token) {
        throw new Error("Authentication required");
      }

      // Add the role field for new volunteers
      const formData = {
        ...data,
        role: "relawan" // Always set this role
      };

      // Remove confirmPassword as the API doesn't need it
      if (formData.confirmPassword) {
        delete formData.confirmPassword;
      }

      let response;
      
      if (mode === "create") {
        response = await fetch("/api/volunteers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      } else {
        // For edit mode, we might not want to send the password if it's empty
        if (!formData.password) {
          delete formData.password;
        }
        
        response = await fetch(`/api/volunteers/${volunteer?.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save volunteer");
      }

      onSave();
    } catch (error) {
      console.error("Error saving volunteer:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Volunteer" : "Edit Volunteer"}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nik"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIK (National Identity Number)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="1234567890123456" 
                      maxLength={16}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="no_telp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="08123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mode === "create" && (
              <>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••" 
                            {...field} 
                          />
                        </FormControl>
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-700 transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••" 
                            {...field} 
                          />
                        </FormControl>
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-700 transition-colors"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>Save</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}