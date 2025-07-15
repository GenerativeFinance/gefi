import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import DeveloperProfile from "@/components/profile/DeveloperProfile";
import InvestorProfile from "@/components/profile/InvestorProfile";
import DataProviderProfile from "@/components/profile/DataProviderProfile";
import AdminProfile from "@/components/profile/AdminProfile";
import ModeratorProfile from "@/components/profile/ModeratorProfile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

export default function UserProfile() {
  const { userType, userId } = useParams<{ userType: string; userId: string }>();

  const { data: profileData, isLoading, error } = useQuery({
    queryKey: [`/api/user-profile/${userType}/${userId}`],
    enabled: !!userType && !!userId,
    retry: false,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !userType || !userId) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                User Not Found
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                The user profile you're looking for doesn't exist.
              </p>
              <Link href="/">
                <Button className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const renderProfile = () => {
    switch (userType) {
      case 'developer':
        return <DeveloperProfile developerId={userId} data={profileData} />;
      case 'investor':
        return <InvestorProfile investorId={userId} data={profileData} />;
      case 'data-provider':
        return <DataProviderProfile providerId={userId} data={profileData} />;
      case 'admin':
        return <AdminProfile adminId={userId} data={profileData} />;
      case 'moderator':
        return <ModeratorProfile moderatorId={userId} data={profileData} />;
      default:
        return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
            <Card className="max-w-md w-full">
              <CardContent className="p-8 text-center">
                <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Invalid Profile Type
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  The profile type "{userType}" is not supported.
                </p>
                <Link href="/">
                  <Button className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Back Home
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <Layout>
      {renderProfile()}
    </Layout>
  );
}