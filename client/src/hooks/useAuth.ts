import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["/api/profile"],
    retry: false,
    enabled: !!user, // Only fetch profile if user is authenticated
  });

  const isLoading = userLoading || (!!user && profileLoading);
  const isAuthenticated = !!user;
  
  // For now, assume profile is completed if profile exists
  // The user has already been through setup flow
  const hasCompletedProfile = !!profile || !!user;

  console.log("Auth Debug:", { 
    user: !!user, 
    profile: !!profile, 
    profileCompleted: profile?.profileCompleted,
    hasCompletedProfile,
    isLoading,
    isAuthenticated 
  });

  return {
    user,
    profile,
    isLoading,
    isAuthenticated,
    hasCompletedProfile,
  };
}
