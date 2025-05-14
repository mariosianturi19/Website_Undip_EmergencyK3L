// src/components/volunteers/VolunteerManagement.tsx (updated styling)
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, UserPlus, Loader2, RefreshCw, Search, Filter } from "lucide-react";
import { getAccessToken } from "@/lib/auth";
import VolunteerForm from "./VolunteerForm";
import DeleteVolunteerDialog from "./DeleteVolunteerDialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export default function VolunteerManagement() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchVolunteers = async () => {
    try {
      // Get the access token
      const token = await getAccessToken();
      
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch("/api/volunteers", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch volunteers");
      }
      
      const data = await response.json();
      console.log("Volunteers data:", data);
      
      // Handle the data based on the API response structure
      const volunteersData = Array.isArray(data) ? data : data.data || [];
      setVolunteers(volunteersData);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
      toast.error("Failed to load volunteers");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchVolunteers();
  };

  const handleCreateVolunteer = () => {
    setFormMode('create');
    setSelectedVolunteer(null);
    setIsFormOpen(true);
  };

  const handleEditVolunteer = (volunteer: Volunteer) => {
    setFormMode('edit');
    setSelectedVolunteer(volunteer);
    setIsFormOpen(true);
  };

  const handleDeleteVolunteer = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsDeleteDialogOpen(true);
  };

  const onVolunteerSaved = () => {
    setIsFormOpen(false);
    fetchVolunteers();
    toast.success(
      formMode === 'create' 
        ? "Volunteer created successfully" 
        : "Volunteer updated successfully"
    );
  };

  const onVolunteerDeleted = () => {
    setIsDeleteDialogOpen(false);
    fetchVolunteers();
    toast.success("Volunteer deleted successfully");
  };

  // Filter volunteers based on search query
  const filteredVolunteers = volunteers.filter(volunteer => 
    volunteer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    volunteer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    volunteer.nik.includes(searchQuery) ||
    volunteer.no_telp.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Volunteer Management</h1>
        <Button onClick={handleCreateVolunteer} className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Volunteer
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Volunteers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search volunteers..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" className="shrink-0" onClick={handleRefresh} disabled={isRefreshing}>
                  {isRefreshing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  <span className="ml-2 hidden sm:inline">Refresh</span>
                </Button>
                <Button variant="outline" className="shrink-0">
                  <Filter className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">Filter</span>
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            ) : filteredVolunteers.length === 0 ? (
              <div className="text-center p-8 border rounded-lg bg-gray-50">
                {searchQuery ? (
                  <>
                    <p className="text-gray-500">No volunteers match your search</p>
                    <Button 
                      variant="link" 
                      onClick={() => setSearchQuery('')}
                      className="mt-2"
                    >
                      Clear search
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500">No volunteers found</p>
                    <Button 
                      variant="outline" 
                      onClick={handleCreateVolunteer}
                      className="mt-4"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add First Volunteer
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          NIK
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredVolunteers.map((volunteer) => (
                        <tr key={volunteer.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-medium">
                                  {volunteer.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{volunteer.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {volunteer.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {volunteer.nik}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {volunteer.no_telp}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleEditVolunteer(volunteer)}
                                className="text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteVolunteer(volunteer)}
                                className="text-red-600 hover:text-red-900 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isFormOpen && (
        <VolunteerForm 
          mode={formMode}
          volunteer={selectedVolunteer}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={onVolunteerSaved}
        />
      )}

      {isDeleteDialogOpen && selectedVolunteer && (
        <DeleteVolunteerDialog
          volunteer={selectedVolunteer}
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onDelete={onVolunteerDeleted}
        />
      )}
    </div>
  );
}