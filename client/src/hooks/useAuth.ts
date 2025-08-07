import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      const res = await fetch("/api/auth/user", {
        credentials: "include",
      });
      
      if (res.status === 401) {
        return null; // User is not authenticated
      }
      
      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }
      
      return res.json();
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["/api/profile"],
    queryFn: async () => {
      const res = await fetch("/api/profile", {
        credentials: "include",
      });
      
      if (res.status === 401) {
        return null;
      }
      
      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }
      
      return res.json();
    },
    retry: false,
    enabled: !!user, // Only fetch profile if user is authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Only show loading for initial user auth check
  const isLoading = userLoading;
  const isAuthenticated = !!user && !userError;
  
  // Profile is optional - don't block app loading on it
  const hasCompletedProfile = !!profile;

  return {
    user,
    profile,
    isLoading,
    isAuthenticated,
    hasCompletedProfile,
  };
}
