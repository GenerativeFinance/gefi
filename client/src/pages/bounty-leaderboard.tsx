import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Trophy, Target, DollarSign, Users, Star, TrendingUp, 
  Medal, Crown, Search, Filter, ChevronUp, ChevronDown,
  Award, Calendar, Clock
} from "lucide-react";

interface LeaderboardUser {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  totalBountiesCompleted: number;
  totalRewardsEarned: number;
  successRate: number;
  averageCompletionTime: number;
  reputationScore: number;
  globalRank: number;
  categoryRanks: Record<string, number>;
  streakDays: number;
  activeDays: number;
  specializations: string[];
}

interface LeaderboardStats {
  activeBounties: number;
  totalRewards: number;
  activeDevelopers: number;
  completedBounties: number;
}

const mockLeaderboardStats: LeaderboardStats = {
  activeBounties: 12,
  totalRewards: 8250,
  activeDevelopers: 47,
  completedBounties: 156
};

const mockLeaderboardUsers: LeaderboardUser[] = [
  {
    id: "user_1",
    displayName: "AlexDevPro",
    firstName: "Alex",
    lastName: "Johnson",
    profileImageUrl: "/api/placeholder/60/60",
    totalBountiesCompleted: 15,
    totalRewardsEarned: 12500,
    successRate: 85.5,
    averageCompletionTime: 7,
    reputationScore: 2847,
    globalRank: 1,
    categoryRanks: { "Portfolio Management": 1, "Risk Management": 3 },
    streakDays: 12,
    activeDays: 127,
    specializations: ["Portfolio Optimization", "Risk Management"]
  },
  {
    id: "user_2",
    displayName: "MLMaster",
    firstName: "Sarah",
    lastName: "Chen",
    profileImageUrl: "/api/placeholder/60/60",
    totalBountiesCompleted: 13,
    totalRewardsEarned: 10800,
    successRate: 92.3,
    averageCompletionTime: 5,
    reputationScore: 2654,
    globalRank: 2,
    categoryRanks: { "Market Analysis": 1, "Machine Learning": 1 },
    streakDays: 8,
    activeDays: 89,
    specializations: ["Machine Learning", "Market Analysis"]
  },
  {
    id: "user_3",
    displayName: "RiskGuru",
    firstName: "Michael",
    lastName: "Rodriguez",
    profileImageUrl: "/api/placeholder/60/60",
    totalBountiesCompleted: 11,
    totalRewardsEarned: 9200,
    successRate: 78.6,
    averageCompletionTime: 9,
    reputationScore: 2103,
    globalRank: 3,
    categoryRanks: { "Risk Management": 1, "Compliance": 2 },
    streakDays: 5,
    activeDays: 73,
    specializations: ["Risk Assessment", "Compliance"]
  },
  {
    id: "user_4",
    displayName: "DataWizard",
    firstName: "Emily",
    lastName: "Park",
    profileImageUrl: "/api/placeholder/60/60",
    totalBountiesCompleted: 9,
    totalRewardsEarned: 7500,
    successRate: 88.9,
    averageCompletionTime: 6,
    reputationScore: 1876,
    globalRank: 4,
    categoryRanks: { "Data Analysis": 1, "Machine Learning": 3 },
    streakDays: 3,
    activeDays: 56,
    specializations: ["Data Science", "Analytics"]
  },
  {
    id: "user_5",
    displayName: "CodeNinja",
    firstName: "David",
    lastName: "Kim",
    profileImageUrl: "/api/placeholder/60/60",
    totalBountiesCompleted: 8,
    totalRewardsEarned: 6800,
    successRate: 80.0,
    averageCompletionTime: 8,
    reputationScore: 1654,
    globalRank: 5,
    categoryRanks: { "Backend Development": 2, "API Design": 1 },
    streakDays: 0,
    activeDays: 42,
    specializations: ["Backend Development", "API Design"]
  }
];

