// src/lib/auth.ts
interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user?: {
    role: string;
    // other user properties
  };
}

// Function to check if the token is expired
export function isTokenExpired(): boolean {
  if (typeof window === 'undefined') return true;
  
  const expiresAt = localStorage.getItem("expires_at");
  if (!expiresAt) return true;
  
  return Date.now() > parseInt(expiresAt);
}

// Function to get the current user role
export function getUserRole(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem("user_role");
}

// Function to get a valid access token (refreshes if needed)
export async function getAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  
  // If token is still valid, return it
  if (!isTokenExpired()) {
    return localStorage.getItem("access_token");
  }
  
  // Try to refresh the token
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) {
    // No refresh token available, user needs to login again
    return null;
  }
  
  try {
    // Use our local API route instead of the external one
    const response = await fetch("/api/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    
    if (!response.ok) {
      // Refresh token is invalid or expired
      clearAuthTokens();
      return null;
    }
    
    const data: RefreshTokenResponse = await response.json();
    
    // Update tokens in storage
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    
    // Update expiration time
    const expiresAt = Date.now() + data.expires_in * 1000;
    localStorage.setItem("expires_at", expiresAt.toString());
    
    // Store user role if available
    if (data.user && data.user.role) {
      localStorage.setItem("user_role", data.user.role);
    }
    
    return data.access_token;
  } catch (error) {
    console.error("Error refreshing token:", error);
    clearAuthTokens();
    return null;
  }
}

// Function to clear all auth tokens (for logout)
export function clearAuthTokens(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("expires_at");
  localStorage.removeItem("user_role");
  localStorage.removeItem("user_data");
}

// Function to store user data
export function storeUserData(userData: any): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem("user_data", JSON.stringify(userData));
}

// Function to get user data
export function getUserData(): any {
  if (typeof window === 'undefined') return null;
  
  const userData = localStorage.getItem("user_data");
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
}

// Function to check if user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  return !!localStorage.getItem("access_token");
}