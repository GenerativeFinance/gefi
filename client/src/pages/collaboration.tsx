import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  MessageSquare, 
  Share2, 
  Clock, 
  Star, 
  TrendingUp, 
  Database, 
  Brain, 
  FileText, 
  Plus,
  Search,
  Filter,
  Calendar,
  ChevronRight,
  DollarSign,
  Target,
  CheckCircle,
  AlertCircle,
  Building,
  Globe,
  Handshake,
  UserPlus
} from "lucide-react";
import Layout from "@/components/layout/Layout";

export default function InvestorCollaboration() {
  const [activeTab, setActiveTab] = useState("groups");
  const [newGroupOpen, setNewGroupOpen] = useState(false);
  const [findPartnersOpen, setFindPartnersOpen] = useState(false);
  const [messageTeamOpen, setMessageTeamOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [partnerFilters, setPartnerFilters] = useState({
    location: "",
    experience: "",
    investment_range: "",
    expertise: ""
  });
  const { toast } = useToast();

  // Sample partner data for Find Partners feature
  const potentialPartners = [
    {
      id: 1,
      name: "Alex Thompson",
      title: "Senior Portfolio Manager",
      location: "New York, NY",
      experience: "8 years",
      investment_range: "$100K - $1M",
      expertise: ["AI Trading", "Risk Management", "Quantitative Analysis"],
      rating: 4.8,
      connections: 156,
      active_projects: 3,
      portfolio_return: "24.5%",
      verified: true
    },
    {
      id: 2,
      name: "Maria Garcia",
      title: "Fintech Investment Analyst",
      location: "San Francisco, CA",
      experience: "6 years",
      investment_range: "$50K - $500K",
      expertise: ["ESG Investing", "Blockchain", "Machine Learning"],
      rating: 4.9,
      connections: 203,
      active_projects: 2,
      portfolio_return: "19.2%",
      verified: true
    },
    {
      id: 3,
      name: "James Wilson",
      title: "Algorithmic Trading Specialist",
      location: "London, UK",
      experience: "12 years",
      investment_range: "$250K - $2M",
      expertise: ["High-Frequency Trading", "Market Making", "Derivatives"],
      rating: 4.7,
      connections: 98,
      active_projects: 5,
      portfolio_return: "31.8%",
      verified: true
    }
  ];

  // Sample collaboration data for investors
  const investmentGroups = [
    {
      id: 1,
      name: "AI Trading Pioneers",
      description: "Collective focused on early-stage AI trading technologies and algorithmic investment strategies.",
      members: 24,
      totalInvestment: "$2.4M",
      averageReturn: "18.5%",
      riskLevel: "Medium",
      focus: ["AI Trading", "Machine Learning", "Algorithmic Strategies"],
      leader: "Jennifer Walsh",
      established: "2024-03-15",
      status: "Active",
      recentActivity: "New investment in quantum trading algorithms"
    },
    {
      id: 2,
      name: "ESG FinTech Collective",
      description: "Investment group specializing in sustainable finance technologies and ESG-compliant AI models.",
      members: 18,
      totalInvestment: "$1.8M",
      averageReturn: "14.2%",
      riskLevel: "Low",
      focus: ["ESG", "Sustainable Finance", "Compliance Tech"],
      leader: "Marcus Chen",
      established: "2024-01-20",
      status: "Active",
      recentActivity: "Funded 3 new ESG scoring models"
    },
    {
      id: 3,
      name: "DeFi Innovation Fund",
      description: "Collaborative investment in decentralized finance protocols and yield optimization strategies.",
      members: 32,
      totalInvestment: "$5.2M",
      averageReturn: "22.8%",
      riskLevel: "High",
      focus: ["DeFi", "Yield Farming", "Smart Contracts"],
      leader: "Sarah Kim",
      established: "2023-11-10",
      status: "Active",
      recentActivity: "Deployed new cross-chain arbitrage model"
    }
  ];

  const partnershipOpportunities = [
    {
      id: 1,
      title: "Institutional Portfolio Analytics",
      type: "Co-Investment",
      description: "Partner with pension funds to develop advanced portfolio analytics using AI-driven risk assessment.",
      investment: "$500K - $2M",
      duration: "18 months",
      riskLevel: "Low",
      expectedReturn: "12-15%",
      participants: 3,
      deadline: "2025-08-30"
    },
    {
      id: 2,
      title: "Crypto Market Making Venture",
      type: "Joint Venture",
      description: "Collaborative market making operation across major cryptocurrency exchanges with AI optimization.",
      investment: "$1M - $5M",
      duration: "24 months",
      riskLevel: "High",
      expectedReturn: "25-35%",
      participants: 8,
      deadline: "2025-07-15"
    },
    {
      id: 3,
      title: "RegTech Compliance Platform",
      type: "Syndicated Investment",
      description: "Fund development of AI-powered regulatory compliance platform for financial institutions.",
      investment: "$200K - $1M",
      duration: "12 months",
      riskLevel: "Medium",
      expectedReturn: "18-22%",
      participants: 12,
      deadline: "2025-09-20"
    }
  ];

  const expertAdvisors = [
    {
      id: 1,
      name: "Dr. Robert Johnson",
      title: "Former Goldman Sachs Managing Director",
      specialization: "Quantitative Finance & Risk Management",
      experience: "25+ years",
      rating: 4.9,
      consultations: 156,
      hourlyRate: "$500",
      availability: "Available",
      expertise: ["Risk Management", "Derivatives", "Portfolio Theory"]
    },
    {
      id: 2,
      name: "Maria Rodriguez",
      title: "Ex-BlackRock Portfolio Manager",
      specialization: "AI-Driven Investment Strategies",
      experience: "18+ years",
      rating: 4.8,
      consultations: 203,
      hourlyRate: "$450",
      availability: "Busy",
      expertise: ["AI Trading", "ETF Management", "Factor Investing"]
    },
    {
      id: 3,
      name: "Alex Thompson",
      title: "Former JP Morgan Quant",
      specialization: "Machine Learning in Finance",
      experience: "15+ years",
      rating: 4.7,
      consultations: 89,
      hourlyRate: "$400",
      availability: "Available",
      expertise: ["ML Models", "High-Frequency Trading", "Market Microstructure"]
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "High": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case "Available": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Busy": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const handleSendMessage = (groupId: number) => {
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the team successfully.",
    });
    setMessageTeamOpen(false);
  };

  const handleConnectPartner = (partnerId: number) => {
    toast({
      title: "Connection Request Sent",
      description: "Your connection request has been sent successfully.",
    });
  };

  const filteredPartners = potentialPartners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         partner.expertise.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLocation = !partnerFilters.location || partner.location.includes(partnerFilters.location);
    const matchesExperience = !partnerFilters.experience || partner.experience.includes(partnerFilters.experience);
    return matchesSearch && matchesLocation && matchesExperience;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Investment Collaboration</h1>
            <p className="text-muted-foreground">Connect with fellow investors, join investment groups, and access expert advisors for smarter investing.</p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Dialog open={newGroupOpen} onOpenChange={setNewGroupOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Investment Group</DialogTitle>
                  <DialogDescription>
                    Start a new investment group and collaborate with like-minded investors.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="group-name">Group Name</Label>
                    <Input id="group-name" placeholder="Enter group name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="group-description">Description</Label>
                    <Textarea id="group-description" placeholder="Describe your investment focus and strategy" rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="min-investment">Minimum Investment</Label>
                      <Input id="min-investment" placeholder="$10,000" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="risk-level">Risk Level</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select risk level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Risk</SelectItem>
                          <SelectItem value="medium">Medium Risk</SelectItem>
                          <SelectItem value="high">High Risk</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="focus-areas">Focus Areas</Label>
                    <Input id="focus-areas" placeholder="AI Trading, ESG, DeFi" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="max-members">Maximum Members</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select group size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 members</SelectItem>
                        <SelectItem value="25">25 members</SelectItem>
                        <SelectItem value="50">50 members</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setNewGroupOpen(false)}>Cancel</Button>
                  <Button onClick={() => setNewGroupOpen(false)}>Create Group</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={findPartnersOpen} onOpenChange={setFindPartnersOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Find Partners
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Find Investment Partners</DialogTitle>
                  <DialogDescription>
                    Search and connect with potential investment partners based on your criteria.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Search by name, expertise, or skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Select value={partnerFilters.location} onValueChange={(value) => setPartnerFilters({...partnerFilters, location: value})}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Locations</SelectItem>
                          <SelectItem value="New York">New York</SelectItem>
                          <SelectItem value="San Francisco">San Francisco</SelectItem>
                          <SelectItem value="London">London</SelectItem>
                          <SelectItem value="Singapore">Singapore</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={partnerFilters.experience} onValueChange={(value) => setPartnerFilters({...partnerFilters, experience: value})}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Experience</SelectItem>
                          <SelectItem value="1-3">1-3 years</SelectItem>
                          <SelectItem value="4-7">4-7 years</SelectItem>
                          <SelectItem value="8+">8+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {filteredPartners.map((partner) => (
                      <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarFallback>
                                  {partner.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                  {partner.name}
                                  {partner.verified && (
                                    <Badge variant="secondary" className="text-xs">Verified</Badge>
                                  )}
                                </CardTitle>
                                <CardDescription>{partner.title}</CardDescription>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{partner.rating}</span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Location:</span>
                                <p className="font-medium">{partner.location}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Experience:</span>
                                <p className="font-medium">{partner.experience}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Investment Range:</span>
                                <p className="font-medium">{partner.investment_range}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Portfolio Return:</span>
                                <p className="font-medium text-green-600">{partner.portfolio_return}</p>
                              </div>
                            </div>
                            
                            <div>
                              <span className="text-sm text-muted-foreground">Expertise:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {partner.expertise.map((skill) => (
                                  <Badge key={skill} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center pt-2">
                              <div className="text-xs text-muted-foreground">
                                {partner.connections} connections • {partner.active_projects} active projects
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <MessageSquare className="h-4 w-4 mr-1" />
                                  Message
                                </Button>
                                <Button size="sm" onClick={() => handleConnectPartner(partner.id)}>
                                  <UserPlus className="h-4 w-4 mr-1" />
                                  Connect
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {filteredPartners.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No partners found matching your criteria.</p>
                      <p className="text-sm text-muted-foreground mt-1">Try adjusting your search filters.</p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="groups">Investment Groups</TabsTrigger>
            <TabsTrigger value="partnerships">Partnerships</TabsTrigger>
            <TabsTrigger value="advisors">Expert Advisors</TabsTrigger>
            <TabsTrigger value="network">My Network</TabsTrigger>
          </TabsList>

          <TabsContent value="groups" className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search investment groups..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>

            <div className="grid gap-6">
              {investmentGroups.map((group) => (
                <Card key={group.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{group.name}</CardTitle>
                          <Badge className={getRiskColor(group.riskLevel)}>
                            {group.riskLevel} Risk
                          </Badge>
                        </div>
                        <CardDescription className="text-base">{group.description}</CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <UserPlus className="h-4 w-4 mr-1" />
                        Join Group
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {group.focus.map((area) => (
                          <Badge key={area} variant="secondary">{area}</Badge>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>{group.totalInvestment}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span>{group.averageReturn} avg return</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{group.members} members</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Est. {new Date(group.established).getFullYear()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Led by:</span>
                          <span className="ml-1 font-medium">{group.leader}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedGroup(group);
                              setMessageTeamOpen(true);
                            }}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message Team
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground border-t pt-3">
                        <span className="font-medium">Recent Activity:</span> {group.recentActivity}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="partnerships" className="space-y-6">
            <div className="grid gap-6">
              {partnershipOpportunities.map((opportunity) => (
                <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{opportunity.title}</CardTitle>
                          <Badge variant="outline">{opportunity.type}</Badge>
                          <Badge className={getRiskColor(opportunity.riskLevel)}>
                            {opportunity.riskLevel} Risk
                          </Badge>
                        </div>
                        <CardDescription className="text-base">{opportunity.description}</CardDescription>
                      </div>
                      <Button>
                        <Handshake className="h-4 w-4 mr-1" />
                        Express Interest
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>{opportunity.investment}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{opportunity.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span>{opportunity.expectedReturn}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{opportunity.participants} interested</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          Application Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                        </span>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="advisors" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {expertAdvisors.map((advisor) => (
                <Card key={advisor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <Avatar className="h-16 w-16 mx-auto mb-3">
                      <AvatarFallback className="text-lg">
                        {advisor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">{advisor.name}</CardTitle>
                    <CardDescription>{advisor.title}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Specialization:</span>
                        <p className="font-medium">{advisor.specialization}</p>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Experience:</span>
                        <span className="font-medium">{advisor.experience}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Rating:</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{advisor.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Rate:</span>
                        <span className="font-medium">{advisor.hourlyRate}/hour</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className={getAvailabilityColor(advisor.availability)}>
                          {advisor.availability}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-sm text-muted-foreground">Expertise:</span>
                        <div className="flex flex-wrap gap-1">
                          {advisor.expertise.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        <Button size="sm" className="flex-1" disabled={advisor.availability === "Busy"}>
                          <Calendar className="h-4 w-4 mr-1" />
                          Book
                        </Button>
                      </div>
                      
                      <div className="text-xs text-muted-foreground text-center">
                        {advisor.consultations} consultations completed
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="network" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Investment Network</CardTitle>
                <CardDescription>Manage your connections and collaborations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">24</div>
                    <div className="text-sm text-muted-foreground">Connected Investors</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Building className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-sm text-muted-foreground">Investment Groups</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Star className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">8</div>
                    <div className="text-sm text-muted-foreground">Expert Advisors</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {[
                      { action: "Joined AI Trading Pioneers group", time: "2 hours ago" },
                      { action: "Scheduled consultation with Dr. Robert Johnson", time: "1 day ago" },
                      { action: "Connected with Sarah Kim from DeFi Innovation Fund", time: "3 days ago" },
                      { action: "Expressed interest in RegTech Compliance Platform", time: "5 days ago" }
                    ].map((activity, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm">{activity.action}</span>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <Button variant="outline">View Full Network</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Message Team Dialog */}
        <Dialog open={messageTeamOpen} onOpenChange={setMessageTeamOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Message Team</DialogTitle>
              <DialogDescription>
                {selectedGroup ? `Send a message to ${selectedGroup.name} team members` : "Send a message to team members"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="message-subject">Subject</Label>
                <Input id="message-subject" placeholder="Enter message subject" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message-content">Message</Label>
                <Textarea 
                  id="message-content" 
                  placeholder="Type your message here..." 
                  rows={6}
                />
              </div>
              <div className="grid gap-2">
                <Label>Recipients</Label>
                <div className="border rounded-lg p-3 bg-muted/50">
                  <div className="text-sm text-muted-foreground mb-2">Team Members:</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedGroup && (
                      <>
                        <Badge variant="outline">{selectedGroup.leader} (Lead)</Badge>
                        <Badge variant="outline">All Members ({selectedGroup.members})</Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="urgent" className="rounded" />
                <Label htmlFor="urgent" className="text-sm">Mark as urgent</Label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setMessageTeamOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleSendMessage(selectedGroup?.id)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}