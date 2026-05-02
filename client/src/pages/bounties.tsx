import { useState } from "react";
import { Link } from "wouter";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Target, Clock, DollarSign, Search, Filter, Users, 
  TrendingUp, BarChart3, Shield, Code, Award, Calendar
} from "lucide-react";

type BountyStatus = 'open' | 'claimed' | 'in_progress' | 'completed' | 'expired';
type BountyDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

interface Bounty {
  id: string;
  title: string;
  description: string;
  reward: number;
  deadline: string;
  status: BountyStatus;
  difficulty: BountyDifficulty;
  category: string;
  requirements: string[];
  claimedBy?: string;
  submissionCount: number;
  teamAllowed: boolean;
}

const mockBounties: Bounty[] = [
  {
    id: "1",
    title: "Optimize Portfolio Allocation Model",
    description: "Enhance existing portfolio optimization algorithm to improve risk-adjusted returns using machine learning techniques.",
    reward: 500,
    deadline: "2025-07-15",
    status: "open",
    difficulty: "advanced",
    category: "Portfolio Management",
    requirements: ["Python/R proficiency", "ML knowledge", "Finance background"],
    submissionCount: 3,
    teamAllowed: true
  },
  {
    id: "2", 
    title: "Real-time Risk Assessment Engine",
    description: "Build a real-time risk monitoring system that provides instant alerts for portfolio risk threshold breaches.",
    reward: 750,
    deadline: "2025-07-20",
    status: "claimed",
    difficulty: "expert",
    category: "Risk Management",
    requirements: ["Real-time systems", "Risk modeling", "API development"],
    claimedBy: "dev_team_alpha",
    submissionCount: 1,
    teamAllowed: true
  },
  {
    id: "3",
    title: "ESG Compliance Checker",
    description: "Create an automated tool to assess ESG compliance across investment portfolios.",
    reward: 300,
    deadline: "2025-07-10",
    status: "open",
    difficulty: "intermediate",
    category: "Compliance",
    requirements: ["ESG knowledge", "Data analysis", "Regulatory understanding"],
    submissionCount: 7,
    teamAllowed: false
  },
  {
    id: "4",
    title: "Market Sentiment Analysis Model",
    description: "Develop NLP model to analyze market sentiment from news and social media for trading signals.",
    reward: 600,
    deadline: "2025-08-01",
    status: "in_progress",
    difficulty: "advanced",
    category: "Market Analysis",
    requirements: ["NLP expertise", "Sentiment analysis", "API integration"],
    claimedBy: "nlp_specialist",
    submissionCount: 2,
    teamAllowed: true
  }
];

const statusColors = {
  open: "bg-green-100 text-green-800",
  claimed: "bg-blue-100 text-blue-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  completed: "bg-purple-100 text-purple-800",
  expired: "bg-red-100 text-red-800"
};

const difficultyColors = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-orange-100 text-orange-800",
  expert: "bg-red-100 text-red-800"
};

export default function Bounties() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null);

  const categories = ["Portfolio Management", "Risk Management", "Compliance", "Market Analysis"];
  
  const filteredBounties = mockBounties.filter(bounty => {
    const matchesSearch = bounty.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bounty.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || bounty.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "all" || bounty.difficulty === selectedDifficulty;
    const matchesStatus = selectedStatus === "all" || bounty.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
  });

  const handleClaimBounty = (bountyId: string) => {
    // Claim bounty logic
    // Implementation for claiming bounty
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <MobileNav />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Bounty Board</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Discover and claim bounties to build cutting-edge AI financial models. 
              Earn rewards while contributing to the future of finance.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Active Bounties</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Rewards</p>
                    <p className="text-2xl font-bold">$8,250</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Link href="/bounties/leaderboard">
              <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                <CardContent className="p-4 relative">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Active Developers</p>
                      <p className="text-2xl font-bold">47</p>
                    </div>
                  </div>
                  <TrendingUp className="absolute top-2 right-2 h-4 w-4 text-blue-600/40" />
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/bounties/leaderboard">
              <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                <CardContent className="p-4 relative">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold">156</p>
                    </div>
                  </div>
                  <TrendingUp className="absolute top-2 right-2 h-4 w-4 text-purple-600/40" />
                </CardContent>
              </Card>
            </Link>
          </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search bounties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="claimed">Claimed</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bounties Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBounties.map((bounty) => (
            <Card key={bounty.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className={statusColors[bounty.status]}>
                    {bounty.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <Badge className={difficultyColors[bounty.difficulty]}>
                    {bounty.difficulty.toUpperCase()}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{bounty.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {bounty.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-600">${bounty.reward}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(bounty.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{bounty.category}</span>
                    <span>{bounty.submissionCount} submissions</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setSelectedBounty(bounty)}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{selectedBounty?.title}</DialogTitle>
                          <DialogDescription>
                            {selectedBounty?.description}
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedBounty && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">Reward</h4>
                                <p className="text-2xl font-bold text-green-600">${selectedBounty.reward}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Deadline</h4>
                                <p>{new Date(selectedBounty.deadline).toLocaleDateString()}</p>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-2">Requirements</h4>
                              <ul className="list-disc list-inside space-y-1">
                                {selectedBounty.requirements.map((req, index) => (
                                  <li key={index} className="text-sm">{req}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => handleClaimBounty(selectedBounty.id)}
                                disabled={selectedBounty.status !== 'open'}
                                className="flex-1"
                              >
                                {selectedBounty.status === 'open' ? 'Claim Bounty' : 'Not Available'}
                              </Button>
                              {selectedBounty.teamAllowed && (
                                <Button variant="outline" className="flex-1">
                                  Join Team
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    {bounty.status === 'open' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleClaimBounty(bounty.id)}
                        className="flex-1"
                      >
                        Claim
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBounties.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No bounties found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search terms to find available bounties.
              </p>
            </CardContent>
          </Card>
        )}
        </div>
      </main>
      <Footer />
    </div>
  );
}