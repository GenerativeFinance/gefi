import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  User, MapPin, Globe, Github, Linkedin, Mail, Calendar, 
  Trophy, Target, TrendingUp, Clock, Star, Award, 
  BarChart3, DollarSign, CheckCircle, Users
} from "lucide-react";
import type { UserProfile, UserAchievement, UserSkillRating, Bounty, BountySubmission } from "@shared/schema";

interface UserDetailProps {
  userId?: string;
}

interface UserWithProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  profile?: UserProfile;
  achievements: UserAchievement[];
  skillRatings: UserSkillRating[];
  bounties: Bounty[];
  submissions: BountySubmission[];
}

const mockUserProfile: UserWithProfile = {
  id: "user_123",
  email: "alex.dev@example.com",
  firstName: "Alex",
  lastName: "Johnson",
  profileImageUrl: "/api/placeholder/120/120",
  profile: {
    id: 1,
    userId: "user_123",
    displayName: "AlexDevPro",
    bio: "Full-stack developer passionate about fintech and AI. Specialized in building scalable financial models and risk management systems.",
    location: "San Francisco, CA",
    website: "https://alexdev.pro",
    githubUsername: "alexdevpro",
    linkedinUrl: "https://linkedin.com/in/alexjohnson",
    skills: ["Python", "TypeScript", "React", "Node.js", "PostgreSQL", "Machine Learning", "Financial Modeling"],
    specializations: ["Portfolio Optimization", "Risk Management", "Algorithmic Trading"],
    yearsExperience: 8,
    totalBountiesCompleted: 15,
    totalRewardsEarned: 12500,
    averageCompletionTime: 7,
    successRate: "85.50",
    reputationScore: 2847,
    globalRank: 23,
    categoryRanks: {
      "Portfolio Management": 8,
      "Risk Management": 15,
      "Market Analysis": 31
    },
    activeDays: 127,
    streakDays: 12,
    lastActiveAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  achievements: [
    {
      id: 1,
      userId: "user_123",
      achievementType: "bounty_streak",
      title: "Streak Master",
      description: "Complete 10 bounties in a row",
      iconName: "Target",
      rarity: "epic",
      pointsAwarded: 500,
      unlockedAt: new Date("2025-06-15"),
    },
    {
      id: 2,
      userId: "user_123",
      achievementType: "high_earner",
      title: "Top Earner",
      description: "Earn over $10,000 in bounty rewards",
      iconName: "DollarSign",
      rarity: "legendary",
      pointsAwarded: 1000,
      unlockedAt: new Date("2025-06-20"),
    }
  ],
  skillRatings: [
    { id: 1, userId: "user_123", skill: "Python", rating: "4.8", endorsements: 23, lastUpdated: new Date() },
    { id: 2, userId: "user_123", skill: "Machine Learning", rating: "4.6", endorsements: 18, lastUpdated: new Date() },
    { id: 3, userId: "user_123", skill: "Financial Modeling", rating: "4.9", endorsements: 31, lastUpdated: new Date() },
    { id: 4, userId: "user_123", skill: "Risk Management", rating: "4.7", endorsements: 15, lastUpdated: new Date() },
  ],
  bounties: [],
  submissions: []
};

export default function UserDetail() {
  const [match, params] = useRoute("/user/:userId");
  const userId = params?.userId;
  const [selectedTab, setSelectedTab] = useState("overview");

  const { data: user, isLoading } = useQuery<UserWithProfile>({
    queryKey: [`/api/users/${userId}/profile`],
    enabled: !!userId,
    // Mock data for now
    queryFn: () => Promise.resolve(mockUserProfile),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <div className="h-64 bg-muted rounded"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
              <div className="lg:col-span-2 space-y-4">
                <div className="h-96 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card>
            <CardContent className="text-center py-12">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">User not found</h3>
              <p className="text-muted-foreground">The user profile you're looking for doesn't exist.</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const profile = user.profile;
  const categoryRanks = typeof profile?.categoryRanks === 'object' ? profile.categoryRanks as Record<string, number> : {};

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MobileNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <img
                src={user.profileImageUrl}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-lg text-muted-foreground">@{profile?.displayName}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                      <Trophy className="h-3 w-3 mr-1" />
                      Rank #{profile?.globalRank}
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      <Star className="h-3 w-3 mr-1" />
                      {profile?.reputationScore} reputation
                    </Badge>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-1" />
                    Contact
                  </Button>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-1" />
                    Follow
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile?.bio && (
                  <p className="text-sm text-muted-foreground">{profile.bio}</p>
                )}
                
                <div className="space-y-3">
                  {profile?.location && (
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      {profile.location}
                    </div>
                  )}
                  
                  {profile?.website && (
                    <div className="flex items-center text-sm">
                      <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" 
                         className="text-primary hover:underline truncate">
                        {profile.website}
                      </a>
                    </div>
                  )}
                  
                  {profile?.githubUsername && (
                    <div className="flex items-center text-sm">
                      <Github className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={`https://github.com/${profile.githubUsername}`} target="_blank" rel="noopener noreferrer"
                         className="text-primary hover:underline">
                        {profile.githubUsername}
                      </a>
                    </div>
                  )}
                  
                  {profile?.linkedinUrl && (
                    <div className="flex items-center text-sm">
                      <Linkedin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer"
                         className="text-primary hover:underline">
                        LinkedIn
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    {profile?.yearsExperience} years experience
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skills & Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.skillRatings.map((skill) => (
                    <div key={skill.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{skill.skill}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">{skill.rating}/5.0</span>
                          <Badge variant="secondary" className="text-xs">
                            {skill.endorsements} endorsements
                          </Badge>
                        </div>
                      </div>
                      <Progress value={parseFloat(skill.rating) * 20} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {user.achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                      <div className={`p-2 rounded-full ${
                        achievement.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-600' :
                        achievement.rarity === 'epic' ? 'bg-purple-500/20 text-purple-600' :
                        achievement.rarity === 'rare' ? 'bg-blue-500/20 text-blue-600' :
                        'bg-gray-500/20 text-gray-600'
                      }`}>
                        {achievement.iconName === 'Target' && <Target className="h-4 w-4" />}
                        {achievement.iconName === 'DollarSign' && <DollarSign className="h-4 w-4" />}
                        {achievement.iconName === 'Trophy' && <Trophy className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{achievement.title}</p>
                          <Badge variant="outline" className="text-xs capitalize">
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                        <p className="text-xs text-muted-foreground">
                          +{achievement.pointsAwarded} points
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="bounties">Bounties</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="rankings">Rankings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Performance Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary">{profile?.totalBountiesCompleted}</div>
                      <div className="text-sm text-muted-foreground">Bounties Completed</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">${profile?.totalRewardsEarned?.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Earnings</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{profile?.successRate}%</div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">{profile?.averageCompletionTime}d</div>
                      <div className="text-sm text-muted-foreground">Avg. Completion</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Specializations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Specializations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile?.specializations?.map((spec, index) => (
                        <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Activity Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Activity Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Active Days</span>
                          <span className="text-sm text-muted-foreground">{profile?.activeDays} days</span>
                        </div>
                        <Progress value={(profile?.activeDays || 0) / 365 * 100} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Current Streak</span>
                          <span className="text-sm text-muted-foreground">{profile?.streakDays} days</span>
                        </div>
                        <Progress value={(profile?.streakDays || 0) / 30 * 100} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bounties" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Bounty History</CardTitle>
                    <CardDescription>
                      Track of completed bounties and ongoing submissions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Bounty history will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Recent actions and contributions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Activity timeline will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rankings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Category Rankings</CardTitle>
                    <CardDescription>
                      Performance rankings across different categories
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(categoryRanks).map(([category, rank]) => (
                        <div key={category} className="flex justify-between items-center p-4 rounded-lg bg-muted/50">
                          <div>
                            <div className="font-medium">{category}</div>
                            <div className="text-sm text-muted-foreground">Category ranking</div>
                          </div>
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            #{rank}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}