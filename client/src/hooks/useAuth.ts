/**
 * Authentication Hook
 * 
 * Provides centralized authentication state management using React Query.
 * Handles user authentication, profile data, and loading states efficiently.
 * 
 * Features:
 * - Automatic authentication state detection
 * - User profile data fetching
 * - Optimized loading states
 * - Error handling for 401 responses
 * - Caching with stale-while-revalidate pattern
 */

import { useQuery } from "@tanstack/react-query";

// Types
interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  provider: string;
  role?: string;
  subscriptionTier?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  location?: string;
  website?: string;
  experience?: string;
  skills?: string[];
  // Add other profile fields as needed
}

interface AuthHookReturn {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasCompletedProfile: boolean;
}

// Configuration constants
const AUTH_CACHE_TIME = 5 * 60 * 1000; // 5 minutes
const PROFILE_CACHE_TIME = 10 * 60 * 1000; // 10 minutes

/**
 * Creates an optimized fetch function for authentication endpoints
 * 
 * @param endpoint - API endpoint to fetch from
 * @param returnNullOn401 - Whether to return null on 401 status
 * @returns Promise with response data or null
 */
function createAuthFetcher(endpoint: string, returnNullOn401 = true) {
  return async (): Promise<any> => {
    try {
      const response = await fetch(endpoint, {
        credentials: "include",
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      // Handle unauthorized responses gracefully
      if (response.status === 401) {
        return returnNullOn401 ? null : Promise.reject(new Error('Unauthorized'));
      }

      // Handle other errors
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      // Log error for debugging but don't throw to prevent UI crashes
      console.warn(`Auth fetch error for ${endpoint}:`, error);
      throw error;
    }
  };
}

/**
 * Custom hook for authentication state management
 * 
 * @returns AuthHookReturn object with authentication state and data
 */
export function useAuth(): AuthHookReturn {
  // Fetch user authentication status
  const { 
    data: user, 
    isLoading: userLoading, 
    error: userError,
    isError: userHasError
  } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: createAuthFetcher("/api/auth/user", true),
    retry: false,
    staleTime: AUTH_CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  // Fetch user profile data (only if authenticated)
  const { 
    data: profile, 
    isLoading: profileLoading 
  } = useQuery({
    queryKey: ["/api/profile"],
    queryFn: createAuthFetcher("/api/profile", true),
    retry: false,
    enabled: !!user && !userHasError, // Only fetch if user is authenticated
    staleTime: PROFILE_CACHE_TIME,
    refetchOnWindowFocus: false,
  });

  // Compute derived state
  const isAuthenticated = !!user && !userError && !userHasError;
  const isLoading = userLoading; // Only show loading for initial auth check
  const hasCompletedProfile = !!profile && isProfileComplete(profile);

  return {
    user: user || null,
    profile: profile || null,
    isLoading,
    isAuthenticated,
    hasCompletedProfile,
  };
}

/**
 * Checks if user profile is considered complete
 * 
 * @param profile - User profile object
 * @returns boolean indicating if profile is complete
 */
function isProfileComplete(profile: UserProfile | null): boolean {
  if (!profile) return false;
  
  // Define minimum required fields for a complete profile
  const requiredFields = ['bio', 'location'] as const;
  
  return requiredFields.every(field => {
    const value = profile[field];
    return value && value.trim().length > 0;
  });
}

/**
 * Hook for checking authentication status without fetching user data
 * Useful for components that only need to know if user is logged in
 * 
 * @returns boolean indicating authentication status
 */
export function useIsAuthenticated(): boolean {
  const { data: user, isError } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: createAuthFetcher("/api/auth/user", true),
    retry: false,
    staleTime: AUTH_CACHE_TIME,
  });

  return !!user && !isError;
}

/**
 * Hook for user data only (without profile)
 * Useful for components that only need basic user information
 * 
 * @returns User object or null
 */
export function useUser(): User | null {
  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: createAuthFetcher("/api/auth/user", true),
    retry: false,
    staleTime: AUTH_CACHE_TIME,
  });

  return user || null;
}

// Re-export types for external use
export type { User, UserProfile, AuthHookReturn };