export default function BountyLeaderboard() {
  const [match, params] = useRoute("/bounties/:category");
  const category = params?.category || "all";
  const [selectedTab, setSelectedTab] = useState("overall");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rank");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { data: stats, isLoading: statsLoading } = useQuery<LeaderboardStats>({
    queryKey: ["/api/bounties/stats"],
    // Mock data for now
    queryFn: () => Promise.resolve(mockLeaderboardStats),
  });

  const { data: users, isLoading: usersLoading } = useQuery<LeaderboardUser[]>({
    queryKey: ["/api/bounties/leaderboard", category, sortBy, sortOrder],
    // Mock data for now
    queryFn: () => Promise.resolve(mockLeaderboardUsers),
  });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const filteredUsers = users?.filter(user => 
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const isLoading = statsLoading || usersLoading;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MobileNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center">
              <Trophy className="h-8 w-8 mr-3 text-yellow-500" />
              Bounty Leaderboard
            </h1>
            <p className="text-muted-foreground">Top performers in the bounty program</p>
          </div>
          
          <Link href="/bounties">
            <Button variant="outline">
              <Target className="h-4 w-4 mr-2" />
              Back to Bounties
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Bounties</p>
                    <p className="text-2xl font-bold text-primary">{stats.activeBounties}</p>
                  </div>
                  <Target className="h-8 w-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Rewards</p>
                    <p className="text-2xl font-bold text-green-600">${stats.totalRewards.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600/20" />
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Developers</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.activeDevelopers}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600/20" />
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.completedBounties}</p>
                  </div>
                  <Award className="h-8 w-8 text-purple-600/20" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search developers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full sm:w-64"
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rank">Rank</SelectItem>
                <SelectItem value="bounties">Bounties</SelectItem>
                <SelectItem value="rewards">Rewards</SelectItem>
                <SelectItem value="success_rate">Success Rate</SelectItem>
                <SelectItem value="reputation">Reputation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="overall">Overall</TabsTrigger>
              <TabsTrigger value="monthly">This Month</TabsTrigger>
              <TabsTrigger value="weekly">This Week</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Top Developers
            </CardTitle>
            <CardDescription>
              Ranked by overall performance and contribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4 p-4">
                    <div className="w-12 h-12 bg-muted rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {/* Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
                  <div className="col-span-1">Rank</div>
                  <div className="col-span-4">Developer</div>
                  <div className="col-span-2 cursor-pointer flex items-center" onClick={() => handleSort('bounties')}>
                    Bounties
                    {sortBy === 'bounties' && (
                      sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                  <div className="col-span-2 cursor-pointer flex items-center" onClick={() => handleSort('rewards')}>
                    Rewards
                    {sortBy === 'rewards' && (
                      sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                  <div className="col-span-2 cursor-pointer flex items-center" onClick={() => handleSort('success_rate')}>
                    Success Rate
                    {sortBy === 'success_rate' && (
                      sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                  <div className="col-span-1 cursor-pointer flex items-center" onClick={() => handleSort('reputation')}>
                    Rep
                    {sortBy === 'reputation' && (
                      sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </div>

                {/* Leaderboard Items */}
                {filteredUsers.map((user, index) => (
                  <div key={user.id} className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-lg transition-colors hover:bg-muted/50 ${
                    user.globalRank <= 3 ? 'bg-gradient-to-r from-yellow-500/5 to-transparent border border-yellow-500/20' : ''
                  }`}>
                    {/* Mobile Layout */}
                    <div className="md:hidden space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8">
                          {getRankIcon(user.globalRank)}
                        </div>
                        <Link href={`/user/${user.id}`}>
                          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
                            <img
                              src={user.profileImageUrl}
                              alt={user.displayName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-medium">{user.firstName} {user.lastName}</div>
                              <div className="text-sm text-muted-foreground">@{user.displayName}</div>
                            </div>
                          </div>
                        </Link>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Bounties:</span>
                          <span className="font-medium ml-1">{user.totalBountiesCompleted}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Rewards:</span>
                          <span className="font-medium ml-1 text-green-600">${user.totalRewardsEarned.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Success:</span>
                          <span className="font-medium ml-1">{user.successRate}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Rep:</span>
                          <span className="font-medium ml-1">{user.reputationScore}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {user.specializations.slice(0, 2).map((spec, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:contents">
                      <div className="col-span-1 flex items-center justify-center">
                        {getRankIcon(user.globalRank)}
                      </div>
                      
                      <div className="col-span-4">
                        <Link href={`/user/${user.id}`}>
                          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
                            <img
                              src={user.profileImageUrl}
                              alt={user.displayName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-medium">{user.firstName} {user.lastName}</div>
                              <div className="text-sm text-muted-foreground">@{user.displayName}</div>
                              <div className="flex gap-1 mt-1">
                                {user.specializations.slice(0, 2).map((spec, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {spec}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                      
                      <div className="col-span-2 flex items-center">
                        <span className="font-medium">{user.totalBountiesCompleted}</span>
                        {user.streakDays > 0 && (
                          <Badge variant="secondary" className="ml-2 text-xs bg-orange-500/10 text-orange-600">
                            {user.streakDays} day streak
                          </Badge>
                        )}
                      </div>
                      
                      <div className="col-span-2 flex items-center font-medium text-green-600">
                        ${user.totalRewardsEarned.toLocaleString()}
                      </div>
                      
                      <div className="col-span-2 flex items-center">
                        <span className="font-medium">{user.successRate}%</span>
                        <div className="flex items-center ml-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {user.averageCompletionTime}d avg
                        </div>
                      </div>
                      
                      <div className="col-span-1 flex items-center">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="font-medium">{user.reputationScore}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}