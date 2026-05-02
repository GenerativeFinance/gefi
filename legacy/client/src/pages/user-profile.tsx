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
    queryKey: userType === 'user' ? [`/api/users/${userId}/profile`] : [`/api/user-profile/${userType}/${userId}`],
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
      case 'user':
        return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-4xl mx-auto">
              <Card className="mb-6">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-6 mb-6">
                    {profileData?.profileImageUrl ? (
                      <img 
                        src={profileData.profileImageUrl} 
                        alt="Profile" 
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                        {profileData?.firstName?.[0] || 'U'}
                      </div>
                    )}
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {profileData?.firstName} {profileData?.lastName}
                      </h1>
                      <p className="text-gray-600 dark:text-gray-400">
                        {profileData?.email}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        User ID: {userId}
                      </p>
                    </div>
                  </div>
                  
                  {profileData?.profile?.bio && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-2">About</h2>
                      <p className="text-gray-700 dark:text-gray-300">{profileData.profile.bio}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profileData?.profile?.company && (
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Company</h3>
                        <p className="text-gray-700 dark:text-gray-300">{profileData.profile.company}</p>
                      </div>
                    )}
                    
                    {profileData?.profile?.location && (
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Location</h3>
                        <p className="text-gray-700 dark:text-gray-300">{profileData.profile.location}</p>
                      </div>
                    )}
                    
                    {profileData?.profile?.website && (
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Website</h3>
                        <a 
                          href={profileData.profile.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {profileData.profile.website}
                        </a>
                      </div>
                    )}
                    
                    {profileData?.profile?.joinedDate && (
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Member Since</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                          {new Date(profileData.profile.joinedDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {profileData?.skills && profileData.skills.length > 0 && (
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((skill: any, index: number) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                        >
                          {skill.name || skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {profileData?.experience && profileData.experience.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Experience</h2>
                    <div className="space-y-4">
                      {profileData.experience.map((exp: any, index: number) => (
                        <div key={index} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{exp.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400">{exp.company}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">{exp.duration}</p>
                          {exp.description && (
                            <p className="mt-2 text-gray-700 dark:text-gray-300">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        );
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