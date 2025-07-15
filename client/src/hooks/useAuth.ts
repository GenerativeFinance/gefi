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
  
  // Assume profile is completed if user is authenticated
  const hasCompletedProfile = !!profile || !!user;

  return {
    user,
    profile,
    isLoading,
    isAuthenticated,
    hasCompletedProfile,
  };
}
